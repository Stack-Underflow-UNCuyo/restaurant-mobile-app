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
import { useModal } from "@/hooks/useModal";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import { Promocion } from "@/types/promocion";
import { promocionService } from "@/services/promocionService";
import toast from "react-hot-toast";

type PromocionFormData = {
    porcentajeDescuento: string,
    descripcion: string,
};

const EmptyFormData: PromocionFormData = {
    porcentajeDescuento: "",
    descripcion: "",
};

export default function PromocionTable() {
    const [items, setItems] = useState<Promocion[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState<PromocionFormData>(EmptyFormData);
    const [errors, setErrors] = useState({ porcentajeDescuento: false, descripcion: false });
    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

    useEffect(() => {
        promocionService
        .getAll()
        .then(setItems)
        .catch(() => toast.error("Error al cargar las promociones"))
        .finally(() => setLoading(false));
    }, []);

    const openAdd = () => {
        setEditingId(null);
        setFormData(EmptyFormData);
        setErrors({ porcentajeDescuento: false, descripcion: false });
        openModal();
    };

    const openEdit = (item: Promocion) => {
        setEditingId(item.id);
        setFormData({ porcentajeDescuento: String(item.porcentajeDescuento), descripcion: item.descripcion || "" });
        setErrors({ porcentajeDescuento: false, descripcion: false });
        openModal();
    };

    const requestDelete = (id: number) => {
        setPendingDeleteId(id);
        openConfirm();
    };

    const confirmDelete = async () => {
        if (pendingDeleteId === null) return;
        setDeleting(true);
        try {
        await promocionService.remove(pendingDeleteId);
        setItems((prev) => prev.filter((p) => p.id !== pendingDeleteId));
        closeConfirm();
        toast.success("Promoción eliminada");
        } catch {
        toast.error("Error al eliminar la promoción");
        } finally {
        setDeleting(false);
        }
    };

    const handleSubmit = async () => {
        const porcentaje = Number(formData.porcentajeDescuento);
        const porcentajeInvalido =
        formData.porcentajeDescuento.trim() === "" ||
        Number.isNaN(porcentaje) ||
        porcentaje < 0 ||
        porcentaje > 100;
        const newErrors = { porcentajeDescuento: porcentajeInvalido, descripcion: !formData.descripcion.trim() };
        if (Object.values(newErrors).some(Boolean)) {
        setErrors(newErrors);
        return;
        }
        setSaving(true);
        try {
        const payload = { porcentajeDescuento: porcentaje, descripcion: formData.descripcion };
        if (editingId !== null) {
            const updated = await promocionService.update(editingId, payload);
            setItems((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        } else {
            const created = await promocionService.create(payload);
            setItems((prev) => [...prev, created]);
        }
        closeModal();
        toast.success("Promoción guardada");
        } catch {
        toast.error("Error al guardar la promoción");
        } finally {
        setSaving(false);
        }
    };

    return (
        <>
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Promociones
            </h3>
            <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
                Agregar promoción
            </Button>
            </div>
            <div className="max-w-full overflow-x-auto">
            <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Porcentaje de descuento
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Descripción
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Acciones
                        </TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                    <tr>
                    <td colSpan={3} className="py-10 text-center">
                        <div className="flex justify-center">
                        <Spinner />
                        </div>
                    </td>
                    </tr>
                ) : items.map((item) => (
                    <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                        {item.porcentajeDescuento}%
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                        {item.descripcion || "-"}
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
                ))}
                </TableBody>
            </Table>
            </div>
        </div>

        <DeletionConfirmationPopUp
            isOpen={isConfirmOpen}
            onClose={closeConfirm}
            onConfirm={confirmDelete}
            isLoading={deleting}
            description="¿Estás seguro de que deseas eliminar esta promoción? Esta acción no se puede deshacer."
        />

        <Modal key={editingId ?? "new"} isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
            <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
            {editingId !== null ? "Editar promoción" : "Agregar promoción"}
            </h4>
            <div className="space-y-4">
            <div>
                <Label htmlFor="promocion-porcentaje">Porcentaje de descuento</Label>
                <Input
                id="promocion-porcentaje"
                type="number"
                min="0"
                max="100"
                step={0.01}
                placeholder="Ej: 15"
                defaultValue={formData.porcentajeDescuento}
                error={errors.porcentajeDescuento}
                hint={errors.porcentajeDescuento ? "Ingresá un porcentaje válido entre 0 y 100" : undefined}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((prev) => ({ ...prev, porcentajeDescuento: e.target.value }));
                    if (errors.porcentajeDescuento) setErrors((prev) => ({ ...prev, porcentajeDescuento: false }));
                }}
                />
            </div>
            <div>
                <Label htmlFor="promocion-descripcion">Descripción</Label>
                <Input
                id="promocion-descripcion"
                placeholder="Ej: Descuento de temporada"
                defaultValue={formData.descripcion}
                error={errors.descripcion}
                hint={errors.descripcion ? "La descripción es obligatoria" : undefined}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((prev) => ({ ...prev, descripcion: e.target.value }));
                    if (errors.descripcion) setErrors((prev) => ({ ...prev, descripcion: false }));
                }}
                />
            </div>
            <div className="flex justify-end gap-3 pt-2">
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
