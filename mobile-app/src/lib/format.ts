/** Formato de moneda compartido por las pantallas de la carta (espejo de carta-web/src/lib/format.ts). */
const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatPrice(precio: number): string {
  return currencyFormatter.format(precio);
}
