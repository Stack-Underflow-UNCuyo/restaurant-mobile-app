import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Fonts, Gray, Radius, Spacing, Success, Warning } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { DetalleComanda, EstadoDetalleComanda } from "@/types/comanda";
import { DetalleComandaCard } from "./DetalleComandaCard";


const COLUMN_ACCENT: Partial<Record<EstadoDetalleComanda, string>> = {
  COCINERO_ASIGNADO: Gray[500],
  ENTREGADO_PARA_DESPACHAR: Warning[500],
  ENTREGADO_AL_CLIENTE: Success[500],
};

interface Props {
  title: string;
  items: DetalleComanda[];
  nextEstado?: EstadoDetalleComanda;
  onAction?: (detalle: DetalleComanda, nuevoEstado: EstadoDetalleComanda) => void;
  width: number;
}

export function KanbanColumn({ title, items, nextEstado, onAction, width }: Props) {
  const theme = useTheme();
  const accent = nextEstado ? (COLUMN_ACCENT[nextEstado] ?? Gray[500]) : Success[500];

  return (
    <View
      style={[styles.column, { width, backgroundColor: theme.backgroundElement }]}
    >
      <View style={[styles.header, { borderBottomColor: accent }]}>
        <ThemedText type="smallBold" style={[styles.title, { color: accent }]}>
          {title}
        </ThemedText>
        <View style={[styles.countBadge, { backgroundColor: accent }]}>
          <ThemedText style={styles.countText}>{items.length}</ThemedText>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={styles.list}
      >
        {items.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
            Sin pedidos
          </ThemedText>
        ) : (
          items.map((detalle) => (
            <DetalleComandaCard
              key={detalle.id}
              detalle={detalle}
              nextEstado={nextEstado}
              onAction={onAction}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    borderRadius: Radius.lg,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Spacing.one,
    borderBottomWidth: 2,
  },
  title: { fontFamily: Fonts.semibold },
  countBadge: {
    borderRadius: Radius.full,
    minWidth: 24,
    height: 24,
    paddingHorizontal: Spacing.one,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: { color: "#ffffff", fontFamily: Fonts.bold, fontSize: 12 },
  list: { gap: Spacing.one, paddingBottom: Spacing.two },
  empty: { textAlign: "center", marginTop: Spacing.two },
});
