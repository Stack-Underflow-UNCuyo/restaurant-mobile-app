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
import { CheckCircleIcon, PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import type { Articulo } from "@/types/entities";
import { articuloService } from "@/services/articuloService";
import { unidadDeMedidaService } from "@/services/unidadDeMedidaService";
import toast from "react-hot-toast";
import TextArea from "../form/input/TextArea";
import Select from "../form/Select";
import { CheckedIcon, UncheckedIcon } from "../icons/icons";

type FormData = {
  nombre: string;
  descripcion?: string;
  sinTAC: boolean;
  esIngrediente: boolean;
  unidadDeMedidaId: string;
}

const emptyForm: FormData = {
  nombre: "",
  descripcion: undefined,
  sinTAC: false,
  esIngrediente: false,
  unidadDeMedidaId: ""
};

const noErrors = {
  nombre: false,
  sinTAC: false,
  esIngrediente: false,
  unidadDeMedidaId: false,
}

export default function ArticuloTable() {
  const [items, setItems] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState({ ...noErrors });
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();
  const [unidadMedidaOptions, setUnidadMedidaOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    Promise.all([
      articuloService.getAll(),
      unidadDeMedidaService.getAll()
    ])
      .then(([articulos, unidades]) => {
        setItems(articulos);
        setUnidadMedidaOptions(unidades.map((u) => ({ value: String(u.id), label: u.nombre })));
      })
      .catch(() => toast.error("Error al cargar los artículos"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({ ...noErrors });
    openModal();
  };

  const openEdit = (item: Articulo) => {
    setEditingId(item.id);
    setFormData({
      nombre: item.nombre || "",
      descripcion: item.descripcion || "",
      sinTAC: !!item.sinTAC,
      esIngrediente: !!item.esIngrediente,
      unidadDeMedidaId: item.unidadDeMedida ? String(item.unidadDeMedida.id) : ""
    });
    setErrors({ ...noErrors });
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
      await articuloService.remove(pendingDeleteId);
      setItems((prev) => prev.filter((u) => u.id !== pendingDeleteId));
      closeConfirm();
      toast.success("Artículo eliminado");
    } catch {
      toast.error("Error al eliminar el artículo");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      nombre: !formData.nombre?.trim(),
      sinTAC: false,
      esIngrediente: false,
      unidadDeMedidaId: !formData.unidadDeMedidaId
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors({ ...noErrors, ...newErrors });
      return;
    }
    setSaving(true);
    try {
      if (editingId !== null) {
        const updated = await articuloService.update(editingId, formData);
        setItems((prev) => prev.map((u) => (u.id === editingId ? updated : u)));
      } else {
        const created = await articuloService.create(formData);
        setItems((prev) => [...prev, created]);
      }
      const refreshed = await articuloService.getAll();
      setItems(refreshed);
      closeModal();
      toast.success("Artículo guardado");
    } catch {
      toast.error("Error al guardar el artículo");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Artículos
          </h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
            Agregar Artículo
          </Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Nombre", "Unidad de Medida", "Apto Sin TACC", "Es Ingrediente", "Acciones"].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell className="py-10 text-center">
                    <div className="flex justify-center">
                      <Spinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                      {item.nombre}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                      {item.unidadDeMedida?.nombre ?? "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                      {item.sinTAC ? (
                        <CheckedIcon className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <UncheckedIcon className="w-6 h-6 text-gray-300 dark:text-white/10" />
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                      {item.esIngrediente ? (
                        <CheckedIcon className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <UncheckedIcon className="w-6 h-6 text-gray-300 dark:text-white/10" />
                      )}                    </TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DeletionConfirmationPopUp
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        isLoading={deleting}
        description="¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer."
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar Artículo" : "Agregar Artículo"}
        </h4>
        <div className="space-y-4">
          {/* Nombre Field */}
          <div>
            <Label htmlFor="articulo-nombre">Nombre</Label>
            <Input
              placeholder="Ej: Milanesa con Papas"
              defaultValue={formData.nombre}
              error={errors.nombre}
              hint={errors.nombre ? "El nombre es obligatorio" : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => ({ ...prev, nombre: e.target.value }));
                if (errors.nombre) setErrors({ ...errors, nombre: false });
              }}
            />
          </div>

          {/* Descripcion Field */}
          <div>
            <Label htmlFor="articulo-descripcion">Descripción</Label>
            <TextArea
              placeholder="Ej: Descripción detallada del artículo..."
              value={formData.descripcion || ""}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, descripcion: value }));
              }}
            />
          </div>

          {/* Unidad de Medida */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Unidad de medida</Label>
              <Select
                options={unidadMedidaOptions}
                placeholder="Seleccionar unidad de medida"
                defaultValue={formData.unidadDeMedidaId}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, unidadDeMedidaId: value }));
                  if (errors.unidadDeMedidaId) setErrors((prev) => ({ ...prev, unidadDeMedidaId: false }));
                }}
              />
              {errors.unidadDeMedidaId && (
                <p className="mt-1.5 text-xs text-error-500">Debe seleccionar una unidad de medida</p>
              )}
            </div>
          </div>

          {/* Checkboxes Wrapper */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={formData.sinTAC}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData((prev) => ({ ...prev, sinTAC: e.target.checked }));
                }}
              />
              Apto Sin TACC (Libre de gluten)
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={formData.esIngrediente}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData((prev) => ({ ...prev, esIngrediente: e.target.checked }));
                }}
              />
              Es un ingrediente base
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
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