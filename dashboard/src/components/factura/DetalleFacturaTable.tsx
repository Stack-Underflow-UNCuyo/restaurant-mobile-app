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
import type { DetalleFactura } from "@/types/factura";
import { detalleFacturaService } from "@/services/detalleFacturaService";
import type { DetalleFacturaPayload } from "@/services/detalleFacturaService";
import toast from "react-hot-toast";

// La factura se asigna desde la Factura
type DetalleFacturaFormData = {
    cantidad: string;
    subtotal: string;
};

const emptyForm: DetalleFacturaFormData = {
    cantidad: "",
    subtotal: "",
};

const emptyErrors = {
    cantidad: false,
    subtotal: false,
};

export default function DetalleFacturaTable() {
    const [items, setItems] = useState<DetalleFactura[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [formData, setFormData] = useState<DetalleFacturaFormData>(emptyForm);
    const [errors, setErrors] = useState(emptyErrors);
    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

    useEffect(() => {
        detalleFacturaService
            .getAll()
            .then(setItems)
            .catch(() => toast.error("Error al cargar los detalles de factura"))
            .finally(() => setLoading(false));
    }, []);

    const openAdd = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setErrors(emptyErrors);
        openModal();
    };

    const openEdit = (item: DetalleFactura) => {
        setEditingId(item.id);
        setFormData({
            cantidad: String(item.cantidad ?? ""),
            subtotal: String(item.subtotal ?? ""),
        });
        setErrors(emptyErrors);
        openModal();
    };

    const requestDelete = (id: string) => {
        setPendingDeleteId(id);
        openConfirm();
    };

    const confirmDelete = async () => {
        if (pendingDeleteId === null) return;
        setDeleting(true);
        try {
            await detalleFacturaService.remove(pendingDeleteId);
            setItems((prev) => prev.filter((d) => d.id !== pendingDeleteId));
            closeConfirm();
            toast.success("Detalle de factura eliminado");
        } catch {
            toast.error("Error al eliminar el detalle de factura");
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async () => {
        const cantidad = Number(formData.cantidad);
        const subtotal = Number(formData.subtotal);
        const newErrors = {
            cantidad:
                formData.cantidad.trim() === "" || Number.isNaN(cantidad) || cantidad <= 0,
            subtotal:
                formData.subtotal.trim() === "" || Number.isNaN(subtotal) || subtotal < 0,
        };
        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            return;
        }
        setSaving(true);
        try {
            const payload: DetalleFacturaPayload = { cantidad, subtotal };
            if (editingId !== null) {
                await detalleFacturaService.update(editingId, payload);
            } else {
                await detalleFacturaService.create(payload);
            }
            const refreshed = await detalleFacturaService.getAll();
            setItems(refreshed);
            closeModal();
            toast.success("Detalle de factura guardado");
        } catch {
            toast.error("Error al guardar el detalle de factura");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        Detalles de factura
                    </h3>
                    <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
                        Agregar detalle
                    </Button>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Cantidad
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Subtotal
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Factura asignada
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center">
                                        <div className="flex justify-center">
                                            <Spinner />
                                        </div>
                                    </td>
                                </tr>
                            ) : items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                                        {item.cantidad}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                                        ${item.subtotal}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {item.factura ? `N° ${item.factura.numeroFactura}` : "Sin asignar"}
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
                description="¿Estás seguro de que deseas eliminar este detalle de factura? Esta acción no se puede deshacer."
            />

            <Modal key={editingId ?? "new"} isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
                <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
                    {editingId !== null ? "Editar detalle de factura" : "Agregar detalle de factura"}
                </h4>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="detalle-cantidad">Cantidad</Label>
                        <Input
                            id="detalle-cantidad"
                            type="number"
                            min="1"
                            placeholder="Ej: 2"
                            defaultValue={formData.cantidad}
                            error={errors.cantidad}
                            hint={errors.cantidad ? "Ingresá una cantidad válida" : undefined}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData((prev) => ({ ...prev, cantidad: e.target.value }));
                                if (errors.cantidad) setErrors((prev) => ({ ...prev, cantidad: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="detalle-subtotal">Subtotal</Label>
                        <Input
                            id="detalle-subtotal"
                            type="number"
                            min="0"
                            step={0.01}
                            placeholder="Ej: 750.00"
                            defaultValue={formData.subtotal}
                            error={errors.subtotal}
                            hint={errors.subtotal ? "Ingresá un subtotal válido" : undefined}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData((prev) => ({ ...prev, subtotal: e.target.value }));
                                if (errors.subtotal) setErrors((prev) => ({ ...prev, subtotal: false }));
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
