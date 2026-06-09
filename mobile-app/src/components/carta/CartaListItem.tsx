import { Pressable, StyleSheet } from "react-native";

import { ChevronRightIcon } from "@/components/icons";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Carta } from "@/types/carta";

interface Props {
  carta: Carta;
  onPress: (carta: Carta) => void;
}

/** Fila de una carta en el listado — mismo estilo que los accesos del home del mozo. */
export function CartaListItem({ carta, onPress }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => onPress(carta)}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <ThemedText type="smallBold">{carta.nombre ?? "Carta"}</ThemedText>
      <ChevronRightIcon color={theme.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
});
