"use client";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import type { Categoria } from "@/types/entities";
import { categoriaService } from "@/services/categoriaService";
import toast from "react-hot-toast";

type FormData = { nombre: string };
const emptyForm: FormData = { nombre: "" };

export default function CategoriaTable() {
  const [items, setItems] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [nombreError, setNombreError] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

  useEffect(() => {
    categoriaService.getAll()
      .then(setItems)
      .catch(() => toast.error("Error al cargar las categorías"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setNombreError(false);
    openModal();
  };

  const openEdit = (item: Categoria) => {
    setEditingId(item.id);
    setFormData({ nombre: item.nombre });
    setNombreError(false);
    openModal();
  };

  const requestDelete = (id: number) => { setPendingDeleteId(id); openConfirm(); };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    setDeleting(true);
    try {
      await categoriaService.remove(pendingDeleteId);
      setItems((prev) => prev.filter((u) => u.id !== pendingDeleteId));
      closeConfirm();
      toast.success("Categoría eliminada");
    } catch {
      toast.error("Error al eliminar la categoría");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) { setNombreError(true); return; }
    setSaving(true);
    try {
      if (editingId !== null) {
        const updated = await categoriaService.update(editingId, formData);
        setItems((prev) => prev.map((u) => (u.id === editingId ? updated : u)));
      } else {
        const created = await categoriaService.create(formData);
        setItems((prev) => [...prev, created]);
      }
      closeModal();
      toast.success("Categoría guardada");
    } catch {
      toast.error("Error al guardar la categoría");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Categorías</h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>Agregar Categoría</Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Id", "Nombre", "Acciones"].map((h) => (
                  <TableCell key={h} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{h}</TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow><TableCell className="py-10 text-center"><div className="flex justify-center"><Spinner /></div></TableCell></TableRow>
              ) : items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">{item.id}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">{item.nombre}</TableCell>
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

      <DeletionConfirmationPopUp isOpen={isConfirmOpen} onClose={closeConfirm} onConfirm={confirmDelete} isLoading={deleting}
        description="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer." />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar Categoría" : "Agregar Categoría"}
        </h4>
        <div className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input placeholder="Ej: Pastas" defaultValue={formData.nombre} error={nombreError}
              hint={nombreError ? "El nombre es obligatorio" : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData({ nombre: e.target.value });
                if (nombreError) setNombreError(false);
              }} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
            <Button variant="outline" size="sm" onClick={closeModal} disabled={saving}>Cancelar</Button>
            <Button size="sm" onClick={handleSubmit} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
