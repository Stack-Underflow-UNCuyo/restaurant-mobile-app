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
import { detalleComandaService } from "@/services/detalleComandaService";
import { detalleSeccionCartaService } from "@/services/detalleSeccionCartaService";
import type { DetalleComanda } from "@/types/detalleComanda";
import { EstadoDetalleComanda } from "@/types/detalleComanda";
import type { DetalleSeccionCarta } from "@/types/detalleSeccionCarta";
import toast from "react-hot-toast";

const estadoLabels: Record<EstadoDetalleComanda, string> = {
  [EstadoDetalleComanda.EN_PROCESO_DE_SOLICITUD]: "En proceso de solicitud",
  [EstadoDetalleComanda.ENVIADO_A_LA_COCINA]: "Enviado a la cocina",
  [EstadoDetalleComanda.COCINERO_ASIGNADO]: "Cocinero asignado",
  [EstadoDetalleComanda.ENTREGADO_PARA_DESPACHAR]: "Entregado para despachar",
  [EstadoDetalleComanda.ENTREGADO_AL_CLIENTE]: "Entregado al cliente",
  [EstadoDetalleComanda.PLAZO_EXCEDIDO_DE_ENTREGA]: "Plazo excedido de entrega",
};

const estadoBadge: Record<string, string> = {
  EN_PROCESO_DE_SOLICITUD: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  ENVIADO_A_LA_COCINA: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400",
  COCINERO_ASIGNADO: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  ENTREGADO_PARA_DESPACHAR: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  ENTREGADO_AL_CLIENTE: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400",
  PLAZO_EXCEDIDO_DE_ENTREGA: "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400",
};

const estadoOptions = [
  { value: EstadoDetalleComanda.EN_PROCESO_DE_SOLICITUD, label: "En proceso de solicitud" },
  { value: EstadoDetalleComanda.ENVIADO_A_LA_COCINA, label: "Enviado a la cocina" },
  { value: EstadoDetalleComanda.COCINERO_ASIGNADO, label: "Cocinero asignado" },
  { value: EstadoDetalleComanda.ENTREGADO_PARA_DESPACHAR, label: "Entregado para despachar" },
  { value: EstadoDetalleComanda.ENTREGADO_AL_CLIENTE, label: "Entregado al cliente" },
  { value: EstadoDetalleComanda.PLAZO_EXCEDIDO_DE_ENTREGA, label: "Plazo excedido de entrega" },
];

interface DetalleComandaPanelProps {
  comandaId: string;
  readOnly?: boolean;
}

export default function DetalleComandaPanel({ comandaId, readOnly = false }: DetalleComandaPanelProps) {
  const [items, setItems] = useState<DetalleComanda[]>([]);
  const [menuItems, setMenuItems] = useState<DetalleSeccionCarta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingDetalleId, setEditingDetalleId] = useState<string | null>(null);
  const [formCantidad, setFormCantidad] = useState("");
  const [formEstado, setFormEstado] = useState<EstadoDetalleComanda | "">("");
  const [formDetalleSeccionCartaId, setFormDetalleSeccionCartaId] = useState("");
  const [formErrors, setFormErrors] = useState({ cantidad: false, estado: false, item: false });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      detalleComandaService.getAll(comandaId),
      detalleSeccionCartaService.getAllTodos(),
    ])
      .then(([detalles, itemsList]) => {
        setItems(detalles);
        setMenuItems(itemsList);
      })
      .catch(() => toast.error("Error al cargar los detalles"))
      .finally(() => setLoading(false));
  }, [comandaId]);

  const menuItemOptions = menuItems.map((m) => ({
    value: m.id,
    label: m.seccionCarta?.nombre
      ? `${m.seccionCarta.nombre} (${m.id.slice(0, 8)}...)`
      : `Item ${m.id.slice(0, 8)}...`,
  }));

  const resetForm = () => {
    setEditingDetalleId(null);
    setFormCantidad("");
    setFormEstado("");
    setFormDetalleSeccionCartaId("");
    setFormErrors({ cantidad: false, estado: false, item: false });
    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (item: DetalleComanda) => {
    setEditingDetalleId(item.id);
    setFormCantidad(String(item.cantidad));
    setFormEstado(item.estadoDetalleComanda);
    setFormDetalleSeccionCartaId(item.detalleSeccionCartaId);
    setFormErrors({ cantidad: false, estado: false, item: false });
    setShowForm(true);
  };

  const handleSave = async () => {
    const cantidad = Number(formCantidad);
    const newErrors = {
      cantidad: formCantidad.trim() === "" || Number.isNaN(cantidad) || cantidad < 1,
      estado: formEstado === "",
      item: formDetalleSeccionCartaId === "",
    };
    if (Object.values(newErrors).some(Boolean)) {
      setFormErrors(newErrors);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        cantidad,
        estadoDetalleComanda: formEstado as EstadoDetalleComanda,
        comandaId,
        detalleSeccionCartaId: formDetalleSeccionCartaId,
      };
      if (editingDetalleId !== null) {
        await detalleComandaService.update(comandaId, editingDetalleId, payload);
        toast.success("Detalle actualizado");
      } else {
        await detalleComandaService.create(comandaId, payload);
        toast.success("Detalle agregado");
      }
      resetForm();
      const [detalles, itemsList] = await Promise.all([
        detalleComandaService.getAll(comandaId),
        detalleSeccionCartaService.getAllTodos(),
      ]);
      setItems(detalles);
      setMenuItems(itemsList);
    } catch {
      toast.error("Error al guardar el detalle");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (detalleId: string) => {
    try {
      await detalleComandaService.remove(comandaId, detalleId);
      setItems((prev) => prev.filter((d) => d.id !== detalleId));
      toast.success("Detalle eliminado");
    } catch {
      toast.error("Error al eliminar el detalle");
    }
  };

  return (
    <div>
      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Cant.</TableCell>
              <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Estado</TableCell>
              <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Item del menú</TableCell>
              {!readOnly && <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Acciones</TableCell>}
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
                <td colSpan={4} className="py-8 text-center text-gray-500 text-theme-sm">No hay detalles para esta comanda</td>
              </tr>
            ) : items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-4 py-3 text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                  {item.cantidad}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${estadoBadge[item.estadoDetalleComanda]}`}>
                    {estadoLabels[item.estadoDetalleComanda]}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {menuItemOptions.find((m) => m.value === item.detalleSeccionCartaId)?.label ?? item.detalleSeccionCartaId?.slice(0, 8) ?? "-"}
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

      {/* Add button */}
      {!readOnly && !showForm && (
        <div className="mt-4">
          <Button size="sm" onClick={openAddForm} startIcon={<PlusIcon />}>
            Agregar detalle
          </Button>
        </div>
      )}

      {/* Inline form */}
      {showForm && (
        <div className="mt-4 p-4 border border-gray-200 dark:border-white/[0.05] rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <h5 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-3">
            {editingDetalleId !== null ? "Editar detalle" : "Nuevo detalle"}
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
            <div>
              <Label htmlFor="dc-cantidad">Cantidad</Label>
              <Input
                id="dc-cantidad" type="number" min="1" placeholder="Ej: 2"
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
              <Label>Estado</Label>
              <Select
                options={estadoOptions}
                placeholder="Seleccionar estado"
                defaultValue={formEstado}
                onChange={(value) => {
                  setFormEstado(value as EstadoDetalleComanda);
                  if (formErrors.estado) setFormErrors((p) => ({ ...p, estado: false }));
                }}
              />
              {formErrors.estado && <p className="mt-1 text-xs text-error-500">Campo obligatorio</p>}
            </div>
            <div>
              <Label>Item del menú</Label>
              <Select
                options={menuItemOptions}
                placeholder="Seleccionar item"
                defaultValue={formDetalleSeccionCartaId}
                onChange={(value) => {
                  setFormDetalleSeccionCartaId(value);
                  if (formErrors.item) setFormErrors((p) => ({ ...p, item: false }));
                }}
              />
              {formErrors.item && <p className="mt-1 text-xs text-error-500">Campo obligatorio</p>}
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
