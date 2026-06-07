import { DEFAULT_HERO_IMAGE } from "@/lib/constants";
import type { Categoria } from "@/types/entities";

const IMAGE_BY_CATEGORIA: Record<string, string> = {
  Entradas: "/images/entradas.svg",
  "Platos Principales": "/images/platos-principales.svg",
  "Pastas y Pizzas": "/images/pastas-pizzas.svg",
  Postres: "/images/postres.svg",
  Bebidas: "/images/bebidas.svg",
  Combos: "/images/combos.svg",
};

// Ni Articulo ni Menu exponen una imagen propia (ver ArticuloDto/MenuDto), así
// que toda imagen de plato, combo o sección usa este mismo mapeo por categoría.
export function imageForCategoria(categoria?: Categoria): string {
  if (!categoria) return DEFAULT_HERO_IMAGE;
  return IMAGE_BY_CATEGORIA[categoria.nombre] ?? DEFAULT_HERO_IMAGE;
}
