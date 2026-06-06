import { Pressable, StyleSheet, View } from "react-native";

import { EstadoBadge } from "@/components/mesa/EstadoBadge";
import { ThemedText } from "@/components/themed-text";
import { estadoStyle } from "@/constants/estadoMesa";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Mesa } from "@/types/mesa";

/** Tarjeta de una mesa: número grande, estado y datos (capacidad / zona). */
export function MesaCard({ mesa, onPress }: { mesa: Mesa; onPress: (mesa: Mesa) => void }) {
  const theme = useTheme();
  const s = estadoStyle(mesa.estadoMesa);

  return (
    <Pressable
      onPress={() => onPress(mesa)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderLeftColor: s.dot,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.topRow}>
        <ThemedText type="small" themeColor="textSecondary">
          Mesa
        </ThemedText>
        <ThemedText style={[styles.numero, { color: theme.text }]}>
          {mesa.identificadorMesa}
        </ThemedText>
      </View>

      <EstadoBadge estado={mesa.estadoMesa} />

      <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
        {mesa.capacidadPersonas} pers.
        {mesa.zonaFisica ? ` · ${mesa.zonaFisica}` : ""}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 124,
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderLeftWidth: 4,
    justifyContent: "space-between",
  },
  topRow: { flexDirection: "row", alignItems: "baseline", gap: Spacing.two },
  numero: { fontSize: 34, lineHeight: 38, fontFamily: "Outfit_700Bold" },
});
