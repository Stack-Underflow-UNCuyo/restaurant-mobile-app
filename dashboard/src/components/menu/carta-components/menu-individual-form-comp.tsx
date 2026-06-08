"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import type { Articulo } from "@/types/entities";
import { articuloService } from "@/services/articuloService";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/lib/constants";

import FileInput from "@/components/form/input/FileInput";

export type MenuIndividualFormData = {
  articuloId: string;
  articuloNombre: string;
  precio: number;
  imagen?: { nombre: string; mime: string; contenido: string; tipoImagen: string };
  imagenUrl?: string;
};

type FormProps = {
  initialData?: MenuIndividualFormData;
  onSave: (data: MenuIndividualFormData) => Promise<void>;
  onCancel: () => void;
};

const MenuArtIndividualFormComp: React.FC<FormProps> = ({ initialData, onSave, onCancel }) => {
  const [articuloId, setArticuloId] = useState(initialData?.articuloId ?? "");
  const [precio, setPrecio] = useState(initialData?.precio ? String(initialData.precio) : "");
  const [imagen, setImagen] = useState<{ nombre: string; mime: string; contenido: string; tipoImagen: string } | undefined>(initialData?.imagen);
  const [imagenUrl, setImagenUrl] = useState<string | undefined>(initialData?.imagenUrl);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    articuloService.getAll()
      .then(setArticulos)
      .catch(() => toast.error("Error al cargar artículos"))
      .finally(() => setLoading(false));
  }, []);

  const articuloOptions = articulos.map((a) => ({ value: a.id, label: a.nombre }));

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
          tipoImagen: "PRODUCTO"
        });
        setImagenUrl(undefined); // Ocultar imagen anterior si sube una nueva
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!articuloId || !precio.trim() || Number(precio) <= 0) {
      toast.error("Seleccione un artículo y un precio válido");
      return;
    }
    const selected = articulos.find((a) => a.id === articuloId);
    setSaving(true);
    try {
      await onSave({
        articuloId,
        articuloNombre: selected?.nombre ?? "",
        precio: Number(precio),
        imagen
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-brand-500 dark:border-brand-400 bg-white dark:bg-white/[0.02] p-5">
      <div className="flex gap-4 mb-5">
        <div className="flex-1">
          <Label>Artículo</Label>
          <Select
            options={articuloOptions}
            placeholder={loading ? "Cargando..." : "Seleccionar artículo"}
            defaultValue={articuloId}
            onChange={setArticuloId}
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
      <div className="mb-5">
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
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
        <Button size="sm" variant="outline" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={saving || loading}>
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </div>
  );
};

export default MenuArtIndividualFormComp;
