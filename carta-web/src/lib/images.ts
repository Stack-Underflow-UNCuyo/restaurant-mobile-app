import { API_BASE_URL, DEFAULT_HERO_IMAGE } from "@/lib/constants";
import type { Categoria } from "@/types/entities";

const IMAGE_BY_CATEGORIA: Record<string, string> = {
  Entradas: "/images/entradas.svg",
  "Platos Principales": "/images/platos-principales.svg",
  "Pastas y Pizzas": "/images/pastas-pizzas.svg",
  Postres: "/images/postres.svg",
  Bebidas: "/images/bebidas.svg",
  Combos: "/images/combos.svg",
};

// Respaldo cuando una sección o plato no tiene imagen propia: se usa un
// placeholder según su categoría.
export function imageForCategoria(categoria?: Categoria): string {
  if (!categoria) return DEFAULT_HERO_IMAGE;
  return IMAGE_BY_CATEGORIA[categoria.nombre] ?? DEFAULT_HERO_IMAGE;
}

// El backend devuelve la imagen como una ruta relativa servida por su propio
// servidor de recursos estáticos (ver WebConfig) — hay que resolverla contra
// la URL base de la API.
export function resolveImagenUrl(imagenUrl?: string): string | undefined {
  if (!imagenUrl) return undefined;
  return /^https?:\/\//.test(imagenUrl) ? imagenUrl : `${API_BASE_URL}${imagenUrl}`;
}

// Imagen a mostrar para un plato o combo: la propia si fue cargada, y si no
// el placeholder de su categoría.
export function imageForItem(imagenUrl: string | undefined, categoria?: Categoria): string {
  return resolveImagenUrl(imagenUrl) ?? imageForCategoria(categoria);
}
