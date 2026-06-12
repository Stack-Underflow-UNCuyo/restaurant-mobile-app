"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { PencilIcon, PlusIcon, TrashBinIcon, CloseIcon } from "@/icons/index";
import Spinner from "@/components/ui/Spinner";
import type {
  DetalleSeccionCarta,
  DetalleSeccionCartaMenu,
  DetalleSeccionCartaArticuloIndividual,
} from "@/types/entities";

type AnyDetalleSeccionCarta = DetalleSeccionCarta | DetalleSeccionCartaMenu | DetalleSeccionCartaArticuloIndividual;
import { detalleSeccionCartaMenuService } from "@/services/detalleSeccionCartaMenuService";
import { detalleSeccionCartaArticuloIndividualService } from "@/services/detalleSeccionCartaArticuloIndividualService";
import { menuService } from "@/services/menuService";
import { articuloService } from "@/services/articuloService";
import toast from "react-hot-toast";

type ItemType = "individual" | "menu";

interface DetalleSeccionCartaPanelProps {
  seccionCartaId: string;
  items: AnyDetalleSeccionCarta[];
  onItemsChange: (items: AnyDetalleSeccionCarta[]) => void;
}

export default function DetalleSeccionCartaPanel({
  seccionCartaId,
  items,
  onItemsChange,
}: DetalleSeccionCartaPanelProps) {
  const [menuOptions, setMenuOptions] = useState<{ value: string; label: string }[]>([]);
  const [articuloOptions, setArticuloOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [itemType, setItemType] = useState<ItemType>("individual");
  const [formArticuloId, setFormArticuloId] = useState("");
  const [formPrecio, setFormPrecio] = useState("");
  const [formMenuId, setFormMenuId] = useState("");
  const [formErrors, setFormErrors] = useState({ articulo: false, precio: false, menu: false });

  useEffect(() => {
    setLoadingOptions(true);
    Promise.all([menuService.getAll(), articuloService.getAll()])
      .then(([menus, articulos]) => {
        setMenuOptions(menus.map((m) => ({ value: String(m.id), label: m.nombre })));
        setArticuloOptions(articulos.map((a) => ({ value: String(a.id), label: a.nombre })));
      })
      .catch(() => toast.error("Error al cargar opciones"))
      .finally(() => setLoadingOptions(false));
  }, []);

  const getItemName = (item: AnyDetalleSeccionCarta): string => {
    if ("menu" in item && item.menu) return item.menu.nombre;
    if ("articulo" in item && (item as DetalleSeccionCartaArticuloIndividual).articulo)
      return (item as DetalleSeccionCartaArticuloIndividual).articulo.nombre;
    return item.id.slice(0, 8);
  };

  const getItemTypeLabel = (item: AnyDetalleSeccionCarta): string => {
    if ("menu" in item) return "Menú";
    return "Artículo individual";
  };

  const getItemPrice = (item: AnyDetalleSeccionCarta): string => {
    if ("precio" in item) return `$${(item as DetalleSeccionCartaArticuloIndividual).precio}`;
    if ("menu" in item && item.menu) return `$${item.menu.precio}`;
    return "-";
  };

  const resetForm = () => {
    setShowForm(false);
    setItemType("individual");
    setFormArticuloId("");
    setFormPrecio("");
    setFormMenuId("");
    setFormErrors({ articulo: false, precio: false, menu: false });
  };

  const handleAdd = async () => {
    if (itemType === "individual") {
      const precio = Number(formPrecio);
      const newErrors = {
        articulo: formArticuloId === "",
        precio: formPrecio.trim() === "" || Number.isNaN(precio) || precio <= 0,
        menu: false,
      };
      if (Object.values(newErrors).some(Boolean)) {
        setFormErrors(newErrors);
        return;
      }
      try {
        const saved = await detalleSeccionCartaArticuloIndividualService.create({
          seccionCartaId,
          precio,
          articuloId: formArticuloId,
        });
        onItemsChange([...items, saved]);
        toast.success("Artículo agregado");
        resetForm();
      } catch {
        toast.error("Error al agregar el artículo");
      }
    } else {
      if (!formMenuId) {
        setFormErrors({ articulo: false, precio: false, menu: true });
        return;
      }
      try {
        const saved = await detalleSeccionCartaMenuService.create({
          seccionCartaId,
          menuId: formMenuId,
        });
        onItemsChange([...items, saved]);
        toast.success("Menú agregado");
        resetForm();
      } catch {
        toast.error("Error al agregar el menú");
      }
    }
  };

  const handleDelete = async (detalleId: string) => {
    try {
      const item = items.find((i) => i.id === detalleId);
      if (!item) return;
      if ("menu" in item) {
        await detalleSeccionCartaMenuService.remove(detalleId);
      } else {
        await detalleSeccionCartaArticuloIndividualService.remove(detalleId);
      }
      onItemsChange(items.filter((i) => i.id !== detalleId));
      toast.success("Detalle eliminado");
    } catch {
      toast.error("Error al eliminar el detalle");
    }
  };

  return (
    <div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tipo</TableCell>
              <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nombre</TableCell>
              <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Precio</TableCell>
              <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Acciones</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500 text-theme-sm">No hay detalles en esta sección</td>
              </tr>
            ) : items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-4 py-3">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-white/[0.08] dark:text-gray-300">
                    {getItemTypeLabel(item)}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-800 text-theme-sm dark:text-white/90 font-medium">
                  {getItemName(item)}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {getItemPrice(item)}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-gray-400 hover:text-error-500 transition-colors"
                  >
                    <TrashBinIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!showForm && (
        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => { resetForm(); setItemType("individual"); setShowForm(true); }}
            startIcon={<PlusIcon />}
          >
            Agregar artículo
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => { resetForm(); setItemType("menu"); setShowForm(true); }}
            startIcon={<PlusIcon />}
          >
            Agregar menú
          </Button>
        </div>
      )}

      {showForm && (
        <div className="mt-4 p-4 border border-gray-200 dark:border-white/[0.05] rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              {itemType === "individual" ? "Nuevo artículo individual" : "Nuevo menú"}
            </h5>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
              <CloseIcon />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            {itemType === "individual" ? (
              <>
                <div>
                  <Label>Artículo</Label>
                  <Select
                    options={articuloOptions}
                    placeholder="Seleccionar artículo"
                    defaultValue={formArticuloId}
                    onChange={(value) => {
                      setFormArticuloId(value);
                      if (formErrors.articulo) setFormErrors((p) => ({ ...p, articulo: false }));
                    }}
                  />
                  {formErrors.articulo && <p className="mt-1 text-xs text-error-500">Campo obligatorio</p>}
                </div>
                <div>
                  <Label htmlFor="dsc-precio">Precio</Label>
                  <Input
                    id="dsc-precio" type="number" placeholder="Ej: 1200"
                    defaultValue={formPrecio}
                    error={formErrors.precio}
                    hint={formErrors.precio ? "Precio inválido" : undefined}
                    onChange={(e) => {
                      setFormPrecio(e.target.value);
                      if (formErrors.precio) setFormErrors((p) => ({ ...p, precio: false }));
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="sm:col-span-2">
                <Label>Menú</Label>
                <Select
                  options={menuOptions}
                  placeholder="Seleccionar menú"
                  defaultValue={formMenuId}
                  onChange={(value) => {
                    setFormMenuId(value);
                    if (formErrors.menu) setFormErrors((p) => ({ ...p, menu: false }));
                  }}
                />
                {formErrors.menu && <p className="mt-1 text-xs text-error-500">Campo obligatorio</p>}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={resetForm}>Cancelar</Button>
            <Button size="sm" onClick={handleAdd}>Agregar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
