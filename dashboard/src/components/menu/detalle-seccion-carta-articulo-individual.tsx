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
import type { Articulo, SeccionCarta, DetalleSeccionCartaArticuloIndividual } from "@/types/entities";
import { detalleSeccionCartaArticuloIndividualService } from "@/services/detalleSeccionCartaArticuloIndividualService";
import { articuloService } from "@/services/articuloService";
import { seccionCartaService } from "@/services/seccionCartaService";
import toast from "react-hot-toast";

type FormData = { precio: number; articuloId: string; seccionCartaId: string };
const emptyForm: FormData = { precio: 0, articuloId: "", seccionCartaId: "" };
const noErrors = { precio: false, articuloId: false, seccionCartaId: false };

export default function DetalleSeccionCartaArticuloIndividualTable() {
  const [items, setItems] = useState<DetalleSeccionCartaArticuloIndividual[]>([]);
  const [articuloOptions, setArticuloOptions] = useState<{ value: string; label: string }[]>([]);
  const [seccionOptions, setSeccionOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState({ ...noErrors });
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

  useEffect(() => {
    Promise.all([
      detalleSeccionCartaArticuloIndividualService.getAll(),
      articuloService.getAll(),
      seccionCartaService.getAll(),
    ])
      .then(([detalles, articulos, secciones]) => {
        setItems(detalles);
        setArticuloOptions(articulos.map((a: Articulo) => ({ value: String(a.id), label: a.nombre })));
        setSeccionOptions(secciones.map((s: SeccionCarta) => ({ value: String(s.id), label: s.nombre })));
      })
      .catch(() => toast.error("Error al cargar los datos"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditingId(null); setFormData(emptyForm); setErrors({ ...noErrors }); openModal(); };

  const openEdit = (item: DetalleSeccionCartaArticuloIndividual) => {
    setEditingId(item.id);
    setFormData({
      precio: item.precio,
      articuloId: item.articulo ? String(item.articulo.id) : "",
      seccionCartaId: item.seccionCartaId ?? "",
    });
    setErrors({ ...noErrors });
    openModal();
  };

  const requestDelete = (id: string) => { setPendingDeleteId(id); openConfirm(); };

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
      articuloId: !formData.articuloId,
      seccionCartaId: !formData.seccionCartaId,
    };
    if (Object.values(newErrors).some(Boolean)) { setErrors(newErrors); return; }

    const payload = {
      precio: formData.precio,
      articuloId: formData.articuloId,
      seccionCartaId: formData.seccionCartaId,
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
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Detalles Seccion Carta Articulo Individual</h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>Agregar Detalle</Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Id", "Precio", "Articulo", "Seccion", "Acciones"].map((h) => (
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
                    {item.articulo?.nombre ?? "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                    {item.seccionCartaId ?? "-"}
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
        description="Se eliminara el detalle. El articulo asociado no sera eliminado." />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar Detalle Articulo Individual" : "Agregar Detalle Articulo Individual"}
        </h4>
        <div className="space-y-4">
          <div>
            <Label>Seccion de Carta</Label>
            <Select options={seccionOptions} placeholder="Seleccionar seccion" defaultValue={formData.seccionCartaId}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, seccionCartaId: val }));
                if (errors.seccionCartaId) setErrors((prev) => ({ ...prev, seccionCartaId: false }));
              }} />
            {errors.seccionCartaId && <p className="mt-1.5 text-xs text-error-500">Debe seleccionar una seccion</p>}
          </div>
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
            <Label>Articulo</Label>
            <Select options={articuloOptions} placeholder="Seleccionar articulo" defaultValue={formData.articuloId}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, articuloId: val }));
                if (errors.articuloId) setErrors((prev) => ({ ...prev, articuloId: false }));
              }} />
            {errors.articuloId && <p className="mt-1.5 text-xs text-error-500">Debe seleccionar un articulo</p>}
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
