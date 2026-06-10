import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ChevronRightIcon } from "@/components/icons";
import { MedioPagoModal } from "@/components/pagar/MedioPagoModal";
import { PromocionSheet } from "@/components/pagar/PromocionSheet";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Gray, Radius, Spacing } from "@/constants/theme";
import { useComandas } from "@/hooks/useComandas";
import { usePromociones } from "@/hooks/usePromociones";
import { useTheme } from "@/hooks/use-theme";
import type { DetalleComanda } from "@/types/comanda";
import type { Promocion } from "@/types/promocion";

function formatMonto(monto: number): string {
  return `$${Math.round(monto).toLocaleString("es-AR")}`;
}

function DashedSeparator() {
  const theme = useTheme();
  return <View style={[styles.separador, { borderColor: theme.border }]} />;
}

function DetalleRow({ detalle }: { detalle: DetalleComanda }) {
  const theme = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.imgPlaceholder, { backgroundColor: Gray[200] }]} />
      <View style={styles.info}>
        <ThemedText type="smallBold" numberOfLines={2}>
          {detalle.nombre ?? "Pedido"}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatMonto(detalle.precio)} c/u
        </ThemedText>
      </View>
      <View style={styles.itemRight}>
        <View style={[styles.qtyBadge, { backgroundColor: Gray[200] }]}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            ×{detalle.cantidad}
          </ThemedText>
        </View>
        <ThemedText type="smallBold" style={{ color: theme.brand }}>
          {formatMonto(detalle.precio * detalle.cantidad)}
        </ThemedText>
      </View>
    </View>
  );
}

interface TipRowProps {
  label: string;
  amount: string;
  selected: boolean;
  onPress: () => void;
}

function TipRow({ label, amount, selected, onPress }: TipRowProps) {
  const theme = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [styles.tipRow, { opacity: pressed ? 0.7 : 1 }]}
      onPress={onPress}
      hitSlop={6}
    >
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
      <ThemedText type="smallBold" style={styles.tipLabel}>
        {label}
      </ThemedText>
      <ThemedText type="smallBold">{amount}</ThemedText>
    </Pressable>
  );
}

export default function PagarScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { mesaId, numero } = useLocalSearchParams<{ mesaId: string; numero?: string }>();
  const { comandas, loading, error, refresh } = useComandas(mesaId);
  const { promociones } = usePromociones();

  const [conPropina, setConPropina] = useState(false);
  const [promoSeleccionada, setPromoSeleccionada] = useState<Promocion | null>(null);
  const [promoSheetOpen, setPromoSheetOpen] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);

  const comanda = comandas[0] ?? null;

  // Subtotal (sin propina ni descuentos).
  const subtotal = comanda
    ? comanda.detalles.reduce((acc, d) => acc + d.precio * d.cantidad, 0)
    : 0;
  // Descuento por promoción: misma fórmula que el dashboard (FacturaTable).
  const porcentaje = promoSeleccionada?.porcentajeDescuento ?? 0;
  const descuento = (subtotal * porcentaje) / 100;
  const totalConDescuento = subtotal - descuento;
  const totalConPropina = Math.round(totalConDescuento * 1.1);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <AppHeader
          title="Pagar"
          subtitle={numero ? `Mesa ${numero}` : undefined}
          onBack={() => router.back()}
        />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.brand} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <ThemedText type="default" style={styles.centerText}>
              {error}
            </ThemedText>
            <Pressable onPress={refresh} style={[styles.retry, { backgroundColor: theme.brand }]}>
              <ThemedText type="smallBold" style={{ color: theme.brandText }}>
                Reintentar
              </ThemedText>
            </Pressable>
          </View>
        ) : !comanda ? (
          <View style={styles.center}>
            <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
              Sin comanda activa.
            </ThemedText>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.scroll}>
              <DashedSeparator />
              <ThemedText type="smallBold" style={styles.sectionLabel}>
                Comanda #1
              </ThemedText>
              <View style={styles.items}>
                {comanda.detalles.map((detalle) => (
                  <DetalleRow key={detalle.id} detalle={detalle} />
                ))}
              </View>
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: theme.border }]}>
              <View style={styles.lineRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  Subtotal
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {formatMonto(subtotal)}
                </ThemedText>
              </View>

              <Pressable
                style={({ pressed }) => [styles.promoSelector, { opacity: pressed ? 0.7 : 1 }]}
                onPress={() => setPromoSheetOpen(true)}
                hitSlop={6}
              >
                <View style={styles.promoSelectorText}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Promoción
                  </ThemedText>
                  <ThemedText type="smallBold" numberOfLines={1}>
                    {promoSeleccionada
                      ? promoSeleccionada.descripcion ||
                        `${promoSeleccionada.porcentajeDescuento}%`
                      : "Sin promoción"}
                  </ThemedText>
                </View>
                <ChevronRightIcon color={theme.textSecondary} />
              </Pressable>

              {promoSeleccionada && (
                <View style={styles.lineRow}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Descuento ({porcentaje}%)
                  </ThemedText>
                  <ThemedText type="small" themeColor="error">
                    -{formatMonto(descuento)}
                  </ThemedText>
                </View>
              )}

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <TipRow
                label="Total"
                amount={formatMonto(totalConDescuento)}
                selected={!conPropina}
                onPress={() => setConPropina(false)}
              />
              <TipRow
                label="Total con propina"
                amount={formatMonto(totalConPropina)}
                selected={conPropina}
                onPress={() => setConPropina(true)}
              />
              <Pressable
                style={[styles.pagarBtn, { backgroundColor: theme.brand }]}
                onPress={() => setPagoOpen(true)}
              >
                <ThemedText type="smallBold" style={{ color: theme.brandText }}>
                  Ir a Pagar
                </ThemedText>
              </Pressable>
            </View>

            <PromocionSheet
              visible={promoSheetOpen}
              promociones={promociones}
              seleccionada={promoSeleccionada}
              onSelect={setPromoSeleccionada}
              onClose={() => setPromoSheetOpen(false)}
            />
            <MedioPagoModal
              visible={pagoOpen}
              onClose={() => setPagoOpen(false)}
              amount={conPropina ? totalConPropina : totalConDescuento}
              comandaId={comanda?.id}
              promocionId={promoSeleccionada?.id}
              descripcion={numero ? `Mesa ${numero}` : undefined}
              onPagoExitoso={() => {
                setPagoOpen(false);
                router.back();
              }}
            />
          </>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
  separador: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    marginBottom: Spacing.one,
  },
  sectionLabel: {
    paddingHorizontal: Spacing.one,
  },
  items: { gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.three,
  },
  imgPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: Radius.md,
    flexShrink: 0,
  },
  info: { flex: 1, gap: Spacing.one },
  itemRight: { alignItems: "flex-end", gap: Spacing.one, flexShrink: 0 },
  qtyBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.two,
    flexShrink: 0,
  },
  center: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.five,
    gap: Spacing.three,
  },
  centerText: { textAlign: "center" },
  retry: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.md,
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderTopWidth: 1,
    gap: Spacing.two,
  },
  lineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  promoSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    paddingVertical: Spacing.one,
  },
  promoSelectorText: { flexShrink: 1, gap: Spacing.half },
  divider: {
    height: 1,
    marginVertical: Spacing.one,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.one,
  },
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
  tipLabel: { flex: 1 },
  pagarBtn: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.three + 2,
    alignItems: "center",
    marginTop: Spacing.one,
  },
});
