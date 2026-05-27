"use client";
import React, { useRef, useState } from "react";
import { PlusIcon, TrashBinIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

export type ArticuloFormItem = {
  nombre: string;
  cantidad: string | number;
};

export type MenuIndividualFormData = {
  nombre: string;
  precio: string;
  detalles: ArticuloFormItem[];
};

type FormProps = {
  initialData?: MenuIndividualFormData;
  onSave: (data: MenuIndividualFormData) => void;
  onCancel: () => void;
};

type DetalleRow = ArticuloFormItem & { _key: number };

const inputClasses =
  "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800";

const MenuArtIndividualFormComp: React.FC<FormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [nombre, setNombre] = useState(initialData?.nombre ?? "");
  const [precio, setPrecio] = useState(initialData?.precio ?? "");
  const [detalles, setDetalles] = useState<DetalleRow[]>(() =>
    (initialData?.detalles ?? [{ nombre: "", cantidad: "" }]).map((d, i) => ({ ...d, _key: i }))
  );
  const nextKey = useRef(detalles.length);

  const handleAddDetalle = () => {
    setDetalles((prev) => [...prev, { nombre: "", cantidad: "", _key: nextKey.current++ }]);
  };

  const handleRemoveDetalle = (key: number) => {
    setDetalles((prev) => prev.filter((d) => d._key !== key));
  };

  const handleDetalleChange = (key: number, field: keyof ArticuloFormItem, value: string) => {
    setDetalles((prev) =>
      prev.map((d) => (d._key === key ? { ...d, [field]: value } : d))
    );
  };

  return (
    <div className="rounded-xl border border-brand-500 dark:border-brand-400 bg-white dark:bg-white/[0.02] p-5">
      <div className="flex gap-4 mb-5">
        <div className="flex-1">
          <Label>Nombre</Label>
          <Input
            placeholder="Ingrese el nombre..."
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
          <span>Artículo</span>
          <span className="w-24 text-right pr-8">Cantidad</span>
        </div>

        <div className="flex flex-col gap-2">
          {detalles.map((detalle) => (
            <div key={detalle._key} className="flex gap-2 items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Artículo..."
                  value={detalle.nombre}
                  onChange={(e) => handleDetalleChange(detalle._key, "nombre", e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  placeholder="0"
                  value={detalle.cantidad}
                  onChange={(e) => handleDetalleChange(detalle._key, "cantidad", e.target.value)}
                  className={inputClasses}
                />
              </div>
              <button
                onClick={() => handleRemoveDetalle(detalle._key)}
                className="text-gray-400 hover:text-error-500 transition-colors"
              >
                <TrashBinIcon />
              </button>
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
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button size="sm" onClick={() => onSave({ nombre, precio, detalles: detalles.map((d) => ({ nombre: d.nombre, cantidad: d.cantidad })) })}>
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default MenuArtIndividualFormComp;
