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
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons/index";
import DeletionConfirmationPopUp from "@/components/ui/DeletionConfirmationPopUp";
import Spinner from "@/components/ui/Spinner";
import { EstadoFactura } from "@/types/factura";
import type { Factura, DetalleFactura } from "@/types/factura";
import { facturaService } from "@/services/facturaService";
import type { FacturaPayload, FacturaPreview } from "@/services/facturaService";
import { detalleFacturaService } from "@/services/detalleFacturaService";
import { formaDePagoService } from "@/services/formaDePagoService";
import { promocionService } from "@/services/promocionService";
import { comandaService } from "@/services/comandaService";
import toast from "react-hot-toast";

const estadoOptions = [
    { value: EstadoFactura.PAGADA, label: "Pagada" },
    { value: EstadoFactura.ANULADA, label: "Anulada" },
    { value: EstadoFactura.SIN_DEFINIR, label: "Sin definir" },
];

const estadoLabels: Record<EstadoFactura, string> = {
    [EstadoFactura.PAGADA]: "Pagada",
    [EstadoFactura.ANULADA]: "Anulada",
    [EstadoFactura.SIN_DEFINIR]: "Sin definir",
};

const hoy = () => new Date().toISOString().slice(0, 10);

// --- Formulario de edición (solo cabecera; los detalles se preservan) ---
type EditFormData = {
    fechaFactura: string;
    estado: EstadoFactura | "";
    formaDePagoId: string;
    promocionId: string;
};

const emptyEdit: EditFormData = { fechaFactura: "", estado: "", formaDePagoId: "", promocionId: "" };

type Promo = { id: string; porcentajeDescuento: number; descripcion?: string };

export default function FacturaTable() {
    const [items, setItems] = useState<Factura[]>([]);
    const [detalles, setDetalles] = useState<DetalleFactura[]>([]);
    const [formaDePagoOptions, setFormaDePagoOptions] = useState<{ value: string; label: string }[]>([]);
    const [promociones, setPromociones] = useState<Promo[]>([]);
    const [comandaOptions, setComandaOptions] = useState<{ value: string; label: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    // edición
    const [editData, setEditData] = useState<EditFormData>(emptyEdit);
    const [editErrors, setEditErrors] = useState({ estado: false, formaDePagoId: false, fechaFactura: false });

    // generación desde comanda
    const [genComandaId, setGenComandaId] = useState("");
    const [genPreview, setGenPreview] = useState<FacturaPreview | null>(null);
    const [genLoadingPreview, setGenLoadingPreview] = useState(false);
    const [genFormaDePagoId, setGenFormaDePagoId] = useState("");
    const [genPromocionId, setGenPromocionId] = useState("");
    const [genFecha, setGenFecha] = useState(hoy());
    const [genEstado, setGenEstado] = useState<EstadoFactura>(EstadoFactura.PAGADA);
    const [genErrors, setGenErrors] = useState({ comanda: false, formaDePago: false, fecha: false });

    const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
    const { isOpen: isGenOpen, openModal: openGenModal, closeModal: closeGenModal } = useModal();
    const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

    const promocionOptions = promociones.map((p) => ({
        value: String(p.id),
        label: p.descripcion || `${p.porcentajeDescuento}%`,
    }));

    useEffect(() => {
        Promise.all([
            facturaService.getAll(),
            detalleFacturaService.getAll(),
            formaDePagoService.getAll(),
            promocionService.getAll(),
            comandaService.getAll(),
        ])
            .then(([facturas, detallesFactura, formasDePago, promos, comandas]) => {
                setItems(facturas);
                setDetalles(detallesFactura);
                setFormaDePagoOptions(formasDePago.map((f) => ({ value: String(f.id), label: f.tipoPago })));
                setPromociones(promos.map((p) => ({ id: String(p.id), porcentajeDescuento: p.porcentajeDescuento, descripcion: p.descripcion })));
                setComandaOptions(comandas.map((c) => ({
                    value: String(c.id),
                    label: `Comanda ${String(c.id).slice(0, 8)} (${c.estadoComanda})`,
                })));
            })
            .catch(() => toast.error("Error al cargar las facturas"))
            .finally(() => setLoading(false));
    }, []);

    const refresh = async () => {
        const [facturas, detallesFactura] = await Promise.all([
            facturaService.getAll(),
            detalleFacturaService.getAll(),
        ]);
        setItems(facturas);
        setDetalles(detallesFactura);
    };

    // ---- Generar desde comanda ----
    const openGenerar = () => {
        setGenComandaId("");
        setGenPreview(null);
        setGenFormaDePagoId("");
        setGenPromocionId("");
        setGenFecha(hoy());
        setGenEstado(EstadoFactura.PAGADA);
        setGenErrors({ comanda: false, formaDePago: false, fecha: false });
        openGenModal();
    };

    const handleGenComandaChange = async (comandaId: string) => {
        setGenComandaId(comandaId);
        setGenErrors((p) => ({ ...p, comanda: false }));
        setGenPreview(null);
        if (!comandaId) return;
        setGenLoadingPreview(true);
        try {
            const preview = await facturaService.previewDesdeComanda(comandaId);
            setGenPreview(preview);
        } catch {
            toast.error("Error al calcular el preview de la comanda");
        } finally {
            setGenLoadingPreview(false);
        }
    };

    const genSubtotal = genPreview?.subtotalGeneral ?? 0;
    const genPorcentaje = promociones.find((p) => p.id === genPromocionId)?.porcentajeDescuento ?? 0;
    const genDescuento = genSubtotal * genPorcentaje / 100;
    const genTotal = genSubtotal - genDescuento;

    const handleGenerar = async () => {
        const newErrors = {
            comanda: genComandaId === "",
            formaDePago: genFormaDePagoId === "",
            fecha: !genFecha,
        };
        if (Object.values(newErrors).some(Boolean)) {
            setGenErrors(newErrors);
            return;
        }
        if (!genPreview || genPreview.lineas.length === 0) {
            toast.error("La comanda no tiene ítems para facturar");
            return;
        }
        if (genPreview.yaFacturada) {
            toast.error("La comanda ya tiene una factura");
            return;
        }
        setSaving(true);
        try {
            await facturaService.generarDesdeComanda({
                comandaId: genComandaId,
                formaDePagoId: genFormaDePagoId,
                fechaFactura: genFecha,
                estado: genEstado,
                ...(genPromocionId ? { promocionId: genPromocionId } : {}),
            });
            await refresh();
            closeGenModal();
            toast.success("Factura generada");
        } catch {
            toast.error("No se pudo generar la factura (¿la comanda ya está facturada?)");
        } finally {
            setSaving(false);
        }
    };

    // ---- Editar (cabecera) ----
    const openEdit = (item: Factura) => {
        setEditingId(item.id);
        setEditData({
            fechaFactura: item.fechaFactura ?? "",
            estado: item.estado ?? "",
            formaDePagoId: item.formaDePago ? String(item.formaDePago.id) : "",
            promocionId: item.promocion ? String(item.promocion.id) : "",
        });
        setEditErrors({ estado: false, formaDePagoId: false, fechaFactura: false });
        openEditModal();
    };

    const handleEdit = async () => {
        if (editingId === null) return;
        const newErrors = {
            estado: !editData.estado,
            formaDePagoId: !editData.formaDePagoId,
            fechaFactura: !editData.fechaFactura,
        };
        if (Object.values(newErrors).some(Boolean)) {
            setEditErrors(newErrors);
            return;
        }
        const factura = items.find((f) => f.id === editingId);
        // Preservamos número, total y los detalles ya asignados (el update reasigna detalles).
        const detalleIds = detalles.filter((d) => d.factura?.id === editingId).map((d) => d.id);
        setSaving(true);
        try {
            const payload: FacturaPayload = {
                numeroFactura: factura?.numeroFactura ?? 0,
                fechaFactura: editData.fechaFactura,
                totalPagado: factura?.totalPagado ?? 0,
                estado: editData.estado as EstadoFactura,
                formaDePagoId: editData.formaDePagoId,
                detalleFacturaIds: detalleIds,
                ...(editData.promocionId ? { promocionId: editData.promocionId } : {}),
            };
            await facturaService.update(editingId, payload);
            await refresh();
            closeEditModal();
            toast.success("Factura actualizada");
        } catch {
            toast.error("Error al actualizar la factura");
        } finally {
            setSaving(false);
        }
    };

    const requestDelete = (id: string) => {
        setPendingDeleteId(id);
        openConfirm();
    };

    const confirmDelete = async () => {
        if (pendingDeleteId === null) return;
        setDeleting(true);
        try {
            await facturaService.remove(pendingDeleteId);
            setItems((prev) => prev.filter((f) => f.id !== pendingDeleteId));
            closeConfirm();
            toast.success("Factura eliminada");
        } catch {
            toast.error("Error al eliminar la factura");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        Facturas
                    </h3>
                    <Button size="sm" onClick={openGenerar} startIcon={<PlusIcon />}>
                        Generar desde comanda
                    </Button>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">N° Factura</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Fecha</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Total pagado</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Estado</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Forma de pago</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Promoción</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Detalles</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Acciones</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="py-10 text-center">
                                        <div className="flex justify-center">
                                            <Spinner />
                                        </div>
                                    </td>
                                </tr>
                            ) : items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                                        {item.numeroFactura}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {item.fechaFactura || "-"}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                                        ${item.totalPagado}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {item.estado ? estadoLabels[item.estado] : "-"}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {item.formaDePago?.tipoPago ?? "-"}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {item.promocion?.descripcion ?? "-"}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {detalles.filter((d) => d.factura?.id === item.id).length}
                                    </TableCell>
                                    <TableCell className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => openEdit(item)}
                                                className="text-gray-400 hover:text-brand-500 transition-colors"
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
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <DeletionConfirmationPopUp
                isOpen={isConfirmOpen}
                onClose={closeConfirm}
                onConfirm={confirmDelete}
                isLoading={deleting}
                description="¿Estás seguro de que deseas eliminar esta factura? Esta acción no se puede deshacer."
            />

            {/* Modal: Generar desde comanda */}
            <Modal isOpen={isGenOpen} onClose={closeGenModal} className="max-w-2xl p-6">
                <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Generar factura desde comanda
                </h4>
                <div className="space-y-4">
                    <div>
                        <Label>Comanda</Label>
                        <Select
                            options={comandaOptions}
                            placeholder="Seleccionar comanda"
                            defaultValue={genComandaId}
                            onChange={handleGenComandaChange}
                        />
                        {genErrors.comanda && (
                            <p className="mt-1.5 text-xs text-error-500">Debe seleccionar una comanda</p>
                        )}
                    </div>

                    {/* Preview de ítems */}
                    {genLoadingPreview ? (
                        <div className="flex justify-center py-6"><Spinner /></div>
                    ) : genPreview && (
                        genPreview.yaFacturada ? (
                            <p className="rounded-lg bg-error-50 px-3 py-2 text-sm text-error-600 dark:bg-error-500/10">
                                Esta comanda ya tiene una factura generada.
                            </p>
                        ) : genPreview.lineas.length === 0 ? (
                            <p className="rounded-lg bg-warning-50 px-3 py-2 text-sm text-warning-700 dark:bg-warning-500/10">
                                La comanda no tiene ítems para facturar.
                            </p>
                        ) : (
                            <div className="rounded-lg border border-gray-200 dark:border-white/[0.05] overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 dark:bg-white/[0.03] text-gray-500 dark:text-gray-400">
                                        <tr>
                                            <th className="px-3 py-2 text-start font-medium">Ítem</th>
                                            <th className="px-3 py-2 text-end font-medium">Cant.</th>
                                            <th className="px-3 py-2 text-end font-medium">Precio</th>
                                            <th className="px-3 py-2 text-end font-medium">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {genPreview.lineas.map((l) => (
                                            <tr key={l.detalleComandaId}>
                                                <td className="px-3 py-2 text-gray-800 dark:text-white/90">{l.nombreItem}</td>
                                                <td className="px-3 py-2 text-end text-gray-600 dark:text-gray-300">{l.cantidad}</td>
                                                <td className="px-3 py-2 text-end text-gray-600 dark:text-gray-300">${l.precioUnitario}</td>
                                                <td className="px-3 py-2 text-end text-gray-800 dark:text-white/90">${l.subtotal}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 dark:bg-white/[0.03]">
                                        <tr>
                                            <td colSpan={3} className="px-3 py-1.5 text-end text-gray-500 dark:text-gray-400">Subtotal</td>
                                            <td className="px-3 py-1.5 text-end text-gray-800 dark:text-white/90">${genSubtotal.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className="px-3 py-1.5 text-end text-gray-500 dark:text-gray-400">Descuento ({genPorcentaje}%)</td>
                                            <td className="px-3 py-1.5 text-end text-error-500">-${genDescuento.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className="px-3 py-2 text-end font-semibold text-gray-800 dark:text-white/90">Total</td>
                                            <td className="px-3 py-2 text-end font-semibold text-gray-800 dark:text-white/90">${genTotal.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Forma de pago</Label>
                            <Select
                                options={formaDePagoOptions}
                                placeholder="Seleccionar forma de pago"
                                defaultValue={genFormaDePagoId}
                                onChange={(value) => {
                                    setGenFormaDePagoId(value);
                                    setGenErrors((p) => ({ ...p, formaDePago: false }));
                                }}
                            />
                            {genErrors.formaDePago && (
                                <p className="mt-1.5 text-xs text-error-500">Debe seleccionar una forma de pago</p>
                            )}
                        </div>
                        <div>
                            <Label>Promoción (opcional)</Label>
                            <Select
                                options={promocionOptions}
                                placeholder="Sin promoción"
                                defaultValue={genPromocionId}
                                onChange={setGenPromocionId}
                            />
                        </div>
                        <div>
                            <Label htmlFor="gen-fecha">Fecha</Label>
                            <Input
                                id="gen-fecha"
                                type="date"
                                defaultValue={genFecha}
                                error={genErrors.fecha}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setGenFecha(e.target.value);
                                    setGenErrors((p) => ({ ...p, fecha: false }));
                                }}
                            />
                        </div>
                        <div>
                            <Label>Estado</Label>
                            <Select
                                options={estadoOptions}
                                placeholder="Seleccionar estado"
                                defaultValue={genEstado}
                                onChange={(value) => setGenEstado(value as EstadoFactura)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" size="sm" onClick={closeGenModal} disabled={saving}>
                            Cancelar
                        </Button>
                        <Button size="sm" onClick={handleGenerar} disabled={saving}>
                            {saving ? "Generando…" : "Generar factura"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal: Editar cabecera de factura */}
            <Modal key={editingId ?? "edit"} isOpen={isEditOpen} onClose={closeEditModal} className="max-w-md p-6">
                <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Editar factura
                </h4>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="edit-fecha">Fecha</Label>
                        <Input
                            id="edit-fecha"
                            type="date"
                            defaultValue={editData.fechaFactura}
                            error={editErrors.fechaFactura}
                            hint={editErrors.fechaFactura ? "La fecha es obligatoria" : undefined}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setEditData((prev) => ({ ...prev, fechaFactura: e.target.value }));
                                if (editErrors.fechaFactura) setEditErrors((p) => ({ ...p, fechaFactura: false }));
                            }}
                        />
                    </div>
                    <div>
                        <Label>Estado</Label>
                        <Select
                            options={estadoOptions}
                            placeholder="Seleccionar estado"
                            defaultValue={editData.estado}
                            onChange={(value) => {
                                setEditData((prev) => ({ ...prev, estado: value as EstadoFactura }));
                                if (editErrors.estado) setEditErrors((p) => ({ ...p, estado: false }));
                            }}
                        />
                        {editErrors.estado && (
                            <p className="mt-1.5 text-xs text-error-500">Debe seleccionar un estado</p>
                        )}
                    </div>
                    <div>
                        <Label>Forma de pago</Label>
                        <Select
                            options={formaDePagoOptions}
                            placeholder="Seleccionar forma de pago"
                            defaultValue={editData.formaDePagoId}
                            onChange={(value) => {
                                setEditData((prev) => ({ ...prev, formaDePagoId: value }));
                                if (editErrors.formaDePagoId) setEditErrors((p) => ({ ...p, formaDePagoId: false }));
                            }}
                        />
                        {editErrors.formaDePagoId && (
                            <p className="mt-1.5 text-xs text-error-500">Debe seleccionar una forma de pago</p>
                        )}
                    </div>
                    <div>
                        <Label>Promoción (opcional)</Label>
                        <Select
                            options={promocionOptions}
                            placeholder="Sin promoción"
                            defaultValue={editData.promocionId}
                            onChange={(value) => setEditData((prev) => ({ ...prev, promocionId: value }))}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" size="sm" onClick={closeEditModal} disabled={saving}>
                            Cancelar
                        </Button>
                        <Button size="sm" onClick={handleEdit} disabled={saving}>
                            {saving ? "Guardando…" : "Guardar"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
