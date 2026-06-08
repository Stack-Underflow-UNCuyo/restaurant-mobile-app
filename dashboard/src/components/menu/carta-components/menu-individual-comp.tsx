"use client";
import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashBinIcon } from "@/icons";
import { API_BASE_URL } from "@/lib/constants";

export type DetalleItem = {
  nombre: string;
  cantidad: number | string;
  unidad?: string;
};

type MenuItemProps = {
  nombre: string;
  precio: string | number;
  detalles?: DetalleItem[];
  imagenUrl?: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const MenuArtIndividualComp: React.FC<MenuItemProps> = ({
  nombre = "Nombre del ítem",
  precio = "$$$",
  detalles = [],
  imagenUrl,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetalles = detalles.length > 0;

  return (
    <div className="border border-gray-200 dark:border-white/[0.1] rounded-lg bg-white dark:bg-transparent overflow-hidden transition-all duration-200">
      <div className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {imagenUrl && (
            <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-white/[0.05]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${API_BASE_URL}${imagenUrl}`} alt={nombre} className="w-full h-full object-cover" />
            </div>
          )}
          <span
            className="flex-1 text-sm font-medium text-gray-800 dark:text-white/90 cursor-pointer select-none"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {nombre}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
            {precio}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="text-gray-400 hover:text-brand-500 transition-colors">
              <PencilIcon />
            </button>
            <button onClick={onDelete} className="text-gray-400 hover:text-error-500 transition-colors">
              <TrashBinIcon />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && hasDetalles && (
        <div className="px-4 pb-3 flex flex-col gap-1.5">
          <div className="border-t border-gray-100 dark:border-white/[0.05] pt-2 mb-1" />
          {detalles.map((detalle, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 pl-2"
            >
              <span>{detalle.nombre}</span>
              <div className="flex gap-2 text-right justify-end w-24">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {detalle.cantidad}
                </span>
                {detalle.unidad && <span>{detalle.unidad}</span>}
              </div>
            </div>
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

export default MenuArtIndividualComp;
