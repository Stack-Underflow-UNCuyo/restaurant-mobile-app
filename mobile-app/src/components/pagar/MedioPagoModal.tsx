import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import { cobrar } from "@/services/facturaService";
import { confirmarPago, crearOrden } from "@/services/mercadoPagoService";
import type { OrdenMP } from "@/types/orden";

type MedioPago = "EFECTIVO" | "MERCADO_PAGO";

const OPCIONES: { value: MedioPago; label: string; icono: string }[] = [
  { value: "EFECTIVO", label: "Efectivo", icono: "💵" },
  { value: "MERCADO_PAGO", label: "Mercado Pago", icono: "🪙" },
];

const POLL_MS = 4000;

function formatMonto(monto: number): string {
  return `$${Math.round(monto).toLocaleString("es-AR")}`;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  amount: number;
  comandaId?: string;
  promocionId?: string;
  descripcion?: string;
  /** Se llama cuando el cobro se concretó (factura generada). */
  onPagoExitoso?: () => void;
}

/**
 * Popup de pago. Para Mercado Pago crea una order, muestra el QR y hace polling
 * hasta detectar el pago; para Efectivo cobra al confirmar. En ambos casos el
 * backend genera la factura, finaliza la comanda y libera la mesa.
 */
export function MedioPagoModal({
  visible,
  onClose,
  amount,
  comandaId,
  promocionId,
  descripcion,
  onPagoExitoso,
}: Props) {
  const theme = useTheme();
  const { token } = useAuth();
  const [seleccionado, setSeleccionado] = useState<MedioPago | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orden, setOrden] = useState<OrdenMP | null>(null);
  const [pagado, setPagado] = useState(false);

  // Reset cada vez que se abre el popup.
  useEffect(() => {
    if (visible) {
      setSeleccionado(null);
      setLoading(false);
      setError(null);
      setOrden(null);
      setPagado(false);
    }
  }, [visible]);

  // Polling del estado del pago de Mercado Pago mientras se muestra el QR.
  useEffect(() => {
    if (!visible || !orden || pagado || !token) return;
    const interval = setInterval(async () => {
      try {
        const estado = await confirmarPago(token, orden.id);
        if (estado.paid) setPagado(true);
      } catch {
        // Error transitorio de red: se reintenta en el próximo ciclo.
      }
    }, POLL_MS);
    return () => clearInterval(interval);
  }, [visible, orden, pagado, token]);

  async function handleConfirmar() {
    if (!token || loading || !seleccionado) return;
    setLoading(true);
    setError(null);
    try {
      if (seleccionado === "MERCADO_PAGO") {
        const res = await crearOrden(token, { amount, comandaId, promocionId, description: descripcion });
        setOrden(res);
      } else {
        if (!comandaId) throw new Error("No hay comanda para cobrar.");
        await cobrar(token, { comandaId, tipoPago: "EFECTIVO", promocionId });
        setPagado(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo procesar el cobro.");
    } finally {
      setLoading(false);
    }
  }

  function finalizar() {
    if (onPagoExitoso) onPagoExitoso();
    else onClose();
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

            {pagado ? (
              // --- Pago concretado ---
              <View style={styles.qrWrap}>
                <ThemedText style={styles.bigCheck}>✅</ThemedText>
                <ThemedText type="subtitle" style={styles.title}>
                  Pago registrado
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.qrHint}>
                  Se generó la factura por {formatMonto(amount)} y la mesa quedó libre.
                </ThemedText>
                <Pressable
                  style={[styles.confirmBtn, { backgroundColor: theme.brand }]}
                  onPress={finalizar}
                >
                  <ThemedText type="smallBold" style={{ color: theme.brandText }}>
                    Listo
                  </ThemedText>
                </Pressable>
              </View>
            ) : orden ? (
              // --- Vista QR (esperando el pago) ---
              <View style={styles.qrWrap}>
                <ThemedText type="subtitle" style={styles.title}>
                  Cobrar {formatMonto(amount)}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.qrHint}>
                  Mostrale este QR al cliente para que lo escanee con Mercado Pago.
                </ThemedText>
                <View style={styles.qrBox}>
                  {orden.qrData ? (
                    <QRCode value={orden.qrData} size={220} />
                  ) : (
                    <ThemedText type="small" themeColor="error">
                      La order no devolvió un QR.
                    </ThemedText>
                  )}
                </View>
                <View style={styles.esperando}>
                  <ActivityIndicator size="small" color={theme.brand} />
                  <ThemedText type="small" themeColor="textSecondary">
                    Esperando el pago…
                  </ThemedText>
                </View>
                <Pressable
                  style={[styles.confirmBtn, { backgroundColor: theme.brand }]}
                  onPress={onClose}
                >
                  <ThemedText type="smallBold" style={{ color: theme.brandText }}>
                    Cerrar
                  </ThemedText>
                </Pressable>
              </View>
            ) : (
              // --- Selección de medio de pago ---
              <>
                <ThemedText type="subtitle" style={styles.title}>
                  Medio de pago
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
                  Total a cobrar: {formatMonto(amount)}
                </ThemedText>

                <View style={styles.options}>
                  {OPCIONES.map((op) => {
                    const selected = seleccionado === op.value;
                    return (
                      <Pressable
                        key={op.value}
                        onPress={() => setSeleccionado(op.value)}
                        disabled={loading}
                        style={({ pressed }) => [
                          styles.option,
                          {
                            backgroundColor: theme.surface,
                            borderColor: selected ? theme.brand : theme.border,
                            opacity: pressed ? 0.6 : 1,
                          },
                        ]}
                      >
                        <View style={styles.optionLeft}>
                          <ThemedText type="default">{op.icono}</ThemedText>
                          <ThemedText type="default">{op.label}</ThemedText>
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
                  })}
                </View>

                {error && (
                  <ThemedText type="small" themeColor="error" style={styles.error}>
                    {error}
                  </ThemedText>
                )}

                <Pressable
                  disabled={!seleccionado || loading}
                  onPress={handleConfirmar}
                  style={[
                    styles.confirmBtn,
                    { backgroundColor: theme.brand, opacity: seleccionado && !loading ? 1 : 0.5 },
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={theme.brandText} />
                  ) : (
                    <ThemedText type="smallBold" style={{ color: theme.brandText }}>
                      {seleccionado === "MERCADO_PAGO" ? "Generar QR de cobro" : "Confirmar pago"}
                    </ThemedText>
                  )}
                </Pressable>
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
  title: { marginBottom: Spacing.one },
  subtitle: { marginBottom: Spacing.four },
  options: { gap: Spacing.two },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 52,
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  optionLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
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
  confirmBtn: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.three + 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.four,
    minHeight: 48,
  },
  error: {
    marginTop: Spacing.three,
    textAlign: "center",
  },
  qrWrap: {
    alignItems: "center",
  },
  bigCheck: {
    fontSize: 48,
    lineHeight: 56,
    marginBottom: Spacing.two,
  },
  qrHint: {
    textAlign: "center",
    marginBottom: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  qrBox: {
    backgroundColor: "#ffffff",
    padding: Spacing.three,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 220 + Spacing.three * 2,
    minWidth: 220 + Spacing.three * 2,
  },
  esperando: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
