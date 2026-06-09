import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { estadoDetalleStyle } from "@/constants/estadoComanda";
import { Fonts, Gray, Radius, Spacing } from "@/constants/theme";
import { formatHora } from "@/lib/format";
import { useTheme } from "@/hooks/use-theme";
import type { ComandaConDetalles } from "@/hooks/useComandas";
import type { DetalleComanda } from "@/types/comanda";

interface Props {
  comanda: ComandaConDetalles;
  /** Detalles ya filtrados por el chip activo. */
  detallesVisibles: DetalleComanda[];
  /** Navega a la carta para agregar nuevos ítems a la comanda. */
  onAdd?: () => void;
}

function formatMonto(monto: number): string {
  return `$${Math.round(monto).toLocaleString("es-AR")}`;
}

function DashedSeparator() {
  const theme = useTheme();
  return <View style={[styles.separador, { borderColor: theme.border }]} />;
}

/** Tarjeta de recibo para una comanda: cada DetalleComanda como fila con punto de color. */
export function ComandaDetalleRecibo({ comanda, detallesVisibles, onAdd }: Props) {
  const theme = useTheme();

  const total = comanda.detalles.reduce(
    (acc, d) => acc + d.precio * d.cantidad,
    0,
  );

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.header}>
        <ThemedText type="smallBold">Comanda #1</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatHora(comanda.fechaSolicitudComanda)}
        </ThemedText>
      </View>

      <DashedSeparator />

      <View style={styles.items}>
        {detallesVisibles.map((detalle) => {
          const dot = estadoDetalleStyle(detalle.estadoDetalleComanda).dot;
          return (
            <View key={detalle.id} style={styles.fila}>
              <View style={[styles.dot, { backgroundColor: dot }]} />
              <ThemedText type="small" style={styles.nombre} numberOfLines={1}>
                {detalle.nombre ?? "Pedido"} x{detalle.cantidad}
              </ThemedText>
              <View style={styles.guiones} />
              <ThemedText type="small" themeColor="textSecondary">
                {formatMonto(detalle.precio * detalle.cantidad)}
              </ThemedText>
            </View>
          );
        })}

        {detallesVisibles.length === 0 && (
          <ThemedText type="small" themeColor="textSecondary" style={styles.vacio}>
            Sin pedidos con este estado.
          </ThemedText>
        )}
      </View>

      <Pressable style={[styles.addButton, { borderColor: Gray[400] }]} onPress={onAdd}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          +
        </ThemedText>
      </Pressable>

      <DashedSeparator />

      <View style={styles.totalFila}>
        <ThemedText type="default">Total</ThemedText>
        <ThemedText type="default" style={styles.totalMonto}>{formatMonto(total)}</ThemedText>
      </View>

      <View style={styles.esquinaRecibo} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    marginHorizontal: Spacing.four,
    marginTop: Spacing.two,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  separador: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
  },
  items: { gap: Spacing.two },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  dot: { width: 8, height: 8, borderRadius: Radius.full, flexShrink: 0 },
  nombre: { fontFamily: Fonts.regular, flexShrink: 1 },
  guiones: { flex: 1, borderBottomWidth: 1, borderStyle: "dashed", borderColor: "#d0d5dd", marginBottom: 2 },
  vacio: { textAlign: "center", paddingVertical: Spacing.two },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  totalFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalMonto: { fontFamily: Fonts.bold },
  esquinaRecibo: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 28,
    height: 28,
    backgroundColor: "#f9fafb",
    borderTopLeftRadius: Radius.md,
    borderBottomRightRadius: Radius.lg,
  },
});
