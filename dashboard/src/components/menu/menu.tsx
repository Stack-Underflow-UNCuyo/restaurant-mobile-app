"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import type { Articulo, Menu } from "@/types/entities";
import { menuService } from "@/services/menuService";
import { articuloService } from "@/services/articuloService";
import toast from "react-hot-toast";
import Select from "../form/Select";

type DetalleFormItem = {
  articuloId: string;
  cantidad: number;
};

type FormData = {
  nombre: string;
  precio: number;
  detallesMenu: DetalleFormItem[];
};

const emptyForm: FormData = {
  nombre: "",
  precio: 0,
  detallesMenu: [],
};

const emptyDetalle: DetalleFormItem = { articuloId: "", cantidad: 1 };

const noErrors = { nombre: false, precio: false, detalles: false };

export default function MenuTable() {
  const [items, setItems] = useState<Menu[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articuloOptions, setArticuloOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [pendingDetalle, setPendingDetalle] = useState<DetalleFormItem>(emptyDetalle);
  const [errors, setErrors] = useState({ ...noErrors });
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

  useEffect(() => {
    Promise.all([menuService.getAll(), articuloService.getAll()])
      .then(([menus, arts]) => {
        setItems(menus);
        setArticulos(arts);
        setArticuloOptions(arts.map((a) => ({ value: String(a.id), label: a.nombre })));
      })
      .catch(() => toast.error("Error al cargar los datos"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setPendingDetalle(emptyDetalle);
    setErrors({ ...noErrors });
    openModal();
  };

  const openEdit = (item: Menu) => {
    setEditingId(item.id);
    setFormData({
      nombre: item.nombre ?? "",
      precio: item.precio,
      detallesMenu: (item.detallesMenu ?? []).map((d) => ({
        articuloId: String(d.articulo?.id ?? ""),
        cantidad: d.cantidad,
      })),
    });
    setPendingDetalle(emptyDetalle);
    setErrors({ ...noErrors });
    openModal();
  };

  const addDetalle = () => {
    if (!pendingDetalle.articuloId || pendingDetalle.cantidad <= 0) return;
    setFormData((prev) => ({
      ...prev,
      detallesMenu: [...prev.detallesMenu, pendingDetalle],
    }));
    setPendingDetalle(emptyDetalle);
    setErrors((prev) => ({ ...prev, detalles: false }));
  };

  const removeDetalle = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      detallesMenu: prev.detallesMenu.filter((_, i) => i !== index),
    }));
  };

  const requestDelete = (id: number) => {
    setPendingDeleteId(id);
    openConfirm();
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    setDeleting(true);
    try {
      await menuService.remove(pendingDeleteId);
      setItems((prev) => prev.filter((u) => u.id !== pendingDeleteId));
      closeConfirm();
      toast.success("Menú eliminado");
    } catch {
      toast.error("Error al eliminar el menú");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      nombre: !formData.nombre.trim(),
      precio: !formData.precio || formData.precio <= 0,
      detalles: editingId !== null && formData.detallesMenu.length === 0,
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      nombre: formData.nombre.trim(),
      precio: formData.precio,
      detallesMenu: formData.detallesMenu.map((d) => ({
        cantidad: d.cantidad,
        articulo: articulos.find((a) => String(a.id) === d.articuloId)!,
      })),
    };

    setSaving(true);
    try {
      if (editingId !== null) {
        const updated = await menuService.update(editingId, payload);
        setItems((prev) => prev.map((u) => (u.id === editingId ? updated : u)));
      } else {
        const created = await menuService.create(payload);
        setItems((prev) => [...prev, created]);
      }
      closeModal();
      toast.success("Menú guardado");
    } catch {
      toast.error("Error al guardar el menú");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Menús
          </h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
            Agregar Menú
          </Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Id", "Nombre", "Precio", "Detalles", "Acciones"].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell className="py-10 text-center">
                    <div className="flex justify-center">
                      <Spinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                      {item.id}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                      {item.nombre}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                      ${item.precio}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                      {(item.detallesMenu ?? []).length > 0
                        ? (item.detallesMenu ?? [])
                            .map((d) => `${d.articulo?.nombre ?? "?"} ×${d.cantidad}`)
                            .join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEdit(item)}
                          className="text-gray-400 hover:text-brand-500 transition-colors"
                        >
                          <PencilIcon />
                        </button>
                        <button
                          onClick={() => requestDelete(item.id)}
                          className="text-gray-400 hover:text-error-500 transition-colors"
                        >
                          <TrashBinIcon />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DeletionConfirmationPopUp
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        isLoading={deleting}
        description="¿Estás seguro de que deseas eliminar este menú? Esta acción no se puede deshacer."
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-lg p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar Menú" : "Agregar Menú"}
        </h4>
        <div className="space-y-5">
          {/* Nombre */}
          <div>
            <Label htmlFor="menu-nombre">Nombre</Label>
            <Input
              placeholder="Ej: Menú del día"
              defaultValue={formData.nombre}
              error={errors.nombre}
              hint={errors.nombre ? "El nombre es obligatorio" : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({ ...prev, nombre: e.target.value }));
                if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: false }));
              }}
            />
          </div>

          {/* Precio */}
          <div>
            <Label htmlFor="menu-precio">Precio</Label>
            <Input
              placeholder="Ej: 1500"
              defaultValue={formData.precio}
              error={errors.precio}
              hint={errors.precio ? "El precio debe ser mayor a cero" : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({ ...prev, precio: Number(e.target.value) }));
                if (errors.precio) setErrors((prev) => ({ ...prev, precio: false }));
              }}
            />
          </div>

          {/* Detalles del menú */}
          <div>
            <Label>Detalles del menú</Label>

            {formData.detallesMenu.length > 0 && (
              <ul className="mb-3 divide-y divide-gray-100 rounded-lg border border-gray-200 dark:border-white/[0.08] dark:divide-white/[0.05]">
                {formData.detallesMenu.map((d, i) => {
                  const label = articuloOptions.find((o) => o.value === d.articuloId)?.label ?? d.articuloId;
                  return (
                    <li key={i} className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-white/80">
                      <span>{label} <span className="text-gray-400">×{d.cantidad}</span></span>
                      <button
                        type="button"
                        onClick={() => removeDetalle(i)}
                        className="text-gray-400 hover:text-error-500 transition-colors"
                      >
                        <TrashBinIcon />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Select
                  options={articuloOptions}
                  placeholder="Seleccionar artículo"
                  defaultValue={pendingDetalle.articuloId}
                  onChange={(value) => setPendingDetalle((prev) => ({ ...prev, articuloId: value }))}
                />
              </div>
              <div className="w-24">
                <Input
                  placeholder="Cant."
                  defaultValue={pendingDetalle.cantidad}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPendingDetalle((prev) => ({ ...prev, cantidad: Number(e.target.value) }))
                  }
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={addDetalle}
                disabled={!pendingDetalle.articuloId || pendingDetalle.cantidad <= 0}
              >
                Agregar
              </Button>
            </div>

            {errors.detalles && (
              <p className="mt-1.5 text-xs text-error-500">
                El menú debe tener al menos un detalle
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
            <Button variant="outline" size="sm" onClick={closeModal} disabled={saving}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
