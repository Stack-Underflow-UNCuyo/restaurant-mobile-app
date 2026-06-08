export const APP_NAME = "Aromas de Viña";
export const APP_DESCRIPTION = "Sistema de gestión para restaurant";

// El backend devuelve las imágenes (Imagen.url) como rutas relativas servidas
// como recursos estáticos — hay que anteponer la URL base de la API para mostrarlas.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";
