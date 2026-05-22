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
import { PlusIcon } from "@/icons/index";
import Spinner from "@/components/ui/Spinner";
import { TipoMovimientoStock } from "@/types/entities";
import type { MovimientoStock, Stock } from "@/types/entities";
import { movimientoStockService } from "@/services/movimientoStockService";
import { stockService } from "@/services/stockService";
import toast from "react-hot-toast";

type FormData = {
  stockId: string;
  cantidad: number;
  tipoMovimientoStock: TipoMovimientoStock | "";
};

const emptyForm: FormData = {
  stockId: "",
  cantidad: 0,
  tipoMovimientoStock: "",
};

const noErrors = {
  stockId: false,
  cantidad: false,
  tipoMovimientoStock: false,
};

export default function MovimientoStockTable() {
  const [items, setItems] = useState<MovimientoStock[]>([]);
  const [stockOptions, setStockOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState({ ...noErrors });
  
  const { isOpen, openModal, closeModal } = useModal();

  const tipoOptions = [
    { value: TipoMovimientoStock.ENTRADA, label: "Entrada (Ingreso)" },
    { value: TipoMovimientoStock.SALIDA, label: "Salida (Egreso)" },
  ];

  useEffect(() => {
    Promise.all([
      movimientoStockService.getAll(),
      stockService.getAll()
    ])
      .then(([movimientos, stocks]) => {
        // Ordenamos los movimientos para que los más recientes aparezcan primero
        const sorted = movimientos.sort((a, b) => new Date(b.fechaMovimiento).getTime() - new Date(a.fechaMovimiento).getTime());
        setItems(sorted);
        
        setStockOptions(stocks.map((s) => ({ 
          value: String(s.id), 
          label: `${s.articulo?.nombre ?? "Artículo"} (Actual: ${s.cantidadActual})` 
        })));
      })
      .catch(() => toast.error("Error al cargar los movimientos de stock"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setFormData(emptyForm);
    setErrors({ ...noErrors });
    openModal();
  };

  const handleSubmit = async () => {
    const newErrors = {
      stockId: !formData.stockId,
      cantidad: formData.cantidad <= 0,
      tipoMovimientoStock: !formData.tipoMovimientoStock,
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors({ ...noErrors, ...newErrors });
      return;
    }
    
    setSaving(true);
    try {
      // El backend se encarga de la "fecha" actual automáticamente
      await movimientoStockService.create(formData);
      
      // Refrescamos la lista completa para traer los datos reales con su relación SQL armada
      const refreshed = await movimientoStockService.getAll();
      const sorted = refreshed.sort((a, b) => new Date(b.fechaMovimiento).getTime() - new Date(a.fechaMovimiento).getTime());
      setItems(sorted);
      
      // Opcional: Podrías refrescar también las opciones de stock si cambió el "Actual: X" mostrado en el select
      const stocks = await stockService.getAll();
      setStockOptions(stocks.map((s) => ({ 
        value: String(s.id), 
        label: `${s.articulo?.nombre ?? "Artículo"} (Actual: ${s.cantidadActual})` 
      })));

      closeModal();
      toast.success("Movimiento registrado con éxito");
    } catch {
      toast.error("Error al registrar el movimiento");
    } finally {
      setSaving(false);
    }
  };

  // Helper interno para formatear las fechas de manera amigable
  const formatearFecha = (fechaStr: string) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return fechaStr;
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Historial de Movimientos
          </h3>
          <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
            Registrar Movimiento
          </Button>
        </div>
        
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Fecha y Hora", "Artículo", "Tipo", "Cantidad"].map((header) => (
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
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell className="py-10 text-center text-gray-400 text-theme-sm">
                    No se han registrado movimientos de stock aún.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => {
                  const esEntrada = item.tipoMovimientoStock === TipoMovimientoStock.ENTRADA;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                        {formatearFecha(item.fechaMovimiento)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                        {item.stock?.articulo?.nombre ?? "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm">
                        {esEntrada ? (
                          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                            ENTRADA
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20">
                            SALIDA
                          </span>
                        )}
                      </TableCell>
                      <TableCell className={`px-5 py-4 font-semibold text-theme-sm ${esEntrada ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {esEntrada ? `+${item.cantidad}` : `-${item.cantidad}`}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Registrar Movimiento de Stock
        </h4>
        
        <div className="space-y-4">
          {/* Stock Target Select */}
          <div>
            <Label>Stock / Artículo Destino</Label>
            <Select
              options={stockOptions}
              placeholder="Seleccionar stock"
              defaultValue={formData.stockId}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, stockId: value }));
                if (errors.stockId) setErrors((prev) => ({ ...prev, stockId: false }));
              }}
            />
            {errors.stockId && (
              <p className="mt-1.5 text-xs text-error-500">Debe seleccionar un ítem de stock</p>
            )}
          </div>

          {/* Tipo de Movimiento (Enum) */}
          <div>
            <Label>Tipo de Movimiento</Label>
            <Select
              options={tipoOptions}
              placeholder="Seleccionar tipo"
              defaultValue={formData.tipoMovimientoStock}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, tipoMovimientoStock: value as TipoMovimientoStock }));
                if (errors.tipoMovimientoStock) setErrors((prev) => ({ ...prev, tipoMovimientoStock: false }));
              }}
            />
            {errors.tipoMovimientoStock && (
              <p className="mt-1.5 text-xs text-error-500">Debe seleccionar el tipo de movimiento</p>
            )}
          </div>

          {/* Cantidad Field */}
          <div>
            <Label htmlFor="mov-cantidad">Cantidad a transaccionar</Label>
            <Input
              id="mov-cantidad"
              type="number"
              min="1"
              placeholder="Ej: 10"
              defaultValue={formData.cantidad || ""}
              error={errors.cantidad}
              hint={errors.cantidad ? "La cantidad debe ser mayor a 0" : "Unidades físicas a ingresar o egresar"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = Math.max(0, parseInt(e.target.value) || 0);
                setFormData((prev) => ({ ...prev, cantidad: val }));
                if (errors.cantidad) setErrors((prev) => ({ ...prev, cantidad: false }));
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
            <Button variant="outline" size="sm" onClick={closeModal} disabled={saving}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={saving}>
              {saving ? "Registrando…" : "Registrar"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}