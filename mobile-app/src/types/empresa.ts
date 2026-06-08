/**
 * Tipo de la empresa, espejo de EmpresaDto del backend.
 * Solo se usa el nombre para el encabezado de la home — el resto de los
 * campos (dirección, contactos) no se muestran en la app móvil.
 */
export interface Empresa {
  id: string;
  nombre: string;
}
