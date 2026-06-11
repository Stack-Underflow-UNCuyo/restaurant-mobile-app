import { Image } from "expo-image";
import { Pressable, StyleSheet, View, type ImageSourcePropType } from "react-native";

import { ThemedText } from "@/views/components/themed-text";
import { Error as ErrorColor, Fonts, Radius, Spacing } from "@/views/constants/theme";
import { useAuth } from "@/controllers/context/AuthContext";
import { useTheme } from "@/controllers/hooks/use-theme";

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
      <View style={styles.left}>
        {logo ? <Image source={logo} style={styles.logo} contentFit="contain" /> : null}
        <View style={styles.titles}>
          {title ? <ThemedText type="subtitle">{title}</ThemedText> : null}
          {showGreeting && nombre ? (
            <ThemedText type="small" themeColor="textSecondary">
              Hola, {nombre}
            </ThemedText>
          ) : null}
        </View>
      </View>

      <View style={styles.rightActions}>
        {rolLabel ? (
          <View style={[styles.chip, { backgroundColor: theme.backgroundElement }]}>
            <View style={[styles.chipDot, { backgroundColor: theme.textSecondary }]} />
            <ThemedText style={[styles.actionText, { color: theme.textSecondary }]}>
              {rolLabel}
            </ThemedText>
          </View>
        ) : null}

        <Pressable
          onPress={logout}
          style={({ pressed }) => [
            styles.logoutBtn,
            { backgroundColor: ErrorColor[50], borderColor: ErrorColor[500], opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <ThemedText style={[styles.actionText, { color: ErrorColor[600] }]}>
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
    justifyContent: "space-between",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flex: 1,
    minWidth: 0,
  },
  logo: { width: 36, height: 38 },
  titles: { flexShrink: 1, gap: Spacing.half },
  rightActions: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.full,
  },
  chipDot: { width: 6, height: 6, borderRadius: Radius.full },
  logoutBtn: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
  },
  actionText: { fontFamily: Fonts.semibold, fontSize: 13, lineHeight: 18 },
});
