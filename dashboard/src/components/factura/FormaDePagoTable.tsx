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
    import Select from "@/components/form/Select";
    import Label from "@/components/form/Label";
    import { useModal } from "@/hooks/useModal";
    import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
    import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
    import Spinner from "@/components/ui/Spinner";
    import { FormaDePago, TipoPago } from "@/types/formaDePago";
    import { formaDePagoService } from "@/services/formaDePagoService";
    import toast from "react-hot-toast";

    type FormaDePagoFormData = {
        tipoPago: TipoPago | "",
        observacion: string,
    };

    const EmptyFormData: FormaDePagoFormData = {
        tipoPago: "",
        observacion: "",
    };

export default function FormaDePagoTable() {
    const [items, setItems] = useState<FormaDePago[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormaDePagoFormData>(EmptyFormData);
    const [errors, setErrors] = useState({ tipoPago: false });
    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

    const tipoPagoOptions = [
        { value: TipoPago.EFECTIVO, label: "Efectivo" },
        { value: TipoPago.TRANSFERENCIA, label: "Transferencia" },
        { value: TipoPago.BILLETERA_VIRTUAL, label: "Billetera Virtual" },
    ];

    useEffect(() => {
        formaDePagoService
        .getAll()
        .then(setItems)
        .catch(() => toast.error("Error al cargar las formas de pago"))
        .finally(() => setLoading(false));
    }, []);

    const openAdd = () => {
        setEditingId(null);
        setFormData(EmptyFormData);
        setErrors({ tipoPago: false });
        openModal();
    };

    const openEdit = (item: FormaDePago) => {
        setEditingId(item.id);
        setFormData({ tipoPago: item.tipoPago, observacion: item.observacion || "" });
        setErrors({ tipoPago: false });
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
        await formaDePagoService.remove(pendingDeleteId);
        setItems((prev) => prev.filter((f) => f.id !== pendingDeleteId));
        closeConfirm();
        toast.success("Forma de pago eliminada");
        } catch {
        toast.error("Error al eliminar la forma de pago");
        } finally {
        setDeleting(false);
        }
    };

    const handleSubmit = async () => {
        const newErrors = { tipoPago: !formData.tipoPago };
        if (Object.values(newErrors).some(Boolean)) {
        setErrors(newErrors);
        return;
        }
        setSaving(true);
        try {
        const payload = { tipoPago: formData.tipoPago as TipoPago, observacion: formData.observacion };
        if (editingId !== null) {
            const updated = await formaDePagoService.update(editingId, payload);
            setItems((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        } else {
            const created = await formaDePagoService.create(payload);
            setItems((prev) => [...prev, created]);
        }
        closeModal();
        toast.success("Forma de pago guardada");
        } catch {
        toast.error("Error al guardar la forma de pago");
        } finally {
        setSaving(false);
        }
    };

    return (
        <>
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Formas de pago
            </h3>
            <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
                Agregar forma de pago
            </Button>
            </div>
            <div className="max-w-full overflow-x-auto">
            <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Tipo de pago
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Observación
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
                        {item.tipoPago}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                        {item.observacion || "-"}
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
            description="¿Estás seguro de que deseas eliminar esta forma de pago? Esta acción no se puede deshacer."
        />

        <Modal key={editingId ?? "new"} isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
            <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
            {editingId !== null ? "Editar forma de pago" : "Agregar forma de pago"}
            </h4>
            <div className="space-y-4">
            <div>
                <Label htmlFor="forma-de-pago-tipo">Tipo de pago</Label>
                <Select
                options={tipoPagoOptions}
                placeholder="Selecciona un tipo de pago"
                defaultValue={formData.tipoPago}
                onChange={(value) => {
                    setFormData((prev) => ({ ...prev, tipoPago: value as TipoPago }));
                    if (errors.tipoPago) setErrors({ tipoPago: false });
                }}
                />
                {errors.tipoPago && (
                <p className="mt-1.5 text-xs text-error-500">El tipo de pago es obligatorio</p>
                )}
            </div>
            <div>
                <Label htmlFor="forma-de-pago-observacion">Observación</Label>
                <Input
                id="forma-de-pago-observacion"
                placeholder="Observación (opcional)"
                defaultValue={formData.observacion}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((prev) => ({ ...prev, observacion: e.target.value }));
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
