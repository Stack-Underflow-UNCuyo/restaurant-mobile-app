/**
 * Almacenamiento del JWT. Usa expo-secure-store en dispositivos (cifrado por el
 * sistema) y localStorage en web, donde SecureStore no está disponible.
 */
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY = "auth-token";

export async function saveToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(KEY, token);
    return;
  }
  await SecureStore.setItemAsync(KEY, token);
}

export async function getToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return globalThis.localStorage?.getItem(KEY) ?? null;
  }
  return SecureStore.getItemAsync(KEY);
}

export async function clearToken(): Promise<void> {
  if (Platform.OS === "web") {
    globalThis.localStorage?.removeItem(KEY);
    return;
  }
  await SecureStore.deleteItemAsync(KEY);
}
