"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Spinner from "@/components/ui/Spinner";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import TelefonoSection, { type TelefonoRow } from "@/components/contacto/TelefonoSection";
import EmailSection, { type EmailRow } from "@/components/contacto/EmailSection";
import DireccionModal from "@/components/direccion/DireccionModal";
import { empresaService } from "@/services/empresaService";
import { direccionService } from "@/services/direccionService";
import { localidadService } from "@/services/localidadService";
import { contactoTelefonicoService } from "@/services/contactoTelefonicoService";
import { contactoCorreoElectronicoService } from "@/services/contactoCorreoElectronicoService";
import toast from "react-hot-toast";
import { useModal } from "@/hooks/useModal";
import type { Empresa, Direccion } from "@/types/entities";
import type { ContactoTelefonico, ContactoCorreoElectronico } from "@/types/contactos";
import { TipoContacto, TipoTelefono } from "@/types/contactos";
import { ApiError } from "@/lib/apiClient";

// ── tipos locales ────────────────────────────────────────────────────────────

type EmpresaFormData = { nombre: string; direccionId: string };

type ExistingTelefonoRow = TelefonoRow & { id: string; toDelete: boolean };
type ExistingEmailRow    = EmailRow    & { id: string; toDelete: boolean };

type Errors = Record<string, boolean>;

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

    // existing contacts (editable / soft-deletable)
    const [existingTels,  setExistingTels]  = useState<ExistingTelefonoRow[]>([]);
    const [existingMails, setExistingMails] = useState<ExistingEmailRow[]>([]);
    const [errExistingTels,  setErrExistingTels]  = useState<Errors[]>([]);
    const [errExistingMails, setErrExistingMails] = useState<Errors[]>([]);

    // new contacts (via shared sections)
    const [newTels,  setNewTels]  = useState<TelefonoRow[]>([]);
    const [newMails, setNewMails] = useState<EmailRow[]>([]);
    const [errNewTels,  setErrNewTels]  = useState<Errors[]>([]);
    const [errNewMails, setErrNewMails] = useState<Errors[]>([]);

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

    const addNewTel     = () => { setNewTels((p) => [...p, { telefono: "", tipoTelefono: "", tipoContacto: "", observacion: "" }]); setErrNewTels((p) => [...p, {}]); };
    const removeNewTel  = (i: number) => { setNewTels((p) => p.filter((_, j) => j !== i)); setErrNewTels((p) => p.filter((_, j) => j !== i)); };
    const updateNewTel  = (i: number, field: keyof TelefonoRow, value: string) => {
        setNewTels((p) => p.map((t, j) => j === i ? { ...t, [field]: value } : t));
        setErrNewTels((p) => p.map((e, j) => j === i ? { ...e, [field]: false } : e));
    };

    const addNewMail    = () => { setNewMails((p) => [...p, { email: "", tipoContacto: "", observacion: "" }]); setErrNewMails((p) => [...p, {}]); };
    const removeNewMail = (i: number) => { setNewMails((p) => p.filter((_, j) => j !== i)); setErrNewMails((p) => p.filter((_, j) => j !== i)); };
    const updateNewMail = (i: number, field: keyof EmailRow, value: string) => {
        setNewMails((p) => p.map((e, j) => j === i ? { ...e, [field]: value } : e));
        setErrNewMails((p) => p.map((e, j) => j === i ? { ...e, [field]: false } : e));
    };

    // ── direccion created callback ───────────────────────────────────────────

    const handleDireccionCreada = (nueva: Direccion) => {
        setDireccionOptions((prev) => [...prev, {
            value: String(nueva.id),
            label: `${nueva.calle} ${nueva.numeracion}, ${nueva.barrio} — ${nueva.localidad?.nombre ?? ""}`,
        }]);
        setFormData((p) => ({ ...p, direccionId: String(nueva.id) }));
    };

    // ── empresa submit ───────────────────────────────────────────────────────

    const handleSubmit = async () => {
        const newErrForm: Errors = {
            nombre: !formData.nombre.trim(), direccionId: !formData.direccionId,
        };
        const newErrExTels: Errors[] = existingTels.map((t): Errors =>
            t.toDelete ? {} : { telefono: !t.telefono.trim(), tipoTelefono: !t.tipoTelefono, tipoContacto: !t.tipoContacto }
        );
        const newErrExMails: Errors[] = existingMails.map((e): Errors =>
            e.toDelete ? {} : { email: !e.email.trim(), tipoContacto: !e.tipoContacto }
        );
        const newErrNewTels: Errors[] = newTels.map((t) => ({
            telefono: !t.telefono.trim(), tipoTelefono: !t.tipoTelefono, tipoContacto: !t.tipoContacto,
        }));
        const newErrNewMails: Errors[] = newMails.map((e) => ({
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
            await Promise.all([
                ...existingTels.filter((t) => t.toDelete).map((t) =>
                    contactoTelefonicoService.remove(t.id)
                ),
                ...existingTels.filter((t) => !t.toDelete).map((t) =>
                    contactoTelefonicoService.update(t.id, {
                        telefono: t.telefono, tipoTelefono: t.tipoTelefono as TipoTelefono,
                        tipoContacto: t.tipoContacto as TipoContacto, observacion: t.observacion,
                    })
                ),
                ...existingMails.filter((e) => e.toDelete).map((e) =>
                    contactoCorreoElectronicoService.remove(e.id)
                ),
                ...existingMails.filter((e) => !e.toDelete).map((e) =>
                    contactoCorreoElectronicoService.update(e.id, {
                        email: e.email, tipoContacto: e.tipoContacto as TipoContacto, observacion: e.observacion,
                    })
                ),
            ]);

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
                                    <button type="button" onClick={openDirec}
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

                    {/* existing phone contacts */}
                    {existingTels.length > 0 && (
                        <ModalSection title="Teléfonos existentes">
                            <div className="space-y-3">
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
                                                <Select options={[{ value: "FIJO", label: "Fijo" }, { value: "CELULAR", label: "Celular" }]}
                                                    placeholder="Tipo" defaultValue={t.tipoTelefono}
                                                    onChange={(v) => updateExistingTel(i, "tipoTelefono", v)}
                                                />
                                                {errExistingTels[i]?.tipoTelefono && <FieldError msg="Debe seleccionar el tipo" />}
                                            </div>
                                            <div>
                                                <Label>Tipo de Contacto</Label>
                                                <Select options={[{ value: "PERSONAL", label: "Personal" }, { value: "LABORAL", label: "Laboral" }, { value: "EMPRESA", label: "Empresa" }]}
                                                    placeholder="Tipo" defaultValue={t.tipoContacto}
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
                            </div>
                        </ModalSection>
                    )}

                    {/* existing email contacts */}
                    {existingMails.length > 0 && (
                        <ModalSection title="Correos existentes">
                            <div className="space-y-3">
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
                                                <Select options={[{ value: "PERSONAL", label: "Personal" }, { value: "LABORAL", label: "Laboral" }, { value: "EMPRESA", label: "Empresa" }]}
                                                    placeholder="Tipo" defaultValue={e.tipoContacto}
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
                            </div>
                        </ModalSection>
                    )}

                    {/* new phone contacts — shared component */}
                    <TelefonoSection
                        rows={newTels} errors={errNewTels}
                        onAdd={addNewTel} onRemove={removeNewTel} onUpdate={updateNewTel}
                        idPrefix="nt"
                    />

                    {/* new email contacts — shared component */}
                    <EmailSection
                        rows={newMails} errors={errNewMails}
                        onAdd={addNewMail} onRemove={removeNewMail} onUpdate={updateNewMail}
                        idPrefix="nm"
                    />

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-white/[0.05]">
                        <Button variant="outline" size="sm" onClick={closeModal} disabled={saving}>Cancelar</Button>
                        <Button size="sm" onClick={handleSubmit} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
                    </div>
                </div>
            </Modal>

            {/* ── shared DireccionModal ──────────────────────────────────── */}
            <DireccionModal
                isOpen={isDirecOpen}
                onClose={closeDirec}
                localidadOptions={localidadOptions}
                onCreated={handleDireccionCreada}
            />
        </>
    );
}

// ── subcomponentes locales ────────────────────────────────────────────────────

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
            <button type="button" onClick={onToggleDelete}
                title={toDelete ? "Deshacer eliminación" : "Eliminar"}
                className={`absolute top-3 right-3 transition-colors ${
                    toDelete ? "text-error-400 hover:text-gray-400" : "text-gray-300 hover:text-error-500"
                }`}>
                <TrashBinIcon />
            </button>
            {toDelete && <p className="text-xs text-error-500 mb-2 font-medium">Se eliminará al guardar</p>}
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

function ModalSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-gray-200 dark:border-white/[0.05]">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.05]">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-white/80">{title}</h5>
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
