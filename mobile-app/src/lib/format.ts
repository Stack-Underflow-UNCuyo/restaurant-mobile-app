/** Formatea "2024-01-15T15:31:00" como "15:31". */
export function formatHora(fechaIso: string): string {
  const hora = fechaIso.slice(11, 16);
  return hora || "--:--";
}

/** Formato de moneda compartido por las pantallas de la carta (espejo de carta-web/src/lib/format.ts). */
const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatPrice(precio: number): string {
  return currencyFormatter.format(precio);
}
