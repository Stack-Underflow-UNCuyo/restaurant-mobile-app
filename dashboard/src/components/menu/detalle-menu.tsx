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
import type { DetalleMenu } from "@/types/entities";
import { articuloService } from "@/services/articuloService";
import toast from "react-hot-toast";
import Select from "../form/Select";
import { detalleMenuService } from "@/services/detalleMenuService";

type FormData = {
  nombre: string;
  cantidad: number;
  articuloId: string;
};

const emptyForm: FormData = {
  nombre: "",
  cantidad: 0,
  articuloId: "",
};

const noErrors = {
  nombre: false,
  cantidad: false,
  articuloId: false,
};

export default function DetalleMenuTable() {
  const [items, setItems] = useState<DetalleMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState({ ...noErrors });
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();
  const [articuloState, setArticuloState] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    Promise.all([
      detalleMenuService.getAll(),
      articuloService.getAll(),
    ])
      .then(([detallesMenu, articulos]) => {
        setItems(detallesMenu);
        setArticuloState(articulos.map((articulo) => ({ value: String(articulo.id), label: articulo.nombre })));
      })
      .catch(() => toast.error("Error al cargar los datos"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({ ...noErrors });
    openModal();
  };

  const openEdit = (item: DetalleMenu) => {
    setEditingId(item.id);
    setFormData({
      nombre: item.nombre ?? "",
      cantidad: item.cantidad || 0,
      articuloId: item.articulo ? String(item.articulo.id) : "",
    });
    setErrors({ ...noErrors });
    openModal();
  };

  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
    openConfirm();
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    setDeleting(true);
    try {
      await detalleMenuService.remove(pendingDeleteId);
      setItems((prev) => prev.filter((u) => u.id !== pendingDeleteId));
      closeConfirm();
      toast.success("Detalle eliminado");
    } catch {
      toast.error("Error al eliminar el detalle");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      nombre: !formData.nombre.trim(),
      cantidad: !formData.cantidad,
      articuloId: !formData.articuloId,
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }
    setSaving(true);
    try {
      if (editingId !== null) {
        const updated = await detalleMenuService.update(editingId, formData);
        setItems((prev) => prev.map((u) => (u.id === editingId ? updated : u)));
      } else {
        const created = await detalleMenuService.create(formData);
        setItems((prev) => [...prev, created]);
      }
      const refreshed = await detalleMenuService.getAll();
      setItems(refreshed);
      closeModal();
      toast.success("Detalle guardado");
    } catch {
      toast.error("Error al guardar el detalle");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Detalles Menú
          </h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
            Agregar Detalle
          </Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Id", "Nombre", "Cantidad", "Artículo", "Acciones"].map((header) => (
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
                      {item.cantidad}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                      {item.articulo?.nombre ?? "-"}
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
        description="¿Estás seguro de que deseas eliminar este detalle de menú? Esta acción no se puede deshacer."
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar Detalle de Menú" : "Agregar Detalle de Menú"}
        </h4>
        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="detalleMenu-nombre">Nombre</Label>
            <Input
              placeholder="Ej: Porción de pasta"
              defaultValue={formData.nombre}
              error={errors.nombre}
              hint={errors.nombre ? "El nombre es obligatorio" : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({ ...prev, nombre: e.target.value }));
                if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: false }));
              }}
            />
          </div>

          {/* Cantidad */}
          <div>
            <Label htmlFor="detalleMenu-cantidad">Cantidad</Label>
            <Input
              placeholder="Ej: 10"
              defaultValue={formData.cantidad}
              error={errors.cantidad}
              hint={errors.cantidad ? "La cantidad es obligatoria" : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({ ...prev, cantidad: Number(e.target.value) }));
                if (errors.cantidad) setErrors((prev) => ({ ...prev, cantidad: false }));
              }}
            />
          </div>

          {/* Artículo */}
          <div>
            <Label>Artículo</Label>
            <Select
              options={articuloState}
              placeholder="Seleccionar artículo"
              defaultValue={formData.articuloId}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, articuloId: value }));
                if (errors.articuloId) setErrors((prev) => ({ ...prev, articuloId: false }));
                console.log(formData)
              }}
            />
            {errors.articuloId && (
              <p className="mt-1.5 text-xs text-error-500">Debe seleccionar un artículo</p>
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
