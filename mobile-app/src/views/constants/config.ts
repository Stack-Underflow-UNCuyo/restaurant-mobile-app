/**
 * Configuración de entorno de la app.
 *
 * La URL del backend se toma de la variable EXPO_PUBLIC_API_URL (ver .env).
 * Notas para conectarse al backend Spring (corre en http://localhost:8081):
 *  - Emulador Android: usar http://10.0.2.2:8081 (10.0.2.2 = localhost del host)
 *  - Dispositivo físico (Expo Go): usar la IP LAN de tu PC, ej http://192.168.0.10:8081
 *  - Web / iOS simulator: http://localhost:8081 funciona
 */
const DEFAULT_API_URL = "http://localhost:8081";

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL;
