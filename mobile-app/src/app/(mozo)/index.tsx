import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import { getEmpresaActiva } from "@/services/empresaService";

const logo = require("../../../assets/images/logo.png");
const NOMBRE_POR_DEFECTO = "Aromas de Viña";

const ACCESOS: { label: string; href?: "/(mozo)/mesas" | "/(mozo)/comandas" }[] = [
  { label: "Ver Mesas", href: "/(mozo)/mesas" },
  { label: "Estados Comanda", href: "/(mozo)/comandas" },
  { label: "Ver Cartas" },
];

/** Landing del mozo: nombre y logo del local, con accesos a sus pantallas. */
export default function MozoHome() {
  const router = useRouter();
  const theme = useTheme();
  const { logout } = useAuth();
  const [nombreEmpresa, setNombreEmpresa] = useState(NOMBRE_POR_DEFECTO);

  useEffect(() => {
    let activo = true;
    getEmpresaActiva()
      .then((empresa) => {
        if (activo && empresa.nombre) setNombreEmpresa(empresa.nombre);
      })
      .catch(() => {
        // Sin conexión o backend caído: nos quedamos con el nombre por defecto.
      });
    return () => {
      activo = false;
    };
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right", "bottom"]}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable
            onPress={logout}
            hitSlop={8}
            style={({ pressed }) => [
              styles.logout,
              { borderColor: theme.border, opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <ThemedText type="smallBold" themeColor="textSecondary">
              Salir
            </ThemedText>
          </Pressable>

          <View style={styles.hero}>
            <ThemedText type="subtitle" style={styles.centerText}>
              {nombreEmpresa}
            </ThemedText>
            <Image
              source={logo}
              style={styles.logo}
              contentFit="contain"
              accessibilityLabel={`${nombreEmpresa} — logo`}
            />
          </View>

          <View style={styles.accesos}>
            {ACCESOS.map((acceso) => (
              <Pressable
                key={acceso.label}
                disabled={!acceso.href}
                onPress={() => acceso.href && router.push(acceso.href)}
                style={({ pressed }) => [
                  styles.acceso,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                  acceso.href && pressed ? { opacity: 0.7 } : null,
                ]}
              >
                <ThemedText type="smallBold">{acceso.label}</ThemedText>
                {acceso.href ? (
                  <ThemedText themeColor="textSecondary">›</ThemedText>
                ) : (
                  <ThemedText type="small" themeColor="textSecondary">
                    Próximamente
                  </ThemedText>
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
    gap: Spacing.five,
  },
  logout: {
    alignSelf: "flex-end",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  hero: { alignItems: "center", gap: Spacing.three, marginTop: Spacing.three },
  centerText: { textAlign: "center" },
  logo: { width: 132, height: 140 },
  accesos: { gap: Spacing.three },
  acceso: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
});
