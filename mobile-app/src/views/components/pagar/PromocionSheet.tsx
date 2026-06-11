import { Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/views/components/themed-text";
import { Radius, Spacing } from "@/views/constants/theme";
import { useTheme } from "@/controllers/hooks/use-theme";
import type { Promocion } from "@/models/types/promocion";

interface Props {
  visible: boolean;
  promociones: Promocion[];
  /** Promoción actualmente aplicada (null = sin promoción). */
  seleccionada: Promocion | null;
  onSelect: (promo: Promocion | null) => void;
  onClose: () => void;
}

/** Bottom sheet para elegir la promoción a aplicar en el pago. */
export function PromocionSheet({ visible, promociones, seleccionada, onSelect, onClose }: Props) {
  const theme = useTheme();

  function handleSelect(promo: Promocion | null) {
    onSelect(promo);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Evita que el tap dentro del panel cierre el modal. */}
        <Pressable style={[styles.sheet, { backgroundColor: theme.surface }]} onPress={() => {}}>
          <SafeAreaView edges={["bottom"]}>
            <View style={[styles.handle, { backgroundColor: theme.border }]} />

            <ThemedText type="subtitle" style={styles.title}>
              Promoción
            </ThemedText>

            <View style={styles.options}>
              <Option
                label="Sin promoción"
                selected={seleccionada === null}
                onPress={() => handleSelect(null)}
              />
              {promociones.map((promo) => (
                <Option
                  key={promo.id}
                  label={promo.descripcion || `${promo.porcentajeDescuento}%`}
                  detail={`${promo.porcentajeDescuento}% de descuento`}
                  selected={seleccionada?.id === promo.id}
                  onPress={() => handleSelect(promo)}
                />
              ))}
            </View>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface OptionProps {
  label: string;
  detail?: string;
  selected: boolean;
  onPress: () => void;
}

function Option({ label, detail, selected, onPress }: OptionProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: theme.surface,
          borderColor: selected ? theme.brand : theme.border,
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      <View style={styles.optionText}>
        <ThemedText type="default">{label}</ThemedText>
        {detail && (
          <ThemedText type="small" themeColor="textSecondary">
            {detail}
          </ThemedText>
        )}
      </View>
      <View
        style={[
          styles.circle,
          selected
            ? { backgroundColor: theme.brand, borderColor: theme.brand }
            : { backgroundColor: "transparent", borderColor: theme.border },
        ]}
      >
        {selected && <ThemedText style={styles.checkmark}>✓</ThemedText>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(16, 24, 40, 0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: Radius.lg + 4,
    borderTopRightRadius: Radius.lg + 4,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    alignSelf: "center",
    marginBottom: Spacing.three,
  },
  title: { marginBottom: Spacing.three },
  options: { gap: Spacing.two },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 52,
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  optionText: { flexShrink: 1, gap: Spacing.half },
  circle: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkmark: {
    fontSize: 13,
    lineHeight: 15,
    color: "#ffffff",
  },
});
