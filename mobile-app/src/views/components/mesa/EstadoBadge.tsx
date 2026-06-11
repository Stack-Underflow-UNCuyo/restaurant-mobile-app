import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/views/components/themed-text";
import { estadoStyle } from "@/views/constants/estadoMesa";
import { Radius, Spacing } from "@/views/constants/theme";
import type { EstadoMesa } from "@/models/types/mesa";

/** Pill de color con un punto + la etiqueta del estado de la mesa. */
export function EstadoBadge({ estado }: { estado: EstadoMesa }) {
  const s = estadoStyle(estado);
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <View style={[styles.dot, { backgroundColor: s.dot }]} />
      <ThemedText type="small" style={[styles.label, { color: s.fg }]}>
        {s.label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.one + 2,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half + 2,
    borderRadius: Radius.full,
  },
  dot: { width: 7, height: 7, borderRadius: Radius.full },
  label: { fontSize: 12, lineHeight: 16 },
});
