"use client";
import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Select from "../form/Select";
import DireccionModal from "../direccion/DireccionModal";
import { profileService } from "@/services/profileService";
import { localidadService } from "@/services/localidadService";
import { contactoTelefonicoService } from "@/services/contactoTelefonicoService";
import { contactoCorreoElectronicoService } from "@/services/contactoCorreoElectronicoService";
import { direccionService } from "@/services/direccionService";
import type { Persona } from "@/types/empleado";
import type { Usuario } from "@/types/usuario";
import type { Direccion, Localidad } from "@/types/entities";
import {
  TipoContacto,
  TipoTelefono,
  type ContactoTelefonico,
  type ContactoCorreoElectronico,
} from "@/types/contactos";
import { toast } from "react-hot-toast";

const inputClass =
  "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

const TIPO_DOC = ["DNI", "LE", "LC", "PASAPORTE", "CUIT", "CUIL"];
const TIPO_CONTACTO_OPTS = Object.values(TipoContacto).map((v) => ({ value: v, label: v }));
const TIPO_TELEFONO_OPTS = Object.values(TipoTelefono).map((v) => ({ value: v, label: v }));

type PhoneEntry = { id?: string; telefono: string; tipoTelefono: string; tipoContacto: string; observacion: string; isNew?: boolean };
type EmailEntry = { id?: string; email: string; tipoContacto: string; observacion: string; isNew?: boolean };

interface Props {
  usuario: Usuario;
  persona: Persona | null;
  onPersonaUpdated: (p: Persona) => void;
}

type BasicForm = {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  tipoDocumento: string;
  numeroDocumento: string;
};

export default function UserInfoCard({ usuario, persona, onPersonaUpdated }: Props) {
  const { isOpen, openModal, closeModal } = useModal();
  const [saving, setSaving] = useState(false);

  // Basic fields
  const [basic, setBasic] = useState<BasicForm>({ nombre: "", apellido: "", fechaNacimiento: "", tipoDocumento: "DNI", numeroDocumento: "" });
  const [basicErrors, setBasicErrors] = useState<Partial<BasicForm>>({});

  // Direccion
  const [direcciones, setDirecciones]   = useState<Direccion[]>([]);
  const [localidades, setLocalidades]   = useState<Localidad[]>([]);
  const [selectedDirId, setSelectedDirId] = useState<string>("");
  const [dirModalOpen, setDirModalOpen] = useState(false);
  const [dirError, setDirError]         = useState(false);

  // Contacts
  const [phones, setPhones]     = useState<PhoneEntry[]>([]);
  const [emails, setEmails]     = useState<EmailEntry[]>([]);
  const [deletedPhoneIds, setDeletedPhoneIds] = useState<string[]>([]);
  const [deletedEmailIds, setDeletedEmailIds] = useState<string[]>([]);

  async function openEdit() {
    setBasic({
      nombre: persona?.nombre ?? "",
      apellido: persona?.apellido ?? "",
      fechaNacimiento: persona?.fechaNacimiento ?? "",
      tipoDocumento: persona?.tipoDocumento ?? "DNI",
      numeroDocumento: persona?.numeroDocumento ?? "",
    });
    setBasicErrors({});
    setSelectedDirId(persona?.direccion?.id ?? "");
    setDirError(false);
    setDeletedPhoneIds([]);
    setDeletedEmailIds([]);
    setPhones(
      persona?.contactoTelefonicoDtos?.map((c) => ({
        id: c.id,
        telefono: c.telefono,
        tipoTelefono: c.tipoTelefono,
        tipoContacto: c.tipoContacto,
        observacion: c.observacion,
      })) ?? []
    );
    setEmails(
      persona?.contactoCorreoElectronicoDtos?.map((c) => ({
        id: c.id,
        email: c.email,
        tipoContacto: c.tipoContacto,
        observacion: c.observacion,
      })) ?? []
    );

    // Load direcciones and localidades in parallel
    try {
      const [dirs, locs] = await Promise.all([
        direccionService.getAll(),
        localidadService.getAll(),
      ]);
      setDirecciones(dirs);
      setLocalidades(locs);
    } catch {
      toast.error("Error al cargar direcciones");
    }

    openModal();
  }

  function addPhone() {
    setPhones((p) => [...p, { telefono: "", tipoTelefono: TipoTelefono.CELULAR, tipoContacto: TipoContacto.PERSONAL, observacion: "", isNew: true }]);
  }

  function removePhone(idx: number) {
    const entry = phones[idx];
    if (entry.id) setDeletedPhoneIds((d) => [...d, entry.id!]);
    setPhones((p) => p.filter((_, i) => i !== idx));
  }

  function addEmail() {
    setEmails((e) => [...e, { email: "", tipoContacto: TipoContacto.PERSONAL, observacion: "", isNew: true }]);
  }

  function removeEmail(idx: number) {
    const entry = emails[idx];
    if (entry.id) setDeletedEmailIds((d) => [...d, entry.id!]);
    setEmails((e) => e.filter((_, i) => i !== idx));
  }

  function validate() {
    const e: Partial<BasicForm> = {};
    if (!basic.nombre.trim()) e.nombre = "Requerido";
    if (!basic.apellido.trim()) e.apellido = "Requerido";
    if (!basic.numeroDocumento.trim()) e.numeroDocumento = "Requerido";
    if (!basic.fechaNacimiento) e.fechaNacimiento = "Requerido";
    const hasDir = !!selectedDirId;
    setDirError(!hasDir);
    return { basicErrors: e, valid: Object.keys(e).length === 0 && hasDir };
  }

  async function handleSave() {
    const { basicErrors: errs, valid } = validate();
    setBasicErrors(errs);
    if (!valid) return;
    if (!usuario.personaId) { toast.error("Sin persona asociada"); return; }

    setSaving(true);
    try {
      // 1. Delete removed contacts
      await Promise.all([
        ...deletedPhoneIds.map((id) => contactoTelefonicoService.remove(id)),
        ...deletedEmailIds.map((id) => contactoCorreoElectronicoService.remove(id)),
      ]);

      // 2. Create new contacts, update existing ones
      const phoneIds: string[] = [];
      for (const p of phones) {
        if (p.isNew) {
          const created = await contactoTelefonicoService.create({
            telefono: p.telefono,
            tipoTelefono: p.tipoTelefono as TipoTelefono,
            tipoContacto: p.tipoContacto as TipoContacto,
            observacion: p.observacion,
          } as Omit<ContactoTelefonico, "id">);
          phoneIds.push(created.id);
        } else {
          await contactoTelefonicoService.update(p.id!, {
            telefono: p.telefono,
            tipoTelefono: p.tipoTelefono as TipoTelefono,
            tipoContacto: p.tipoContacto as TipoContacto,
            observacion: p.observacion,
          } as Omit<ContactoTelefonico, "id">);
          phoneIds.push(p.id!);
        }
      }

      const emailIds: string[] = [];
      for (const e of emails) {
        if (e.isNew) {
          const created = await contactoCorreoElectronicoService.create({
            email: e.email,
            tipoContacto: e.tipoContacto as TipoContacto,
            observacion: e.observacion,
          } as Omit<ContactoCorreoElectronico, "id">);
          emailIds.push(created.id);
        } else {
          await contactoCorreoElectronicoService.update(e.id!, {
            email: e.email,
            tipoContacto: e.tipoContacto as TipoContacto,
            observacion: e.observacion,
          } as Omit<ContactoCorreoElectronico, "id">);
          emailIds.push(e.id!);
        }
      }

      // 3. Update persona
      const updated = await profileService.updatePersona(usuario.personaId!, {
        nombre: basic.nombre,
        apellido: basic.apellido,
        fechaNacimiento: basic.fechaNacimiento,
        tipoDocumento: basic.tipoDocumento,
        numeroDocumento: basic.numeroDocumento,
        direccionId: selectedDirId,
        contactoTelefonicoIds: phoneIds,
        contactoCorreoElectronicoIds: emailIds,
      });

      onPersonaUpdated(updated);
      toast.success("Información actualizada");
      closeModal();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const displayField = (label: string, value: string | undefined) => (
    <div key={label}>
      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">{value || "—"}</p>
    </div>
  );

  const dirOpts = direcciones.map((d) => ({
    value: d.id,
    label: `${d.calle} ${d.numeracion}, ${d.localidad?.nombre ?? ""}`,
  }));

  const localidadOpts = localidades.map((l) => ({ value: l.id, label: `${l.nombre} (${l.departamento?.nombre ?? ""})` }));

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
            Información personal
          </h4>

          {persona ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              {displayField("Nombre", persona.nombre)}
              {displayField("Apellido", persona.apellido)}
              {displayField("Tipo de documento", persona.tipoDocumento)}
              {displayField("Número de documento", persona.numeroDocumento)}
              {displayField("Fecha de nacimiento", persona.fechaNacimiento)}
              {displayField("Email", usuario.email)}
              {persona.contactoTelefonicoDtos?.map((c, i) =>
                displayField(persona.contactoTelefonicoDtos!.length > 1 ? `Teléfono ${i + 1}` : "Teléfono", c.telefono)
              )}
              {persona.contactoCorreoElectronicoDtos?.map((c, i) =>
                displayField(persona.contactoCorreoElectronicoDtos!.length > 1 ? `Correo ${i + 1}` : "Correo contacto", c.email)
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No hay información personal asociada a este usuario.
            </p>
          )}
        </div>

        {persona && (
          <button
            onClick={openEdit}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" fill="" />
            </svg>
            Editar
          </button>
        )}
      </div>

      {/* ── Edit Modal ── */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14 mb-6">
            <h4 className="mb-1 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar información personal
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Actualice sus datos personales, dirección y contactos.
            </p>
          </div>

          <div className="custom-scrollbar max-h-[60vh] overflow-y-auto px-2 pb-3 space-y-8">

            {/* ── Datos personales ── */}
            <section>
              <h5 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Datos personales</h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
                <div>
                  <Label>Nombre</Label>
                  <input type="text" value={basic.nombre} onChange={(e) => setBasic({ ...basic, nombre: e.target.value })} className={inputClass} />
                  {basicErrors.nombre && <p className="mt-1 text-xs text-error-500">{basicErrors.nombre}</p>}
                </div>
                <div>
                  <Label>Apellido</Label>
                  <input type="text" value={basic.apellido} onChange={(e) => setBasic({ ...basic, apellido: e.target.value })} className={inputClass} />
                  {basicErrors.apellido && <p className="mt-1 text-xs text-error-500">{basicErrors.apellido}</p>}
                </div>
                <div>
                  <Label>Tipo de documento</Label>
                  <select value={basic.tipoDocumento} onChange={(e) => setBasic({ ...basic, tipoDocumento: e.target.value })} className={inputClass}>
                    {TIPO_DOC.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Número de documento</Label>
                  <input type="text" value={basic.numeroDocumento} onChange={(e) => setBasic({ ...basic, numeroDocumento: e.target.value })} className={inputClass} />
                  {basicErrors.numeroDocumento && <p className="mt-1 text-xs text-error-500">{basicErrors.numeroDocumento}</p>}
                </div>
                <div>
                  <Label>Fecha de nacimiento</Label>
                  <input type="date" value={basic.fechaNacimiento} onChange={(e) => setBasic({ ...basic, fechaNacimiento: e.target.value })} className={inputClass} />
                  {basicErrors.fechaNacimiento && <p className="mt-1 text-xs text-error-500">{basicErrors.fechaNacimiento}</p>}
                </div>
              </div>
            </section>

            {/* ── Dirección ── */}
            <section>
              <h5 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Dirección</h5>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Label>Seleccionar dirección</Label>
                  <Select
                    key={selectedDirId}
                    options={dirOpts}
                    placeholder="Seleccionar dirección"
                    defaultValue={selectedDirId}
                    onChange={(v) => { setSelectedDirId(v); setDirError(false); }}
                  />
                  {dirError && <p className="mt-1 text-xs text-error-500">La dirección es obligatoria</p>}
                </div>
                <Button size="sm" variant="outline" onClick={() => setDirModalOpen(true)}>
                  Nueva
                </Button>
              </div>
            </section>

            {/* ── Teléfonos ── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Teléfonos</h5>
                <Button size="sm" variant="outline" onClick={addPhone}>+ Agregar</Button>
              </div>
              <div className="space-y-4">
                {phones.map((p, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      <div>
                        <Label>Número</Label>
                        <input type="text" value={p.telefono} onChange={(e) => setPhones((arr) => arr.map((x, j) => j === i ? { ...x, telefono: e.target.value } : x))} className={inputClass} placeholder="Ej: 2614123456" />
                      </div>
                      <div>
                        <Label>Tipo de teléfono</Label>
                        <Select key={`tp-${i}-${p.tipoTelefono}`} options={TIPO_TELEFONO_OPTS} defaultValue={p.tipoTelefono} onChange={(v) => setPhones((arr) => arr.map((x, j) => j === i ? { ...x, tipoTelefono: v } : x))} />
                      </div>
                      <div>
                        <Label>Tipo de contacto</Label>
                        <Select key={`tc-${i}-${p.tipoContacto}`} options={TIPO_CONTACTO_OPTS} defaultValue={p.tipoContacto} onChange={(v) => setPhones((arr) => arr.map((x, j) => j === i ? { ...x, tipoContacto: v } : x))} />
                      </div>
                      <div>
                        <Label>Observación</Label>
                        <input type="text" value={p.observacion} onChange={(e) => setPhones((arr) => arr.map((x, j) => j === i ? { ...x, observacion: e.target.value } : x))} className={inputClass} placeholder="Opcional" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button onClick={() => removePhone(i)} className="text-xs text-error-500 hover:underline">Eliminar</button>
                    </div>
                  </div>
                ))}
                {phones.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500">Sin teléfonos registrados.</p>}
              </div>
            </section>

            {/* ── Correos de contacto ── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Correos de contacto</h5>
                <Button size="sm" variant="outline" onClick={addEmail}>+ Agregar</Button>
              </div>
              <div className="space-y-4">
                {emails.map((e, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      <div>
                        <Label>Email</Label>
                        <input type="email" value={e.email} onChange={(ev) => setEmails((arr) => arr.map((x, j) => j === i ? { ...x, email: ev.target.value } : x))} className={inputClass} placeholder="correo@ejemplo.com" />
                      </div>
                      <div>
                        <Label>Tipo de contacto</Label>
                        <Select key={`ec-${i}-${e.tipoContacto}`} options={TIPO_CONTACTO_OPTS} defaultValue={e.tipoContacto} onChange={(v) => setEmails((arr) => arr.map((x, j) => j === i ? { ...x, tipoContacto: v } : x))} />
                      </div>
                      <div className="lg:col-span-2">
                        <Label>Observación</Label>
                        <input type="text" value={e.observacion} onChange={(ev) => setEmails((arr) => arr.map((x, j) => j === i ? { ...x, observacion: ev.target.value } : x))} className={inputClass} placeholder="Opcional" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button onClick={() => removeEmail(i)} className="text-xs text-error-500 hover:underline">Eliminar</button>
                    </div>
                  </div>
                ))}
                {emails.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500">Sin correos de contacto registrados.</p>}
              </div>
            </section>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── DireccionModal (nested, outside the edit modal scroll) ── */}
      <DireccionModal
        isOpen={dirModalOpen}
        onClose={() => setDirModalOpen(false)}
        localidadOptions={localidadOpts}
        onCreated={(nueva) => {
          setDirecciones((d) => [...d, nueva]);
          setSelectedDirId(nueva.id);
          setDirError(false);
          setDirModalOpen(false);
        }}
      />
    </div>
  );
}
