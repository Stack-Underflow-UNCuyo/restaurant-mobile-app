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
import type { Provincia } from "@/types/entities";
import { provinciaService } from "@/services/provinciaService";
import { paisService } from "@/services/paisService";
import toast from "react-hot-toast";

type FormData = { nombre: string; paisId: string };
const emptyForm: FormData = { nombre: "", paisId: "" };

export default function ProvinciaTable() {
  const [items, setItems] = useState<Provincia[]>([]);
  const [paisOptions, setPaisOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState({ nombre: false, paisId: false });
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

  useEffect(() => {
    Promise.all([
      provinciaService.getAll(),
      paisService.getAll(),
    ])
      .then(([provincias, paises]) => {
        setItems(provincias);
        setPaisOptions(paises.map((p) => ({ value: String(p.id), label: p.nombre })));
      })
      .catch(() => toast.error("Error al cargar los datos"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({ nombre: false, paisId: false });
    openModal();
  };

  const openEdit = (item: Provincia) => {
    setEditingId(item.id);
    setFormData({ nombre: item.nombre, paisId: item.pais ? String(item.pais.id) : "" });
    setErrors({ nombre: false, paisId: false });
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
      await provinciaService.remove(pendingDeleteId);
      setItems((prev) => prev.filter((p) => p.id !== pendingDeleteId));
      closeConfirm();
      toast.success("Provincia eliminada");
    } catch {
      toast.error("Error al eliminar la provincia");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      nombre: !formData.nombre.trim(),
      paisId: !formData.paisId,
    };
    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }
    const payload = { nombre: formData.nombre, paisId: formData.paisId };
    setSaving(true);
    try {
      if (editingId !== null) {
        await provinciaService.update(editingId, payload);
      } else {
        await provinciaService.create(payload);
      }
      const refreshed = await provinciaService.getAll();
      setItems(refreshed);
      closeModal();
      toast.success("Provincia guardada");
    } catch {
      toast.error("Error al guardar la provincia");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Provincias
          </h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
            Agregar Provincia
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
                  País
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
                    {item.pais?.nombre ?? "-"}
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
        description="¿Estás seguro de que deseas eliminar esta provincia? Esta acción no se puede deshacer."
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar Provincia" : "Agregar Provincia"}
        </h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="prov-nombre">Nombre</Label>
            <Input
              id="prov-nombre"
              placeholder="Ej: Mendoza"
              defaultValue={formData.nombre}
              error={errors.nombre}
              hint={errors.nombre ? "El nombre es obligatorio" : "Nombre completo de la provincia"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({ ...prev, nombre: e.target.value }));
                if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: false }));
              }}
            />
          </div>
          <div>
            <Label>País</Label>
            <Select
              options={paisOptions}
              placeholder="Seleccionar país"
              defaultValue={formData.paisId}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, paisId: value }));
                if (errors.paisId) setErrors((prev) => ({ ...prev, paisId: false }));
              }}
            />
            {errors.paisId && (
              <p className="mt-1.5 text-xs text-error-500">Debe seleccionar un país</p>
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
