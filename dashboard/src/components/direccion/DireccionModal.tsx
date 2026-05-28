"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { direccionService } from "@/services/direccionService";
import toast from "react-hot-toast";
import type { Direccion } from "@/types/entities";

type DireccionFormData = {
    calle: string;
    numeracion: string;
    barrio: string;
    localidadId: string;
    observacion: string;
};

type Errors = Record<string, boolean>;

const emptyForm = (): DireccionFormData => ({
    calle: "", numeracion: "", barrio: "", localidadId: "", observacion: "",
});

function FieldError({ msg }: { msg: string }) {
    return <p className="mt-1.5 text-xs text-error-500">{msg}</p>;
}

interface DireccionModalProps {
    isOpen: boolean;
    onClose: () => void;
    localidadOptions: { value: string; label: string }[];
    /** Called with the newly created Direccion so the parent can add it to its select list. */
    onCreated: (direccion: Direccion) => void;
}

export default function DireccionModal({
    isOpen,
    onClose,
    localidadOptions,
    onCreated,
}: DireccionModalProps) {
    const [form, setForm]     = useState<DireccionFormData>(emptyForm);
    const [errors, setErrors] = useState<Errors>({});
    const [saving, setSaving] = useState(false);

    const resetAndClose = () => {
        setForm(emptyForm());
        setErrors({});
        onClose();
    };

    const handleSubmit = async () => {
        const newErrors: Errors = {
            calle:       !form.calle.trim(),
            numeracion:  !form.numeracion.trim(),
            barrio:      !form.barrio.trim(),
            localidadId: !form.localidadId,
        };
        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            return;
        }
        setSaving(true);
        try {
            const nueva = await direccionService.create({
                calle:       form.calle.trim(),
                numeracion:  form.numeracion.trim(),
                barrio:      form.barrio.trim(),
                localidadId: form.localidadId,
                observacion: form.observacion.trim() || undefined,
            });
            onCreated(nueva);
            resetAndClose();
            toast.success("Dirección creada");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al crear la dirección");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={resetAndClose} className="max-w-md p-6">
            <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
                Nueva Dirección
            </h4>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="nd-calle">Calle</Label>
                    <Input
                        id="nd-calle"
                        placeholder="Ej: Av. San Martín"
                        defaultValue={form.calle}
                        error={errors.calle}
                        hint={errors.calle ? "La calle es obligatoria" : ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setForm((p) => ({ ...p, calle: e.target.value }));
                            if (errors.calle) setErrors((p) => ({ ...p, calle: false }));
                        }}
                    />
                </div>
                <div>
                    <Label htmlFor="nd-num">Numeración</Label>
                    <Input
                        id="nd-num"
                        placeholder="Ej: 1234"
                        defaultValue={form.numeracion}
                        error={errors.numeracion}
                        hint={errors.numeracion ? "La numeración es obligatoria" : ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setForm((p) => ({ ...p, numeracion: e.target.value }));
                            if (errors.numeracion) setErrors((p) => ({ ...p, numeracion: false }));
                        }}
                    />
                </div>
                <div>
                    <Label htmlFor="nd-barrio">Barrio</Label>
                    <Input
                        id="nd-barrio"
                        placeholder="Ej: Centro"
                        defaultValue={form.barrio}
                        error={errors.barrio}
                        hint={errors.barrio ? "El barrio es obligatorio" : ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setForm((p) => ({ ...p, barrio: e.target.value }));
                            if (errors.barrio) setErrors((p) => ({ ...p, barrio: false }));
                        }}
                    />
                </div>
                <div>
                    <Label>Localidad</Label>
                    <Select
                        options={localidadOptions}
                        placeholder="Seleccionar localidad"
                        defaultValue={form.localidadId}
                        onChange={(v) => {
                            setForm((p) => ({ ...p, localidadId: v }));
                            if (errors.localidadId) setErrors((p) => ({ ...p, localidadId: false }));
                        }}
                    />
                    {errors.localidadId && <FieldError msg="Debe seleccionar una localidad" />}
                </div>
                <div>
                    <Label htmlFor="nd-obs">Observación (Opcional)</Label>
                    <Input
                        id="nd-obs"
                        placeholder="Ej: Esquina con calle Belgrano"
                        defaultValue={form.observacion}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setForm((p) => ({ ...p, observacion: e.target.value }))
                        }
                    />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" size="sm" onClick={resetAndClose} disabled={saving}>
                        Cancelar
                    </Button>
                    <Button size="sm" onClick={handleSubmit} disabled={saving}>
                        {saving ? "Guardando…" : "Crear Dirección"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
