"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import Spinner from "@/components/ui/Spinner";
import { reseniaService } from "@/services/reseniaService";
import type { Resenia } from "@/types/resenia";
import toast from "react-hot-toast";

interface ReseniaPanelProps {
  comandaId: string;
  readOnly?: boolean;
}

export default function ReseniaPanel({ comandaId, readOnly = false }: ReseniaPanelProps) {
  const [items, setItems] = useState<Resenia[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingReseniaId, setEditingReseniaId] = useState<string | null>(null);
  const [formObservacion, setFormObservacion] = useState("");
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    setLoading(true);
    reseniaService
      .getByComanda(comandaId)
      .then(setItems)
      .catch(() => toast.error("Error al cargar las reseñas"))
      .finally(() => setLoading(false));
  }, [comandaId]);

  const resetForm = () => {
    setEditingReseniaId(null);
    setFormObservacion("");
    setFormError(false);
    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (item: Resenia) => {
    setEditingReseniaId(item.id);
    setFormObservacion(item.observacion);
    setFormError(false);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (formObservacion.trim() === "") {
      setFormError(true);
      return;
    }
    setSaving(true);
    try {
      const payload = { observacion: formObservacion.trim() };
      if (editingReseniaId !== null) {
        await reseniaService.updateForComanda(comandaId, editingReseniaId, payload);
        toast.success("Reseña actualizada");
      } else {
        await reseniaService.createForComanda(comandaId, payload);
        toast.success("Reseña agregada");
      }
      resetForm();
      const refreshed = await reseniaService.getByComanda(comandaId);
      setItems(refreshed);
    } catch {
      toast.error("Error al guardar la reseña");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reseniaId: string) => {
    try {
      await reseniaService.removeForComanda(comandaId, reseniaId);
      setItems((prev) => prev.filter((r) => r.id !== reseniaId));
      toast.success("Reseña eliminada");
    } catch {
      toast.error("Error al eliminar la reseña");
    }
  };

  return (
    <div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Observación</TableCell>
              <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Fecha</TableCell>
              {!readOnly && <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Acciones</TableCell>}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <tr>
                <td colSpan={readOnly ? 2 : 3} className="py-8 text-center">
                  <div className="flex justify-center"><Spinner /></div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={readOnly ? 2 : 3} className="py-8 text-center text-gray-500 text-theme-sm">No hay reseñas para esta comanda</td>
              </tr>
            ) : items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-4 py-3 text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                  {item.observacion}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.fechaResenia || "-"}
                </TableCell>
                {!readOnly && (
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditForm(item)} className="text-gray-400 hover:text-brand-500 transition-colors"><PencilIcon /></button>
                      <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-error-500 transition-colors"><TrashBinIcon /></button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!readOnly && !showForm && (
        <div className="mt-4">
          <Button size="sm" onClick={openAddForm} startIcon={<PlusIcon />}>
            Agregar reseña
          </Button>
        </div>
      )}

      {showForm && (
        <div className="mt-4 p-4 border border-gray-200 dark:border-white/[0.05] rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <h5 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-3">
            {editingReseniaId !== null ? "Editar reseña" : "Nueva reseña"}
          </h5>
          <div className="mb-3">
            <Label htmlFor="resenia-observacion">Observación</Label>
            <Input
              id="resenia-observacion" type="text" placeholder="Ej: Excelente atención"
              defaultValue={formObservacion}
              error={formError}
              hint={formError ? "La observación es obligatoria" : undefined}
              onChange={(e) => {
                setFormObservacion(e.target.value);
                if (formError) setFormError(false);
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={resetForm} disabled={saving}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}