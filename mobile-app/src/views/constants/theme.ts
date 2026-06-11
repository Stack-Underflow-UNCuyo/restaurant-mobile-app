/**
 * Tema de la app, alineado con el dashboard (TailAdmin) definido en
 * dashboard/src/app/globals.css: color de marca bordó (#8b1a3a), escala de
 * grises de Tailwind y tipografía Outfit.
 */

import "@/views/global.css";

import { Platform } from "react-native";

/** Paleta de marca (brand-*) del dashboard. */
export const Brand = {
  25: "#fdf5f7",
  50: "#f9e8ed",
  100: "#f2ccd6",
  200: "#e699b0",
  300: "#d4668a",
  400: "#b73663",
  500: "#8b1a3a",
  600: "#741530",
  700: "#5c1125",
  800: "#450d1c",
  900: "#320914",
  950: "#1f050c",
} as const;

/** Escala de grises del dashboard. */
export const Gray = {
  25: "#fcfcfd",
  50: "#f9fafb",
  100: "#f2f4f7",
  200: "#e4e7ec",
  300: "#d0d5dd",
  400: "#98a2b3",
  500: "#667085",
  600: "#475467",
  700: "#344054",
  800: "#1d2939",
  900: "#101828",
  950: "#0c111d",
  dark: "#1a2231",
} as const;

/** Paletas de feedback del dashboard (para badges: fondo suave + texto fuerte). */
export const Success = { 50: "#ecfdf3", 500: "#12b76a", 600: "#039855" } as const;
export const Warning = { 50: "#fffaeb", 500: "#f79009", 600: "#dc6803" } as const;
export const Error = { 50: "#fef3f2", 500: "#f04438", 600: "#d92d20" } as const;
export const Info = { 50: "#eff8ff", 500: "#2e90fa", 600: "#1570ef" } as const;

export const Colors = {
  light: {
    text: Gray[900],
    textSecondary: Gray[500],
    background: Gray[50],
    surface: "#ffffff",
    backgroundElement: Gray[100],
    backgroundSelected: Gray[200],
    border: Gray[200],
    brand: Brand[500],
    brandHover: Brand[600],
    brandText: "#ffffff",
    error: "#f04438",
    success: "#12b76a",
  },
  dark: {
    text: "#ffffff",
    textSecondary: Gray[400],
    background: Gray[900],
    surface: Gray.dark,
    backgroundElement: Gray[800],
    backgroundSelected: Gray[700],
    border: Gray[800],
    brand: Brand[500],
    brandHover: Brand[600],
    brandText: "#ffffff",
    error: "#f97066",
    success: "#32d583",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Familias de la fuente Outfit (una por peso, como exige React Native).
 * Se cargan en el layout raíz con useFonts. El fallback aplica antes de
 * que terminen de cargar o en plataformas sin la fuente.
 */
export const Fonts = {
  regular: "Outfit_400Regular",
  medium: "Outfit_500Medium",
  semibold: "Outfit_600SemiBold",
  bold: "Outfit_700Bold",
  mono: Platform.select({ ios: "ui-monospace", default: "monospace" }) as string,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 6,
  md: 9,
  lg: 12,
  full: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
