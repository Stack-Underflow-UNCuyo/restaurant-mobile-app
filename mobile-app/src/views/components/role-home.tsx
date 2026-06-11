import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/views/components/themed-text";
import { ThemedView } from "@/views/components/themed-view";
import { Brand, Radius, Spacing } from "@/views/constants/theme";
import { useAuth } from "@/controllers/context/AuthContext";
import { useTheme } from "@/controllers/hooks/use-theme";

/**
 * Pantalla de inicio compartida por mozos y cocineros (placeholder por ahora).
 * Muestra el saludo, el rol y permite cerrar sesión. Cada rol irá sumando
 * sus propias funcionalidades dentro de su grupo de rutas.
 */
export function RoleHome({ subtitle }: { subtitle: string }) {
  const { user, logout } = useAuth();
  const theme = useTheme();

  const nombre = user?.nombre?.trim() || user?.email || "";
  const rolLabel = user?.tipoEmpleado === "MOZO" ? "Mozo" : "Cocinero";

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.chip, { backgroundColor: Brand[50] }]}>
              <ThemedText type="smallBold" style={{ color: Brand[500] }}>
                {rolLabel}
              </ThemedText>
            </View>
            <ThemedText type="subtitle">Hola{nombre ? `, ${nombre}` : ""}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {subtitle}
            </ThemedText>
          </View>

          <Pressable
            onPress={logout}
            style={({ pressed }) => [
              styles.logout,
              { borderColor: theme.error, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <ThemedText type="smallBold" style={{ color: theme.error }}>
              Cerrar sesión
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  header: { gap: Spacing.two, marginTop: Spacing.five, alignItems: "flex-start" },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
    marginBottom: Spacing.one,
  },
  logout: {
    height: 50,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
