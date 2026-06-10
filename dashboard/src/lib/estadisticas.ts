import { EstadoFactura, type Factura } from "@/types/factura";
import { TipoPago } from "@/types/formaDePago";
import type { Resenia } from "@/types/resenia";

/** Solo las facturas efectivamente cobradas cuentan para ingresos/estadísticas. */
function pagadas(facturas: Factura[]): Factura[] {
  return facturas.filter((f) => f.estado === EstadoFactura.PAGADA);
}

export interface ResumenEstadisticas {
  totalFacturado: number;
  cantFacturas: number;
  ticketPromedio: number;
  cantResenias: number;
}

export function resumen(facturas: Factura[], resenias: Resenia[]): ResumenEstadisticas {
  const cobradas = pagadas(facturas);
  const totalFacturado = cobradas.reduce((acc, f) => acc + (f.totalPagado ?? 0), 0);
  const cantFacturas = cobradas.length;
  return {
    totalFacturado,
    cantFacturas,
    ticketPromedio: cantFacturas > 0 ? totalFacturado / cantFacturas : 0,
    cantResenias: resenias.length,
  };
}

/** Suma de `totalPagado` (facturas PAGADAS) por mes (índice 0 = enero) del año dado. */
export function ingresosPorMes(facturas: Factura[], anio: number): number[] {
  const meses = new Array<number>(12).fill(0);
  for (const f of pagadas(facturas)) {
    if (!f.fechaFactura) continue;
    // fechaFactura llega como "YYYY-MM-DD".
    const [y, m] = f.fechaFactura.split("-");
    if (Number(y) !== anio) continue;
    const idx = Number(m) - 1;
    if (idx >= 0 && idx < 12) meses[idx] += f.totalPagado ?? 0;
  }
  return meses;
}

export interface PromediosResenia {
  ambiente: number;
  servicio: number;
  comida: number;
  general: number;
}

export function promediosResenia(resenias: Resenia[]): PromediosResenia {
  if (resenias.length === 0) {
    return { ambiente: 0, servicio: 0, comida: 0, general: 0 };
  }
  const prom = (sel: (r: Resenia) => number) =>
    resenias.reduce((acc, r) => acc + (sel(r) ?? 0), 0) / resenias.length;
  const ambiente = prom((r) => r.ambiente);
  const servicio = prom((r) => r.servicio);
  const comida = prom((r) => r.comida);
  return { ambiente, servicio, comida, general: (ambiente + servicio + comida) / 3 };
}

export type ConteoPorTipoPago = Record<TipoPago, number>;

/** Conteo de facturas PAGADAS por tipo de pago. */
export function facturasPorTipoPago(facturas: Factura[]): ConteoPorTipoPago {
  const conteo: ConteoPorTipoPago = {
    [TipoPago.EFECTIVO]: 0,
    [TipoPago.TRANSFERENCIA]: 0,
    [TipoPago.BILLETERA_VIRTUAL]: 0,
  };
  for (const f of pagadas(facturas)) {
    const tipo = f.formaDePago?.tipoPago;
    if (tipo && tipo in conteo) conteo[tipo] += 1;
  }
  return conteo;
}
