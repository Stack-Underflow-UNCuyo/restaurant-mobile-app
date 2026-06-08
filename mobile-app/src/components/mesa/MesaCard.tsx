import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { estadoStyle } from "@/constants/estadoMesa";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Mesa } from "@/types/mesa";

interface Props {
  mesa: Mesa;
  onPress: (mesa: Mesa) => void;
  /** Resalta la tarjeta con un aviso (ej. mesas reservadas a preparar). */
  atencion?: boolean;
}

/** Tarjeta de una mesa: barra de estado, número, ubicación y capacidad. */
export function MesaCard({ mesa, onPress, atencion }: Props) {
  const theme = useTheme();
  const s = estadoStyle(mesa.estadoMesa);

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={() => onPress(mesa)}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <View style={[styles.statusBar, { backgroundColor: s.dot }]} />

        <View style={styles.body}>
          <ThemedText style={styles.titulo}>Mesa {mesa.identificadorMesa}</ThemedText>
          {mesa.zonaFisica ? (
            <ThemedText type="default" themeColor="textSecondary" numberOfLines={1}>
              {mesa.zonaFisica}
            </ThemedText>
          ) : null}
          <ThemedText type="default" themeColor="textSecondary">
            {mesa.capacidadPersonas} pers
          </ThemedText>
        </View>
      </Pressable>

      {atencion && (
        <View style={[styles.alerta, { backgroundColor: theme.error, borderColor: theme.surface }]}>
          <ThemedText type="smallBold" style={{ color: theme.brandText }}>
            1
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  card: {
    minHeight: 132,
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  statusBar: { height: 8 },
  body: { flex: 1, gap: Spacing.one + 2, padding: Spacing.three, justifyContent: "center" },
  titulo: { fontSize: 19, lineHeight: 24, fontFamily: Fonts.bold },
  alerta: {
    position: "absolute",
    top: -8,
    right: -8,
    minWidth: 24,
    height: 24,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
