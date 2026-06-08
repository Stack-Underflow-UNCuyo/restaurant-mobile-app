import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { EstadoDetalleBadge } from "@/components/comanda/EstadoDetalleBadge";
import { estadoDetalleMasAvanzado } from "@/constants/estadoComanda";
import { Brand, Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { ComandaConDetalles } from "@/hooks/useComandas";

interface Props {
  comanda: ComandaConDetalles;
  /** Número secuencial a mostrar ("Comanda #N"); no es un campo del backend. */
  numero: number;
}

/** Formatea "2024-01-15T15:31:00" como "15:31". */
function formatHora(fechaIso: string): string {
  const hora = fechaIso.slice(11, 16);
  return hora || "--:--";
}

function formatMonto(monto: number): string {
  return `$${Math.round(monto)}`;
}

/** Tarjeta de una comanda: número, hora, líneas de pedido y estado de cocina. */
export function ComandaCard({ comanda, numero }: Props) {
  const theme = useTheme();
  const estado = estadoDetalleMasAvanzado(comanda.detalles.map((d) => d.estadoDetalleComanda));

  return (
    <View
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.dot, { backgroundColor: Brand[500] }]} />
          <ThemedText type="smallBold">Comanda #{numero}</ThemedText>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {formatHora(comanda.fechaSolicitudComanda)}
        </ThemedText>
      </View>

      <View style={[styles.separador, { borderColor: theme.border }]} />

      <View style={styles.items}>
        {comanda.detalles.map((detalle) => (
          <View key={detalle.id} style={styles.item}>
            <ThemedText type="small" numberOfLines={1} style={styles.itemNombre}>
              {detalle.nombre ?? "Pedido"} x{detalle.cantidad}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {formatMonto(detalle.precio * detalle.cantidad)}
            </ThemedText>
          </View>
        ))}
        {comanda.detalles.length === 0 && (
          <ThemedText type="small" themeColor="textSecondary">
            Sin pedidos cargados.
          </ThemedText>
        )}
      </View>

      {estado && <EstadoDetalleBadge estado={estado} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 180,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.one + 2 },
  dot: { width: 8, height: 8, borderRadius: Radius.full },
  separador: { borderBottomWidth: 1, borderStyle: "dashed" },
  items: { gap: Spacing.one + 2 },
  item: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: Spacing.two },
  itemNombre: { flex: 1, fontFamily: Fonts.medium },
});
