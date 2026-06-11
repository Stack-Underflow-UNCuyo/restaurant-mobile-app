import { ScrollView, StyleSheet, Pressable, View } from "react-native";

import { ThemedText } from "@/views/components/themed-text";
import {
  ESTADO_COMANDA_CONFIG,
  estadoComandaStyle,
  type EstadoDetalleStyle,
} from "@/views/constants/estadoComanda";
import { Brand, Radius, Spacing } from "@/views/constants/theme";
import { useTheme } from "@/controllers/hooks/use-theme";
import type { EstadoComanda } from "@/models/types/comanda";
import type { ComandaConDetalles } from "@/controllers/hooks/useComandas";

export type FiltroEstadoComanda = "TODAS" | EstadoComanda;

interface Props {
  comandas: ComandaConDetalles[];
  value: FiltroEstadoComanda;
  onChange: (filtro: FiltroEstadoComanda) => void;
}

const ESTILO_TODAS: EstadoDetalleStyle = { label: "Todas", fg: Brand[600], bg: Brand[50], dot: Brand[500] };

const ESTADOS: EstadoComanda[] = Object.keys(ESTADO_COMANDA_CONFIG) as EstadoComanda[];

/** Chips de filtro por estado global de comanda (ABIERTA, FINALIZADA, etc.). */
export function ComandaEstadoFilter({ comandas, value, onChange }: Props) {
  const theme = useTheme();

  const chips: { key: FiltroEstadoComanda; count: number; style: EstadoDetalleStyle }[] = [
    { key: "TODAS", count: comandas.length, style: ESTILO_TODAS },
    ...ESTADOS.map((estado) => ({
      key: estado as FiltroEstadoComanda,
      count: comandas.filter((c) => c.estadoComanda === estado).length,
      style: estadoComandaStyle(estado),
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
