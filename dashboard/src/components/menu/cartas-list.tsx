"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import type { Carta } from "@/types/entities";
import { cartaService } from "@/services/cartaService";
import toast from "react-hot-toast";

type FormData = { fechaDesde: string; fechaHasta: string };
const emptyForm: FormData = { fechaDesde: "", fechaHasta: "" };

export default function CartasListTable() {
  const router = useRouter();
  const [items, setItems] = useState<Carta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<{ fechaDesde: boolean; fechaHasta: boolean }>({ fechaDesde: false, fechaHasta: false });
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

  useEffect(() => {
    cartaService.getAll()
      .then(setItems)
      .catch(() => toast.error("Error al cargar las cartas"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({ fechaDesde: false, fechaHasta: false });
    openModal();
  };

  const openEdit = (item: Carta) => {
    setEditingId(item.id);
    setFormData({ fechaDesde: item.fechaDesde, fechaHasta: item.fechaHasta });
    setErrors({ fechaDesde: false, fechaHasta: false });
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
      await cartaService.remove(pendingDeleteId);
      setItems((prev) => prev.filter((c) => c.id !== pendingDeleteId));
      closeConfirm();
      toast.success("Carta eliminada");
    } catch {
      toast.error("Error al eliminar la carta");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      fechaDesde: !formData.fechaDesde.trim(),
      fechaHasta: !formData.fechaHasta.trim(),
    };
    setErrors(newErrors);
    if (newErrors.fechaDesde || newErrors.fechaHasta) return;

    setSaving(true);
    try {
      const payload = {
        fechaDesde: formData.fechaDesde,
        fechaHasta: formData.fechaHasta,
      };

      if (editingId !== null) {
        const updated = await cartaService.update(editingId, payload);
        setItems((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
      } else {
        const created = await cartaService.create(payload);
        setItems((prev) => [...prev, created]);
      }
      closeModal();
      toast.success("Carta guardada");
    } catch {
      toast.error("Error al guardar la carta");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Cartas</h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>Agregar Carta</Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Id", "Fecha Desde", "Fecha Hasta", "Secciones", "Acciones"].map((h) => (
                  <TableCell key={h} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{h}</TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow><TableCell className="py-10 text-center"><div className="flex justify-center"><Spinner /></div></TableCell></TableRow>
              ) : items.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                  onClick={() => router.push(`/menus/carta/${item.id}`)}
                >
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">{item.id}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">{item.fechaDesde}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">{item.fechaHasta}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                    {item.seccionesCarta?.length ?? 0}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
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

      <DeletionConfirmationPopUp isOpen={isConfirmOpen} onClose={closeConfirm} onConfirm={confirmDelete} isLoading={deleting}
        description="Se eliminara la carta. Las secciones y sus detalles no seran eliminados." />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar Carta" : "Agregar Carta"}
        </h4>
        <div className="space-y-4">
          <div>
            <Label>Fecha Desde</Label>
            <Input type="date" defaultValue={formData.fechaDesde} error={errors.fechaDesde}
              hint={errors.fechaDesde ? "La fecha de inicio es obligatoria" : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({ ...prev, fechaDesde: e.target.value }));
                if (errors.fechaDesde) setErrors((prev) => ({ ...prev, fechaDesde: false }));
              }} />
          </div>
          <div>
            <Label>Fecha Hasta</Label>
            <Input type="date" defaultValue={formData.fechaHasta} error={errors.fechaHasta}
              hint={errors.fechaHasta ? "La fecha de fin es obligatoria" : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({ ...prev, fechaHasta: e.target.value }));
                if (errors.fechaHasta) setErrors((prev) => ({ ...prev, fechaHasta: false }));
              }} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
            <Button variant="outline" size="sm" onClick={closeModal} disabled={saving}>Cancelar</Button>
            <Button size="sm" onClick={handleSubmit} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
