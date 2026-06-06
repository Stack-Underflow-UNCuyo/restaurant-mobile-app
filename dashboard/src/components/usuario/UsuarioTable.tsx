"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { empleadoService } from "@/services/empleadoService";
import toast from "react-hot-toast";
import { Usuario, Rol } from "@/types/usuario";
import { Empleado, TipoEmpleado } from "@/types/empleado";
import { ApiError } from "@/lib/apiClient";

type UsuarioFormData = {
    email: string; clave: string; rol: string; personaId: string;
};

const emptyForm: UsuarioFormData = { email: "", clave: "", rol: "", personaId: "" };

const rolOptions = [
    { value: Rol.ADMIN, label: "Administrador" },
    { value: Rol.PERSONAL, label: "Personal" },
];

const rolLabel: Record<string, string> = {
    [Rol.ADMIN]: "Administrador",
    [Rol.PERSONAL]: "Personal",
};

const tipoEmpleadoLabel: Record<string, string> = {
    [TipoEmpleado.ADMINISTRATIVO]: "Administrativo",
    [TipoEmpleado.COCINERO]: "Cocinero",
    [TipoEmpleado.MOZO]: "Mozo",
};

export default function UsuarioTable() {
    const [items, setItems] = useState<Usuario[]>([]);
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [detailUsuario, setDetailUsuario] = useState<Usuario | null>(null);
    const [formData, setFormData] = useState<UsuarioFormData>(emptyForm);
    const [errors, setErrors] = useState<{ email?: string; clave?: string; rol?: string; }>({});

    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();
    const { isOpen: isDetailOpen, openModal: openDetail, closeModal: closeDetail } = useModal();

    useEffect(() => {
        Promise.all([usuarioService.getAll(), empleadoService.getAll()])
            .then(([usuarios, empleadosList]) => {
                setItems(usuarios);
                setEmpleados(empleadosList);
            })
            .catch(() => toast.error("Error al cargar los usuarios"))
            .finally(() => setLoading(false));
    }, []);

    // Mapa personaId -> empleado, para vincular cada usuario con su persona/empleado.
    const empleadoByPersonaId = useMemo(() => {
        const map = new Map<string, Empleado>();
        empleados.forEach((e) => map.set(String(e.id), e));
        return map;
    }, [empleados]);

    const personaDe = (usuario: Usuario): Empleado | undefined =>
        usuario.personaId ? empleadoByPersonaId.get(String(usuario.personaId)) : undefined;

    const openEdit = (item: Usuario) => {
        setEditingId(item.id);
        setFormData({ email: item.email, clave: "", rol: item.rol, personaId: item.personaId ?? "" });
        setErrors({ email: "", clave: "", rol: "" });
        openModal();
    };

    const openVerMas = (item: Usuario) => {
        setDetailUsuario(item);
        openDetail();
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
            email: !formData.email.trim() ? "El email es obligatorio" : undefined,
            clave:
                editingId === null && !formData.clave.trim()
                    ? "La contraseña es obligatoria"
                    : undefined,
            rol: !formData.rol ? "Debe seleccionar un rol" : undefined,
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
        } catch (error) {
            if (error instanceof ApiError) {
                toast.error(error.message);
                if (error.fieldErrors) {
                    setErrors(error.fieldErrors);
                }
            } else {
                toast.error("Error inesperado al guardar el usuario");
            }
        } finally {
            setSaving(false);
        }
    };

    const detailPersona = detailUsuario ? personaDe(detailUsuario) : undefined;

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
                                    Nombre
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Apellido
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Tipo de empleado
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
                                    <td colSpan={6} className="py-10 text-center">
                                        <div className="flex justify-center">
                                            <Spinner />
                                        </div>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-sm text-gray-400">
                                        No hay usuarios registrados
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => {
                                    const persona = personaDe(item);
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                                                {item.email}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                                                {persona?.nombre ?? "—"}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                                                {persona?.apellido ?? "—"}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                                {persona?.tipoEmpleado ? (
                                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-white/[0.05] dark:text-gray-400">
                                                        {tipoEmpleadoLabel[persona.tipoEmpleado] ?? persona.tipoEmpleado}
                                                    </span>
                                                ) : (
                                                    "—"
                                                )}
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
                                                        onClick={() => openVerMas(item)}
                                                        className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors"
                                                    >
                                                        Ver más
                                                    </button>
                                                    <button
                                                        onClick={() => openEdit(item)}
                                                        className="text-gray-400 hover:text-gray-700 transition-colors dark:hover:text-white/70"
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
                                    );
                                })
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

            {/* Modal de detalle ("Ver más") */}
            <Modal isOpen={isDetailOpen} onClose={closeDetail} className="max-w-lg p-6">
                <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Detalle del usuario
                </h4>
                {detailUsuario && (
                    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
                        <DetailSection title="Usuario">
                            <DetailRow label="Email" value={detailUsuario.email} />
                            <DetailRow label="Rol" value={rolLabel[detailUsuario.rol] ?? detailUsuario.rol} />
                        </DetailSection>

                        {detailPersona ? (
                            <>
                                <DetailSection title="Persona / Empleado">
                                    <DetailRow label="Nombre" value={detailPersona.nombre} />
                                    <DetailRow label="Apellido" value={detailPersona.apellido} />
                                    <DetailRow
                                        label="Tipo de empleado"
                                        value={tipoEmpleadoLabel[detailPersona.tipoEmpleado] ?? detailPersona.tipoEmpleado}
                                    />
                                    <DetailRow
                                        label="Documento"
                                        value={`${detailPersona.tipoDocumento ?? ""} ${detailPersona.numeroDocumento ?? ""}`.trim() || "—"}
                                    />
                                    <DetailRow label="Fecha de nacimiento" value={detailPersona.fechaNacimiento ?? "—"} />
                                    <DetailRow
                                        label="Dirección"
                                        value={
                                            detailPersona.direccion
                                                ? `${detailPersona.direccion.calle} ${detailPersona.direccion.numeracion}, ${detailPersona.direccion.barrio}${
                                                      detailPersona.direccion.localidad ? ` (${detailPersona.direccion.localidad.nombre})` : ""
                                                  }`
                                                : "—"
                                        }
                                    />
                                </DetailSection>

                                <DetailSection title="Contactos de correo electrónico">
                                    {detailPersona.contactoCorreoElectronicoDtos && detailPersona.contactoCorreoElectronicoDtos.length > 0 ? (
                                        <ul className="space-y-1">
                                            {detailPersona.contactoCorreoElectronicoDtos.map((c) => (
                                                <li key={c.id} className="text-sm text-gray-700 dark:text-gray-300">
                                                    {c.email}
                                                    <span className="ml-2 text-xs text-gray-400">({c.tipoContacto})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-400">Sin correos registrados</p>
                                    )}
                                </DetailSection>

                                <DetailSection title="Contactos telefónicos">
                                    {detailPersona.contactoTelefonicoDtos && detailPersona.contactoTelefonicoDtos.length > 0 ? (
                                        <ul className="space-y-1">
                                            {detailPersona.contactoTelefonicoDtos.map((c) => (
                                                <li key={c.id} className="text-sm text-gray-700 dark:text-gray-300">
                                                    {c.telefono}
                                                    <span className="ml-2 text-xs text-gray-400">
                                                        ({c.tipoTelefono} · {c.tipoContacto})
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-400">Sin teléfonos registrados</p>
                                    )}
                                </DetailSection>
                            </>
                        ) : (
                            <p className="text-sm text-gray-400">Este usuario no tiene una persona/empleado asociada.</p>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button variant="outline" size="sm" onClick={closeDetail}>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

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
                            error={!!errors.email}
                            hint={errors.email ? "El email es obligatorio" : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData((p) => ({ ...p, email: e.target.value }));
                                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
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
                            error={!!errors.clave}
                            hint={errors.clave ? "La contraseña es obligatoria" : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData((p) => ({ ...p, clave: e.target.value }));
                                if (errors.clave) setErrors((p) => ({ ...p, clave: undefined }));
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
                                if (errors.rol) setErrors((p) => ({ ...p, rol: undefined }));
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

// ─── subcomponentes del detalle ──────────────────────────────────────────────

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h5 className="mb-2 text-sm font-semibold text-gray-700 dark:text-white/80">{title}</h5>
            <div className="rounded-lg border border-gray-100 dark:border-white/[0.05] px-4 py-3 space-y-2">
                {children}
            </div>
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4 text-sm">
            <span className="text-gray-400">{label}</span>
            <span className="text-gray-800 dark:text-white/90 text-right">{value}</span>
        </div>
    );
}
