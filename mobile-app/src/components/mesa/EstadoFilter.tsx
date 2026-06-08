import { ScrollView, StyleSheet, Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ESTADOS_SELECCIONABLES, estadoStyle, type EstadoStyle } from "@/constants/estadoMesa";
import { Brand, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { EstadoMesa, Mesa } from "@/types/mesa";

/** "TODAS" o uno de los estados seleccionables. */
export type FiltroMesa = "TODAS" | EstadoMesa;

interface Props {
  mesas: Mesa[];
  value: FiltroMesa;
  onChange: (filtro: FiltroMesa) => void;
}

/** Estilo del chip "Todas", con los tonos de marca del resto de la app. */
const ESTILO_TODAS: EstadoStyle = { label: "Todas", fg: Brand[600], bg: Brand[50], dot: Brand[500] };

/** Chips de filtro por estado: cada uno tiñe su color al activarse y muestra su contador. */
export function EstadoFilter({ mesas, value, onChange }: Props) {
  const theme = useTheme();

  const chips: { key: FiltroMesa; count: number; style: EstadoStyle }[] = [
    { key: "TODAS", count: mesas.length, style: ESTILO_TODAS },
    ...ESTADOS_SELECCIONABLES.map((estado) => ({
      key: estado as FiltroMesa,
      count: mesas.filter((m) => m.estadoMesa === estado).length,
      style: estadoStyle(estado),
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
  // achicarse, sin importar cuántas mesas haya o cuál chip esté activo.
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
