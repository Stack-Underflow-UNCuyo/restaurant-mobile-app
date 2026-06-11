import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EstadoBadge } from "@/views/components/mesa/EstadoBadge";
import { ThemedText } from "@/views/components/themed-text";
import { ESTADOS_SELECCIONABLES, estadoStyle } from "@/views/constants/estadoMesa";
import { Radius, Spacing } from "@/views/constants/theme";
import { useTheme } from "@/controllers/hooks/use-theme";
import type { EstadoMesa, Mesa } from "@/models/types/mesa";

interface Props {
  mesa: Mesa | null;
  onClose: () => void;
  /** Aplica el nuevo estado; debe lanzar si falla (para mostrar el error). */
  onSelect: (mesa: Mesa, estado: EstadoMesa) => Promise<void>;
}

/** Bottom sheet con la info de la mesa y los estados que el mozo puede asignar. */
export function MesaEstadoSheet({ mesa, onClose, onSelect }: Props) {
  const theme = useTheme();
  const [saving, setSaving] = useState<EstadoMesa | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset al abrir/cerrar para una mesa distinta.
  useEffect(() => {
    setSaving(null);
    setError(null);
  }, [mesa?.id]);

  async function handleSelect(estado: EstadoMesa) {
    if (!mesa || saving) return;
    if (estado === mesa.estadoMesa) {
      onClose();
      return;
    }
    setError(null);
    setSaving(estado);
    try {
      await onSelect(mesa, estado);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cambiar el estado.");
      setSaving(null);
    }
  }

  return (
    <Modal
      visible={mesa !== null}
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

            {mesa && (
              <>
                <View style={styles.header}>
                  <View style={styles.headerText}>
                    <ThemedText type="subtitle">Mesa {mesa.identificadorMesa}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {mesa.capacidadPersonas} personas
                      {mesa.zonaFisica ? ` · ${mesa.zonaFisica}` : ""}
                    </ThemedText>
                  </View>
                  <EstadoBadge estado={mesa.estadoMesa} />
                </View>

                <ThemedText type="smallBold" style={styles.sectionTitle}>
                  Cambiar estado
                </ThemedText>

                <View style={styles.options}>
                  {ESTADOS_SELECCIONABLES.map((estado) => {
                    const s = estadoStyle(estado);
                    const isCurrent = estado === mesa.estadoMesa;
                    const isSaving = saving === estado;
                    return (
                      <Pressable
                        key={estado}
                        onPress={() => handleSelect(estado)}
                        disabled={saving !== null}
                        style={({ pressed }) => [
                          styles.option,
                          {
                            backgroundColor: isCurrent ? s.bg : theme.surface,
                            borderColor: isCurrent ? s.dot : theme.border,
                            opacity: pressed || (saving && !isSaving) ? 0.6 : 1,
                          },
                        ]}
                      >
                        <View style={styles.optionLeft}>
                          <View style={[styles.dot, { backgroundColor: s.dot }]} />
                          <ThemedText type="default" style={{ color: isCurrent ? s.fg : theme.text }}>
                            {s.label}
                          </ThemedText>
                        </View>
                        {isSaving ? (
                          <ActivityIndicator size="small" color={s.fg} />
                        ) : isCurrent ? (
                          <ThemedText type="small" themeColor="textSecondary">
                            Actual
                          </ThemedText>
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>

                {error && (
                  <ThemedText type="small" themeColor="error" style={styles.error}>
                    {error}
                  </ThemedText>
                )}
              </>
            )}
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
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
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  headerText: { gap: Spacing.one, flexShrink: 1 },
  sectionTitle: { marginBottom: Spacing.two },
  options: { gap: Spacing.two },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 52,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  optionLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  dot: { width: 10, height: 10, borderRadius: Radius.full },
  error: { marginTop: Spacing.three },
});
