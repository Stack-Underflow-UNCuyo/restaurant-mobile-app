import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Brand, Radius, Spacing } from "@/constants/theme";

interface Props {
  onPress: () => void;
}

/**
 * Acceso rápido a la vista previa del menú — espejo de MenuOptionCard del
 * sitio web (sin gradiente porque la app no tiene expo-linear-gradient;
 * un fondo bordó plano cumple el mismo rol de "tarjeta destacada").
 */
export function MenuOptionCard({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={styles.top}>
        <View style={styles.star}>
          <ThemedText style={styles.starText}>★</ThemedText>
        </View>
      </View>
      <View style={styles.body}>
        <ThemedText type="small" style={styles.label}>
          VISTA RÁPIDA
        </ThemedText>
        <ThemedText type="smallBold" style={styles.title} numberOfLines={1}>
          Menú
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    overflow: "hidden",
    borderRadius: Radius.lg,
    backgroundColor: Brand[600],
  },
  top: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  star: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  starText: { color: "#fff", fontSize: 16 },
  body: { gap: Spacing.one + 2, padding: Spacing.three },
  label: { color: Brand[100], letterSpacing: 2, textTransform: "uppercase" },
  title: { color: "#fff" },
});
