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
import { PencilIcon, TrashBinIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import { empleadoService } from "@/services/empleadoService";
import toast from "react-hot-toast";
import { Empleado, TipoEmpleado } from "@/types/empleado";

type EmpleadoFormData = {
    nombre: string;
    apellido: string;
    tipoEmpleado: string;
    numeroDocumento: string;
};

const emptyForm: EmpleadoFormData = {
    nombre: "",
    apellido: "",
    tipoEmpleado: "",
    numeroDocumento: "",
};

const tipoEmpleadoOptions = [
    { value: TipoEmpleado.ADMINISTRATIVO, label: "Administrador" },
    { value: TipoEmpleado.COCINERO, label: "Cocinero" },
    { value: TipoEmpleado.MOZO, label: "Mozo" },
];

const tipoEmpleadoLabel: Record<string, string> = {
    [TipoEmpleado.ADMINISTRATIVO]: "Administrador",
    [TipoEmpleado.COCINERO]: "Cocinero",
    [TipoEmpleado.MOZO]: "Mozo",
};

export default function EmpleadoTable() {
    const [items, setItems] = useState<Empleado[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [formData, setFormData] = useState<EmpleadoFormData>(emptyForm);
    const [errors, setErrors] = useState({
        nombre: false,
        apellido: false,
        tipoEmpleado: false,
        numeroDocumento: false,
    });

    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

    useEffect(() => {
        empleadoService
            .getAll()
            .then(setItems)
            .catch(() => toast.error("Error al cargar los empleados"))
            .finally(() => setLoading(false));
    }, []);

    const openEdit = (item: Empleado) => {
        setEditingId(item.id);
        setFormData({
            nombre: item.nombre,
            apellido: item.apellido,
            tipoEmpleado: item.tipoEmpleado,
            numeroDocumento: item.numeroDocumento,
        });
        setErrors({ nombre: false, apellido: false, tipoEmpleado: false, numeroDocumento: false });
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
            await empleadoService.remove(pendingDeleteId);
            setItems((prev) => prev.filter((e) => e.id !== pendingDeleteId));
            closeConfirm();
            toast.success("Empleado eliminado");
        } catch {
            toast.error("Error al eliminar el empleado");
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async () => {
        const newErrors = {
            nombre: !formData.nombre.trim(),
            apellido: !formData.apellido.trim(),
            tipoEmpleado: !formData.tipoEmpleado,
            numeroDocumento: !formData.numeroDocumento.trim(),
        };
        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            return;
        }

        const payload: EmpleadoFormData = {
            nombre: formData.nombre,
            apellido: formData.apellido,
            tipoEmpleado: formData.tipoEmpleado,
            numeroDocumento: formData.numeroDocumento,
        };

        setSaving(true);
        try {
            /*if (editingId !== null) {
                await empleadoService.update(editingId, payload);
            }
                */
            const refreshed = await empleadoService.getAll();
            setItems(refreshed);
            closeModal();
            toast.success("Empleado guardado");
        } catch {
            toast.error("Error al guardar el empleado");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Empleados</h3>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Nombre
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Apellido
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Tipo
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    N° Documento
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center">
                                        <div className="flex justify-center">
                                            <Spinner />
                                        </div>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-sm text-gray-400">
                                        No hay empleados registrados
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                                            {item.nombre}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                                            {item.apellido}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    item.tipoEmpleado === TipoEmpleado.ADMINISTRATIVO
                                                        ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                                                        : "bg-gray-100 text-gray-600 dark:bg-white/[0.05] dark:text-gray-400"
                                                }`}
                                            >
                                                {tipoEmpleadoLabel[item.tipoEmpleado] ?? item.tipoEmpleado}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {item.numeroDocumento}
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {/*
                                                <button
                                                    onClick={() => openEdit(item)}
                                                    className="text-gray-400 hover:text-gray-700 transition-colors dark:hover:text-white/70"
                                                >
                                                    <PencilIcon />
                                                </button>
                                                */}
                                                <button
                                                    onClick={() => requestDelete(item.id)}
                                                    className="text-gray-400 hover:text-error-500 transition-colors"
                                                >
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <DeletionConfirmationPopUp
                isOpen={isConfirmOpen}
                onClose={closeConfirm}
                onConfirm={confirmDelete}
                isLoading={deleting}
                description="¿Estás seguro de que deseas eliminar este empleado? Esta acción no se puede deshacer."
            />

            {/* Modal de edición */}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
                <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Editar Empleado
                </h4>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="edit-nombre">Nombre</Label>
                        <Input
                            id="edit-nombre"
                            placeholder="Juan"
                            defaultValue={formData.nombre}
                            error={errors.nombre}
                            hint={errors.nombre ? "El nombre es obligatorio" : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData((p) => ({ ...p, nombre: e.target.value }));
                                if (errors.nombre) setErrors((p) => ({ ...p, nombre: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="edit-apellido">Apellido</Label>
                        <Input
                            id="edit-apellido"
                            placeholder="Pérez"
                            defaultValue={formData.apellido}
                            error={errors.apellido}
                            hint={errors.apellido ? "El apellido es obligatorio" : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData((p) => ({ ...p, apellido: e.target.value }));
                                if (errors.apellido) setErrors((p) => ({ ...p, apellido: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label>Tipo de empleado</Label>
                        <Select
                            options={tipoEmpleadoOptions}
                            placeholder="Seleccionar tipo"
                            defaultValue={formData.tipoEmpleado}
                            onChange={(v) => {
                                setFormData((p) => ({ ...p, tipoEmpleado: v }));
                                if (errors.tipoEmpleado) setErrors((p) => ({ ...p, tipoEmpleado: false }));
                            }}
                        />
                        {errors.tipoEmpleado && (
                            <p className="mt-1.5 text-xs text-error-500">Debe seleccionar un tipo</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="edit-documento">N° de Documento</Label>
                        <Input
                            id="edit-documento"
                            placeholder="12345678"
                            defaultValue={formData.numeroDocumento}
                            error={errors.numeroDocumento}
                            hint={errors.numeroDocumento ? "El número de documento es obligatorio" : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData((p) => ({ ...p, numeroDocumento: e.target.value }));
                                if (errors.numeroDocumento) setErrors((p) => ({ ...p, numeroDocumento: false }));
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