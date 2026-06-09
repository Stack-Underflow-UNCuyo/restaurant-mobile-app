import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Appearance, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TopBar } from "@/components/top-bar";
import { Gray, Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";
import { getEmpresaActiva } from "@/services/empresaService";

const logo = require("../../../assets/images/logo.png");
const NOMBRE_POR_DEFECTO = "Aromas de Viña";

const ACCESOS: { label: string; href?: "/(mozo)/mesas" | "/(mozo)/comandas" | "/(mozo)/carta" }[] = [
  { label: "Ver Mesas", href: "/(mozo)/mesas" },
  { label: "Estados Comanda", href: "/(mozo)/comandas" },
  { label: "Ver Cartas", href: "/(mozo)/carta" },
];

const TRACK_W = 56;
const TRACK_H = 30;
const KNOB = 24;
const PAD = 3;


function ThemeSlider({ isDark, onPress }: { isDark: boolean; onPress: () => void }) {
  const progress = useSharedValue(isDark ? 1 : 0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    progress.value = withSpring(isDark ? 1 : 0, { damping: 20, stiffness: 250 });
  }, [isDark]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [Gray[300], Gray[600]]),
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [TRACK_W - KNOB - PAD, PAD]) }],
  }));

  return (
    <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.knob, knobStyle]}>
          {isDark ? <Ionicons name="moon-outline" size={14} color={Gray[600]} /> : <Ionicons name="sunny-outline" size={14} color={Gray[500]} />}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

/** Landing del mozo: nombre y logo del local, con accesos a sus pantallas. */
export default function MozoHome() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const toggleTheme = () => Appearance.setColorScheme(isDark ? "light" : "dark");
  const nombreUsuario = user?.nombre?.trim() || user?.email || "";
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
        <TopBar title={nombreEmpresa} showGreeting={false} />
        <ScrollView contentContainerStyle={styles.content}>

          <View style={styles.hero}>
            <ThemedText type="subtitle" themeColor="textSecondary" style={styles.centerText}>
              {nombreUsuario ? `Hola, ${nombreUsuario}` : "Bienvenido"}
            </ThemedText>
            <ThemeSlider isDark={isDark} onPress={toggleTheme} />
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
                <ThemedText style={{fontSize: 20, fontWeight:500}}>{acceso.label}</ThemedText>
                {acceso.href ? (
                  <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
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
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: "center",
  },
  knob: {
    position: "absolute",
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});
