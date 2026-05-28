"use client";
import React from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { PlusIcon, TrashBinIcon } from "@/icons/index";
import { TipoContacto, TipoTelefono } from "@/types/contactos";

export type TelefonoRow = {
    telefono: string;
    tipoTelefono: string;
    tipoContacto: string;
    observacion: string;
};

type Errors = Record<string, boolean>;

const tipoTelefonoOptions = [
    { value: TipoTelefono.FIJO,    label: "Fijo"    },
    { value: TipoTelefono.CELULAR, label: "Celular" },
];
const tipoContactoOptions = [
    { value: TipoContacto.PERSONAL, label: "Personal" },
    { value: TipoContacto.LABORAL,  label: "Laboral"  },
    { value: TipoContacto.EMPRESA,  label: "Empresa"  },
];

function FieldError({ msg }: { msg: string }) {
    return <p className="mt-1.5 text-xs text-error-500">{msg}</p>;
}

interface TelefonoSectionProps {
    rows: TelefonoRow[];
    errors: Errors[];
    onAdd: () => void;
    onRemove: (i: number) => void;
    onUpdate: (i: number, field: keyof TelefonoRow, value: string) => void;
    /** Minimum number of rows — the remove button hides when rows.length <= minRows. Default: 0 */
    minRows?: number;
    idPrefix?: string;
}

export default function TelefonoSection({
    rows,
    errors,
    onAdd,
    onRemove,
    onUpdate,
    minRows = 0,
    idPrefix = "tel",
}: TelefonoSectionProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    Contactos Telefónicos
                </h3>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 transition-colors"
                >
                    <PlusIcon />
                    Agregar teléfono
                </button>
            </div>

            <div className="px-5 py-4">
                {rows.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        Sin teléfonos. Hacé clic en &ldquo;Agregar teléfono&rdquo; para añadir.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {rows.map((t, i) => (
                            <div
                                key={i}
                                className="rounded-lg border border-gray-100 dark:border-white/[0.05] p-4 relative"
                            >
                                {rows.length > minRows && (
                                    <button
                                        type="button"
                                        onClick={() => onRemove(i)}
                                        className="absolute top-3 right-3 text-gray-300 hover:text-error-500 transition-colors"
                                    >
                                        <TrashBinIcon />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor={`${idPrefix}-num-${i}`}>Teléfono</Label>
                                        <Input
                                            id={`${idPrefix}-num-${i}`}
                                            placeholder="Ej: 2614123456"
                                            defaultValue={t.telefono}
                                            error={errors[i]?.telefono}
                                            hint={errors[i]?.telefono ? "El teléfono es obligatorio" : ""}
                                            onChange={(e) => onUpdate(i, "telefono", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Tipo de Teléfono</Label>
                                        <Select
                                            options={tipoTelefonoOptions}
                                            placeholder="Seleccionar tipo"
                                            defaultValue={t.tipoTelefono}
                                            onChange={(v) => onUpdate(i, "tipoTelefono", v)}
                                        />
                                        {errors[i]?.tipoTelefono && (
                                            <FieldError msg="Debe seleccionar el tipo de teléfono" />
                                        )}
                                    </div>
                                    <div>
                                        <Label>Tipo de Contacto</Label>
                                        <Select
                                            options={tipoContactoOptions}
                                            placeholder="Seleccionar tipo"
                                            defaultValue={t.tipoContacto}
                                            onChange={(v) => onUpdate(i, "tipoContacto", v)}
                                        />
                                        {errors[i]?.tipoContacto && (
                                            <FieldError msg="Debe seleccionar el tipo de contacto" />
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor={`${idPrefix}-obs-${i}`}>Observación (Opcional)</Label>
                                        <Input
                                            id={`${idPrefix}-obs-${i}`}
                                            placeholder="Ej: Horario laboral"
                                            defaultValue={t.observacion}
                                            onChange={(e) => onUpdate(i, "observacion", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
