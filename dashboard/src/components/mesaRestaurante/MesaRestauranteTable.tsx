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
import { mesaRestauranteService } from "@/services/mesaRestauranteService";
import type { MesaRestaurante } from "@/types/mesaRestaurante";
import { EstadoMesa } from "@/types/mesaRestaurante";
import toast from "react-hot-toast";

const estadoLabels: Record<EstadoMesa, string> = {
  [EstadoMesa.LIBRE]: "Libre",
  [EstadoMesa.RESERVADA]: "Reservada",
  [EstadoMesa.OCUPADA]: "Ocupada",
  [EstadoMesa.FUERA_DE_SERVICIO]: "Fuera de servicio",
};

const estadoBadge: Record<EstadoMesa, string> = {
  [EstadoMesa.LIBRE]: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400",
  [EstadoMesa.RESERVADA]: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400",
  [EstadoMesa.OCUPADA]: "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400",
  [EstadoMesa.FUERA_DE_SERVICIO]: "bg-gray-50 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
};

const estadoOptions = [
  { value: EstadoMesa.LIBRE, label: "Libre" },
  { value: EstadoMesa.RESERVADA, label: "Reservada" },
  { value: EstadoMesa.OCUPADA, label: "Ocupada" },
  { value: EstadoMesa.FUERA_DE_SERVICIO, label: "Fuera de servicio" },
];

type FormData = {
  identificadorMesa: string;
  estadoMesa: EstadoMesa | "";
  capacidadPersonas: string;
  zonaFisica: string;
};

const emptyForm: FormData = {
  identificadorMesa: "",
  estadoMesa: "",
  capacidadPersonas: "",
  zonaFisica: "",
};

const emptyErrors = {
  identificadorMesa: false,
  estadoMesa: false,
  capacidadPersonas: false,
  zonaFisica: false,
};

export default function MesaRestauranteTable() {
  const [items, setItems] = useState<MesaRestaurante[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

  useEffect(() => {
    mesaRestauranteService
      .getAll()
      .then(setItems)
      .catch(() => toast.error("Error al cargar las mesas"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors(emptyErrors);
    openModal();
  };

  const openEdit = (item: MesaRestaurante) => {
    setEditingId(item.id);
    setFormData({
      identificadorMesa: String(item.identificadorMesa),
      estadoMesa: item.estadoMesa,
      capacidadPersonas: String(item.capacidadPersonas),
      zonaFisica: item.zonaFisica,
    });
    setErrors(emptyErrors);
    openModal();
  };

  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
    openConfirm();
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    setDeleting(true);
    try {
      await mesaRestauranteService.remove(pendingDeleteId);
      setItems((prev) => prev.filter((m) => m.id !== pendingDeleteId));
      closeConfirm();
      toast.success("Mesa eliminada");
    } catch {
      toast.error("Error al eliminar la mesa");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    const identificador = Number(formData.identificadorMesa);
    const capacidad = Number(formData.capacidadPersonas);
    const newErrors = {
      identificadorMesa: formData.identificadorMesa.trim() === "" || Number.isNaN(identificador),
      estadoMesa: formData.estadoMesa === "",
      capacidadPersonas: formData.capacidadPersonas.trim() === "" || Number.isNaN(capacidad),
      zonaFisica: formData.zonaFisica.trim() === "",
    };
    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        identificadorMesa: identificador,
        estadoMesa: formData.estadoMesa as EstadoMesa,
        capacidadPersonas: capacidad,
        zonaFisica: formData.zonaFisica.trim(),
      };
      if (editingId !== null) {
        await mesaRestauranteService.update(editingId, payload);
      } else {
        await mesaRestauranteService.create(payload);
      }
      const refreshed = await mesaRestauranteService.getAll();
      setItems(refreshed);
      closeModal();
      toast.success("Mesa guardada");
    } catch {
      toast.error("Error al guardar la mesa");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Mesas</h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
            Agregar mesa
          </Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Mesa</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Estado</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Capacidad</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Zona</TableCell>
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
                  <td colSpan={5} className="py-10 text-center text-gray-500 text-theme-sm">No hay mesas registradas</td>
                </tr>
              ) : items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    Mesa #{item.identificadorMesa}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${estadoBadge[item.estadoMesa]}`}>
                      {estadoLabels[item.estadoMesa]}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                    {item.capacidadPersonas} pers.
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.zonaFisica}
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

      <DeletionConfirmationPopUp
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        isLoading={deleting}
        description="¿Estás seguro de que deseas eliminar esta mesa? Esta acción no se puede deshacer."
      />

      <Modal key={editingId ?? "new"} isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar mesa" : "Agregar mesa"}
        </h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="mesa-identificador">N° de mesa</Label>
            <Input
              id="mesa-identificador" type="number" min="1" placeholder="Ej: 5"
              defaultValue={formData.identificadorMesa}
              error={errors.identificadorMesa}
              hint={errors.identificadorMesa ? "Ingresá un número de mesa válido" : undefined}
              onChange={(e) => {
                setFormData((p) => ({ ...p, identificadorMesa: e.target.value }));
                if (errors.identificadorMesa) setErrors((p) => ({ ...p, identificadorMesa: false }));
              }}
            />
          </div>
          <div>
            <Label>Estado</Label>
            <Select
              options={estadoOptions}
              placeholder="Seleccionar estado"
              defaultValue={formData.estadoMesa}
              onChange={(value) => {
                setFormData((p) => ({ ...p, estadoMesa: value as EstadoMesa }));
                if (errors.estadoMesa) setErrors((p) => ({ ...p, estadoMesa: false }));
              }}
            />
            {errors.estadoMesa && <p className="mt-1.5 text-xs text-error-500">Debe seleccionar un estado</p>}
          </div>
          <div>
            <Label htmlFor="mesa-capacidad">Capacidad (personas)</Label>
            <Input
              id="mesa-capacidad" type="number" min="1" placeholder="Ej: 4"
              defaultValue={formData.capacidadPersonas}
              error={errors.capacidadPersonas}
              hint={errors.capacidadPersonas ? "Ingresá una capacidad válida" : undefined}
              onChange={(e) => {
                setFormData((p) => ({ ...p, capacidadPersonas: e.target.value }));
                if (errors.capacidadPersonas) setErrors((p) => ({ ...p, capacidadPersonas: false }));
              }}
            />
          </div>
          <div>
            <Label htmlFor="mesa-zona">Zona física</Label>
            <Input
              id="mesa-zona" type="text" placeholder="Ej: Salón principal, Terraza"
              defaultValue={formData.zonaFisica}
              error={errors.zonaFisica}
              hint={errors.zonaFisica ? "La zona es obligatoria" : undefined}
              onChange={(e) => {
                setFormData((p) => ({ ...p, zonaFisica: e.target.value }));
                if (errors.zonaFisica) setErrors((p) => ({ ...p, zonaFisica: false }));
              }}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={closeModal} disabled={saving}>Cancelar</Button>
            <Button size="sm" onClick={handleSubmit} disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
