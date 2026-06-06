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
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import DetalleComandaPanel from "@/components/comanda/DetalleComandaPanel";
import ReseniaPanel from "@/components/comanda/ReseniaPanel";
import { comandaRestaurantService, type ComandaRestaurantPayload } from "@/services/comandaRestaurantService";
import { empleadoService } from "@/services/empleadoService";
import type { ComandaRestaurantDto } from "@/types/comanda";
import { EstadoComanda } from "@/types/comanda";
import type { Empleado } from "@/types/empleado";
import toast from "react-hot-toast";

const estadoLabels: Record<EstadoComanda, string> = {
  [EstadoComanda.ABIERTA]: "Abierta",
  [EstadoComanda.FINALIZADA]: "Finalizada",
  [EstadoComanda.ANULADA]: "Anulada",
  [EstadoComanda.PENDIENTE_DE_ENTREGA]: "Pendiente de entrega",
  [EstadoComanda.ENTREGA_FALLIDA]: "Entrega fallida",
};

const estadoBadge: Record<string, string> = {
  ABIERTA: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  FINALIZADA: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400",
  ANULADA: "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400",
  PENDIENTE_DE_ENTREGA: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400",
  ENTREGA_FALLIDA: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400",
};

const estadoOptions = [
  { value: EstadoComanda.ABIERTA, label: "Abierta" },
  { value: EstadoComanda.FINALIZADA, label: "Finalizada" },
  { value: EstadoComanda.ANULADA, label: "Anulada" },
  { value: EstadoComanda.PENDIENTE_DE_ENTREGA, label: "Pendiente de entrega" },
  { value: EstadoComanda.ENTREGA_FALLIDA, label: "Entrega fallida" },
];

type FormData = {
  estadoComanda: EstadoComanda | "";
  empleadoId: string;
};

const emptyForm: FormData = {
  estadoComanda: "",
  empleadoId: "",
};

const emptyErrors = {
  estadoComanda: false,
  empleadoId: false,
};

function getEmpleadoLabel(e: Empleado): string {
  return `${e.nombre} ${e.apellido}`;
}

function isEstadoTerminal(estado: EstadoComanda): boolean {
  return estado === EstadoComanda.FINALIZADA
    || estado === EstadoComanda.ANULADA
    || estado === EstadoComanda.ENTREGA_FALLIDA;
}

function DetallesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default function ComandaRestaurantTable() {
  const [items, setItems] = useState<ComandaRestaurantDto[]>([]);
  const [empleadoOptions, setEmpleadoOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);
  const [selectedComandaId, setSelectedComandaId] = useState<string | null>(null);
  const [selectedComandaTerminal, setSelectedComandaTerminal] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();
  const { isOpen: isDetalleOpen, openModal: openDetalle, closeModal: closeDetalle } = useModal();
  const { isOpen: isReseniasOpen, openModal: openResenias, closeModal: closeResenias } = useModal();

  useEffect(() => {
    Promise.all([
      comandaRestaurantService.getAll(),
      empleadoService.getAll(),
    ])
      .then(([comandas, empleados]) => {
        setItems(comandas);
        setEmpleadoOptions(
          empleados.map((e) => ({ value: String(e.id), label: getEmpleadoLabel(e) })),
        );
      })
      .catch(() => toast.error("Error al cargar los datos"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors(emptyErrors);
    openModal();
  };

  const openEdit = (item: ComandaRestaurantDto) => {
    setEditingId(item.id);
    setFormData({
      estadoComanda: item.estadoComanda,
      empleadoId: item.empleado ? String(item.empleado.id) : "",
    });
    setErrors(emptyErrors);
    openModal();
  };

  const openDetalles = (id: string) => {
    const item = items.find((c) => c.id === id);
    setSelectedComandaId(id);
    setSelectedComandaTerminal(item !== undefined && isEstadoTerminal(item.estadoComanda));
    openDetalle();
  };

  const openReseniasHandler = (id: string) => {
    setSelectedComandaId(id);
    const item = items.find((c) => c.id === id);
    setSelectedComandaTerminal(item !== undefined && isEstadoTerminal(item.estadoComanda));
    openResenias();
  };

  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
    openConfirm();
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    setDeleting(true);
    try {
      await comandaRestaurantService.remove(pendingDeleteId);
      setItems((prev) => prev.filter((c) => c.id !== pendingDeleteId));
      closeConfirm();
      toast.success("Comanda eliminada");
    } catch {
      toast.error("Error al eliminar la comanda");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      estadoComanda: editingId !== null && formData.estadoComanda === "",
      empleadoId: formData.empleadoId === "",
    };
    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }
    setSaving(true);
    try {
      const payload: ComandaRestaurantPayload = {
        empleadoId: formData.empleadoId,
      };
      if (editingId !== null) {
        payload.estadoComanda = formData.estadoComanda;
        await comandaRestaurantService.update(editingId, payload);
      } else {
        await comandaRestaurantService.create(payload);
      }
      const refreshed = await comandaRestaurantService.getAll();
      setItems(refreshed);
      closeModal();
      toast.success("Comanda guardada");
    } catch {
      toast.error("Error al guardar la comanda");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Comandas de restaurante</h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
            Agregar comanda
          </Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Fecha solicitud</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Fecha entrega</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Estado</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Mozo</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <div className="flex justify-center"><Spinner /></div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500 text-theme-sm">No hay comandas registradas</td>
                </tr>
              ) : items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.fechaSolicitudComanda ? new Date(item.fechaSolicitudComanda).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.fechaEntregaComanda ? new Date(item.fechaEntregaComanda).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${estadoBadge[item.estadoComanda]}`}>
                      {estadoLabels[item.estadoComanda]}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                    {item.empleado ? `${item.empleado.nombre} ${item.empleado.apellido}` : "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openDetalles(item.id)}
                        className="text-gray-400 hover:text-brand-500 transition-colors"
                        title="Ver detalles"
                      >
                        <DetallesIcon />
                      </button>
                      <button
                        onClick={() => openReseniasHandler(item.id)}
                        className="text-gray-400 hover:text-brand-500 transition-colors"
                        title="Ver reseñas"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                        </svg>
                      </button>
                      {!isEstadoTerminal(item.estadoComanda) && (
                        <>
                          <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-brand-500 transition-colors"><PencilIcon /></button>
                          <button onClick={() => requestDelete(item.id)} className="text-gray-400 hover:text-error-500 transition-colors"><TrashBinIcon /></button>
                        </>
                      )}
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
        description="¿Estás seguro de que deseas eliminar esta comanda? Esta acción no se puede deshacer."
      />

      <Modal key={editingId ?? "new"} isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar comanda" : "Agregar comanda"}
        </h4>
        <div className="space-y-4">
          {editingId !== null && (
            <div>
              <Label>Estado</Label>
              <Select
                options={estadoOptions}
                placeholder="Seleccionar estado"
                defaultValue={formData.estadoComanda}
                onChange={(value) => {
                  setFormData((p) => ({ ...p, estadoComanda: value as EstadoComanda }));
                  if (errors.estadoComanda) setErrors((p) => ({ ...p, estadoComanda: false }));
                }}
              />
              {errors.estadoComanda && <p className="mt-1.5 text-xs text-error-500">Debe seleccionar un estado</p>}
            </div>
          )}
          <div>
            <Label>Mozo</Label>
            <Select
              options={empleadoOptions}
              placeholder="Seleccionar mozo"
              defaultValue={formData.empleadoId}
              onChange={(value) => {
                setFormData((p) => ({ ...p, empleadoId: value }));
                if (errors.empleadoId) setErrors((p) => ({ ...p, empleadoId: false }));
              }}
            />
            {errors.empleadoId && <p className="mt-1.5 text-xs text-error-500">Debe seleccionar un mozo</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={closeModal} disabled={saving}>Cancelar</Button>
            <Button size="sm" onClick={handleSubmit} disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal key={`detalles-${selectedComandaId}`} isOpen={isDetalleOpen} onClose={closeDetalle} className="max-w-3xl p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Detalles de comanda #{selectedComandaId?.slice(0, 8) ?? ""}
        </h4>
        {selectedComandaId && <DetalleComandaPanel comandaId={selectedComandaId} readOnly={selectedComandaTerminal} />}
      </Modal>

      <Modal key={`resenias-${selectedComandaId}`} isOpen={isReseniasOpen} onClose={closeResenias} className="max-w-2xl p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Reseñas de comanda #{selectedComandaId?.slice(0, 8) ?? ""}
        </h4>
        {selectedComandaId && <ReseniaPanel comandaId={selectedComandaId} readOnly={selectedComandaTerminal} />}
      </Modal>
    </>
  );
}
