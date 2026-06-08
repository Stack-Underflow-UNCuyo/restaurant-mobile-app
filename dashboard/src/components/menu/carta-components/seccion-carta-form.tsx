"use client";
import React, { useState } from "react";
import { CloseLineIcon, PlusIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import FileInput from "@/components/form/input/FileInput";
import { API_BASE_URL } from "@/lib/constants";

export type SeccionImagenData = { nombre: string; mime: string; contenido: string; tipoImagen: string };

type SeccionFormProps = {
  initialTitulo?: string;
  initialCategorias?: string[];
  initialImagenUrl?: string;
  itemsAgregados?: React.ReactNode;
  onSave: (data: { titulo: string; categorias: string[]; imagen?: SeccionImagenData }) => void;
  onCancel: () => void;
};

const SeccionCartaFormComp: React.FC<SeccionFormProps> = ({
  initialTitulo = "",
  initialCategorias = [],
  initialImagenUrl,
  itemsAgregados,
  onSave,
  onCancel,
}) => {
  const [titulo, setTitulo] = useState(initialTitulo);
  const [categorias, setCategorias] = useState<string[]>(initialCategorias);
  const [nuevaCat, setNuevaCat] = useState("");
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [imagen, setImagen] = useState<SeccionImagenData | undefined>(undefined);
  const [imagenUrl, setImagenUrl] = useState<string | undefined>(initialImagenUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = (event.target?.result as string).split(',')[1];
        setImagen({
          nombre: file.name,
          mime: file.type,
          contenido: base64String,
          tipoImagen: "PRODUCTO",
        });
        setImagenUrl(undefined);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategoria = () => {
    if (nuevaCat.trim()) {
      setCategorias((prev) => [...prev, nuevaCat.trim()]);
      setNuevaCat("");
      setIsAddingCat(false);
    }
  };

  const handleRemoveCategoria = (index: number) => {
    setCategorias((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-xl border border-brand-500 dark:border-brand-400 bg-white dark:bg-white/[0.03]">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="mb-4">
          <Label>Nombre de sección</Label>
          <Input
            placeholder="Ej: Entradas, Principales..."
            defaultValue={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categorias.map((cat, index) => (
            <span
              key={index}
              className="flex items-center gap-1.5 px-3 py-0.5 border border-gray-300 dark:border-white/[0.15] rounded-full text-xs text-gray-600 dark:text-gray-400"
            >
              {cat}
              <button
                onClick={() => handleRemoveCategoria(index)}
                className="text-gray-400 hover:text-error-500 transition-colors"
              >
                <CloseLineIcon className="w-3 h-3" />
              </button>
            </span>
          ))}

          {isAddingCat ? (
            <input
              autoFocus
              type="text"
              value={nuevaCat}
              onChange={(e) => setNuevaCat(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCategoria();
                if (e.key === "Escape") setIsAddingCat(false);
              }}
              onBlur={handleAddCategoria}
              placeholder="Categoría..."
              className="text-xs border-b border-brand-500 bg-transparent outline-none py-1 w-24 text-gray-700 dark:text-gray-300 placeholder:text-gray-400"
            />
          ) : (
            <button
              onClick={() => setIsAddingCat(true)}
              className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full text-gray-400 hover:text-brand-500 hover:border-brand-500 transition-colors dark:border-white/[0.15]"
            >
              <PlusIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="mt-4">
          <Label>Imagen</Label>
          <div className="flex items-center gap-4">
            {imagenUrl && (
              <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-white/[0.05] flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${API_BASE_URL}${imagenUrl}`} alt="Imagen actual" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <FileInput onChange={handleFileChange} />
              {imagen && <p className="text-xs text-gray-500 mt-1">Archivo nuevo: {imagen.nombre}</p>}
              {!imagen && imagenUrl && <p className="text-xs text-gray-500 mt-1">Sube una imagen para reemplazar la actual.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-5">
        {itemsAgregados ?? (
          <div className="flex items-center justify-center py-8 border border-dashed border-gray-200 dark:border-white/[0.05] rounded-lg">
            <p className="text-sm text-gray-400">No hay ítems en esta sección todavía</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-5 pb-5">
        <Button size="sm" variant="outline" startIcon={<PlusIcon />}>
          Agregar Detalle Menu
        </Button>
        <div className="flex gap-3">
          <Button size="sm" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button size="sm" onClick={() => onSave({ titulo, categorias, imagen })}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeccionCartaFormComp;
