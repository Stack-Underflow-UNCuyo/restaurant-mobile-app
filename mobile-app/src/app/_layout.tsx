import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts,
} from "@expo-google-fonts/outfit";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";

import { Brand } from "@/constants/theme";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

export const unstable_settings = {
  anchor: "index",
};

/**
 * Redirige según el estado de sesión:
 *  - sin sesión  -> /login
 *  - mozo        -> /(mozo)
 *  - cocinero    -> /(cocinero)
 */
function AuthGate() {
  const { user, loading } = useAuth();
  const theme = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const group = segments[0]; // "login" | "(mozo)" | "(cocinero)" | undefined

    if (!user) {
      if (group !== "login") router.replace("/login");
      return;
    }

    const home = user.tipoEmpleado === "MOZO" ? "/(mozo)" : "/(cocinero)";
    const inOwnArea =
      (user.tipoEmpleado === "MOZO" && group === "(mozo)") ||
      (user.tipoEmpleado === "COCINERO" && group === "(cocinero)");

    if (!inOwnArea) router.replace(home);
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.brand} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="(mozo)" />
      <Stack.Screen name="(cocinero)" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  // Mantenemos el splash mientras carga la fuente para evitar un parpadeo de tipografía.
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: Brand[500] }} />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthGate />
        <StatusBar style="auto" />
      </AuthProvider>
      <Toast />
    </ThemeProvider>
  );
}
