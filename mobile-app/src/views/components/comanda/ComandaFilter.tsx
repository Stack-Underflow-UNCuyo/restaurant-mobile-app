import { ScrollView, StyleSheet, Pressable, View } from "react-native";

import { ThemedText } from "@/views/components/themed-text";
import {
  ESTADOS_DETALLE_FILTRABLES,
  estadoDetalleStyle,
  type EstadoDetalleStyle,
} from "@/views/constants/estadoComanda";
import { Brand, Radius, Spacing } from "@/views/constants/theme";
import { useTheme } from "@/controllers/hooks/use-theme";
import type { DetalleComanda, EstadoDetalleComanda } from "@/models/types/comanda";

/** "TODAS" o uno de los estados de detalle filtrables. */
export type FiltroComanda = "TODAS" | EstadoDetalleComanda;

interface Props {
  detalles: DetalleComanda[];
  value: FiltroComanda;
  onChange: (filtro: FiltroComanda) => void;
}

/** Estilo del chip "Todas", con los tonos de marca del resto de la app. */
const ESTILO_TODAS: EstadoDetalleStyle = { label: "Todas", fg: Brand[600], bg: Brand[50], dot: Brand[500] };

/** Chips de filtro por estado de detalle: cada uno tiñe su color al activarse y muestra su contador. */
export function ComandaFilter({ detalles, value, onChange }: Props) {
  const theme = useTheme();

  const chips: { key: FiltroComanda; count: number; style: EstadoDetalleStyle }[] = [
    { key: "TODAS", count: detalles.length, style: ESTILO_TODAS },
    ...ESTADOS_DETALLE_FILTRABLES.map((estado) => ({
      key: estado as FiltroComanda,
      count: detalles.filter((d) => d.estadoDetalleComanda === estado).length,
      style: estadoDetalleStyle(estado),
    })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.wrapper}
      contentContainerStyle={styles.row}
    >
      {chips.map((chip) => {
        const active = chip.key === value;
        return (
          <Pressable
            key={chip.key}
            onPress={() => onChange(chip.key)}
            style={[
              styles.chip,
              active
                ? { backgroundColor: chip.style.bg, borderColor: chip.style.dot }
                : { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: chip.style.dot }]} />
            <ThemedText
              type="smallBold"
              numberOfLines={1}
              style={[styles.label, { color: active ? chip.style.fg : theme.text }]}
            >
              {chip.style.label} ({chip.count})
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Altura fija del contenedor: la fila de chips nunca debe crecer ni
  // achicarse, sin importar cuántas comandas haya o cuál chip esté activo.
  wrapper: { height: 60, flexGrow: 0, flexShrink: 0 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 142,
    height: 44,
    gap: Spacing.one + 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
  dot: { width: 8, height: 8, borderRadius: Radius.full },
  label: { textAlign: "center" },
});
