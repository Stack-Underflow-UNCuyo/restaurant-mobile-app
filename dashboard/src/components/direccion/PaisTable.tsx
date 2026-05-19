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
import type { Pais } from "@/types/entities";
import { paisService } from "@/services/paisService";
import toast from "react-hot-toast";

export default function PaisTable() {
  const [items, setItems] = useState<Pais[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nombre: "" });
  const [errors, setErrors] = useState({ nombre: false });
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

  useEffect(() => {
    paisService
      .getAll()
      .then(setItems)
      .catch(() => toast.error("Error al cargar los países"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ nombre: "" });
    setErrors({ nombre: false });
    openModal();
  };

  const openEdit = (item: Pais) => {
    setEditingId(item.id);
    setFormData({ nombre: item.nombre });
    setErrors({ nombre: false });
    openModal();
  };

  const requestDelete = (id: number) => {
    setPendingDeleteId(id);
    openConfirm();
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    setDeleting(true);
    try {
      await paisService.remove(pendingDeleteId);
      setItems((prev) => prev.filter((p) => p.id !== pendingDeleteId));
      closeConfirm();
      toast.success("País eliminado");
    } catch {
      toast.error("Error al eliminar el país");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = { nombre: !formData.nombre.trim() };
    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }
    setSaving(true);
    try {
      if (editingId !== null) {
        const updated = await paisService.update(editingId, formData);
        setItems((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const created = await paisService.create(formData);
        setItems((prev) => [...prev, created]);
      }
      closeModal();
      toast.success("País guardado");
    } catch {
      toast.error("Error al guardar el país");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Países
          </h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
            Agregar País
          </Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Nombre
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <tr>
                  <td colSpan={2} className="py-10 text-center">
                    <div className="flex justify-center">
                      <Spinner />
                    </div>
                  </td>
                </tr>
              ) : items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                    {item.nombre}
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <DeletionConfirmationPopUp
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        isLoading={deleting}
        description="¿Estás seguro de que deseas eliminar este país? Esta acción no se puede deshacer."
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar País" : "Agregar País"}
        </h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="pais-nombre">Nombre</Label>
            <Input
              id="pais-nombre"
              placeholder="Ej: Argentina"
              defaultValue={formData.nombre}
              error={errors.nombre}
              hint={errors.nombre ? "El nombre es obligatorio" : "Nombre completo del país"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData({ nombre: e.target.value });
                if (errors.nombre) setErrors({ nombre: false });
              }}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
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
