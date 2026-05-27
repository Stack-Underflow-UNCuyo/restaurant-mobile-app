"use client";
import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashBinIcon } from "@/icons";

export type ArticuloItem = {
  nombre: string;
  cantidad: number | string;
  unidad?: string;
};

export type DetalleCombo = {
  nombre: string;
  cantidad: number;
  articulos?: ArticuloItem[];
};

type MenuComboProps = {
  nombre: string;
  precio: string | number;
  detalles?: DetalleCombo[];
  onEdit?: () => void;
};

const DetalleComboRow: React.FC<{ detalle: DetalleCombo }> = ({ detalle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasArticulos = detalle.articulos && detalle.articulos.length > 0;

  return (
    <div className="border border-gray-300 dark:border-white/[0.15] rounded overflow-hidden">
      <div
        className={`flex justify-between items-center px-3 py-2 bg-white dark:bg-white/[0.02] ${hasArticulos ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.04]" : ""}`}
        onClick={() => hasArticulos && setIsExpanded(!isExpanded)}
      >
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {detalle.nombre}
        </span>
        <span className="text-sm font-medium text-gray-800 dark:text-white/90 w-8 text-right">
          {detalle.cantidad}
        </span>
      </div>

      {isExpanded && hasArticulos && (
        <div className="px-3 pb-2 flex flex-col gap-1 bg-gray-50 dark:bg-transparent">
          <div className="border-t border-gray-200 dark:border-white/[0.05] pt-1 mb-1" />
          {detalle.articulos!.map((articulo, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pl-2"
            >
              <span>{articulo.nombre}</span>
              <div className="flex gap-2 text-right justify-end w-24">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  {articulo.cantidad}
                </span>
                {articulo.unidad && <span>{articulo.unidad}</span>}
              </div>
            </div>
          ))}
          <div className="flex justify-center pt-1">
            <ChevronUpIcon className="w-3 h-3 text-gray-400" />
          </div>
        </div>
      )}

      {!isExpanded && hasArticulos && (
        <div className="flex justify-center pb-1 bg-white dark:bg-white/[0.02]">
          <ChevronDownIcon className="w-3 h-3 text-gray-400" />
        </div>
      )}
    </div>
  );
};

const MenuComboComp: React.FC<MenuComboProps> = ({
  nombre = "Nombre del Combo",
  precio = "$$$",
  detalles = [],
  onEdit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetalles = detalles.length > 0;

  return (
    <div className="border border-gray-200 dark:border-white/[0.1] rounded-lg bg-white dark:bg-transparent overflow-hidden transition-all duration-200">
      <div className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
        <span
          className="flex-1 text-sm font-medium text-gray-800 dark:text-white/90 cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {nombre}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
            {precio}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="text-gray-400 hover:text-brand-500 transition-colors">
              <PencilIcon />
            </button>
            <button className="text-gray-400 hover:text-error-500 transition-colors">
              <TrashBinIcon />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && hasDetalles && (
        <div className="px-4 pb-3 flex flex-col gap-2">
          <div className="border-t border-gray-100 dark:border-white/[0.05] pt-2 mb-1" />
          {detalles.map((detalle, index) => (
            <DetalleComboRow key={index} detalle={detalle} />
          ))}
        </div>
      )}

      <div
        className="flex justify-center py-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronUpIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        )}
      </div>
    </div>
  );
};

export default MenuComboComp;
