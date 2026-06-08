import { Image } from "expo-image";
import { Pressable, StyleSheet, View, type ImageSourcePropType } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme";

interface Props {
  title?: string;
  logo?: ImageSourcePropType;
  showGreeting?: boolean;
}

const ROL_LABEL: Record<string, string> = {
  MOZO: "Mozo",
  COCINERO: "Cocinero",
};

export function TopBar({ title, logo, showGreeting = true }: Props) {
  const theme = useTheme();
  const { user, logout } = useAuth();

  const nombre = user?.nombre?.trim() || user?.email || "";
  const rolLabel = user?.tipoEmpleado ? (ROL_LABEL[user.tipoEmpleado] ?? user.tipoEmpleado) : "";

  return (
    <View style={[styles.bar, { borderBottomColor: theme.border }]}>
      {logo ? <Image source={logo} style={styles.logo} contentFit="contain" /> : null}

      {/* Absolutely centered so it stays in the middle regardless of side elements */}
      <View style={styles.center} pointerEvents="none">
        {title ? <ThemedText type="subtitle">{title}</ThemedText> : null}
        {showGreeting && nombre ? (
          <ThemedText type="small" themeColor="textSecondary">
            Hola, {nombre}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.rightActions}>
        {rolLabel ? (
          <View style={[styles.chip, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.chipText}>
              {rolLabel}
            </ThemedText>
          </View>
        ) : null}

        <Pressable
          onPress={logout}
          style={({ pressed }) => [
            styles.logoutBtn,
            { borderColor: theme.error, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <ThemedText type="smallBold" style={{ color: theme.error }}>
            Salir
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  logo: { width: 36, height: 38 },
  center: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    gap: Spacing.half,
  },
  rightActions: { flexDirection: "row", alignItems: "center", gap: Spacing.two, marginLeft: "auto" },
  chip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  chipText: { fontFamily: Fonts.medium },
  logoutBtn: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
  },
});
