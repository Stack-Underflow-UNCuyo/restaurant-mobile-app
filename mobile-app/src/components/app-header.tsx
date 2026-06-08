import { Image } from "expo-image";
import { Pressable, StyleSheet, View, type ImageSourcePropType } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface Props {
  title: string;
  subtitle?: string;
  /** Flecha para volver a la pantalla anterior (navegación existente vía expo-router). */
  onBack?: () => void;
  /** Logo del local, mostrado a la derecha. */
  logo?: ImageSourcePropType;
}

/** Encabezado de las pantallas internas: volver, título centrado y logo del local. */
export function AppHeader({ title, subtitle, onBack, logo }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {onBack && (
          <Pressable
            onPress={onBack}
            hitSlop={8}
            style={({ pressed }) => [styles.back, { opacity: pressed ? 0.6 : 1 }]}
          >
            <ThemedText style={[styles.chevron, { color: theme.text }]}>‹</ThemedText>
          </Pressable>
        )}
      </View>

      <View style={styles.texts}>
        <ThemedText type="subtitle" style={styles.centerText}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>

      <View style={[styles.side, styles.sideRight]}>
        {logo && <Image source={logo} style={styles.logo} contentFit="contain" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  side: { width: 48, alignItems: "flex-start" },
  sideRight: { alignItems: "flex-end" },
  back: { padding: Spacing.one },
  chevron: { fontSize: 40, lineHeight: 42 },
  texts: { flex: 1, alignItems: "center", gap: Spacing.half },
  centerText: { textAlign: "center" },
  logo: { width: 36, height: 38 },
});
