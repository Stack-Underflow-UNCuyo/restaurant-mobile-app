import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/views/components/themed-text";
import { Brand, Fonts, Gray, Radius, Spacing, Success, Warning } from "@/views/constants/theme";
import { useTheme } from "@/controllers/hooks/use-theme";
import type { DetalleComanda, EstadoDetalleComanda } from "@/models/types/comanda";

interface Props {
  detalle: DetalleComanda;
  /** Target estado to transition to when the action button is pressed. */
  nextEstado?: EstadoDetalleComanda;
  onAction?: (detalle: DetalleComanda, nuevoEstado: EstadoDetalleComanda) => void;
}

const ACTION_LABEL: Partial<Record<EstadoDetalleComanda, string>> = {
  COCINERO_ASIGNADO: "Tomar",
  ENTREGADO_PARA_DESPACHAR: "Listo",
  ENTREGADO_AL_CLIENTE: "Entregado",
};

function elapsedTime(iso: string | null): string {
  if (!iso) return "";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

const BUTTON_COLORS: Partial<Record<EstadoDetalleComanda, string>> = {
  COCINERO_ASIGNADO: Gray[500],
  ENTREGADO_PARA_DESPACHAR: Warning[500],
  ENTREGADO_AL_CLIENTE: Success[500]
};

export function DetalleComandaCard({ detalle, nextEstado, onAction }: Props) {
  const theme = useTheme();
  const btnColor = nextEstado ? BUTTON_COLORS[nextEstado] ?? Brand[500] : Brand[500];

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Header: name + quantity badge */}
      <View style={styles.header}>
        <ThemedText type="smallBold" numberOfLines={2} style={styles.nombre}>
          {detalle.nombre ?? "Pedido"}
        </ThemedText>
        <View style={[styles.badge, { backgroundColor: Brand[50] }]}>
          <ThemedText style={[styles.badgeText, { color: Brand[600] }]}>
            ×{detalle.cantidad}
          </ThemedText>
        </View>
      </View>

      {/* Description (individual articles) */}
      {detalle.descripcion ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.descripcion}>
          {detalle.descripcion}
        </ThemedText>
      ) : null}

      {/* Components list (menus/combos) */}
      {detalle.componentes && detalle.componentes.length > 0 ? (
        <View style={[styles.componentes, { borderColor: theme.border }]}>
          {detalle.componentes.map((c, i) => (
            <View key={i} style={styles.componenteRow}>
              <View style={[styles.dot, { backgroundColor: Gray[400] }]} />
              <ThemedText type="small" themeColor="textSecondary" style={styles.componenteText}>
                {c}
              </ThemedText>
            </View>
          ))}
        </View>
      ) : null}

      {/* Comanda reference + elapsed time */}
      <View style={styles.meta}>
        <ThemedText type="small" themeColor="textSecondary">
          #{detalle.comandaId.slice(-6).toUpperCase()}
        </ThemedText>
        {(
          <ThemedText type="small" themeColor="textSecondary">
            {elapsedTime(detalle.fechaCreacion)}
          </ThemedText>
        )}
      </View>

      {nextEstado && onAction && (
        <Pressable
          onPress={() => onAction(detalle, nextEstado)}
          style={({ pressed }) => [
            styles.btn,
            { backgroundColor: btnColor, opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <ThemedText type="smallBold" style={styles.btnText}>
            {ACTION_LABEL[nextEstado] ?? "Avanzar"}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  header: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.two },
  nombre: { flex: 1, fontFamily: Fonts.semibold },
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    alignSelf: "flex-start",
  },
  badgeText: { fontFamily: Fonts.bold, fontSize: 13 },
  descripcion: { fontStyle: "italic" },
  componentes: {
    borderTopWidth: 1,
    borderStyle: "dashed",
    paddingTop: Spacing.two,
    gap: Spacing.one,
  },
  componenteRow: { flexDirection: "row", alignItems: "center", gap: Spacing.one + 2 },
  dot: { width: 4, height: 4, borderRadius: Radius.full },
  componenteText: { flex: 1 },
  meta: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.two,
    alignItems: "center",
  },
  btnText: { color: "#ffffff" },
});
