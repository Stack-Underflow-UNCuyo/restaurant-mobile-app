import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Brand, Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { DetalleComanda, EstadoDetalleComanda } from "@/types/comanda";
import { DetalleComandaCard } from "./DetalleComandaCard";


interface Props {
  title: string;
  items: DetalleComanda[];
  nextEstado?: EstadoDetalleComanda;
  onAction?: (detalle: DetalleComanda, nuevoEstado: EstadoDetalleComanda) => void;
}

export function KanbanColumn({ title, items, nextEstado, onAction }: Props) {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  return (
    <View
      style={[styles.column, { width: width * 0.3, backgroundColor: theme.backgroundElement }]}
    >
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.title}>
          {title}
        </ThemedText>
        <View style={[styles.countBadge, { backgroundColor: Brand[500] }]}>
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
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.one,
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
  list: { gap: Spacing.two, paddingBottom: Spacing.three },
  empty: { textAlign: "center", marginTop: Spacing.three },
});
