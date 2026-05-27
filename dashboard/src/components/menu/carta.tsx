"use client";
import { useState } from "react";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import toast from "react-hot-toast";
import SeccionCartaComp from "./carta-components/seccion-carta";
import SeccionCartaFormComp from "./carta-components/seccion-carta-form";
import MenuArtIndividualComp, { type DetalleItem } from "./carta-components/menu-individual-comp";
import MenuArtIndividualFormComp, { type MenuIndividualFormData } from "./carta-components/menu-individual-form-comp";
import MenuComboComp, { type DetalleCombo } from "./carta-components/menu-combo-comp";
import MenuComboFormComp, { type MenuComboFormData } from "./carta-components/menu-combo-form-comp";

type IndividualItem = {
  id: number;
  type: "individual";
  nombre: string;
  precio: string;
  detalles: DetalleItem[];
};

type ComboItem = {
  id: number;
  type: "combo";
  nombre: string;
  precio: string;
  detalles: DetalleCombo[];
};

type SectionItem = IndividualItem | ComboItem;

type Section = { id: number; titulo: string; categorias: string[] };

const initialSections: Section[] = [
  { id: 1, titulo: "Sección Entradas", categorias: ["Entrada", "Carnes", "Compartidos"] },
];

const initialItemsBySection: Record<number, SectionItem[]> = {
  1: [
    { id: 1, type: "individual", nombre: "Rabas", precio: "$ 8.500", detalles: [] },
    {
      id: 2,
      type: "individual",
      nombre: "Empanadas",
      precio: "$ 1.200",
      detalles: [
        { nombre: "Carne", cantidad: 100, unidad: "gr" },
        { nombre: "Cebolla", cantidad: 15, unidad: "unidad" },
      ],
    },
    {
      id: 3,
      type: "combo",
      nombre: "Picada para dos",
      precio: "$$$",
      detalles: [
        { nombre: "Rabas", cantidad: 1 },
        { nombre: "Empanadas", cantidad: 2 },
        {
          nombre: "Salchichas a la pomarola",
          cantidad: 2,
          articulos: [
            { nombre: "Salchichas", cantidad: 100, unidad: "gr" },
            { nombre: "Tomates", cantidad: 15, unidad: "unidad" },
          ],
        },
      ],
    },
  ],
};

export default function CartaTable() {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [itemsBySection, setItemsBySection] = useState<Record<number, SectionItem[]>>(initialItemsBySection);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [pendingDeleteSectionId, setPendingDeleteSectionId] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const nextItemId = (prev: Record<number, SectionItem[]>) => {
    const allIds = Object.values(prev).flat().map((i) => i.id);
    return Math.max(0, ...allIds) + 1;
  };

  const handleAddSection = () => {
    const newId = Math.max(0, ...sections.map((s) => s.id)) + 1;
    setSections((prev) => [...prev, { id: newId, titulo: "", categorias: [] }]);
    setItemsBySection((prev) => ({ ...prev, [newId]: [] }));
    setEditingSectionId(newId);
  };

  const handleSaveSection = (sectionId: number, data: { titulo: string; categorias: string[] }) => {
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, ...data } : s));
    setEditingSectionId(null);
  };

  const handleCancelSectionEdit = (sectionId: number) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section && !section.titulo) {
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
      setItemsBySection((prev) => { const n = { ...prev }; delete n[sectionId]; return n; });
    }
    setEditingSectionId(null);
  };

  const confirmDeleteSection = () => {
    if (pendingDeleteSectionId === null) return;
    setSections((prev) => prev.filter((s) => s.id !== pendingDeleteSectionId));
    setItemsBySection((prev) => { const n = { ...prev }; delete n[pendingDeleteSectionId]; return n; });
    setPendingDeleteSectionId(null);
    toast.success("Sección eliminada");
  };

  const handleAddIndividual = (sectionId: number, data: MenuIndividualFormData) => {
    setItemsBySection((prev) => ({
      ...prev,
      [sectionId]: [
        ...(prev[sectionId] ?? []),
        { id: nextItemId(prev), type: "individual", nombre: data.nombre, precio: data.precio, detalles: data.detalles },
      ],
    }));
  };

  const handleAddCombo = (sectionId: number, data: MenuComboFormData) => {
    setItemsBySection((prev) => ({
      ...prev,
      [sectionId]: [
        ...(prev[sectionId] ?? []),
        {
          id: nextItemId(prev),
          type: "combo",
          nombre: data.nombre,
          precio: data.precio,
          detalles: data.detalles.map((d) => ({
            nombre: d.nombre,
            cantidad: Number(d.cantidad),
            articulos: d.articulos?.map((a) => ({ nombre: a.nombre, cantidad: a.cantidad })),
          })),
        },
      ],
    }));
  };

  const handleEditIndividualSave = (sectionId: number, id: number, data: MenuIndividualFormData) => {
    setItemsBySection((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] ?? []).map((item) =>
        item.id === id && item.type === "individual"
          ? { ...item, nombre: data.nombre, precio: data.precio, detalles: data.detalles }
          : item
      ),
    }));
    setEditingItemId(null);
  };

  const handleEditComboSave = (sectionId: number, id: number, data: MenuComboFormData) => {
    setItemsBySection((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] ?? []).map((item) =>
        item.id === id && item.type === "combo"
          ? {
              ...item,
              nombre: data.nombre,
              precio: data.precio,
              detalles: data.detalles.map((d) => ({
                nombre: d.nombre,
                cantidad: Number(d.cantidad),
                articulos: d.articulos?.map((a) => ({ nombre: a.nombre, cantidad: a.cantidad })),
              })),
            }
          : item
      ),
    }));
    setEditingItemId(null);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {sections.map((section) => {
          const sectionItems = itemsBySection[section.id] ?? [];

          const itemsJSX = sectionItems.map((item) => {
            if (item.type === "individual" && item.id === editingItemId) {
              return (
                <MenuArtIndividualFormComp
                  key={item.id}
                  initialData={{ nombre: item.nombre, precio: item.precio, detalles: item.detalles }}
                  onSave={(data) => handleEditIndividualSave(section.id, item.id, data)}
                  onCancel={() => setEditingItemId(null)}
                />
              );
            }
            if (item.type === "individual") {
              return (
                <MenuArtIndividualComp
                  key={item.id}
                  nombre={item.nombre}
                  precio={item.precio}
                  detalles={item.detalles}
                  onEdit={() => setEditingItemId(item.id)}
                />
              );
            }
            if (item.type === "combo" && item.id === editingItemId) {
              return (
                <MenuComboFormComp
                  key={item.id}
                  initialData={{ nombre: item.nombre, precio: item.precio, detalles: item.detalles }}
                  onSave={(data) => handleEditComboSave(section.id, item.id, data)}
                  onCancel={() => setEditingItemId(null)}
                />
              );
            }
            return (
              <MenuComboComp
                key={item.id}
                nombre={item.nombre}
                precio={item.precio}
                detalles={item.detalles}
                onEdit={() => setEditingItemId(item.id)}
              />
            );
          });

          if (editingSectionId === section.id) {
            return (
              <div key={section.id} className="mx-5">
                <SeccionCartaFormComp
                  initialTitulo={section.titulo}
                  initialCategorias={section.categorias}
                  itemsAgregados={sectionItems.length > 0 ? <>{itemsJSX}</> : undefined}
                  onSave={(data) => handleSaveSection(section.id, data)}
                  onCancel={() => handleCancelSectionEdit(section.id)}
                />
              </div>
            );
          }

          return (
            <div key={section.id} className="mx-5">
              <SeccionCartaComp
                titulo={section.titulo}
                categorias={section.categorias}
                onAddIndividual={(data) => handleAddIndividual(section.id, data)}
                onAddCombo={(data) => handleAddCombo(section.id, data)}
                onEdit={() => setEditingSectionId(section.id)}
                onDelete={() => setPendingDeleteSectionId(section.id)}
              >
                {itemsJSX}
              </SeccionCartaComp>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center px-5 pt-5 pb-5">
        <Button size="sm" variant="outline" startIcon={<PlusIcon />} onClick={handleAddSection}>
          Agregar Seccion
        </Button>
      </div>

      <DeletionConfirmationPopUp
        isOpen={pendingDeleteSectionId !== null}
        onClose={() => setPendingDeleteSectionId(null)}
        onConfirm={confirmDeleteSection}
        description="¿Estás seguro de que deseas eliminar esta sección? Se perderán todos sus ítems."
      />
    </>
  );
}
