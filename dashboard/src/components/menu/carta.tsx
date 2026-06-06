"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import toast from "react-hot-toast";
import SeccionCartaComp from "./carta-components/seccion-carta";
import SeccionCartaFormComp from "./carta-components/seccion-carta-form";
import MenuArtIndividualComp, { type DetalleItem } from "./carta-components/menu-individual-comp";
import MenuArtIndividualFormComp, { type MenuIndividualFormData } from "./carta-components/menu-individual-form-comp";
import MenuComboComp, { type DetalleCombo } from "./carta-components/menu-combo-comp";
import MenuComboFormComp from "./carta-components/menu-combo-form-comp";
import type { Menu } from "@/types/entities";
import { cartaService } from "@/services/cartaService";
import { seccionCartaService } from "@/services/seccionCartaService";
import { detalleSeccionCartaMenuService } from "@/services/detalleSeccionCartaMenuService";
import { detalleSeccionCartaArticuloIndividualService } from "@/services/detalleSeccionCartaArticuloIndividualService";
import { detalleMenuService } from "@/services/detalleMenuService";

type IndividualItem = {
  id: string;
  type: "individual";
  nombre: string;
  precio: string;
  articuloId?: string;
  detalles: DetalleItem[];
};

type ComboItem = {
  id: string;
  menuId: string;
  type: "combo";
  nombre: string;
  precio: string;
  detalles: DetalleCombo[];
};

type SectionItem = IndividualItem | ComboItem;

type Section = { id: string; titulo: string; categorias: string[] };

export default function CartaTable({ cartaId }: { cartaId: string }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [itemsBySection, setItemsBySection] = useState<Record<string, SectionItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [pendingDeleteSectionId, setPendingDeleteSectionId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<{ sectionId: string; id: string; type: "individual" | "combo" } | null>(null);
  const [pendingDeleteDetalle, setPendingDeleteDetalle] = useState<{ sectionId: string; itemId: string; detalleMenuId: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [carta, menuDetails, individualDetails] = await Promise.all([
          cartaService.getById(cartaId),
          detalleSeccionCartaMenuService.getAll(),
          detalleSeccionCartaArticuloIndividualService.getAll(),
        ]);

        const secciones = carta.seccionesCarta ?? [];
        const seccionIds = new Set(secciones.map((s) => s.id));

        setSections(secciones.map((s) => ({
          id: s.id,
          titulo: s.nombre,
          categorias: s.categoria ? [s.categoria.nombre] : [],
        })));

        const bySection: Record<string, SectionItem[]> = {};
        for (const s of secciones) bySection[s.id] = [];

        for (const d of menuDetails) {
          if (!seccionIds.has(d.seccionCartaId)) continue;
          bySection[d.seccionCartaId]?.push({
            id: d.id,
            menuId: d.menu.id,
            type: "combo",
            nombre: d.menu.nombre,
            precio: String(d.menu.precio),
            detalles: (d.menu.detallesMenu ?? []).map((dm) => ({
              nombre: dm.nombre,
              cantidad: dm.cantidad,
              articuloId: dm.articulo?.id,
              articuloCantidad: dm.articuloCantidad || dm.cantidad,
              detalleMenuId: dm.id,
              articulos: dm.articulo ? [{
                nombre: dm.articulo.nombre,
                cantidad: dm.articuloCantidad || dm.cantidad,
                unidad: dm.articulo.unidadDeMedida?.nombre,
              }] : [],
            })),
          });
        }

        for (const d of individualDetails) {
          if (!seccionIds.has(d.seccionCartaId)) continue;
          bySection[d.seccionCartaId]?.push({
            id: d.id,
            type: "individual",
            nombre: d.articulo?.nombre ?? "Articulo individual",
            precio: String(d.precio),
            articuloId: d.articulo?.id,
            detalles: d.articulo ? [{
              nombre: d.articulo.nombre,
              cantidad: 1,
              unidad: d.articulo.unidadDeMedida?.nombre,
            }] : [],
          });
        }

        setItemsBySection(bySection);
      } catch {
        toast.error("Error al cargar la carta");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [cartaId]);

  const updateCartaSecciones = async (sectionIds: string[]) => {
    const carta = await cartaService.getById(cartaId);
    await cartaService.update(cartaId, {
      fechaDesde: carta.fechaDesde,
      fechaHasta: carta.fechaHasta,
      seccionCartaIds: sectionIds,
    });
  };

  const handleAddSection = () => {
    const tempId = `temp-${Date.now()}`;
    setSections((prev) => [...prev, { id: tempId, titulo: "", categorias: [] }]);
    setItemsBySection((prev) => ({ ...prev, [tempId]: [] }));
    setEditingSectionId(tempId);
  };

  const handleSaveSection = async (sectionId: string, data: { titulo: string; categorias: string[] }) => {
    try {
      const payload = {
        nombre: data.titulo,
        categoriaNombre: data.categorias[0] || undefined,
      };

      if (sectionId.startsWith("temp-")) {
        const saved = await seccionCartaService.create(payload);
        const newSections = sections.map((s) =>
          s.id === sectionId
            ? { id: saved.id, titulo: saved.nombre, categorias: saved.categoria ? [saved.categoria.nombre] : [] }
            : s
        );
        setSections(newSections);
        setItemsBySection((prev) => {
          const next = { ...prev, [saved.id]: prev[sectionId] ?? [] };
          delete next[sectionId];
          return next;
        });
        await updateCartaSecciones(newSections.map((s) => s.id));
      } else {
        const saved = await seccionCartaService.update(sectionId, payload);
        setSections((prev) => prev.map((s) =>
          s.id === sectionId
            ? { ...s, titulo: saved.nombre, categorias: saved.categoria ? [saved.categoria.nombre] : [] }
            : s
        ));
      }

      setEditingSectionId(null);
      toast.success("Seccion guardada");
    } catch {
      toast.error("Error al guardar la seccion");
    }
  };

  const handleCancelSectionEdit = (sectionId: string) => {
    if (sectionId.startsWith("temp-")) {
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
      setItemsBySection((prev) => { const n = { ...prev }; delete n[sectionId]; return n; });
    }
    setEditingSectionId(null);
  };

  const confirmDeleteSection = async () => {
    if (pendingDeleteSectionId === null) return;
    try {
      const remaining = sections.filter((s) => s.id !== pendingDeleteSectionId);
      await updateCartaSecciones(remaining.map((s) => s.id));
      await seccionCartaService.remove(pendingDeleteSectionId);
      setSections(remaining);
      setItemsBySection((prev) => { const n = { ...prev }; delete n[pendingDeleteSectionId]; return n; });
      setPendingDeleteSectionId(null);
      toast.success("Seccion eliminada");
    } catch {
      toast.error("Error al eliminar la seccion");
    }
  };

  const handleAddIndividual = async (sectionId: string, data: MenuIndividualFormData) => {
    const saved = await detalleSeccionCartaArticuloIndividualService.create({
      seccionCartaId: sectionId,
      precio: data.precio,
      articuloId: data.articuloId,
    });
    setItemsBySection((prev) => ({
      ...prev,
      [sectionId]: [
        ...(prev[sectionId] ?? []),
        {
          id: saved.id,
          type: "individual" as const,
          nombre: saved.articulo?.nombre ?? data.articuloNombre,
          precio: String(saved.precio),
          articuloId: saved.articulo?.id ?? data.articuloId,
          detalles: saved.articulo ? [{
            nombre: saved.articulo.nombre,
            cantidad: 1,
            unidad: saved.articulo.unidadDeMedida?.nombre,
          }] : [],
        },
      ],
    }));
    toast.success("Artículo agregado");
  };

  const handleAddCombo = async (sectionId: string, savedMenu: Menu) => {
    const saved = await detalleSeccionCartaMenuService.create({
      seccionCartaId: sectionId,
      menuId: savedMenu.id,
    });
    setItemsBySection((prev) => ({
      ...prev,
      [sectionId]: [
        ...(prev[sectionId] ?? []),
        {
          id: saved.id,
          menuId: savedMenu.id,
          type: "combo" as const,
          nombre: savedMenu.nombre,
          precio: String(savedMenu.precio),
          detalles: (savedMenu.detallesMenu ?? []).map((d) => ({
            nombre: d.nombre,
            cantidad: d.cantidad,
            articuloId: d.articulo?.id,
            articuloCantidad: d.articuloCantidad || d.cantidad,
            detalleMenuId: d.id,
            articulos: d.articulo ? [{
              nombre: d.articulo.nombre,
              cantidad: d.articuloCantidad || d.cantidad,
              unidad: d.articulo.unidadDeMedida?.nombre,
            }] : [],
          })),
        },
      ],
    }));
    toast.success("Menú agregado");
  };

  const handleEditIndividualSave = async (sectionId: string, id: string, data: MenuIndividualFormData) => {
    const saved = await detalleSeccionCartaArticuloIndividualService.update(id, {
      seccionCartaId: sectionId,
      precio: data.precio,
      articuloId: data.articuloId,
    });
    setItemsBySection((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] ?? []).map((item) =>
        item.id === id && item.type === "individual"
          ? {
              ...item,
              nombre: saved.articulo?.nombre ?? data.articuloNombre,
              precio: String(saved.precio),
              articuloId: saved.articulo?.id ?? data.articuloId,
              detalles: saved.articulo ? [{
                nombre: saved.articulo.nombre,
                cantidad: 1,
                unidad: saved.articulo.unidadDeMedida?.nombre,
              }] : [],
            }
          : item
      ),
    }));
    setEditingItemId(null);
    toast.success("Artículo actualizado");
  };

  const handleEditComboSuccess = async (sectionId: string, id: string, savedMenu: Menu) => {
    setItemsBySection((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] ?? []).map((item) =>
        item.id === id && item.type === "combo"
          ? {
              ...item,
              menuId: savedMenu.id,
              nombre: savedMenu.nombre,
              precio: String(savedMenu.precio),
              detalles: (savedMenu.detallesMenu ?? []).map((d) => ({
                nombre: d.nombre,
                cantidad: d.cantidad,
                articuloId: d.articulo?.id,
                articuloCantidad: d.articuloCantidad || d.cantidad,
                detalleMenuId: d.id,
                articulos: d.articulo ? [{
                  nombre: d.articulo.nombre,
                  cantidad: d.articuloCantidad || d.cantidad,
                  unidad: d.articulo.unidadDeMedida?.nombre,
                }] : [],
              })),
            }
          : item
      ),
    }));
    setEditingItemId(null);
    toast.success("Menú actualizado");
  };

  const handleDeleteItem = async () => {
    if (!pendingDeleteItem) return;
    const { sectionId, id, type } = pendingDeleteItem;
    try {
      if (type === "individual") {
        await detalleSeccionCartaArticuloIndividualService.remove(id);
      } else {
        await detalleSeccionCartaMenuService.remove(id);
      }
      setItemsBySection((prev) => ({
        ...prev,
        [sectionId]: (prev[sectionId] ?? []).filter((item) => item.id !== id),
      }));
      setPendingDeleteItem(null);
      toast.success("Ítem eliminado");
    } catch {
      toast.error("Error al eliminar el ítem");
    }
  };

  const handleDeleteDetalle = async () => {
    if (!pendingDeleteDetalle) return;
    const { sectionId, itemId, detalleMenuId } = pendingDeleteDetalle;
    try {
      await detalleMenuService.remove(detalleMenuId);
      setItemsBySection((prev) => ({
        ...prev,
        [sectionId]: (prev[sectionId] ?? []).map((item) =>
          item.id === itemId && item.type === "combo"
            ? { ...item, detalles: item.detalles.filter((d) => d.detalleMenuId !== detalleMenuId) }
            : item
        ),
      }));
      setPendingDeleteDetalle(null);
      toast.success("Detalle eliminado");
    } catch {
      toast.error("Error al eliminar el detalle");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-400 dark:text-gray-500">
        Cargando carta...
      </div>
    );
  }

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
                  initialData={{
                    articuloId: item.articuloId ?? "",
                    articuloNombre: item.nombre,
                    precio: Number(item.precio),
                  }}
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
                  onDelete={() => setPendingDeleteItem({ sectionId: section.id, id: item.id, type: "individual" })}
                />
              );
            }
            if (item.type === "combo" && item.id === editingItemId) {
              return (
                <MenuComboFormComp
                  key={item.id}
                  initialData={{ id: item.menuId, nombre: item.nombre, precio: item.precio, detalles: item.detalles }}
                  onSuccess={(savedMenu) => handleEditComboSuccess(section.id, item.id, savedMenu)}
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
                onDelete={() => setPendingDeleteItem({ sectionId: section.id, id: item.id, type: "combo" })}
                onDeleteDetalle={(detalleMenuId) => setPendingDeleteDetalle({ sectionId: section.id, itemId: item.id, detalleMenuId })}
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
                onAddCombo={(savedMenu) => handleAddCombo(section.id, savedMenu)}
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

      <DeletionConfirmationPopUp
        isOpen={pendingDeleteItem !== null}
        onClose={() => setPendingDeleteItem(null)}
        onConfirm={handleDeleteItem}
        description="¿Estás seguro de que deseas eliminar este ítem del menú?"
      />

      <DeletionConfirmationPopUp
        isOpen={pendingDeleteDetalle !== null}
        onClose={() => setPendingDeleteDetalle(null)}
        onConfirm={handleDeleteDetalle}
        description="¿Estás seguro de que deseas eliminar este detalle del combo?"
      />
    </>
  );
}
