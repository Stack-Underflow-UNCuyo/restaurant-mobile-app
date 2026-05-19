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
import type { Localidad } from "@/types/entities";
import { localidadService } from "@/services/localidadService";
import { departamentoService } from "@/services/departamentoService";
import toast from "react-hot-toast";

type FormData = { nombre: string; codigoPostal: string; departamentoId: string };
const emptyForm: FormData = { nombre: "", codigoPostal: "", departamentoId: "" };

export default function LocalidadTable() {
  const [items, setItems] = useState<Localidad[]>([]);
  const [departamentoOptions, setDepartamentoOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState({ nombre: false, codigoPostal: false, departamentoId: false });
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

  useEffect(() => {
    Promise.all([
      localidadService.getAll(),
      departamentoService.getAll(),
    ])
      .then(([localidades, departamentos]) => {
        setItems(localidades);
        setDepartamentoOptions(departamentos.map((d) => ({ value: String(d.id), label: d.nombre })));
      })
      .catch(() => toast.error("Error al cargar los datos"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({ nombre: false, codigoPostal: false, departamentoId: false });
    openModal();
  };

  const openEdit = (item: Localidad) => {
    setEditingId(item.id);
    setFormData({
      nombre: item.nombre,
      codigoPostal: item.codigoPostal,
      departamentoId: item.departamento ? String(item.departamento.id) : "",
    });
    setErrors({ nombre: false, codigoPostal: false, departamentoId: false });
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
      await localidadService.remove(pendingDeleteId);
      setItems((prev) => prev.filter((l) => l.id !== pendingDeleteId));
      toast.success("Localidad eliminada");
      closeConfirm();
    } catch {
      toast.error("Error al eliminar la localidad");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      nombre: !formData.nombre.trim(),
      codigoPostal: !formData.codigoPostal.trim(),
      departamentoId: !formData.departamentoId,
    };
    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }
    const payload = {
      nombre: formData.nombre,
      codigoPostal: formData.codigoPostal,
      departamentoId: formData.departamentoId,
    };
    setSaving(true);
    try {
      if (editingId !== null) {
        await localidadService.update(editingId, payload);
      } else {
        await localidadService.create(payload);
      }
      const refreshed = await localidadService.getAll();
      setItems(refreshed);
      toast.success("Localidad guardada");
      closeModal();
    } catch {
      toast.error("Error al guardar la localidad");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Localidades
          </h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
            Agregar Localidad
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
                  Código Postal
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Departamento
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center">
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
                    {item.codigoPostal}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.departamento?.nombre ?? "-"}
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
        description="¿Estás seguro de que deseas eliminar esta localidad? Esta acción no se puede deshacer."
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar Localidad" : "Agregar Localidad"}
        </h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="loc-nombre">Nombre</Label>
            <Input
              id="loc-nombre"
              placeholder="Ej: Godoy Cruz"
              defaultValue={formData.nombre}
              error={errors.nombre}
              hint={errors.nombre ? "El nombre es obligatorio" : "Nombre completo de la localidad"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({ ...prev, nombre: e.target.value }));
                if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: false }));
              }}
            />
          </div>
          <div>
            <Label htmlFor="loc-cp">Código Postal</Label>
            <Input
              id="loc-cp"
              placeholder="Ej: 5500"
              defaultValue={formData.codigoPostal}
              error={errors.codigoPostal}
              hint={errors.codigoPostal ? "El código postal es obligatorio" : "Código postal de 4 dígitos"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({ ...prev, codigoPostal: e.target.value }));
                if (errors.codigoPostal) setErrors((prev) => ({ ...prev, codigoPostal: false }));
              }}
            />
          </div>
          <div>
            <Label>Departamento</Label>
            <Select
              options={departamentoOptions}
              placeholder="Seleccionar departamento"
              defaultValue={formData.departamentoId}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, departamentoId: value }));
                if (errors.departamentoId) setErrors((prev) => ({ ...prev, departamentoId: false }));
              }}
            />
            {errors.departamentoId && (
              <p className="mt-1.5 text-xs text-error-500">Debe seleccionar un departamento</p>
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
