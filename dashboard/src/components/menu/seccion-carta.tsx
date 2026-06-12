"use client";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, PlusIcon, TrashBinIcon, ListIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import Select from "@/components/form/Select";
import DetalleSeccionCartaPanel from "./DetalleSeccionCartaPanel";
import type { Categoria, SeccionCarta, DetalleSeccionCarta, DetalleSeccionCartaMenu, DetalleSeccionCartaArticuloIndividual } from "@/types/entities";

type AnyDetalleSeccionCarta = DetalleSeccionCarta | DetalleSeccionCartaMenu | DetalleSeccionCartaArticuloIndividual;
import { seccionCartaService } from "@/services/seccionCartaService";
import { categoriaService } from "@/services/categoriaService";
import toast from "react-hot-toast";

type FormData = { nombre: string; categoriaNombre: string };
const emptyForm: FormData = { nombre: "", categoriaNombre: "" };
const noErrors = { nombre: false, categoriaNombre: false };

export default function SeccionCartaTable() {
  const [items, setItems] = useState<SeccionCarta[]>([]);
  const [categoriaOptions, setCategoriaOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState({ ...noErrors });

  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();
  const { isOpen: isDetalleOpen, openModal: openDetalleModal, closeModal: closeDetalleModal } = useModal();

  const [selectedSeccion, setSelectedSeccion] = useState<SeccionCarta | null>(null);

  useEffect(() => {
    Promise.all([seccionCartaService.getAll(), categoriaService.getAll()])
      .then(([secciones, categorias]) => {
        setItems(secciones);
        setCategoriaOptions(categorias.map((c: Categoria) => ({ value: c.nombre, label: c.nombre })));
      })
      .catch(() => toast.error("Error al cargar las secciones de carta"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditingId(null); setFormData(emptyForm); setErrors({ ...noErrors }); openModal(); };

  const openEdit = (item: SeccionCarta) => {
    setEditingId(item.id);
    setFormData({
      nombre: item.nombre ?? "",
      categoriaNombre: item.categoria?.nombre ?? "",
    });
    setErrors({ ...noErrors });
    openModal();
  };

  const openDetalle = (item: SeccionCarta) => {
    setSelectedSeccion(item);
    openDetalleModal();
  };

  const requestDelete = (id: string) => { setPendingDeleteId(id); openConfirm(); };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    setDeleting(true);
    try {
      await seccionCartaService.remove(pendingDeleteId);
      setItems((prev) => prev.filter((u) => u.id !== pendingDeleteId));
      closeConfirm();
      toast.success("Sección de carta eliminada");
    } catch {
      toast.error("Error al eliminar la sección de carta");
    } finally {
      setDeleting(false);
    }
  };

  const handleDetalleChange = (detalles: AnyDetalleSeccionCarta[]) => {
    if (!selectedSeccion) return;
    setItems((prev) =>
      prev.map((s) =>
        s.id === selectedSeccion.id ? { ...s, detallesSeccionCarta: detalles } : s
      )
    );
    setSelectedSeccion((prev) => (prev ? { ...prev, detallesSeccionCarta: detalles } : prev));
  };

  const handleSubmit = async () => {
    const newErrors = { nombre: !formData.nombre.trim(), categoriaNombre: false };
    if (Object.values(newErrors).some(Boolean)) { setErrors(newErrors); return; }
    setSaving(true);
    try {
      const payload = { nombre: formData.nombre, categoriaNombre: formData.categoriaNombre || undefined };
      if (editingId !== null) {
        const updated = await seccionCartaService.update(editingId, payload);
        setItems((prev) => prev.map((u) => (u.id === editingId ? updated : u)));
      } else {
        const created = await seccionCartaService.create(payload);
        setItems((prev) => [...prev, created]);
      }
      closeModal();
      toast.success("Sección de carta guardada");
    } catch {
      toast.error("Error al guardar la sección de carta");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Secciones de Carta</h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>Agregar Sección</Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Id", "Nombre", "Categoría", "Acciones"].map((h) => (
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
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">{item.categoria?.nombre ?? "-"}</TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openDetalle(item)} className="text-gray-400 hover:text-brand-500 transition-colors" title="Gestionar detalles"><ListIcon /></button>
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
        description="¿Estás seguro de que deseas eliminar esta sección de carta? Esta acción no se puede deshacer." />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar Sección de Carta" : "Agregar Sección de Carta"}
        </h4>
        <div className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input placeholder="Ej: Entradas" defaultValue={formData.nombre} error={errors.nombre}
              hint={errors.nombre ? "El nombre es obligatorio" : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({ ...prev, nombre: e.target.value }));
                if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: false }));
              }} />
          </div>
          <div>
            <Label>Categoría</Label>
            <Select options={[{ value: "", label: "Sin categoría" }, ...categoriaOptions]} placeholder="Seleccionar categoría" defaultValue={formData.categoriaNombre}
              onChange={(value) => { setFormData((prev) => ({ ...prev, categoriaNombre: value })); }} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
            <Button variant="outline" size="sm" onClick={closeModal} disabled={saving}>Cancelar</Button>
            <Button size="sm" onClick={handleSubmit} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDetalleOpen} onClose={closeDetalleModal} className="max-w-2xl p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Detalles de {selectedSeccion?.nombre ?? "Sección"}
        </h4>
        {selectedSeccion && (
          <DetalleSeccionCartaPanel
            seccionCartaId={selectedSeccion.id}
            items={selectedSeccion.detallesSeccionCarta ?? []}
            onItemsChange={handleDetalleChange}
          />
        )}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
          <Button variant="outline" size="sm" onClick={closeDetalleModal}>Cerrar</Button>
        </div>
      </Modal>
    </>
  );
}
