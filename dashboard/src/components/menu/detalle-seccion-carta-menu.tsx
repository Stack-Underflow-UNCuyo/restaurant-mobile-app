"use client";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import Select from "@/components/form/Select";
import type { DetalleSeccionCartaMenu, Menu } from "@/types/entities";
import { detalleSeccionCartaMenuService } from "@/services/detalleSeccionCartaMenuService";
import { menuService } from "@/services/menuService";
import toast from "react-hot-toast";

type FormData = { menuId: string };
const emptyForm: FormData = { menuId: "" };

export default function DetalleSeccionCartaMenuTable() {
  const [items, setItems] = useState<DetalleSeccionCartaMenu[]>([]);
  const [menuOptions, setMenuOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [menuError, setMenuError] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

  useEffect(() => {
    Promise.all([detalleSeccionCartaMenuService.getAll(), menuService.getAll()])
      .then(([detalles, menus]) => {
        setItems(detalles);
        setMenuOptions(menus.map((m: Menu) => ({ value: String(m.id), label: m.nombre ?? `Menú #${m.id}` })));
      })
      .catch(() => toast.error("Error al cargar los datos"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditingId(null); setFormData(emptyForm); setMenuError(false); openModal(); };

  const openEdit = (item: DetalleSeccionCartaMenu) => {
    setEditingId(item.id);
    setFormData({ menuId: item.menu ? String(item.menu.id) : "" });
    setMenuError(false);
    openModal();
  };

  const requestDelete = (id: number) => { setPendingDeleteId(id); openConfirm(); };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    setDeleting(true);
    try {
      await detalleSeccionCartaMenuService.remove(pendingDeleteId);
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
    if (!formData.menuId) { setMenuError(true); return; }
    setSaving(true);
    try {
      if (editingId !== null) {
        const updated = await detalleSeccionCartaMenuService.update(editingId, formData);
        setItems((prev) => prev.map((u) => (u.id === editingId ? updated : u)));
      } else {
        const created = await detalleSeccionCartaMenuService.create(formData);
        setItems((prev) => [...prev, created]);
      }
      const refreshed = await detalleSeccionCartaMenuService.getAll();
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
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Detalles Sección Carta Menú</h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>Agregar Detalle</Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Id", "Menú", "Acciones"].map((h) => (
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
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">{item.menu?.nombre ?? "-"}</TableCell>
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
        description="¿Estás seguro de que deseas eliminar este detalle? Esta acción no se puede deshacer." />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar Detalle Sección Carta Menú" : "Agregar Detalle Sección Carta Menú"}
        </h4>
        <div className="space-y-4">
          <div>
            <Label>Menú</Label>
            <Select options={menuOptions} placeholder="Seleccionar menú" defaultValue={formData.menuId}
              onChange={(value) => { setFormData({ menuId: value }); if (menuError) setMenuError(false); }} />
            {menuError && <p className="mt-1.5 text-xs text-error-500">Debe seleccionar un menú</p>}
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
