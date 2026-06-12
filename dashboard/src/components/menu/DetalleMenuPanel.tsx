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
import Select from "@/components/form/Select";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import Spinner from "@/components/ui/Spinner";
import { detalleMenuService } from "@/services/detalleMenuService";
import { articuloService } from "@/services/articuloService";
import type { DetalleMenu } from "@/types/entities";
import toast from "react-hot-toast";

interface DetalleMenuPanelProps {
  menuId: string;
}

export default function DetalleMenuPanel({ menuId }: DetalleMenuPanelProps) {
  const [items, setItems] = useState<DetalleMenu[]>([]);
  const [articuloOptions, setArticuloOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingDetalleId, setEditingDetalleId] = useState<string | null>(null);
  const [formNombre, setFormNombre] = useState("");
  const [formCantidad, setFormCantidad] = useState("");
  const [formArticuloId, setFormArticuloId] = useState("");
  const [formErrors, setFormErrors] = useState({ nombre: false, cantidad: false, articulo: false });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      detalleMenuService.getByMenuId(menuId),
      articuloService.getAll(),
    ])
      .then(([detalles, articulos]) => {
        setItems(detalles);
        setArticuloOptions(
          articulos.map((a) => ({ value: String(a.id), label: a.nombre })),
        );
      })
      .catch(() => toast.error("Error al cargar los detalles"))
      .finally(() => setLoading(false));
  }, [menuId]);

  const resetForm = () => {
    setEditingDetalleId(null);
    setFormNombre("");
    setFormCantidad("");
    setFormArticuloId("");
    setFormErrors({ nombre: false, cantidad: false, articulo: false });
    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (item: DetalleMenu) => {
    setEditingDetalleId(item.id);
    setFormNombre(item.nombre);
    setFormCantidad(String(item.cantidad));
    setFormArticuloId(item.articulo ? String(item.articulo.id) : "");
    setFormErrors({ nombre: false, cantidad: false, articulo: false });
    setShowForm(true);
  };

  const handleSave = async () => {
    const cantidad = Number(formCantidad);
    const newErrors = {
      nombre: formNombre.trim() === "",
      cantidad: formCantidad.trim() === "" || Number.isNaN(cantidad) || cantidad < 1,
      articulo: formArticuloId === "",
    };
    if (Object.values(newErrors).some(Boolean)) {
      setFormErrors(newErrors);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        nombre: formNombre.trim(),
        cantidad,
        articuloId: formArticuloId,
      };
      if (editingDetalleId !== null) {
        await detalleMenuService.updateInMenu(menuId, editingDetalleId, payload);
        toast.success("Detalle actualizado");
      } else {
        await detalleMenuService.createInMenu(menuId, payload);
        toast.success("Detalle agregado");
      }
      resetForm();
      const [detalles] = await Promise.all([
        detalleMenuService.getByMenuId(menuId),
      ]);
      setItems(detalles);
    } catch {
      toast.error("Error al guardar el detalle");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (detalleId: string) => {
    try {
      await detalleMenuService.removeFromMenu(menuId, detalleId);
      setItems((prev) => prev.filter((d) => d.id !== detalleId));
      toast.success("Detalle eliminado");
    } catch {
      toast.error("Error al eliminar el detalle");
    }
  };

  return (
    <div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nombre</TableCell>
              <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Cant.</TableCell>
              <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Artículo</TableCell>
              <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Acciones</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center">
                  <div className="flex justify-center"><Spinner /></div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500 text-theme-sm">No hay detalles para este menú</td>
              </tr>
            ) : items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-4 py-3 text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                  {item.nombre}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-800 text-theme-sm dark:text-white/90">
                  {item.cantidad}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.articulo?.nombre ?? "-"}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditForm(item)} className="text-gray-400 hover:text-brand-500 transition-colors"><PencilIcon /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-error-500 transition-colors"><TrashBinIcon /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!showForm && (
        <div className="mt-4">
          <Button size="sm" onClick={openAddForm} startIcon={<PlusIcon />}>
            Agregar detalle
          </Button>
        </div>
      )}

      {showForm && (
        <div className="mt-4 p-4 border border-gray-200 dark:border-white/[0.05] rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <h5 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-3">
            {editingDetalleId !== null ? "Editar detalle" : "Nuevo detalle"}
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
            <div>
              <Label htmlFor="dm-nombre">Nombre</Label>
              <Input
                id="dm-nombre" placeholder="Ej: Milanesa con papas"
                defaultValue={formNombre}
                error={formErrors.nombre}
                hint={formErrors.nombre ? "Campo obligatorio" : undefined}
                onChange={(e) => {
                  setFormNombre(e.target.value);
                  if (formErrors.nombre) setFormErrors((p) => ({ ...p, nombre: false }));
                }}
              />
            </div>
            <div>
              <Label htmlFor="dm-cantidad">Cantidad</Label>
              <Input
                id="dm-cantidad" type="number" min="1" placeholder="Ej: 2"
                defaultValue={formCantidad}
                error={formErrors.cantidad}
                hint={formErrors.cantidad ? "Cantidad inválida" : undefined}
                onChange={(e) => {
                  setFormCantidad(e.target.value);
                  if (formErrors.cantidad) setFormErrors((p) => ({ ...p, cantidad: false }));
                }}
              />
            </div>
            <div>
              <Label>Artículo</Label>
              <Select
                options={articuloOptions}
                placeholder="Seleccionar artículo"
                defaultValue={formArticuloId}
                onChange={(value) => {
                  setFormArticuloId(value);
                  if (formErrors.articulo) setFormErrors((p) => ({ ...p, articulo: false }));
                }}
              />
              {formErrors.articulo && <p className="mt-1 text-xs text-error-500">Campo obligatorio</p>}
            </div>
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
