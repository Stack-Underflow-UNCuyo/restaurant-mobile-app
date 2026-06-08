import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { estadoDetalleStyle } from "@/constants/estadoComanda";
import { Radius, Spacing } from "@/constants/theme";
import type { EstadoDetalleComanda } from "@/types/comanda";

/** Pill de color con un punto + la etiqueta del estado de una línea de pedido. */
export function EstadoDetalleBadge({ estado }: { estado: EstadoDetalleComanda }) {
  const s = estadoDetalleStyle(estado);
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
