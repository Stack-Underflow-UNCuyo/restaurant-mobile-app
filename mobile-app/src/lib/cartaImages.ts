/**
 * El backend sirve las imágenes propias de Menu/SeccionCarta/Detalle como
 * rutas relativas (p. ej. "/images/<archivo>") — hay que anteponer la URL
 * base de la API para poder mostrarlas (espejo de resolveImagenUrl en
 * carta-web/src/lib/images.ts).
 */
import { API_URL } from "@/constants/config";
import type { Categoria } from "@/types/carta";

export function resolveImagenUrl(imagenUrl?: string): string | undefined {
  if (!imagenUrl) return undefined;
  return /^https?:\/\//.test(imagenUrl) ? imagenUrl : `${API_URL}${imagenUrl}`;
}

// Placeholders locales por categoría (PNG convertidos desde los SVGs de carta-web).
const IMAGE_BY_CATEGORIA: Record<string, ReturnType<typeof require>> = {
  Entradas: require("../../assets/images/placeholders/entradas.png"),
  "Platos Principales": require("../../assets/images/placeholders/platos-principales.png"),
  "Pastas y Pizzas": require("../../assets/images/placeholders/pastas-pizzas.png"),
  Postres: require("../../assets/images/placeholders/postres.png"),
  Bebidas: require("../../assets/images/placeholders/bebidas.png"),
  Combos: require("../../assets/images/placeholders/combos.png"),
};

const DEFAULT_PLACEHOLDER = require("../../assets/images/placeholders/default-hero.png");

export function imageForCategoria(
  categoria?: Categoria,
): ReturnType<typeof require> {
  if (!categoria) return DEFAULT_PLACEHOLDER;
  return IMAGE_BY_CATEGORIA[categoria.nombre] ?? DEFAULT_PLACEHOLDER;
}
