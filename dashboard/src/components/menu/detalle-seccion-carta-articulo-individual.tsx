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
import Select from "@/components/form/Select";
import type { Articulo, DetalleSeccionCartaArticuloIndividual } from "@/types/entities";
import { detalleSeccionCartaArticuloIndividualService } from "@/services/detalleSeccionCartaArticuloIndividualService";
import { articuloService } from "@/services/articuloService";
import toast from "react-hot-toast";

type FormData = { precio: number; articuloIds: string[] };
const emptyForm: FormData = { precio: 0, articuloIds: [] };
const noErrors = { precio: false, articulos: false };

export default function DetalleSeccionCartaArticuloIndividualTable() {
  const [items, setItems] = useState<DetalleSeccionCartaArticuloIndividual[]>([]);
  const [allArticulos, setAllArticulos] = useState<Articulo[]>([]);
  const [articuloOptions, setArticuloOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [pendingArticuloId, setPendingArticuloId] = useState("");
  const [errors, setErrors] = useState({ ...noErrors });
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

  useEffect(() => {
    Promise.all([detalleSeccionCartaArticuloIndividualService.getAll(), articuloService.getAll()])
      .then(([detalles, articulos]) => {
        setItems(detalles);
        setAllArticulos(articulos);
        setArticuloOptions(articulos.map((a: Articulo) => ({ value: String(a.id), label: a.nombre })));
      })
      .catch(() => toast.error("Error al cargar los datos"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditingId(null); setFormData(emptyForm); setPendingArticuloId(""); setErrors({ ...noErrors }); openModal(); };

  const openEdit = (item: DetalleSeccionCartaArticuloIndividual) => {
    setEditingId(item.id);
    setFormData({
      precio: item.precio,
      articuloIds: (item.articulos ?? []).map((a) => String(a.id)),
    });
    setPendingArticuloId("");
    setErrors({ ...noErrors });
    openModal();
  };

  const addArticulo = () => {
    if (!pendingArticuloId || formData.articuloIds.includes(pendingArticuloId)) return;
    setFormData((prev) => ({ ...prev, articuloIds: [...prev.articuloIds, pendingArticuloId] }));
    setPendingArticuloId("");
    setErrors((prev) => ({ ...prev, articulos: false }));
  };

  const removeArticulo = (id: string) => {
    setFormData((prev) => ({ ...prev, articuloIds: prev.articuloIds.filter((a) => a !== id) }));
  };

  const requestDelete = (id: number) => { setPendingDeleteId(id); openConfirm(); };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    setDeleting(true);
    try {
      await detalleSeccionCartaArticuloIndividualService.remove(pendingDeleteId);
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
      precio: !formData.precio || formData.precio <= 0,
      articulos: formData.articuloIds.length === 0,
    };
    if (Object.values(newErrors).some(Boolean)) { setErrors(newErrors); return; }

    const payload = {
      precio: formData.precio,
      articulos: formData.articuloIds.map((id) => allArticulos.find((a) => String(a.id) === id)!),
    };

    setSaving(true);
    try {
      if (editingId !== null) {
        const updated = await detalleSeccionCartaArticuloIndividualService.update(editingId, payload);
        setItems((prev) => prev.map((u) => (u.id === editingId ? updated : u)));
      } else {
        const created = await detalleSeccionCartaArticuloIndividualService.create(payload);
        setItems((prev) => [...prev, created]);
      }
      const refreshed = await detalleSeccionCartaArticuloIndividualService.getAll();
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
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Detalles Sección Carta Artículo Individual</h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>Agregar Detalle</Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Id", "Precio", "Artículos", "Acciones"].map((h) => (
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
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">${item.precio}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                    {(item.articulos ?? []).map((a) => a.nombre).join(", ") || "-"}
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

      <DeletionConfirmationPopUp isOpen={isConfirmOpen} onClose={closeConfirm} onConfirm={confirmDelete} isLoading={deleting}
        description="¿Estás seguro de que deseas eliminar este detalle? Esta acción no se puede deshacer." />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-lg p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar Detalle Artículo Individual" : "Agregar Detalle Artículo Individual"}
        </h4>
        <div className="space-y-4">
          <div>
            <Label>Precio</Label>
            <Input placeholder="Ej: 1200" defaultValue={formData.precio} error={errors.precio}
              hint={errors.precio ? "El precio debe ser mayor a cero" : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({ ...prev, precio: Number(e.target.value) }));
                if (errors.precio) setErrors((prev) => ({ ...prev, precio: false }));
              }} />
          </div>

          <div>
            <Label>Artículos</Label>
            {formData.articuloIds.length > 0 && (
              <ul className="mb-3 divide-y divide-gray-100 rounded-lg border border-gray-200 dark:border-white/[0.08] dark:divide-white/[0.05]">
                {formData.articuloIds.map((id) => {
                  const label = articuloOptions.find((o) => o.value === id)?.label ?? id;
                  return (
                    <li key={id} className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-white/80">
                      <span>{label}</span>
                      <button type="button" onClick={() => removeArticulo(id)} className="text-gray-400 hover:text-error-500 transition-colors"><TrashBinIcon /></button>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Select options={articuloOptions.filter((o) => !formData.articuloIds.includes(o.value))}
                  placeholder="Seleccionar artículo" defaultValue={pendingArticuloId}
                  onChange={setPendingArticuloId} />
              </div>
              <Button size="sm" variant="outline" onClick={addArticulo} disabled={!pendingArticuloId}>Agregar</Button>
            </div>
            {errors.articulos && <p className="mt-1.5 text-xs text-error-500">Debe agregar al menos un artículo</p>}
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
