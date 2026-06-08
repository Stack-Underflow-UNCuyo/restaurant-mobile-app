/**
 * El backend sirve las imágenes propias de Menu/SeccionCarta/Detalle como
 * rutas relativas (p. ej. "/images/<archivo>") — hay que anteponer la URL
 * base de la API para poder mostrarlas (espejo de resolveImagenUrl en
 * carta-web/src/lib/images.ts).
 */
import { API_URL } from "@/constants/config";

export function resolveImagenUrl(imagenUrl?: string): string | undefined {
  if (!imagenUrl) return undefined;
  return /^https?:\/\//.test(imagenUrl) ? imagenUrl : `${API_URL}${imagenUrl}`;
}
