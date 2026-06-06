import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface Props {
  title: string;
  subtitle?: string;
  /** Acción a la derecha (ej. cerrar sesión). */
  onLogout?: () => void;
}

/** Encabezado de las pantallas internas: título, subtítulo y salir. */
export function AppHeader({ title, subtitle, onLogout }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.texts}>
        <ThemedText type="subtitle">{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>

      {onLogout && (
        <Pressable
          onPress={onLogout}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  texts: { gap: Spacing.one, flexShrink: 1 },
  logout: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
});
