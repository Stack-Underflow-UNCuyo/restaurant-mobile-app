"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { PlusIcon } from "@/icons/index";
import toast from "react-hot-toast";
import TelefonoSection, { type TelefonoRow } from "@/components/contacto/TelefonoSection";
import EmailSection, { type EmailRow } from "@/components/contacto/EmailSection";
import DireccionModal from "@/components/direccion/DireccionModal";
import { usuarioService } from "@/services/usuarioService";
import { empleadoService } from "@/services/empleadoService";
import { contactoTelefonicoService } from "@/services/contactoTelefonicoService";
import { contactoCorreoElectronicoService } from "@/services/contactoCorreoElectronicoService";
import { direccionService } from "@/services/direccionService";
import { localidadService } from "@/services/localidadService";
import { Rol } from "@/types/usuario";
import { TipoEmpleado } from "@/types/empleado";
import { TipoContacto, TipoTelefono } from "@/types/contactos";
import type { Direccion } from "@/types/entities";
import { ApiError } from "@/lib/apiClient";
import { useModal } from "@/hooks/useModal";

// ─── tipos locales ───────────────────────────────────────────────────────────

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

type Errors = Record<string, boolean>;

// ─── valores iniciales ───────────────────────────────────────────────────────

const emptyUsuario: UsuarioForm = { email: "", clave: "", rol: "", personaId: 0 };
const emptyEmpleado: EmpleadoForm = {
    nombre: "", apellido: "", fechaNacimiento: "", tipoDocumento: "",
    numeroDocumento: "", tipoEmpleado: "", contactosId: [], direccionId: "",
};
const emptyTelefono = (): TelefonoRow => ({ telefono: "", tipoTelefono: "", tipoContacto: "", observacion: "" });
const emptyEmail    = (): EmailRow    => ({ email: "", tipoContacto: "", observacion: "" });

// ─── opciones de selects ─────────────────────────────────────────────────────

const rolOptions = [
    { value: Rol.ADMIN,    label: "Administrador" },
    { value: Rol.PERSONAL, label: "Personal"      },
];
const tipoEmpleadoOptions = [
    { value: TipoEmpleado.ADMINISTRATIVO, label: "Administrativo" },
    { value: TipoEmpleado.COCINERO,       label: "Cocinero"       },
    { value: TipoEmpleado.MOZO,           label: "Mozo"           },
];
const tipoDocumentoOptions = [
    { value: "DNI",       label: "DNI"       },
    { value: "PASAPORTE", label: "Pasaporte" },
    { value: "CUIL",      label: "CUIL"      },
];

// ─── componente ──────────────────────────────────────────────────────────────

export default function CrearUsuario() {
    const [usuario,  setUsuario]  = useState<UsuarioForm>(emptyUsuario);
    const [empleado, setEmpleado] = useState<EmpleadoForm>(emptyEmpleado);
    const [direccionId, setDireccionId] = useState<string>("");

    const [telefonos, setTelefonos] = useState<TelefonoRow[]>([emptyTelefono()]);
    const [emails,    setEmails]    = useState<EmailRow[]>([emptyEmail()]);
    const [errTelefonos, setErrTelefonos] = useState<Errors[]>([{}]);
    const [errEmails,    setErrEmails]    = useState<Errors[]>([{}]);

    const [direccionOptions, setDireccionOptions] = useState<{ value: string; label: string }[]>([]);
    const [localidadOptions, setLocalidadOptions] = useState<{ value: string; label: string }[]>([]);
    const [loadingDirecciones, setLoadingDirecciones] = useState(true);
    const [saving, setSaving] = useState(false);

    const [errUsuario,  setErrUsuario]  = useState<Errors>({});
    const [errEmpleado, setErrEmpleado] = useState<Errors>({});
    const [errDireccion, setErrDireccion] = useState(false);

    const { isOpen: isDirecOpen, openModal: openDirec, closeModal: closeDirec } = useModal();

    useEffect(() => {
        Promise.all([direccionService.getAll(), localidadService.getAll()])
            .then(([dirs, locs]) => {
                setDireccionOptions(dirs.map((d) => ({
                    value: String(d.id),
                    label: `${d.calle} ${d.numeracion}, ${d.barrio}${d.localidad ? ` (${d.localidad.nombre})` : ""}`,
                })));
                setLocalidadOptions(locs.map((l) => ({ value: String(l.id), label: l.nombre })));
            })
            .catch(() => toast.error("Error al cargar los datos"))
            .finally(() => setLoadingDirecciones(false));
    }, []);

    // ── telefono helpers ─────────────────────────────────────────────────────

    const addTelefono    = () => { setTelefonos((p) => [...p, emptyTelefono()]); setErrTelefonos((p) => [...p, {}]); };
    const removeTelefono = (i: number) => { setTelefonos((p) => p.filter((_, j) => j !== i)); setErrTelefonos((p) => p.filter((_, j) => j !== i)); };
    const updateTelefono = (i: number, field: keyof TelefonoRow, value: string) => {
        setTelefonos((p) => p.map((t, j) => j === i ? { ...t, [field]: value } : t));
        setErrTelefonos((p) => p.map((e, j) => j === i ? { ...e, [field]: false } : e));
    };

    // ── email helpers ────────────────────────────────────────────────────────

    const addEmail    = () => { setEmails((p) => [...p, emptyEmail()]); setErrEmails((p) => [...p, {}]); };
    const removeEmail = (i: number) => { setEmails((p) => p.filter((_, j) => j !== i)); setErrEmails((p) => p.filter((_, j) => j !== i)); };
    const updateEmail = (i: number, field: keyof EmailRow, value: string) => {
        setEmails((p) => p.map((e, j) => j === i ? { ...e, [field]: value } : e));
        setErrEmails((p) => p.map((e, j) => j === i ? { ...e, [field]: false } : e));
    };

    // ── direccion created callback ───────────────────────────────────────────

    const handleDireccionCreada = (nueva: Direccion) => {
        const label = `${nueva.calle} ${nueva.numeracion}, ${nueva.barrio}${nueva.localidad ? ` (${nueva.localidad.nombre})` : ""}`;
        setDireccionOptions((prev) => [...prev, { value: String(nueva.id), label }]);
        setDireccionId(String(nueva.id));
        if (errDireccion) setErrDireccion(false);
    };

    // ── validación ───────────────────────────────────────────────────────────

    const validate = () => {
        const newErrUsuario: Errors = {
            email: !usuario.email.trim(),
            clave: !usuario.clave.trim(),
            rol:   !usuario.rol,
        };
        const newErrEmpleado: Errors = {
            nombre:           !empleado.nombre.trim(),
            apellido:         !empleado.apellido.trim(),
            tipoEmpleado:     !empleado.tipoEmpleado,
            fechaNacimiento:  !empleado.fechaNacimiento,
            tipoDocumento:    !empleado.tipoDocumento,
            numeroDocumento:  !empleado.numeroDocumento,
        };
        const newErrDireccion = !direccionId;
        const newErrTelefonos = telefonos.map((t) => ({
            telefono:     !t.telefono.trim(),
            tipoTelefono: !t.tipoTelefono,
            tipoContacto: !t.tipoContacto,
        }));
        const newErrEmails = emails.map((e) => ({
            email:        !e.email.trim(),
            tipoContacto: !e.tipoContacto,
        }));

        setErrUsuario(newErrUsuario);
        setErrEmpleado(newErrEmpleado);
        setErrDireccion(newErrDireccion);
        setErrTelefonos(newErrTelefonos);
        setErrEmails(newErrEmails);

        return (
            !Object.values(newErrUsuario).some(Boolean) &&
            !Object.values(newErrEmpleado).some(Boolean) &&
            !newErrDireccion &&
            !newErrTelefonos.some((e) => Object.values(e).some(Boolean)) &&
            !newErrEmails.some((e) => Object.values(e).some(Boolean))
        );
    };

    // ── submit ───────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Revisá los campos obligatorios");
            return;
        }
        setSaving(true);
        try {
            const [telCreados, emailCreados] = await Promise.all([
                Promise.all(telefonos.map((t) =>
                    contactoTelefonicoService.create({
                        telefono:     t.telefono,
                        tipoTelefono: t.tipoTelefono as TipoTelefono,
                        tipoContacto: t.tipoContacto as TipoContacto,
                        observacion:  t.observacion,
                    })
                )),
                Promise.all(emails.map((e) =>
                    contactoCorreoElectronicoService.create({
                        email:        e.email,
                        tipoContacto: e.tipoContacto as TipoContacto,
                        observacion:  e.observacion,
                    })
                )),
            ]);

            const empleadoCreado = await empleadoService.create({
                nombre:           empleado.nombre,
                apellido:         empleado.apellido,
                fechaNacimiento:  empleado.fechaNacimiento,
                tipoDocumento:    empleado.tipoDocumento,
                numeroDocumento:  empleado.numeroDocumento,
                tipoEmpleado:     empleado.tipoEmpleado as TipoEmpleado,
                direccionId,
                contactoTelefonicoIds:        telCreados.map((c) => String(c.id)),
                contactoCorreoElectronicoIds: emailCreados.map((c) => String(c.id)),
            });

            await usuarioService.create({
                email:    usuario.email,
                clave:    usuario.clave,
                rol:      usuario.rol,
                personaId: empleadoCreado.id,
            });

            toast.success("Usuario creado correctamente");

            // reset
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
                Object.entries(error.fieldErrors).forEach(([campo, msg]) =>
                    toast.error(`${campo}: ${msg}`)
                );
            } else {
                toast.error(error instanceof Error ? error.message : "Error inesperado");
            }
        } finally {
            setSaving(false);
        }
    };

    // ── render ───────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">
            {/* usuario */}
            <Section title="Datos del Usuario">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="u-email">Email</Label>
                        <Input id="u-email" placeholder="usuario@ejemplo.com"
                            defaultValue={usuario.email}
                            error={errUsuario.email} hint={errUsuario.email ? "El email es obligatorio" : ""}
                            onChange={(e) => { setUsuario((p) => ({ ...p, email: e.target.value })); if (errUsuario.email) setErrUsuario((p) => ({ ...p, email: false })); }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="u-clave">Contraseña</Label>
                        <Input id="u-clave" type="password" placeholder="••••••••"
                            defaultValue={usuario.clave}
                            error={errUsuario.clave} hint={errUsuario.clave ? "La contraseña es obligatoria" : ""}
                            onChange={(e) => { setUsuario((p) => ({ ...p, clave: e.target.value })); if (errUsuario.clave) setErrUsuario((p) => ({ ...p, clave: false })); }}
                        />
                    </div>
                    <div>
                        <Label>Rol</Label>
                        <Select options={rolOptions} placeholder="Seleccionar rol" defaultValue={usuario.rol}
                            onChange={(v) => { setUsuario((p) => ({ ...p, rol: v })); if (errUsuario.rol) setErrUsuario((p) => ({ ...p, rol: false })); }}
                        />
                        {errUsuario.rol && <FieldError msg="Debe seleccionar un rol" />}
                    </div>
                </div>
            </Section>

            {/* empleado */}
            <Section title="Datos del Empleado">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="e-nombre">Nombre</Label>
                        <Input id="e-nombre" placeholder="Ej: Juan"
                            defaultValue={empleado.nombre}
                            error={errEmpleado.nombre} hint={errEmpleado.nombre ? "El nombre es obligatorio" : ""}
                            onChange={(e) => { setEmpleado((p) => ({ ...p, nombre: e.target.value })); if (errEmpleado.nombre) setErrEmpleado((p) => ({ ...p, nombre: false })); }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="e-apellido">Apellido</Label>
                        <Input id="e-apellido" placeholder="Ej: Pérez"
                            defaultValue={empleado.apellido}
                            error={errEmpleado.apellido} hint={errEmpleado.apellido ? "El apellido es obligatorio" : ""}
                            onChange={(e) => { setEmpleado((p) => ({ ...p, apellido: e.target.value })); if (errEmpleado.apellido) setErrEmpleado((p) => ({ ...p, apellido: false })); }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="e-fecha">Fecha de Nacimiento</Label>
                        <Input id="e-fecha" type="date"
                            defaultValue={empleado.fechaNacimiento}
                            error={errEmpleado.fechaNacimiento} hint={errEmpleado.fechaNacimiento ? "La fecha es obligatoria" : ""}
                            onChange={(e) => { setEmpleado((p) => ({ ...p, fechaNacimiento: e.target.value })); if (errEmpleado.fechaNacimiento) setErrEmpleado((p) => ({ ...p, fechaNacimiento: false })); }}
                        />
                    </div>
                    <div>
                        <Label>Tipo de Documento</Label>
                        <Select options={tipoDocumentoOptions} placeholder="Seleccionar tipo" defaultValue={empleado.tipoDocumento}
                            onChange={(v) => { setEmpleado((p) => ({ ...p, tipoDocumento: v })); if (errEmpleado.tipoDocumento) setErrEmpleado((p) => ({ ...p, tipoDocumento: false })); }}
                        />
                        {errEmpleado.tipoDocumento && <FieldError msg="Debe seleccionar el tipo de documento" />}
                    </div>
                    <div>
                        <Label htmlFor="e-numdoc">Número de Documento</Label>
                        <Input id="e-numdoc" placeholder="Ej: 30123456"
                            defaultValue={empleado.numeroDocumento}
                            error={errEmpleado.numeroDocumento} hint={errEmpleado.numeroDocumento ? "El número es obligatorio" : ""}
                            onChange={(e) => { setEmpleado((p) => ({ ...p, numeroDocumento: e.target.value })); if (errEmpleado.numeroDocumento) setErrEmpleado((p) => ({ ...p, numeroDocumento: false })); }}
                        />
                    </div>
                    <div>
                        <Label>Tipo de Empleado</Label>
                        <Select options={tipoEmpleadoOptions} placeholder="Seleccionar tipo" defaultValue={empleado.tipoEmpleado}
                            onChange={(v) => { setEmpleado((p) => ({ ...p, tipoEmpleado: v })); if (errEmpleado.tipoEmpleado) setErrEmpleado((p) => ({ ...p, tipoEmpleado: false })); }}
                        />
                        {errEmpleado.tipoEmpleado && <FieldError msg="Debe seleccionar el tipo de empleado" />}
                    </div>
                </div>
            </Section>

            {/* dirección */}
            <Section title="Dirección">
                <div className="max-w-sm">
                    <div className="flex items-center justify-between mb-1.5">
                        <Label className="mb-0">Dirección existente</Label>
                        <button type="button" onClick={openDirec}
                            className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 transition-colors">
                            <PlusIcon />Nueva dirección
                        </button>
                    </div>
                    {loadingDirecciones ? (
                        <p className="text-sm text-gray-400">Cargando direcciones…</p>
                    ) : (
                        <Select options={direccionOptions} placeholder="Seleccionar dirección" defaultValue={direccionId}
                            onChange={(v) => { setDireccionId(v); if (errDireccion) setErrDireccion(false); }}
                        />
                    )}
                    {errDireccion && <FieldError msg="Debe seleccionar una dirección" />}
                </div>
            </Section>

            {/* shared phone section */}
            <TelefonoSection
                rows={telefonos} errors={errTelefonos}
                onAdd={addTelefono} onRemove={removeTelefono} onUpdate={updateTelefono}
                minRows={1}
            />

            {/* shared email section */}
            <EmailSection
                rows={emails} errors={errEmails}
                onAdd={addEmail} onRemove={removeEmail} onUpdate={updateEmail}
                minRows={1}
            />

            <div className="flex justify-end pt-2">
                <Button onClick={handleSubmit} disabled={saving}>
                    {saving ? "Guardando…" : "Crear Usuario"}
                </Button>
            </div>

            {/* shared DireccionModal */}
            <DireccionModal
                isOpen={isDirecOpen}
                onClose={closeDirec}
                localidadOptions={localidadOptions}
                onCreated={handleDireccionCreada}
            />
        </div>
    );
}

// ─── subcomponentes auxiliares ───────────────────────────────────────────────

function Section({
    title, action, children,
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
