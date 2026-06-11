/**
 * Tipo de promoción, espejo de PromocionDto del backend.
 * El backend no maneja vigencia ni fechas: una promoción es solo un descuento
 * porcentual con una descripción, y se aplica por selección manual 
 */
export interface Promocion {
  id: string;
  porcentajeDescuento: number;
  descripcion: string;
}
