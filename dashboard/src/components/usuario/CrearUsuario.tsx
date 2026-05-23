"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { PlusIcon, TrashBinIcon } from "@/icons/index";
import toast from "react-hot-toast";
import { usuarioService } from "@/services/usuarioService";
import { empleadoService } from "@/services/empleadoService";
import { contactoTelefonicoService } from "@/services/contactoTelefonicoService";
import { contactoCorreoElectronicoService } from "@/services/contactoCorreoElectronicoService";
import { direccionService } from "@/services/direccionService";
import { Rol } from "@/types/usuario";
import { TipoEmpleado } from "@/types/empleado";
import { TipoContacto, TipoTelefono } from "@/types/contactos";
import { ApiError } from "@/lib/apiClient";

// ─── tipos locales del formulario ───────────────────────────────────────────

type UsuarioForm = {
    email: string;
    clave: string;
    rol: string;
    personaId: number;
};

type EmpleadoForm = {
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    tipoDocumento: string;
    numeroDocumento: string;
    tipoEmpleado: string;
    contactosId: string[];
    direccionId: string;
};

type ContactoTelefonicoForm = {
    telefono: string;
    tipoTelefono: string;
    tipoContacto: string;
    observacion: string;
};

type ContactoEmailForm = {
    email: string;
    tipoContacto: string;
    observacion: string;
};

type Errors = Record<string, boolean>;

// ─── valores iniciales ───────────────────────────────────────────────────────

const emptyUsuario: UsuarioForm = { email: "", clave: "", rol: "", personaId: 0 };
const emptyEmpleado: EmpleadoForm = {
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    tipoDocumento: "",
    numeroDocumento: "",
    tipoEmpleado: "",
    contactosId: [],
    direccionId: "",
};
const emptyTelefono = (): ContactoTelefonicoForm => ({
    telefono: "",
    tipoTelefono: "",
    tipoContacto: "",
    observacion: "",
});
const emptyEmail = (): ContactoEmailForm => ({
    email: "",
    tipoContacto: "",
    observacion: "",
});

// ─── opciones de selects ─────────────────────────────────────────────────────

const rolOptions = [
    { value: Rol.ADMIN, label: "Administrador" },
    { value: Rol.PERSONAL, label: "Personal" },
];
const tipoEmpleadoOptions = [
    { value: TipoEmpleado.ADMINISTRATIVO, label: "Administrativo" },
    { value: TipoEmpleado.COCINERO, label: "Cocinero" },
    { value: TipoEmpleado.MOZO, label: "Mozo" },
];
const tipoContactoOptions = [
    { value: TipoContacto.PERSONAL, label: "Personal" },
    { value: TipoContacto.LABORAL, label: "Laboral" },
    { value: TipoContacto.EMPRESA, label: "Empresa" },
];
const tipoTelefonoOptions = [
    { value: TipoTelefono.FIJO, label: "Fijo" },
    { value: TipoTelefono.CELULAR, label: "Celular" },
];
const tipoDocumentoOptions = [
    { value: "DNI", label: "DNI" },
    { value: "PASAPORTE", label: "Pasaporte" },
    { value: "CUIL", label: "CUIL" },
];


// ─── componente ──────────────────────────────────────────────────────────────

export default function CrearUsuario() {
    const [usuario, setUsuario] = useState<UsuarioForm>(emptyUsuario);
    const [empleado, setEmpleado] = useState<EmpleadoForm>(emptyEmpleado);
    const [direccionId, setDireccionId] = useState<string>("");
    const [telefonos, setTelefonos] = useState<ContactoTelefonicoForm[]>([emptyTelefono()]);
    const [emails, setEmails] = useState<ContactoEmailForm[]>([emptyEmail()]);

    const [direccionOptions, setDireccionOptions] = useState<{ value: string; label: string }[]>([]);
    const [loadingDirecciones, setLoadingDirecciones] = useState(true);
    const [saving, setSaving] = useState(false);

    const [errUsuario, setErrUsuario] = useState<Errors>({});
    const [errEmpleado, setErrEmpleado] = useState<Errors>({});
    const [errDireccion, setErrDireccion] = useState(false);
    const [errTelefonos, setErrTelefonos] = useState<Errors[]>([{}]);
    const [errEmails, setErrEmails] = useState<Errors[]>([{}]);

    useEffect(() => {
        direccionService
            .getAll()
            .then((dirs) =>
                setDireccionOptions(
                    dirs.map((d) => ({
                        value: String(d.id),
                        label: `${d.calle} ${d.numeracion}, ${d.barrio}${d.localidad ? ` (${d.localidad.nombre})` : ""}`,
                    }))
                )
            )
            .catch(() => toast.error("Error al cargar las direcciones"))
            .finally(() => setLoadingDirecciones(false));
    }, []);

    // ── helpers telefonos / emails ───────────────────────────────────────────

    const addTelefono = () => {
        setTelefonos((prev) => [...prev, emptyTelefono()]);
        setErrTelefonos((prev) => [...prev, {}]);
    };
    const removeTelefono = (idx: number) => {
        setTelefonos((prev) => prev.filter((_, i) => i !== idx));
        setErrTelefonos((prev) => prev.filter((_, i) => i !== idx));
    };
    const updateTelefono = (idx: number, field: keyof ContactoTelefonicoForm, value: string) => {
        setTelefonos((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
        setErrTelefonos((prev) =>
            prev.map((e, i) => (i === idx ? { ...e, [field]: false } : e))
        );
    };

    const addEmail = () => {
        setEmails((prev) => [...prev, emptyEmail()]);
        setErrEmails((prev) => [...prev, {}]);
    };
    const removeEmail = (idx: number) => {
        setEmails((prev) => prev.filter((_, i) => i !== idx));
        setErrEmails((prev) => prev.filter((_, i) => i !== idx));
    };
    const updateEmail = (idx: number, field: keyof ContactoEmailForm, value: string) => {
        setEmails((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
        setErrEmails((prev) =>
            prev.map((e, i) => (i === idx ? { ...e, [field]: false } : e))
        );
    };

    // ── validación ───────────────────────────────────────────────────────────

    const validate = () => {
        const newErrUsuario: Errors = {
            email: !usuario.email.trim(),
            clave: !usuario.clave.trim(),
            rol: !usuario.rol,
        };
        const newErrEmpleado: Errors = {
            nombre: !empleado.nombre.trim(),
            apellido: !empleado.apellido.trim(),
            tipoEmpleado: !empleado.tipoEmpleado,
            fechaNacimiento: !empleado.fechaNacimiento,
            tipoDocumento: !empleado.tipoDocumento,
            numeroDocumento: !empleado.numeroDocumento,
        };
        const newErrDireccion = !direccionId;

        const newErrTelefonos = telefonos.map((t) => ({
            telefono: !t.telefono.trim(),
            tipoTelefono: !t.tipoTelefono,
            tipoContacto: !t.tipoContacto,
        }));
        const newErrEmails = emails.map((e) => ({
            email: !e.email.trim(),
            tipoContacto: !e.tipoContacto,
        }));

        setErrUsuario(newErrUsuario);
        setErrEmpleado(newErrEmpleado);
        setErrDireccion(newErrDireccion);
        setErrTelefonos(newErrTelefonos);
        setErrEmails(newErrEmails);

        const hasErrUsuario = Object.values(newErrUsuario).some(Boolean);
        const hasErrEmpleado = Object.values(newErrEmpleado).some(Boolean);
        const hasErrTelefonos = newErrTelefonos.some((e) => Object.values(e).some(Boolean));
        const hasErrEmails = newErrEmails.some((e) => Object.values(e).some(Boolean));

        return !hasErrUsuario && !hasErrEmpleado && !newErrDireccion && !hasErrTelefonos && !hasErrEmails;
    };

    // ── submit ───────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Revisá los campos obligatorios");
            return;
        }
        setSaving(true);
        try {
            // 2) Crear contactos telefónicos
            const telCreados = await Promise.all(
                telefonos.map((t) =>
                    contactoTelefonicoService.create({
                        telefono: t.telefono,
                        tipoTelefono: t.tipoTelefono as TipoTelefono,
                        tipoContacto: t.tipoContacto as TipoContacto,
                        observacion: t.observacion,
                    })
                )
            );

            // 3) Crear contactos de email
            const emailCreados = await Promise.all(
                emails.map((e) =>
                    contactoCorreoElectronicoService.create({
                        email: e.email,
                        tipoContacto: e.tipoContacto as TipoContacto,
                        observacion: e.observacion,
                    })
                )
            );
            
            console.log("id address: ", direccionId);
            const empleadoCreado = await empleadoService.create({
                nombre: empleado.nombre,
                apellido: empleado.apellido,
                fechaNacimiento: empleado.fechaNacimiento,
                tipoDocumento: empleado.tipoDocumento,
                numeroDocumento: empleado.numeroDocumento,
                tipoEmpleado: empleado.tipoEmpleado as TipoEmpleado,
                direccionId: direccionId,
                contactoTelefonicoIds: [
                    ...telCreados.map((c) => String(c.id)),
                ],
                contactoCorreoElectronicoIds: [
                    ...emailCreados.map((c) => String(c.id)),
                ]
            });

            console.log("Empleado creado: ", empleadoCreado.id);

            await usuarioService.create({
                email: usuario.email,
                clave: usuario.clave,
                rol: usuario.rol,
                personaId: empleadoCreado.id,
            });


            toast.success("Usuario creado correctamente");

            // Reset
            setUsuario(emptyUsuario);
            setEmpleado(emptyEmpleado);
            setDireccionId("");
            setTelefonos([emptyTelefono()]);
            setEmails([emptyEmail()]);
            setErrUsuario({});
            setErrEmpleado({});
            setErrDireccion(false);
            setErrTelefonos([{}]);
            setErrEmails([{}]);
        } catch (error) {
            if (error instanceof ApiError && error.fieldErrors) {
                // Error de validación
                Object.entries(error.fieldErrors).forEach(([campo, msg]) => {
                    toast.error(`${campo}: ${msg}`);
                });
            } else {
                // Error genérico 
                toast.error(error instanceof Error ? error.message : "Error inesperado");
            }
        } finally {
            setSaving(false);
        }
    };

    // ── render ───────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">
            {/* ── Sección Usuario ─────────────────────────────────────────── */}
            <Section title="Datos del Usuario">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="u-email">Email</Label>
                        <Input
                            id="u-email"
                            placeholder="usuario@ejemplo.com"
                            defaultValue={usuario.email}
                            error={errUsuario.email}
                            hint={errUsuario.email ? "El email es obligatorio" : ""}
                            onChange={(e) => {
                                setUsuario((p) => ({ ...p, email: e.target.value }));
                                if (errUsuario.email) setErrUsuario((p) => ({ ...p, email: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="u-clave">Contraseña</Label>
                        <Input
                            id="u-clave"
                            type="password"
                            placeholder="••••••••"
                            defaultValue={usuario.clave}
                            error={errUsuario.clave}
                            hint={errUsuario.clave ? "La contraseña es obligatoria" : ""}
                            onChange={(e) => {
                                setUsuario((p) => ({ ...p, clave: e.target.value }));
                                if (errUsuario.clave) setErrUsuario((p) => ({ ...p, clave: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label>Rol</Label>
                        <Select
                            options={rolOptions}
                            placeholder="Seleccionar rol"
                            defaultValue={usuario.rol}
                            onChange={(v) => {
                                setUsuario((p) => ({ ...p, rol: v }));
                                if (errUsuario.rol) setErrUsuario((p) => ({ ...p, rol: false }));
                            }}
                        />
                        {errUsuario.rol && <FieldError msg="Debe seleccionar un rol" />}
                    </div>
                </div>
            </Section>

            {/* ── Sección Empleado ─────────────────────────────────────────── */}
            <Section title="Datos del Empleado">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="e-nombre">Nombre</Label>
                        <Input
                            id="e-nombre"
                            placeholder="Ej: Juan"
                            defaultValue={empleado.nombre}
                            error={errEmpleado.nombre}
                            hint={errEmpleado.nombre ? "El nombre es obligatorio" : ""}
                            onChange={(e) => {
                                setEmpleado((p) => ({ ...p, nombre: e.target.value }));
                                if (errEmpleado.nombre) setErrEmpleado((p) => ({ ...p, nombre: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="e-apellido">Apellido</Label>
                        <Input
                            id="e-apellido"
                            placeholder="Ej: Pérez"
                            defaultValue={empleado.apellido}
                            error={errEmpleado.apellido}
                            hint={errEmpleado.apellido ? "El apellido es obligatorio" : ""}
                            onChange={(e) => {
                                setEmpleado((p) => ({ ...p, apellido: e.target.value }));
                                if (errEmpleado.apellido) setErrEmpleado((p) => ({ ...p, apellido: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="e-fecha">Fecha de Nacimiento</Label>
                        <Input
                            id="e-fecha"
                            type="date"
                            defaultValue={empleado.fechaNacimiento}
                            error={errEmpleado.fechaNacimiento}
                            hint={errEmpleado.fechaNacimiento ? "La fecha de nacimiento es obligatoria" : ""}
                            onChange={(e) => {
                                setEmpleado((p) => ({ ...p, fechaNacimiento: e.target.value }));
                                if (errEmpleado.fechaNacimiento) setErrEmpleado((p) => ({ ...p, fechaNacimiento: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label>Tipo de Documento</Label>
                        <Select
                            options={tipoDocumentoOptions}
                            placeholder="Seleccionar tipo"
                            defaultValue={empleado.tipoDocumento}
                            onChange={(v) => {
                                setEmpleado((p) => ({ ...p, tipoDocumento: v }));
                                if (errEmpleado.tipoDocumento) setErrEmpleado((p) => ({ ...p, tipoDocumento: false }));
                            }}
                        />
                        {errEmpleado.tipoDocumento && <FieldError msg="Debe seleccionar el tipo de documento" />}
                    </div>
                    <div>
                        <Label htmlFor="e-numdoc">Número de Documento</Label>
                        <Input
                            id="e-numdoc"
                            placeholder="Ej: 30123456"
                            defaultValue={empleado.numeroDocumento}
                            error={errEmpleado.numeroDocumento}
                            hint={errEmpleado.numeroDocumento ? "El número de documento es obligatorio" : ""}
                            onChange={(e) => {
                                setEmpleado((p) => ({ ...p, numeroDocumento: e.target.value }));
                                if (errEmpleado.numeroDocumento) setErrEmpleado((p) => ({ ...p, numeroDocumento: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label>Tipo de Empleado</Label>
                        <Select
                            options={tipoEmpleadoOptions}
                            placeholder="Seleccionar tipo"
                            defaultValue={empleado.tipoEmpleado}
                            onChange={(v) => {
                                setEmpleado((p) => ({ ...p, tipoEmpleado: v }));
                                if (errEmpleado.tipoEmpleado) setErrEmpleado((p) => ({ ...p, tipoEmpleado: false }));
                            }}
                        />
                        {errEmpleado.tipoEmpleado && <FieldError msg="Debe seleccionar el tipo de empleado" />}
                    </div>
                </div>
            </Section>

            {/* ── Sección Dirección ────────────────────────────────────────── */}
            <Section title="Dirección">
                <div className="max-w-sm">
                    <Label>Dirección existente</Label>
                    {loadingDirecciones ? (
                        <p className="text-sm text-gray-400">Cargando direcciones…</p>
                    ) : (
                        <Select
                            options={direccionOptions}
                            placeholder="Seleccionar dirección"
                            defaultValue={direccionId}
                            onChange={(v) => {
                                setDireccionId(v);
                                if (errDireccion) setErrDireccion(false);
                            }}
                        />
                    )}
                    {errDireccion && <FieldError msg="Debe seleccionar una dirección" />}
                </div>
            </Section>

            {/* ── Sección Contactos Telefónicos ────────────────────────────── */}
            <Section
                title="Contactos Telefónicos"
                action={
                    <button
                        type="button"
                        onClick={addTelefono}
                        className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Agregar teléfono
                    </button>
                }
            >
                <div className="space-y-4">
                    {telefonos.map((t, idx) => (
                        <div
                            key={idx}
                            className="rounded-lg border border-gray-100 dark:border-white/[0.05] p-4 relative"
                        >
                            {telefonos.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeTelefono(idx)}
                                    className="absolute top-3 right-3 text-gray-300 hover:text-error-500 transition-colors"
                                >
                                    <TrashBinIcon className="w-4 h-4" />
                                </button>
                            )}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor={`tel-num-${idx}`}>Teléfono</Label>
                                    <Input
                                        id={`tel-num-${idx}`}
                                        placeholder="Ej: 2614123456"
                                        defaultValue={t.telefono}
                                        error={errTelefonos[idx]?.telefono}
                                        hint={errTelefonos[idx]?.telefono ? "El teléfono es obligatorio" : ""}
                                        onChange={(e) => updateTelefono(idx, "telefono", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Tipo de Teléfono</Label>
                                    <Select
                                        options={tipoTelefonoOptions}
                                        placeholder="Seleccionar tipo"
                                        defaultValue={t.tipoTelefono}
                                        onChange={(v) => updateTelefono(idx, "tipoTelefono", v)}
                                    />
                                    {errTelefonos[idx]?.tipoTelefono && (
                                        <FieldError msg="Debe seleccionar el tipo de teléfono" />
                                    )}
                                </div>
                                <div>
                                    <Label>Tipo de Contacto</Label>
                                    <Select
                                        options={tipoContactoOptions}
                                        placeholder="Seleccionar tipo"
                                        defaultValue={t.tipoContacto}
                                        onChange={(v) => updateTelefono(idx, "tipoContacto", v)}
                                    />
                                    {errTelefonos[idx]?.tipoContacto && (
                                        <FieldError msg="Debe seleccionar el tipo de contacto" />
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor={`tel-obs-${idx}`}>Observación (Opcional)</Label>
                                    <Input
                                        id={`tel-obs-${idx}`}
                                        placeholder="Ej: Horario laboral"
                                        defaultValue={t.observacion}
                                        onChange={(e) => updateTelefono(idx, "observacion", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ── Sección Contactos Email ──────────────────────────────────── */}
            <Section
                title="Contactos de Correo Electrónico"
                action={
                    <button
                        type="button"
                        onClick={addEmail}
                        className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Agregar email
                    </button>
                }
            >
                <div className="space-y-4">
                    {emails.map((e, idx) => (
                        <div
                            key={idx}
                            className="rounded-lg border border-gray-100 dark:border-white/[0.05] p-4 relative"
                        >
                            {emails.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeEmail(idx)}
                                    className="absolute top-3 right-3 text-gray-300 hover:text-error-500 transition-colors"
                                >
                                    <TrashBinIcon className="w-4 h-4" />
                                </button>
                            )}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor={`mail-addr-${idx}`}>Email</Label>
                                    <Input
                                        id={`mail-addr-${idx}`}
                                        placeholder="contacto@ejemplo.com"
                                        defaultValue={e.email}
                                        error={errEmails[idx]?.email}
                                        hint={errEmails[idx]?.email ? "El email es obligatorio" : ""}
                                        onChange={(ev) => updateEmail(idx, "email", ev.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Tipo de Contacto</Label>
                                    <Select
                                        options={tipoContactoOptions}
                                        placeholder="Seleccionar tipo"
                                        defaultValue={e.tipoContacto}
                                        onChange={(v) => updateEmail(idx, "tipoContacto", v)}
                                    />
                                    {errEmails[idx]?.tipoContacto && (
                                        <FieldError msg="Debe seleccionar el tipo de contacto" />
                                    )}
                                </div>
                                <div className="sm:col-span-2">
                                    <Label htmlFor={`mail-obs-${idx}`}>Observación (Opcional)</Label>
                                    <Input
                                        id={`mail-obs-${idx}`}
                                        placeholder="Ej: Email corporativo"
                                        defaultValue={e.observacion}
                                        onChange={(ev) => updateEmail(idx, "observacion", ev.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ── Botón submit ─────────────────────────────────────────────── */}
            <div className="flex justify-end pt-2">
                <Button onClick={handleSubmit} disabled={saving}>
                    {saving ? "Guardando…" : "Crear Usuario"}
                </Button>
            </div>
        </div>
    );
}

// ─── subcomponentes auxiliares ───────────────────────────────────────────────

function Section({
    title,
    action,
    children,
}: {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{title}</h3>
                {action}
            </div>
            <div className="px-5 py-4">{children}</div>
        </div>
    );
}

function FieldError({ msg }: { msg: string }) {
    return <p className="mt-1.5 text-xs text-error-500">{msg}</p>;
}