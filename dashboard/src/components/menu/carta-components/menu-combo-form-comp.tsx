"use client";
import React, { useEffect, useRef, useState } from "react";
import { PlusIcon, TrashBinIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { menuService } from "@/services/menuService";
import { articuloService } from "@/services/articuloService";
import toast from "react-hot-toast";
import type { Articulo, Menu } from "@/types/entities";

export type DetalleComboFormItem = {
  nombre: string;
  cantidad: string | number;
  articuloId?: string;
  articuloCantidad?: string | number;
};

export type MenuComboFormData = {
  id?: string;
  nombre: string;
  precio: string;
  detalles: DetalleComboFormItem[];
};

type FormProps = {
  initialData?: MenuComboFormData;
  onSuccess: (savedCombo: Menu) => void;
  onCancel: () => void;
};

type DetalleRow = {
  nombre: string;
  cantidad: string | number;
  articuloId: string;
  articuloCantidad: string | number;
  _key: number;
};

const MenuComboFormComp: React.FC<FormProps> = ({ initialData, onSuccess, onCancel }) => {
  const [nombre, setNombre] = useState(initialData?.nombre ?? "");
  const [precio, setPrecio] = useState(initialData?.precio ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [articuloOptions, setArticuloOptions] = useState<{ value: string; label: string }[]>([]);
  const [detalles, setDetalles] = useState<DetalleRow[]>(() =>
    (initialData?.detalles ?? [{ nombre: "", cantidad: "", articuloId: "", articuloCantidad: "" }]).map((d, di) => ({
      nombre: d.nombre,
      cantidad: d.cantidad,
      articuloId: d.articuloId ?? "",
      articuloCantidad: d.articuloCantidad ?? "",
      _key: di,
    }))
  );
  const nextKey = useRef(1000);

  useEffect(() => {
    articuloService.getAll()
      .then((articulos: Articulo[]) => {
        setArticuloOptions(articulos.map((a) => ({ value: String(a.id), label: a.nombre })));
      })
      .catch(() => toast.error("Error al cargar articulos"));
  }, []);

  const handleAddDetalle = () => {
    setDetalles((prev) => [
      ...prev,
      { nombre: "", cantidad: "", articuloId: "", articuloCantidad: "", _key: nextKey.current++ },
    ]);
  };

  const handleRemoveDetalle = (key: number) => {
    setDetalles((prev) => prev.filter((d) => d._key !== key));
  };

  const handleDetalleChange = (key: number, field: "nombre" | "cantidad" | "articuloId" | "articuloCantidad", value: string) => {
    setDetalles((prev) =>
      prev.map((d) => (d._key === key ? { ...d, [field]: value } : d))
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = {
        nombre,
        precio: parseFloat(precio.replace(/[^\d.]/g, "")) || 0,
        detallesMenu: detalles.map((d) => ({
          nombre: d.nombre,
          cantidad: Number(d.cantidad),
          articuloId: d.articuloId,
          articuloCantidad: Number(d.articuloCantidad) || 0,
        })),
      };
      let response;

      if (initialData?.id) {
        response = await menuService.update(initialData.id, payload);
      } else {
        response = await menuService.create(payload);
      }

      toast.success("Combo guardado exitosamente");
      onSuccess(response);
    } catch (error) {
      toast.error("Error al guardar el combo");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-brand-500 dark:border-brand-400 bg-white dark:bg-white/[0.02] p-5">
      <div className="flex gap-4 mb-5">
        <div className="flex-1">
          <Label>Nombre</Label>
          <Input
            placeholder="Nombre del combo..."
            defaultValue={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="w-36">
          <Label>Precio</Label>
          <Input
            placeholder="Precio..."
            defaultValue={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>
      </div>

      <div className="border border-gray-200 dark:border-white/[0.1] rounded-lg p-4 mb-5">
        <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/[0.05] pb-2 mb-3 px-1">
          <span>Detalle</span>
          <span className="w-24 text-right pr-16">Cantidad</span>
        </div>

        <div className="flex flex-col gap-3">
          {detalles.map((detalle) => (
            <div key={detalle._key} className="border border-gray-200 dark:border-white/[0.08] rounded-lg p-2">
              <div className="flex gap-2 items-center mb-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Nombre del detalle..."
                    value={detalle.nombre}
                    onChange={(e) => handleDetalleChange(detalle._key, "nombre", e.target.value)}
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                  />
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    placeholder="0"
                    min="1"
                    value={detalle.cantidad}
                    onChange={(e) => handleDetalleChange(detalle._key, "cantidad", e.target.value)}
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                  />
                </div>
                <button
                  onClick={() => handleRemoveDetalle(detalle._key)}
                  className="text-gray-400 hover:text-error-500 transition-colors"
                >
                  <TrashBinIcon />
                </button>
              </div>
              <div className="flex gap-2 items-center px-1">
                <div className="flex-1">
                  <Select
                    options={articuloOptions}
                    placeholder="Seleccionar articulo"
                    defaultValue={detalle.articuloId}
                    onChange={(val) => handleDetalleChange(detalle._key, "articuloId", val)}
                  />
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    placeholder="Cant."
                    min="0"
                    step="0.01"
                    value={detalle.articuloCantidad}
                    onChange={(e) => handleDetalleChange(detalle._key, "articuloCantidad", e.target.value)}
                    className="h-11 w-full rounded-lg border appearance-none px-3 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-3">
          <button
            onClick={handleAddDetalle}
            className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full text-gray-400 hover:text-brand-500 hover:border-brand-500 transition-colors dark:border-white/[0.15]"
          >
            <PlusIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
        <Button size="sm" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </div>
  );
};

export default MenuComboFormComp;
