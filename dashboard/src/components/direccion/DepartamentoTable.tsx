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
import Select from "@/components/form/Select";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import type { Departamento } from "@/types/entities";
import { departamentoService } from "@/services/departamentoService";
import { provinciaService } from "@/services/provinciaService";
import toast from "react-hot-toast";

type FormData = { nombre: string; provinciaId: string };
const emptyForm: FormData = { nombre: "", provinciaId: "" };

export default function DepartamentoTable() {
  const [items, setItems] = useState<Departamento[]>([]);
  const [provinciaOptions, setProvinciaOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState({ nombre: false, provinciaId: false });
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

  useEffect(() => {
    Promise.all([
      departamentoService.getAll(),
      provinciaService.getAll(),
    ])
      .then(([departamentos, provincias]) => {
        setItems(departamentos);
        setProvinciaOptions(provincias.map((p) => ({ value: String(p.id), label: p.nombre })));
      })
      .catch(() => toast.error("Error al cargar los datos"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({ nombre: false, provinciaId: false });
    openModal();
  };

  const openEdit = (item: Departamento) => {
    setEditingId(item.id);
    setFormData({ nombre: item.nombre, provinciaId: item.provincia ? String(item.provincia.id) : "" });
    setErrors({ nombre: false, provinciaId: false });
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
      await departamentoService.remove(pendingDeleteId);
      setItems((prev) => prev.filter((d) => d.id !== pendingDeleteId));
      closeConfirm();
      toast.success("Departamento eliminado");
    } catch {
      toast.error("Error al eliminar el departamento");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      nombre: !formData.nombre.trim(),
      provinciaId: !formData.provinciaId,
    };
    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }
    const payload = { nombre: formData.nombre, provinciaId: formData.provinciaId };
    setSaving(true);
    try {
      if (editingId !== null) {
        await departamentoService.update(editingId, payload);
      } else {
        await departamentoService.create(payload);
      }
      const refreshed = await departamentoService.getAll();
      setItems(refreshed);
      closeModal();
      toast.success("Departamento guardado");
    } catch {
      toast.error("Error al guardar el departamento");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Departamentos
          </h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
            Agregar Departamento
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
                  Provincia
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-10 text-center">
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
                  <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.provincia?.nombre ?? "-"}
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
        description="¿Estás seguro de que deseas eliminar este departamento? Esta acción no se puede deshacer."
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar Departamento" : "Agregar Departamento"}
        </h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="depto-nombre">Nombre</Label>
            <Input
              id="depto-nombre"
              placeholder="Ej: Godoy Cruz"
              defaultValue={formData.nombre}
              error={errors.nombre}
              hint={errors.nombre ? "El nombre es obligatorio" : "Nombre completo del departamento"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({ ...prev, nombre: e.target.value }));
                if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: false }));
              }}
            />
          </div>
          <div>
            <Label>Provincia</Label>
            <Select
              options={provinciaOptions}
              placeholder="Seleccionar provincia"
              defaultValue={formData.provinciaId}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, provinciaId: value }));
                if (errors.provinciaId) setErrors((prev) => ({ ...prev, provinciaId: false }));
              }}
            />
            {errors.provinciaId && (
              <p className="mt-1.5 text-xs text-error-500">Debe seleccionar una provincia</p>
            )}
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
