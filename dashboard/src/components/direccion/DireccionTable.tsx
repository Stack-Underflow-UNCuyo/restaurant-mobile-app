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
import { useModal } from "@/hooks/useModal";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import { localidadService } from "@/services/localidadService";
import { direccionService } from "@/services/direccionService";
import toast from "react-hot-toast";
import { Direccion } from "@/types/entities";

type DireccionFormData = {
    calle: string;
    numeracion: string;
    barrio: string;
    observacion: string;
    localidadId: string;
};

const emptyForm: DireccionFormData = {
    calle: "",
    numeracion: "",
    barrio: "",
    observacion: "",
    localidadId: "",
};

export default function DireccionTable() {
    const [items, setItems] = useState<Direccion[]>([]);
    const [localidadOptions, setLocalidadOptions] = useState<{ value: string; label: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState<DireccionFormData>(emptyForm);
    //para controlar si los campos del formulario son validos o no
    const [errors, setErrors] = useState({ calle: false, numeracion:false, barrio: false, localidadId: false,});
    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

    useEffect(() => {
        Promise.all([
        direccionService.getAll(),
        localidadService.getAll(),
        ])
            .then(([direcciones, localidades]) => {
                setItems(direcciones);
                setLocalidadOptions(localidades.map((l) => ({ value: String(l.id), label: l.nombre })));
                })
            .catch(() => toast.error("Error al cargar los datos"))
            .finally(() => setLoading(false));
    }, []);

    const openAdd = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setErrors({ calle: false, numeracion: false, barrio: false, localidadId: false });
        openModal();
    };

    const openEdit = (item: Direccion) => {
        setEditingId(item.id);
        setFormData({
            calle: item.calle,
            numeracion: item.numeracion,
            barrio: item.barrio,
            observacion: item.observacion ? String(item.observacion) : "",
            localidadId: item.localidad ? String(item.localidad.id) : "", //si localidad es null, se asigna cadena vacía para evitar error de tipo (no deberia ser null igual pq es obligatoria pero es una buena practica)
        });
        setErrors({ calle: false, numeracion: false, barrio: false, localidadId: false });
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
            await direccionService.remove(pendingDeleteId);
            setItems((prev) => prev.filter((l) => l.id !== pendingDeleteId));
            closeConfirm();
            toast.success("Dirección eliminada");
        } catch {
            toast.error("Error al eliminar la dirección");
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async () => {
        const newErrors = {
            calle: !formData.calle.trim(),
            numeracion: !formData.numeracion.trim(),
            barrio: !formData.barrio.trim(),
            localidadId: !formData.localidadId,
        };
        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            return;
        }
        const payload = {
            calle: formData.calle,
            numeracion: formData.numeracion,
            barrio: formData.barrio,
            observacion: formData.observacion.trim() ? formData.observacion : undefined,
            localidadId: formData.localidadId,
        };
        setSaving(true);
        try {
            if (editingId !== null) {
                await direccionService.update(editingId, payload);
            } else {
                await direccionService.create(payload);
            }
            const refreshed = await direccionService.getAll();
            setItems(refreshed);
            closeModal();
            toast.success("Dirección guardada");
        } catch (error) {
            toast.error("Error al guardar la dirección");
            console.error("Error al guardar la dirección:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
    <>
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Direcciones
            </h3>
            <Button size="sm" onClick={openAdd} startIcon={<PlusIcon />}>
                Agregar Dirección
            </Button>
            </div>
            <div className="max-w-full overflow-x-auto">
            <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Calle
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Numeración
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Barrio
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Localidad
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
                    <td colSpan={6} className="py-10 text-center">
                        <div className="flex justify-center">
                        <Spinner />
                        </div>
                    </td>
                    </tr>
                ) : items.map((item) => (
                    <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                        {item.calle}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.numeracion}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.barrio}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.localidad?.nombre ?? "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400 max-w-[200px] truncate">
                        {item.observacion && item.observacion.trim() !== "" ? item.observacion : "-"}
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
            description="¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se puede deshacer."
        />

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
            <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
            {editingId !== null ? "Editar Dirección" : "Agregar Dirección"}
            </h4>
            <div className="space-y-4">
            <div>
                <Label htmlFor="dir-calle">Calle</Label>
                <Input
                id="dir-calle"
                placeholder="Ej: Av. San Martín"
                defaultValue={formData.calle}
                error={errors.calle}
                hint={errors.calle ? "La calle es obligatoria" : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((prev) => ({ ...prev, calle: e.target.value }));
                    if (errors.calle) setErrors((prev) => ({ ...prev, calle: false }));
                }}
                />
            </div>
            <div>
                <Label htmlFor="dir-num">Numeración</Label>
                <Input
                id="dir-num"
                placeholder="Ej: 1234"
                defaultValue={formData.numeracion}
                error={errors.numeracion}
                hint={errors.numeracion ? "Debe indicar una numeración válida (solo enteros)" : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((prev) => ({ ...prev, numeracion: e.target.value }));
                    if (errors.numeracion) setErrors((prev) => ({ ...prev, numeracion: false }));
                }}
                />
            </div>
            <div>
                <Label htmlFor="dir-barrio">Barrio</Label>
                <Input
                id="dir-barrio"
                placeholder="Ej: Centro"
                defaultValue={formData.barrio}
                error={errors.barrio}
                hint={errors.barrio ? "El barrio es obligatorio" : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((prev) => ({ ...prev, barrio: e.target.value }));
                    if (errors.barrio) setErrors((prev) => ({ ...prev, barrio: false }));
                }}
                />
            </div>
            <div>
                <Label>Localidad</Label>
                <Select
                options={localidadOptions}
                placeholder="Seleccionar localidad"
                defaultValue={formData.localidadId}
                onChange={(value) => {
                    setFormData((prev) => ({ ...prev, localidadId: value }));
                    if (errors.localidadId) setErrors((prev) => ({ ...prev, localidadId: false }));
                }}
                />
                {errors.localidadId && (
                <p className="mt-1.5 text-xs text-error-500">Debe seleccionar una localidad</p>
                )}
            </div>
            <div>
                <Label htmlFor="dir-obs">Observación (Opcional)</Label>
                <Input
                id="dir-obs"
                placeholder="Ej: Depto 2B, portón negro"
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