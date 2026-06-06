import { ScrollView, StyleSheet, Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ESTADOS_SELECCIONABLES, estadoStyle } from "@/constants/estadoMesa";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { EstadoMesa, Mesa } from "@/types/mesa";

/** "TODAS" o uno de los estados seleccionables. */
export type FiltroMesa = "TODAS" | EstadoMesa;

interface Props {
  mesas: Mesa[];
  value: FiltroMesa;
  onChange: (filtro: FiltroMesa) => void;
}

/** Chips de filtro por estado, cada uno con su contador. */
export function EstadoFilter({ mesas, value, onChange }: Props) {
  const theme = useTheme();

  const chips: { key: FiltroMesa; label: string; count: number; color?: string }[] = [
    { key: "TODAS", label: "Todas", count: mesas.length },
    ...ESTADOS_SELECCIONABLES.map((estado) => ({
      key: estado as FiltroMesa,
      label: estadoStyle(estado).label,
      count: mesas.filter((m) => m.estadoMesa === estado).length,
      color: estadoStyle(estado).dot,
    })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
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
              {
                backgroundColor: active ? theme.text : theme.surface,
                borderColor: active ? theme.text : theme.border,
              },
            ]}
          >
            {chip.color && <View style={[styles.dot, { backgroundColor: chip.color }]} />}
            <ThemedText
              type="small"
              style={{ color: active ? theme.background : theme.text }}
            >
              {chip.label} ({chip.count})
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.two, paddingHorizontal: Spacing.four, paddingVertical: Spacing.two },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two - 1,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  dot: { width: 8, height: 8, borderRadius: Radius.full },
});
