// La API expone imágenes propias para Menu, SeccionCarta y los detalles de
// sección (DetalleSeccionCartaMenu/ArticuloIndividual.imagenUrl), pero no
// para Carta/Articulo ni para el logo de la Empresa — esas rutas siguen
// usando estos placeholders ilustrativos servidos desde public/images.
export const RESTAURANT_LOGO = "/images/logo.svg";
export const DEFAULT_HERO_IMAGE = "/images/default-hero.svg";

// Las imágenes subidas se guardan en el backend y se sirven como rutas
// relativas (p. ej. "/images/<archivo>") — hay que anteponer la URL base de
// la API para poder mostrarlas.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";
