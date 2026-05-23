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
import { usuarioService } from "@/services/usuarioService";
import toast from "react-hot-toast";
import { Usuario, Rol } from "@/types/usuario";

type UsuarioFormData = {
    email: string; clave: string; rol: string; personaId: number;
};

const emptyForm: UsuarioFormData = { email: "", clave: "", rol: "", personaId: 0 };

const rolOptions = [
    { value: Rol.ADMIN, label: "Administrador" },
    { value: Rol.PERSONAL, label: "Personal" },
];

const rolLabel: Record<string, string> = {
    [Rol.ADMIN]: "Administrador",
    [Rol.PERSONAL]: "Personal",
};

export default function UsuarioTable() {
    const [items, setItems] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState<UsuarioFormData>(emptyForm);
    const [errors, setErrors] = useState({ email: false, clave: false, rol: false });

    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

    useEffect(() => {
        usuarioService
            .getAll()
            .then(setItems)
            .catch(() => toast.error("Error al cargar los usuarios"))
            .finally(() => setLoading(false));
    }, []);

    const openEdit = (item: Usuario) => {
        setEditingId(item.id);
        setFormData({ email: item.email, clave: "", rol: item.rol, personaId: item.persona.id});
        setErrors({ email: false, clave: false, rol: false });
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
            await usuarioService.remove(pendingDeleteId);
            setItems((prev) => prev.filter((u) => u.id !== pendingDeleteId));
            closeConfirm();
            toast.success("Usuario eliminado");
        } catch {
            toast.error("Error al eliminar el usuario");
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async () => {
        const newErrors = {
            email: !formData.email.trim(),
            // en edición la clave es opcional (si no se toca, no se actualiza)
            clave: editingId === null ? !formData.clave.trim() : false,
            rol: !formData.rol,
        };
        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            return;
        }

        const payload = {
            email: formData.email,
            clave: formData.clave,
            rol: formData.rol,
            personaId: formData.personaId,
        };

        setSaving(true);
        try {
            if (editingId !== null) {
                await usuarioService.update(editingId, payload);
            }
            const refreshed = await usuarioService.getAll();
            setItems(refreshed);
            closeModal();
            toast.success("Usuario guardado");
        } catch {
            toast.error("Error al guardar el usuario");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Usuarios</h3>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Email
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Rol
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
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-10 text-center text-sm text-gray-400">
                                        No hay usuarios registrados
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                                            {item.email}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    item.rol === Rol.ADMIN
                                                        ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                                                        : "bg-gray-100 text-gray-600 dark:bg-white/[0.05] dark:text-gray-400"
                                                }`}
                                            >
                                                {rolLabel[item.rol] ?? item.rol}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="flex items-center gap-3">
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
                description="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
            />

            {/* Modal de edición */}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
                <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Editar Usuario
                </h4>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                            id="edit-email"
                            placeholder="usuario@ejemplo.com"
                            defaultValue={formData.email}
                            error={errors.email}
                            hint={errors.email ? "El email es obligatorio" : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData((p) => ({ ...p, email: e.target.value }));
                                if (errors.email) setErrors((p) => ({ ...p, email: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="edit-clave">Nueva Contraseña (opcional)</Label>
                        <Input
                            id="edit-clave"
                            type="password"
                            placeholder="Dejar vacío para no cambiar"
                            defaultValue={formData.clave}
                            error={errors.clave}
                            hint={errors.clave ? "La contraseña es obligatoria" : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData((p) => ({ ...p, clave: e.target.value }));
                                if (errors.clave) setErrors((p) => ({ ...p, clave: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label>Rol</Label>
                        <Select
                            options={rolOptions}
                            placeholder="Seleccionar rol"
                            defaultValue={formData.rol}
                            onChange={(v) => {
                                setFormData((p) => ({ ...p, rol: v }));
                                if (errors.rol) setErrors((p) => ({ ...p, rol: false }));
                            }}
                        />
                        {errors.rol && (
                            <p className="mt-1.5 text-xs text-error-500">Debe seleccionar un rol</p>
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