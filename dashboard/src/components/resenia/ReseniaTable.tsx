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
import { PencilIcon, TrashBinIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import { reseniaService } from "@/services/reseniaService";
import type { Resenia } from "@/types/resenia";
import toast from "react-hot-toast";

type FormData = {
  observacion: string;
};

const emptyForm: FormData = {
  observacion: "",
};

const emptyErrors = {
  observacion: false,
};

export default function ReseniaTable() {
  const [items, setItems] = useState<Resenia[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

  useEffect(() => {
    reseniaService
      .getAll()
      .then(setItems)
      .catch(() => toast.error("Error al cargar las reseñas"))
      .finally(() => setLoading(false));
  }, []);

  const openEdit = (item: Resenia) => {
    setEditingId(item.id);
    setFormData({
      observacion: item.observacion,
    });
    setErrors(emptyErrors);
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
      await reseniaService.remove(pendingDeleteId);
      setItems((prev) => prev.filter((r) => r.id !== pendingDeleteId));
      closeConfirm();
      toast.success("Reseña eliminada");
    } catch {
      toast.error("Error al eliminar la reseña");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      observacion: formData.observacion.trim() === "",
    };
    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        observacion: formData.observacion.trim(),
      };
      if (editingId !== null) {
        await reseniaService.update(editingId, payload);
      } else {
        await reseniaService.create(payload);
      }
      const refreshed = await reseniaService.getAll();
      setItems(refreshed);
      closeModal();
      toast.success("Reseña guardada");
    } catch {
      toast.error("Error al guardar la reseña");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Reseñas</h3>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Observación</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Comanda</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Fecha</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center">
                    <div className="flex justify-center"><Spinner /></div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-500 text-theme-sm">No hay reseñas registradas</td>
                </tr>
              ) : items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                    {item.observacion}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.comandaId?.slice(0, 8) ?? "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.fechaResenia || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-brand-500 transition-colors"><PencilIcon /></button>
                      <button onClick={() => requestDelete(item.id)} className="text-gray-400 hover:text-error-500 transition-colors"><TrashBinIcon /></button>
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
        description="¿Estás seguro de que deseas eliminar esta reseña? Esta acción no se puede deshacer."
      />

      <Modal key={editingId ?? "new"} isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar reseña" : "Agregar reseña"}
        </h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="resenia-observacion">Observación</Label>
            <Input
              id="resenia-observacion" type="text" placeholder="Ej: Excelente atención"
              defaultValue={formData.observacion}
              error={errors.observacion}
              hint={errors.observacion ? "La observación es obligatoria" : undefined}
              onChange={(e) => {
                setFormData((p) => ({ ...p, observacion: e.target.value }));
                if (errors.observacion) setErrors((p) => ({ ...p, observacion: false }));
              }}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={closeModal} disabled={saving}>Cancelar</Button>
            <Button size="sm" onClick={handleSubmit} disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
