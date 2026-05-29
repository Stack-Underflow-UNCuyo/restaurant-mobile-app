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
import Select from "@/components/form/Select";
import MultiSelect from "@/components/form/MultiSelect";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import { EstadoFactura } from "@/types/factura";
import type { Factura, DetalleFactura } from "@/types/factura";
import { facturaService } from "@/services/facturaService";
import type { FacturaPayload } from "@/services/facturaService";
import { detalleFacturaService } from "@/services/detalleFacturaService";
import { formaDePagoService } from "@/services/formaDePagoService";
import { promocionService } from "@/services/promocionService";
import toast from "react-hot-toast";

type FacturaFormData = {
    numeroFactura: string;
    fechaFactura: string;
    totalPagado: string;
    estado: EstadoFactura | "";
    formaDePagoId: string;
    promocionId: string;
};

const emptyForm: FacturaFormData = {
    numeroFactura: "",
    fechaFactura: "",
    totalPagado: "",
    estado: "",
    formaDePagoId: "",
    promocionId: "",
};

const emptyErrors = {
    numeroFactura: false,
    fechaFactura: false,
    totalPagado: false,
    estado: false,
    formaDePagoId: false,
};

const estadoOptions = [
    { value: EstadoFactura.PAGADA, label: "Pagada" },
    { value: EstadoFactura.ANULADA, label: "Anulada" },
    { value: EstadoFactura.SIN_DEFINIR, label: "Sin definir" },
];

const estadoLabels: Record<EstadoFactura, string> = {
    [EstadoFactura.PAGADA]: "Pagada",
    [EstadoFactura.ANULADA]: "Anulada",
    [EstadoFactura.SIN_DEFINIR]: "Sin definir",
};

export default function FacturaTable() {
    const [items, setItems] = useState<Factura[]>([]);
    const [detalles, setDetalles] = useState<DetalleFactura[]>([]);
    const [selectedDetalleIds, setSelectedDetalleIds] = useState<string[]>([]);
    const [formaDePagoOptions, setFormaDePagoOptions] = useState<{ value: string; label: string }[]>([]);
    const [promocionOptions, setPromocionOptions] = useState<{ value: string; label: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FacturaFormData>(emptyForm);
    const [errors, setErrors] = useState(emptyErrors);
    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

    useEffect(() => {
        Promise.all([
            facturaService.getAll(),
            detalleFacturaService.getAll(),
            formaDePagoService.getAll(),
            promocionService.getAll(),
        ])
            .then(([facturas, detallesFactura, formasDePago, promociones]) => {
                setItems(facturas);
                setDetalles(detallesFactura);
                setFormaDePagoOptions(
                    formasDePago.map((f) => ({ value: String(f.id), label: f.tipoPago })),
                );
                setPromocionOptions(
                    promociones.map((p) => ({ value: String(p.id), label: p.descripcion || `${p.porcentajeDescuento}%` })),
                );
            })
            .catch(() => toast.error("Error al cargar las facturas"))
            .finally(() => setLoading(false));
    }, []);

    // los detalles que se pueden asignar son los que no tienen factura mas los ya
    // asignados a la factura en edición.
    const detalleOptions = detalles
        .filter((d) => !d.factura || d.factura.id === editingId)
        .map((d) => ({
            value: d.id,
            text: `Cant. ${d.cantidad} — $${d.subtotal}`,
            selected: selectedDetalleIds.includes(d.id),
        }));

    const openAdd = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setSelectedDetalleIds([]);
        setErrors(emptyErrors);
        openModal();
    };

    const openEdit = (item: Factura) => {
        setEditingId(item.id);
        setFormData({
            numeroFactura: String(item.numeroFactura ?? ""),
            fechaFactura: item.fechaFactura ?? "",
            totalPagado: String(item.totalPagado ?? ""),
            estado: item.estado ?? "",
            formaDePagoId: item.formaDePago ? String(item.formaDePago.id) : "",
            promocionId: item.promocion ? String(item.promocion.id) : "",
        });
        setSelectedDetalleIds(
            detalles.filter((d) => d.factura?.id === item.id).map((d) => d.id),
        );
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
            await facturaService.remove(pendingDeleteId);
            setItems((prev) => prev.filter((f) => f.id !== pendingDeleteId));
            closeConfirm();
            toast.success("Factura eliminada");
        } catch {
            toast.error("Error al eliminar la factura");
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async () => {
        const numero = Number(formData.numeroFactura);
        const total = Number(formData.totalPagado);
        const newErrors = {
            numeroFactura:
                formData.numeroFactura.trim() === "" || Number.isNaN(numero) || numero < 0,
            fechaFactura: !formData.fechaFactura,
            totalPagado:
                formData.totalPagado.trim() === "" || Number.isNaN(total) || total < 0,
            estado: !formData.estado,
            formaDePagoId: !formData.formaDePagoId,
        };
        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            return;
        }
        setSaving(true);
        try {
            const payload: FacturaPayload = {
                numeroFactura: numero,
                fechaFactura: formData.fechaFactura,
                totalPagado: total,
                estado: formData.estado as EstadoFactura,
                formaDePagoId: formData.formaDePagoId,
                detalleFacturaIds: selectedDetalleIds,
                ...(formData.promocionId ? { promocionId: formData.promocionId } : {}),
            };
            if (editingId !== null) {
                await facturaService.update(editingId, payload);
            } else {
                await facturaService.create(payload);
            }
            const [refreshedFacturas, refreshedDetalles] = await Promise.all([
                facturaService.getAll(),
                detalleFacturaService.getAll(),
            ]);
            setItems(refreshedFacturas);
            setDetalles(refreshedDetalles);
            closeModal();
            toast.success("Factura guardada");
        } catch {
            toast.error("Error al guardar la factura");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        Facturas
                    </h3>
                    <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
                        Agregar factura
                    </Button>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    N° Factura
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Fecha
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Total pagado
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Estado
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Forma de pago
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Promoción
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Detalles
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="py-10 text-center">
                                        <div className="flex justify-center">
                                            <Spinner />
                                        </div>
                                    </td>
                                </tr>
                            ) : items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                                        {item.numeroFactura}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {item.fechaFactura || "-"}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                                        ${item.totalPagado}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {item.estado ? estadoLabels[item.estado] : "-"}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {item.formaDePago?.tipoPago ?? "-"}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {item.promocion?.descripcion ?? "-"}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {detalles.filter((d) => d.factura?.id === item.id).length}
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
                description="¿Estás seguro de que deseas eliminar esta factura? Esta acción no se puede deshacer."
            />

            <Modal key={editingId ?? "new"} isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
                <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
                    {editingId !== null ? "Editar factura" : "Agregar factura"}
                </h4>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="factura-numero">N° de factura</Label>
                        <Input
                            id="factura-numero"
                            type="number"
                            min="0"
                            placeholder="Ej: 1001"
                            defaultValue={formData.numeroFactura}
                            error={errors.numeroFactura}
                            hint={errors.numeroFactura ? "Ingresá un número de factura válido" : undefined}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData((prev) => ({ ...prev, numeroFactura: e.target.value }));
                                if (errors.numeroFactura) setErrors((prev) => ({ ...prev, numeroFactura: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="factura-fecha">Fecha</Label>
                        <Input
                            id="factura-fecha"
                            type="date"
                            defaultValue={formData.fechaFactura}
                            error={errors.fechaFactura}
                            hint={errors.fechaFactura ? "La fecha es obligatoria" : undefined}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData((prev) => ({ ...prev, fechaFactura: e.target.value }));
                                if (errors.fechaFactura) setErrors((prev) => ({ ...prev, fechaFactura: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="factura-total">Total pagado</Label>
                        <Input
                            id="factura-total"
                            type="number"
                            min="0"
                            step={0.01}
                            placeholder="Ej: 1500.00"
                            defaultValue={formData.totalPagado}
                            error={errors.totalPagado}
                            hint={errors.totalPagado ? "Ingresá un total válido" : undefined}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData((prev) => ({ ...prev, totalPagado: e.target.value }));
                                if (errors.totalPagado) setErrors((prev) => ({ ...prev, totalPagado: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label>Estado</Label>
                        <Select
                            options={estadoOptions}
                            placeholder="Seleccionar estado"
                            defaultValue={formData.estado}
                            onChange={(value) => {
                                setFormData((prev) => ({ ...prev, estado: value as EstadoFactura }));
                                if (errors.estado) setErrors((prev) => ({ ...prev, estado: false }));
                            }}
                        />
                        {errors.estado && (
                            <p className="mt-1.5 text-xs text-error-500">Debe seleccionar un estado</p>
                        )}
                    </div>
                    <div>
                        <Label>Forma de pago</Label>
                        <Select
                            options={formaDePagoOptions}
                            placeholder="Seleccionar forma de pago"
                            defaultValue={formData.formaDePagoId}
                            onChange={(value) => {
                                setFormData((prev) => ({ ...prev, formaDePagoId: value }));
                                if (errors.formaDePagoId) setErrors((prev) => ({ ...prev, formaDePagoId: false }));
                            }}
                        />
                        {errors.formaDePagoId && (
                            <p className="mt-1.5 text-xs text-error-500">Debe seleccionar una forma de pago</p>
                        )}
                    </div>
                    <div>
                        <Label>Promoción (opcional)</Label>
                        <Select
                            options={promocionOptions}
                            placeholder="Sin promoción"
                            defaultValue={formData.promocionId}
                            onChange={(value) => {
                                setFormData((prev) => ({ ...prev, promocionId: value }));
                            }}
                        />
                    </div>
                    <div>
                        <MultiSelect
                            label="Detalles de factura"
                            options={detalleOptions}
                            defaultSelected={selectedDetalleIds}
                            onChange={setSelectedDetalleIds}
                        />
                        {detalleOptions.length === 0 && (
                            <p className="mt-1.5 text-xs text-gray-500">
                                No hay detalles disponibles. Creá detalles primero en la sección
                                &quot;Detalles de factura&quot;.
                            </p>
                        )}
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
