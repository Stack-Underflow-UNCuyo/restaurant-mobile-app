import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/views/components/themed-text";
import { estadoStyle } from "@/views/constants/estadoMesa";
import { Brand, Fonts, Radius, Spacing } from "@/views/constants/theme";
import { useTheme } from "@/controllers/hooks/use-theme";
import type { Mesa } from "@/models/types/mesa";

interface Props {
  mesa: Mesa;
  onPress: (mesa: Mesa) => void;
  onLongPress: (mesa: Mesa) => void;
  atencion?: boolean;
  /** Mostrado en mesas OCUPADA sin comanda abierta: inicia el flujo de nueva comanda. */
  onCrearComanda?: () => void;
}

export function MesaCard({ mesa, onPress, onLongPress, atencion, onCrearComanda }: Props) {
  const theme = useTheme();
  const s = estadoStyle(mesa.estadoMesa);

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={() => onPress(mesa)}
        onLongPress={() => onLongPress(mesa)}
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

      {onCrearComanda && (
        <Pressable
          onPress={onCrearComanda}
          hitSlop={8}
          style={({ pressed }) => [
            styles.crearBtn,
            { backgroundColor: Brand[500], borderColor: theme.surface, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <ThemedText style={styles.crearBtnText}>+</ThemedText>
        </Pressable>
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
  crearBtn: {
    position: "absolute",
    bottom: -10,
    right: -10,
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  crearBtnText: {
    fontSize: 16,
    lineHeight: 18,
    color: "#ffffff",
    fontFamily: Fonts.bold,
  },
});
