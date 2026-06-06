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
import Select from "../form/Select";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import type { Stock, Articulo } from "@/types/entities";
import { stockService } from "@/services/stockService";
import { articuloService } from "@/services/articuloService";
import toast from "react-hot-toast";

type FormData = {
  articuloId: string;
  cantidadActual: number;
  minimo: number;
};

const emptyForm: FormData = {
  articuloId: "",
  cantidadActual: 0,
  minimo: 0,
};

const noErrors = {
  articuloId: false,
  cantidadActual: false,
  minimo: false,
};

export default function StockTable() {
  const [items, setItems] = useState<Stock[]>([]);
  const [articuloOptions, setArticuloOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState({ ...noErrors });
  
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

  useEffect(() => {
    Promise.all([
      stockService.getAll(),
      articuloService.getAll()
    ])
      .then(([stocks, articulos]) => {
        setItems(stocks);
        setArticuloOptions(articulos.map((a) => ({ value: String(a.id), label: a.nombre })));
      })
      .catch(() => toast.error("Error al cargar los datos de stock"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({ ...noErrors });
    openModal();
  };

  const openEdit = (item: Stock) => {
    setEditingId(item.id);
    setFormData({
      articuloId: item.articulo ? String(item.articulo.id) : "",
      cantidadActual: item.cantidadActual ?? 0,
      minimo: item.minimo ?? 0,
    });
    setErrors({ ...noErrors });
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
      await stockService.remove(pendingDeleteId);
      setItems((prev) => prev.filter((s) => s.id !== pendingDeleteId));
      closeConfirm();
      toast.success("Registro de stock eliminado");
    } catch {
      toast.error("Error al eliminar el stock");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      articuloId: !formData.articuloId,
      cantidadActual: formData.cantidadActual < 0,
      minimo: formData.minimo < 0,
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors({ ...noErrors, ...newErrors });
      return;
    }
    
    setSaving(true);
    try {
      if (editingId !== null) {
        await stockService.update(editingId, formData);
      } else {
        await stockService.create(formData);
      }
      
      // Forces full refresh matching template layout pattern
      const refreshed = await stockService.getAll();
      setItems(refreshed);
      
      closeModal();
      toast.success("Stock guardado correctamente");
    } catch {
      toast.error("Error al guardar el stock");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Control de Stock
          </h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
            Agregar Stock
          </Button>
        </div>
        
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Artículo", "Cantidad Actual", "Stock Mínimo", "Estado", "Acciones"].map((header) => (
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
                items.map((item) => {
                  const isUnderMinimum = item.cantidadActual <= item.minimo;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                        {item.articulo?.nombre ?? "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                        {item.cantidadActual}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                        {item.minimo}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm">
                        {isUnderMinimum ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20">
                            Reordenar
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                            Óptimo
                          </span>
                        )}
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
                  );
                })
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
        description="¿Estás seguro de que deseas eliminar este registro de stock? Esta acción no se puede deshacer."
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId !== null ? "Editar Stock" : "Agregar Stock"}
        </h4>
        
        <div className="space-y-4">
          {/* Articulo Select Field */}
          <div>
            <Label>Artículo</Label>
            <Select
              options={articuloOptions}
              placeholder="Seleccionar artículo"
              defaultValue={formData.articuloId}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, articuloId: value }));
                if (errors.articuloId) setErrors((prev) => ({ ...prev, articuloId: false }));
              }}
            />
            {errors.articuloId && (
              <p className="mt-1.5 text-xs text-error-500">Debe seleccionar un artículo</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Cantidad Field */}
            <div>
              <Label htmlFor="stock-cantidad">Cantidad</Label>
              <Input
                id="stock-cantidad"
                type="number"
                min="0"
                placeholder="0"
                defaultValue={formData.cantidadActual}
                error={errors.cantidadActual}
                hint={errors.cantidadActual ? "No puede ser menor a 0" : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = Math.max(0, parseInt(e.target.value) || 0);
                  setFormData((prev) => ({ ...prev, cantidadActual: val }));
                  if (errors.cantidadActual) setErrors((prev) => ({ ...prev, cantidadActual: false }));
                }}
              />
            </div>

            {/* Minimo Field */}
            <div>
              <Label htmlFor="stock-minimo">Mínimo</Label>
              <Input
                id="stock-minimo"
                type="number"
                min="0"
                placeholder="0"
                defaultValue={formData.minimo}
                error={errors.minimo}
                hint={errors.minimo ? "No puede ser menor a 0" : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = Math.max(0, parseInt(e.target.value) || 0);
                  setFormData((prev) => ({ ...prev, minimo: val }));
                  if (errors.minimo) setErrors((prev) => ({ ...prev, minimo: false }));
                }}
              />
            </div>
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