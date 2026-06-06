"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import type { Articulo } from "@/types/entities";
import { articuloService } from "@/services/articuloService";
import toast from "react-hot-toast";

export type MenuIndividualFormData = {
  articuloId: string;
  articuloNombre: string;
  precio: number;
};

type FormProps = {
  initialData?: MenuIndividualFormData;
  onSave: (data: MenuIndividualFormData) => Promise<void>;
  onCancel: () => void;
};

const MenuArtIndividualFormComp: React.FC<FormProps> = ({ initialData, onSave, onCancel }) => {
  const [articuloId, setArticuloId] = useState(initialData?.articuloId ?? "");
  const [precio, setPrecio] = useState(initialData?.precio ? String(initialData.precio) : "");
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
