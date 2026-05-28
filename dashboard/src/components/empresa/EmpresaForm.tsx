"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Spinner from "@/components/ui/Spinner";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import { empresaService } from "@/services/empresaService";
import { direccionService } from "@/services/direccionService";
import { localidadService } from "@/services/localidadService";
import { contactoTelefonicoService } from "@/services/contactoTelefonicoService";
import { contactoCorreoElectronicoService } from "@/services/contactoCorreoElectronicoService";
import toast from "react-hot-toast";
import { useModal } from "@/hooks/useModal";
import type { Empresa } from "@/types/entities";
import type { ContactoTelefonico, ContactoCorreoElectronico } from "@/types/contactos";
import { TipoContacto, TipoTelefono } from "@/types/contactos";
import { ApiError } from "@/lib/apiClient";

// ── tipos locales ────────────────────────────────────────────────────────────

type EmpresaFormData = { nombre: string; direccionId: string };

type DireccionFormData = {
    calle: string; numeracion: string; barrio: string; localidadId: string; observacion: string;
};

type TelefonoRow = { telefono: string; tipoTelefono: string; tipoContacto: string; observacion: string };
type EmailRow    = { email: string; tipoContacto: string; observacion: string };

type ExistingTelefonoRow = TelefonoRow & { id: string; toDelete: boolean };
type ExistingEmailRow    = EmailRow    & { id: string; toDelete: boolean };

type Errors = Record<string, boolean>;

const emptyDireccion = (): DireccionFormData => ({
    calle: "", numeracion: "", barrio: "", localidadId: "", observacion: "",
});
const emptyTelefono = (): TelefonoRow => ({ telefono: "", tipoTelefono: "", tipoContacto: "", observacion: "" });
const emptyEmail    = (): EmailRow    => ({ email: "", tipoContacto: "", observacion: "" });

// ── opciones ─────────────────────────────────────────────────────────────────

const tipoContactoOptions = [
    { value: TipoContacto.PERSONAL, label: "Personal" },
    { value: TipoContacto.LABORAL,  label: "Laboral"  },
    { value: TipoContacto.EMPRESA,  label: "Empresa"  },
];
const tipoTelefonoOptions = [
    { value: TipoTelefono.FIJO,    label: "Fijo"    },
    { value: TipoTelefono.CELULAR, label: "Celular" },
];

// ── type guard ───────────────────────────────────────────────────────────────

const esTelefonico = (c: ContactoTelefonico | ContactoCorreoElectronico): c is ContactoTelefonico =>
    "telefono" in c;

// ── componente ───────────────────────────────────────────────────────────────

export default function EmpresaForm() {
    const [empresa, setEmpresa]   = useState<Empresa | null>(null);
    const [direccionOptions, setDireccionOptions] = useState<{ value: string; label: string }[]>([]);
    const [localidadOptions, setLocalidadOptions] = useState<{ value: string; label: string }[]>([]);
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);

    // empresa edit form
    const [formData, setFormData] = useState<EmpresaFormData>({ nombre: "", direccionId: "" });
    const [errForm, setErrForm]   = useState<Errors>({});

    // existing contacts (editable)
    const [existingTels,  setExistingTels]  = useState<ExistingTelefonoRow[]>([]);
    const [existingMails, setExistingMails] = useState<ExistingEmailRow[]>([]);
    const [errExistingTels,  setErrExistingTels]  = useState<Errors[]>([]);
    const [errExistingMails, setErrExistingMails] = useState<Errors[]>([]);

    // new contacts
    const [newTels,  setNewTels]  = useState<TelefonoRow[]>([]);
    const [newMails, setNewMails] = useState<EmailRow[]>([]);
    const [errNewTels,  setErrNewTels]  = useState<Errors[]>([]);
    const [errNewMails, setErrNewMails] = useState<Errors[]>([]);

    // direccion sub-modal
    const [direcForm, setDirecForm]       = useState<DireccionFormData>(emptyDireccion());
    const [errDirec, setErrDirec]         = useState<Errors>({});
    const [savingDirec, setSavingDirec]   = useState(false);

    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isDirecOpen, openModal: openDirec, closeModal: closeDirec } = useModal();

    useEffect(() => {
        Promise.all([
            empresaService.getActive(),
            direccionService.getAll(),
            localidadService.getAll(),
        ])
            .then(([emp, dirs, locs]) => {
                setEmpresa(emp);
                setDireccionOptions(dirs.map((d) => ({
                    value: String(d.id),
                    label: `${d.calle} ${d.numeracion}, ${d.barrio} — ${d.localidad?.nombre ?? ""}`,
                })));
                setLocalidadOptions(locs.map((l) => ({ value: String(l.id), label: l.nombre })));
            })
            .catch(() => toast.error("Error al cargar los datos de la empresa"))
            .finally(() => setLoading(false));
    }, []);

    // ── open empresa modal ───────────────────────────────────────────────────

    const openEdit = () => {
        if (!empresa) return;
        setFormData({
            nombre:      empresa.nombre,
            direccionId: empresa.direccion ? String(empresa.direccion.id) : "",
        });
        setErrForm({});

        const tels = (empresa.contactos ?? []).filter(esTelefonico).map((c) => ({
            id: c.id, toDelete: false,
            telefono:     c.telefono,
            tipoTelefono: c.tipoTelefono as string,
            tipoContacto: c.tipoContacto as string,
            observacion:  c.observacion ?? "",
        }));
        const mails = (empresa.contactos ?? []).filter((c) => !esTelefonico(c)).map((c) => ({
            id: c.id, toDelete: false,
            email:        (c as ContactoCorreoElectronico).email,
            tipoContacto: c.tipoContacto as string,
            observacion:  c.observacion ?? "",
        }));

        setExistingTels(tels);
        setExistingMails(mails);
        setErrExistingTels(tels.map(() => ({})));
        setErrExistingMails(mails.map(() => ({})));

        setNewTels([]);
        setNewMails([]);
        setErrNewTels([]);
        setErrNewMails([]);
        openModal();
    };

    // ── existing contacts helpers ────────────────────────────────────────────

    const updateExistingTel = (i: number, field: keyof TelefonoRow, value: string) => {
        setExistingTels((p) => p.map((t, j) => j === i ? { ...t, [field]: value } : t));
        setErrExistingTels((p) => p.map((e, j) => j === i ? { ...e, [field]: false } : e));
    };
    const toggleDeleteTel = (i: number) =>
        setExistingTels((p) => p.map((t, j) => j === i ? { ...t, toDelete: !t.toDelete } : t));

    const updateExistingMail = (i: number, field: keyof EmailRow, value: string) => {
        setExistingMails((p) => p.map((e, j) => j === i ? { ...e, [field]: value } : e));
        setErrExistingMails((p) => p.map((e, j) => j === i ? { ...e, [field]: false } : e));
    };
    const toggleDeleteMail = (i: number) =>
        setExistingMails((p) => p.map((e, j) => j === i ? { ...e, toDelete: !e.toDelete } : e));

    // ── new contacts helpers ─────────────────────────────────────────────────

    const addNewTel = () => { setNewTels((p) => [...p, emptyTelefono()]); setErrNewTels((p) => [...p, {}]); };
    const removeNewTel = (i: number) => { setNewTels((p) => p.filter((_, j) => j !== i)); setErrNewTels((p) => p.filter((_, j) => j !== i)); };
    const updateNewTel = (i: number, field: keyof TelefonoRow, value: string) => {
        setNewTels((p) => p.map((t, j) => j === i ? { ...t, [field]: value } : t));
        setErrNewTels((p) => p.map((e, j) => j === i ? { ...e, [field]: false } : e));
    };

    const addNewMail = () => { setNewMails((p) => [...p, emptyEmail()]); setErrNewMails((p) => [...p, {}]); };
    const removeNewMail = (i: number) => { setNewMails((p) => p.filter((_, j) => j !== i)); setErrNewMails((p) => p.filter((_, j) => j !== i)); };
    const updateNewMail = (i: number, field: keyof EmailRow, value: string) => {
        setNewMails((p) => p.map((e, j) => j === i ? { ...e, [field]: value } : e));
        setErrNewMails((p) => p.map((e, j) => j === i ? { ...e, [field]: false } : e));
    };

    // ── direccion sub-modal ──────────────────────────────────────────────────

    const openCrearDireccion = () => { setDirecForm(emptyDireccion()); setErrDirec({}); openDirec(); };

    const handleDirecSubmit = async () => {
        const newErr: Errors = {
            calle: !direcForm.calle.trim(), numeracion: !direcForm.numeracion.trim(),
            barrio: !direcForm.barrio.trim(), localidadId: !direcForm.localidadId,
        };
        if (Object.values(newErr).some(Boolean)) { setErrDirec(newErr); return; }
        setSavingDirec(true);
        try {
            const nueva = await direccionService.create({
                calle: direcForm.calle.trim(), numeracion: direcForm.numeracion.trim(),
                barrio: direcForm.barrio.trim(), localidadId: direcForm.localidadId,
                observacion: direcForm.observacion.trim() || undefined,
            });
            const option = {
                value: String(nueva.id),
                label: `${nueva.calle} ${nueva.numeracion}, ${nueva.barrio} — ${nueva.localidad?.nombre ?? ""}`,
            };
            setDireccionOptions((prev) => [...prev, option]);
            setFormData((prev) => ({ ...prev, direccionId: String(nueva.id) }));
            closeDirec();
            toast.success("Dirección creada");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al crear la dirección");
        } finally {
            setSavingDirec(false);
        }
    };

    // ── empresa submit ───────────────────────────────────────────────────────

    const handleSubmit = async () => {
        const newErrForm: Errors = {
            nombre: !formData.nombre.trim(), direccionId: !formData.direccionId,
        };
        const newErrExTels = existingTels.map((t): Errors =>
            t.toDelete ? {} : { telefono: !t.telefono.trim(), tipoTelefono: !t.tipoTelefono, tipoContacto: !t.tipoContacto }
        );
        const newErrExMails = existingMails.map((e): Errors =>
            e.toDelete ? {} : { email: !e.email.trim(), tipoContacto: !e.tipoContacto }
        );
        const newErrNewTels = newTels.map((t) => ({
            telefono: !t.telefono.trim(), tipoTelefono: !t.tipoTelefono, tipoContacto: !t.tipoContacto,
        }));
        const newErrNewMails = newMails.map((e) => ({
            email: !e.email.trim(), tipoContacto: !e.tipoContacto,
        }));

        setErrForm(newErrForm);
        setErrExistingTels(newErrExTels);
        setErrExistingMails(newErrExMails);
        setErrNewTels(newErrNewTels);
        setErrNewMails(newErrNewMails);

        if (
            Object.values(newErrForm).some(Boolean) ||
            newErrExTels.some((e) => Object.values(e).some(Boolean)) ||
            newErrExMails.some((e) => Object.values(e).some(Boolean)) ||
            newErrNewTels.some((e) => Object.values(e).some(Boolean)) ||
            newErrNewMails.some((e) => Object.values(e).some(Boolean))
        ) {
            toast.error("Revisá los campos obligatorios");
            return;
        }

        setSaving(true);
        try {
            // 1) update / delete existing contacts
            await Promise.all([
                ...existingTels.filter((t) => t.toDelete).map((t) =>
                    contactoTelefonicoService.remove(t.id as unknown as number)
                ),
                ...existingTels.filter((t) => !t.toDelete).map((t) =>
                    contactoTelefonicoService.update(t.id as unknown as number, {
                        telefono:     t.telefono,
                        tipoTelefono: t.tipoTelefono as TipoTelefono,
                        tipoContacto: t.tipoContacto as TipoContacto,
                        observacion:  t.observacion,
                    })
                ),
                ...existingMails.filter((e) => e.toDelete).map((e) =>
                    contactoCorreoElectronicoService.remove(e.id as unknown as number)
                ),
                ...existingMails.filter((e) => !e.toDelete).map((e) =>
                    contactoCorreoElectronicoService.update(e.id as unknown as number, {
                        email:        e.email,
                        tipoContacto: e.tipoContacto as TipoContacto,
                        observacion:  e.observacion,
                    })
                ),
            ]);

            // 2) create new contacts
            const [telCreados, mailCreados] = await Promise.all([
                Promise.all(newTels.map((t) =>
                    contactoTelefonicoService.create({
                        telefono: t.telefono, tipoTelefono: t.tipoTelefono as TipoTelefono,
                        tipoContacto: t.tipoContacto as TipoContacto, observacion: t.observacion,
                    })
                )),
                Promise.all(newMails.map((e) =>
                    contactoCorreoElectronicoService.create({
                        email: e.email, tipoContacto: e.tipoContacto as TipoContacto, observacion: e.observacion,
                    })
                )),
            ]);

            const contactoIds = [
                ...telCreados.map((c) => String(c.id)),
                ...mailCreados.map((c) => String(c.id)),
            ];

            // 3) update empresa (nombre, direccion, new contact associations)
            const updated = await empresaService.update({
                nombre:      formData.nombre.trim(),
                direccionId: formData.direccionId,
                contactoIds: contactoIds.length ? contactoIds : undefined,
            });

            setEmpresa(updated);
            closeModal();
            toast.success("Empresa actualizada");
        } catch (error) {
            if (error instanceof ApiError && error.fieldErrors) {
                Object.entries(error.fieldErrors).forEach(([campo, msg]) => toast.error(`${campo}: ${msg}`));
            } else {
                toast.error(error instanceof Error ? error.message : "Error al actualizar la empresa");
            }
        } finally {
            setSaving(false);
        }
    };

    // ── render ───────────────────────────────────────────────────────────────

    if (loading) {
        return <div className="flex justify-center py-16"><Spinner /></div>;
    }

    const dir = empresa?.direccion;

    return (
        <>
            {/* ── card de visualización ──────────────────────────────────── */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Datos de la Empresa</h3>
                    <button onClick={openEdit} className="text-gray-400 hover:text-brand-500 transition-colors" aria-label="Editar empresa">
                        <PencilIcon />
                    </button>
                </div>
                <div className="px-5 py-6 space-y-5">
                    {empresa ? (
                        <>
                            <Field label="Nombre">
                                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{empresa.nombre}</p>
                            </Field>
                            <Field label="Dirección">
                                {dir ? (
                                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-0.5">
                                        <p className="font-medium">{dir.calle} {dir.numeracion}</p>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {dir.barrio}{dir.localidad ? `, ${dir.localidad.nombre} (${dir.localidad.codigoPostal})` : ""}
                                        </p>
                                        {dir.observacion && <p className="text-gray-400 dark:text-gray-500 text-xs">{dir.observacion}</p>}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 dark:text-gray-500">Sin dirección asignada</p>
                                )}
                            </Field>
                            <Field label="Contactos">
                                {empresa.contactos?.length ? (
                                    <ul className="space-y-2">
                                        {empresa.contactos.map((c) => (
                                            <li key={c.id} className="flex items-start gap-2 text-sm">
                                                {esTelefonico(c) ? (
                                                    <><Badge color="blue">Teléfono</Badge>
                                                        <span className="text-gray-700 dark:text-gray-300">
                                                            {c.telefono}{c.observacion && <span className="ml-1 text-gray-400"> — {c.observacion}</span>}
                                                        </span></>
                                                ) : (
                                                    <><Badge color="green">Email</Badge>
                                                        <span className="text-gray-700 dark:text-gray-300">
                                                            {(c as ContactoCorreoElectronico).email}{c.observacion && <span className="ml-1 text-gray-400"> — {c.observacion}</span>}
                                                        </span></>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-400 dark:text-gray-500">Sin contactos registrados</p>
                                )}
                            </Field>
                        </>
                    ) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500">No hay empresa registrada.</p>
                    )}
                </div>
            </div>

            {/* ── modal empresa ──────────────────────────────────────────── */}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
                <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">Editar Empresa</h4>
                <div className="space-y-6">

                    {/* datos generales */}
                    <ModalSection title="Datos generales">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="emp-nombre">Nombre</Label>
                                <Input
                                    id="emp-nombre" placeholder="Nombre de la empresa"
                                    defaultValue={formData.nombre}
                                    error={errForm.nombre} hint={errForm.nombre ? "El nombre es obligatorio" : ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setFormData((p) => ({ ...p, nombre: e.target.value }));
                                        if (errForm.nombre) setErrForm((p) => ({ ...p, nombre: false }));
                                    }}
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <Label className="mb-0">Dirección</Label>
                                    <button type="button" onClick={openCrearDireccion}
                                        className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 transition-colors">
                                        <PlusIcon />Nueva dirección
                                    </button>
                                </div>
                                <Select options={direccionOptions} placeholder="Seleccionar dirección"
                                    defaultValue={formData.direccionId}
                                    onChange={(v) => {
                                        setFormData((p) => ({ ...p, direccionId: v }));
                                        if (errForm.direccionId) setErrForm((p) => ({ ...p, direccionId: false }));
                                    }}
                                />
                                {errForm.direccionId && <FieldError msg="Debe seleccionar una dirección" />}
                            </div>
                        </div>
                    </ModalSection>

                    {/* contactos telefónicos */}
                    <ModalSection title="Contactos Telefónicos"
                        action={<button type="button" onClick={addNewTel}
                            className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 transition-colors">
                            <PlusIcon />Agregar teléfono
                        </button>}
                    >
                        {existingTels.length === 0 && newTels.length === 0 ? (
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                Sin teléfonos. Hacé clic en &ldquo;Agregar teléfono&rdquo; para añadir.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {/* existing */}
                                {existingTels.map((t, i) => (
                                    <ContactRow key={t.id} toDelete={t.toDelete} onToggleDelete={() => toggleDeleteTel(i)}>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div>
                                                <Label htmlFor={`et-num-${i}`}>Teléfono</Label>
                                                <Input id={`et-num-${i}`} placeholder="Ej: 2614123456"
                                                    defaultValue={t.telefono} disabled={t.toDelete}
                                                    error={errExistingTels[i]?.telefono}
                                                    hint={errExistingTels[i]?.telefono ? "El teléfono es obligatorio" : ""}
                                                    onChange={(e) => updateExistingTel(i, "telefono", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Tipo de Teléfono</Label>
                                                <Select options={tipoTelefonoOptions} placeholder="Seleccionar tipo"
                                                    defaultValue={t.tipoTelefono}
                                                    onChange={(v) => updateExistingTel(i, "tipoTelefono", v)}
                                                />
                                                {errExistingTels[i]?.tipoTelefono && <FieldError msg="Debe seleccionar el tipo" />}
                                            </div>
                                            <div>
                                                <Label>Tipo de Contacto</Label>
                                                <Select options={tipoContactoOptions} placeholder="Seleccionar tipo"
                                                    defaultValue={t.tipoContacto}
                                                    onChange={(v) => updateExistingTel(i, "tipoContacto", v)}
                                                />
                                                {errExistingTels[i]?.tipoContacto && <FieldError msg="Debe seleccionar el tipo" />}
                                            </div>
                                            <div>
                                                <Label htmlFor={`et-obs-${i}`}>Observación (Opcional)</Label>
                                                <Input id={`et-obs-${i}`} placeholder="Ej: Horario laboral"
                                                    defaultValue={t.observacion} disabled={t.toDelete}
                                                    onChange={(e) => updateExistingTel(i, "observacion", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </ContactRow>
                                ))}
                                {/* new */}
                                {newTels.map((t, i) => (
                                    <div key={i} className="rounded-lg border border-dashed border-brand-300 dark:border-brand-500/40 p-4 relative">
                                        <button type="button" onClick={() => removeNewTel(i)}
                                            className="absolute top-3 right-3 text-gray-300 hover:text-error-500 transition-colors">
                                            <TrashBinIcon />
                                        </button>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div>
                                                <Label htmlFor={`nt-num-${i}`}>Teléfono</Label>
                                                <Input id={`nt-num-${i}`} placeholder="Ej: 2614123456"
                                                    defaultValue={t.telefono}
                                                    error={errNewTels[i]?.telefono}
                                                    hint={errNewTels[i]?.telefono ? "El teléfono es obligatorio" : ""}
                                                    onChange={(e) => updateNewTel(i, "telefono", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Tipo de Teléfono</Label>
                                                <Select options={tipoTelefonoOptions} placeholder="Seleccionar tipo"
                                                    defaultValue={t.tipoTelefono}
                                                    onChange={(v) => updateNewTel(i, "tipoTelefono", v)}
                                                />
                                                {errNewTels[i]?.tipoTelefono && <FieldError msg="Debe seleccionar el tipo" />}
                                            </div>
                                            <div>
                                                <Label>Tipo de Contacto</Label>
                                                <Select options={tipoContactoOptions} placeholder="Seleccionar tipo"
                                                    defaultValue={t.tipoContacto}
                                                    onChange={(v) => updateNewTel(i, "tipoContacto", v)}
                                                />
                                                {errNewTels[i]?.tipoContacto && <FieldError msg="Debe seleccionar el tipo" />}
                                            </div>
                                            <div>
                                                <Label htmlFor={`nt-obs-${i}`}>Observación (Opcional)</Label>
                                                <Input id={`nt-obs-${i}`} placeholder="Ej: Horario laboral"
                                                    defaultValue={t.observacion}
                                                    onChange={(e) => updateNewTel(i, "observacion", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ModalSection>

                    {/* contactos de correo */}
                    <ModalSection title="Contactos de Correo Electrónico"
                        action={<button type="button" onClick={addNewMail}
                            className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 transition-colors">
                            <PlusIcon />Agregar email
                        </button>}
                    >
                        {existingMails.length === 0 && newMails.length === 0 ? (
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                Sin correos. Hacé clic en &ldquo;Agregar email&rdquo; para añadir.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {/* existing */}
                                {existingMails.map((e, i) => (
                                    <ContactRow key={e.id} toDelete={e.toDelete} onToggleDelete={() => toggleDeleteMail(i)}>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div>
                                                <Label htmlFor={`em-addr-${i}`}>Email</Label>
                                                <Input id={`em-addr-${i}`} placeholder="contacto@ejemplo.com"
                                                    defaultValue={e.email} disabled={e.toDelete}
                                                    error={errExistingMails[i]?.email}
                                                    hint={errExistingMails[i]?.email ? "El email es obligatorio" : ""}
                                                    onChange={(ev) => updateExistingMail(i, "email", ev.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Tipo de Contacto</Label>
                                                <Select options={tipoContactoOptions} placeholder="Seleccionar tipo"
                                                    defaultValue={e.tipoContacto}
                                                    onChange={(v) => updateExistingMail(i, "tipoContacto", v)}
                                                />
                                                {errExistingMails[i]?.tipoContacto && <FieldError msg="Debe seleccionar el tipo" />}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Label htmlFor={`em-obs-${i}`}>Observación (Opcional)</Label>
                                                <Input id={`em-obs-${i}`} placeholder="Ej: Email corporativo"
                                                    defaultValue={e.observacion} disabled={e.toDelete}
                                                    onChange={(ev) => updateExistingMail(i, "observacion", ev.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </ContactRow>
                                ))}
                                {/* new */}
                                {newMails.map((e, i) => (
                                    <div key={i} className="rounded-lg border border-dashed border-brand-300 dark:border-brand-500/40 p-4 relative">
                                        <button type="button" onClick={() => removeNewMail(i)}
                                            className="absolute top-3 right-3 text-gray-300 hover:text-error-500 transition-colors">
                                            <TrashBinIcon />
                                        </button>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div>
                                                <Label htmlFor={`nm-addr-${i}`}>Email</Label>
                                                <Input id={`nm-addr-${i}`} placeholder="contacto@ejemplo.com"
                                                    defaultValue={e.email}
                                                    error={errNewMails[i]?.email}
                                                    hint={errNewMails[i]?.email ? "El email es obligatorio" : ""}
                                                    onChange={(ev) => updateNewMail(i, "email", ev.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Tipo de Contacto</Label>
                                                <Select options={tipoContactoOptions} placeholder="Seleccionar tipo"
                                                    defaultValue={e.tipoContacto}
                                                    onChange={(v) => updateNewMail(i, "tipoContacto", v)}
                                                />
                                                {errNewMails[i]?.tipoContacto && <FieldError msg="Debe seleccionar el tipo" />}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Label htmlFor={`nm-obs-${i}`}>Observación (Opcional)</Label>
                                                <Input id={`nm-obs-${i}`} placeholder="Ej: Email corporativo"
                                                    defaultValue={e.observacion}
                                                    onChange={(ev) => updateNewMail(i, "observacion", ev.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ModalSection>

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-white/[0.05]">
                        <Button variant="outline" size="sm" onClick={closeModal} disabled={saving}>Cancelar</Button>
                        <Button size="sm" onClick={handleSubmit} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
                    </div>
                </div>
            </Modal>

            {/* ── sub-modal: crear dirección ─────────────────────────────── */}
            <Modal isOpen={isDirecOpen} onClose={closeDirec} className="max-w-md p-6">
                <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">Nueva Dirección</h4>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="nd-calle">Calle</Label>
                        <Input id="nd-calle" placeholder="Ej: Av. San Martín" defaultValue={direcForm.calle}
                            error={errDirec.calle} hint={errDirec.calle ? "La calle es obligatoria" : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setDirecForm((p) => ({ ...p, calle: e.target.value }));
                                if (errDirec.calle) setErrDirec((p) => ({ ...p, calle: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="nd-num">Numeración</Label>
                        <Input id="nd-num" placeholder="Ej: 1234" defaultValue={direcForm.numeracion}
                            error={errDirec.numeracion} hint={errDirec.numeracion ? "La numeración es obligatoria" : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setDirecForm((p) => ({ ...p, numeracion: e.target.value }));
                                if (errDirec.numeracion) setErrDirec((p) => ({ ...p, numeracion: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="nd-barrio">Barrio</Label>
                        <Input id="nd-barrio" placeholder="Ej: Centro" defaultValue={direcForm.barrio}
                            error={errDirec.barrio} hint={errDirec.barrio ? "El barrio es obligatorio" : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setDirecForm((p) => ({ ...p, barrio: e.target.value }));
                                if (errDirec.barrio) setErrDirec((p) => ({ ...p, barrio: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label>Localidad</Label>
                        <Select options={localidadOptions} placeholder="Seleccionar localidad"
                            defaultValue={direcForm.localidadId}
                            onChange={(v) => {
                                setDirecForm((p) => ({ ...p, localidadId: v }));
                                if (errDirec.localidadId) setErrDirec((p) => ({ ...p, localidadId: false }));
                            }}
                        />
                        {errDirec.localidadId && <FieldError msg="Debe seleccionar una localidad" />}
                    </div>
                    <div>
                        <Label htmlFor="nd-obs">Observación (Opcional)</Label>
                        <Input id="nd-obs" placeholder="Ej: Esquina con calle Belgrano" defaultValue={direcForm.observacion}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setDirecForm((p) => ({ ...p, observacion: e.target.value }))
                            }
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" size="sm" onClick={closeDirec} disabled={savingDirec}>Cancelar</Button>
                        <Button size="sm" onClick={handleDirecSubmit} disabled={savingDirec}>
                            {savingDirec ? "Guardando…" : "Crear Dirección"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

// ── subcomponentes ────────────────────────────────────────────────────────────

function ContactRow({
    toDelete, onToggleDelete, children,
}: {
    toDelete: boolean;
    onToggleDelete: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className={`rounded-lg border p-4 relative transition-opacity ${
            toDelete
                ? "border-error-200 bg-error-50/50 opacity-50 dark:border-error-500/30 dark:bg-error-500/5"
                : "border-gray-100 dark:border-white/[0.05]"
        }`}>
            <button
                type="button"
                onClick={onToggleDelete}
                title={toDelete ? "Deshacer eliminación" : "Eliminar"}
                className={`absolute top-3 right-3 transition-colors ${
                    toDelete ? "text-error-400 hover:text-gray-400" : "text-gray-300 hover:text-error-500"
                }`}
            >
                <TrashBinIcon />
            </button>
            {toDelete && (
                <p className="text-xs text-error-500 mb-2 font-medium">Se eliminará al guardar</p>
            )}
            {children}
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">{label}</p>
            {children}
        </div>
    );
}

function ModalSection({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-gray-200 dark:border-white/[0.05]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.05]">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-white/80">{title}</h5>
                {action}
            </div>
            <div className="px-4 py-4">{children}</div>
        </div>
    );
}

function Badge({ color, children }: { color: "blue" | "green"; children: React.ReactNode }) {
    const styles = {
        blue:  "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
        green: "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
    };
    return (
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset shrink-0 ${styles[color]}`}>
            {children}
        </span>
    );
}

function FieldError({ msg }: { msg: string }) {
    return <p className="mt-1.5 text-xs text-error-500">{msg}</p>;
}
