import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ComandaDetalleRecibo } from "@/components/comanda/ComandaDetalleRecibo";
import { ComandaFilter, type FiltroComanda } from "@/components/comanda/ComandaFilter";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Radius, Spacing } from "@/constants/theme";
import { useComandas } from "@/hooks/useComandas";
import { useTheme } from "@/hooks/use-theme";

const logo = require("../../../../assets/images/logo.png");

/** Detalle de la comanda activa de una mesa: receipt con detalles y filtro por estado. */
export default function ComandaDetalle() {
  const router = useRouter();
  const theme = useTheme();
  const { mesaId, numero } = useLocalSearchParams<{ mesaId: string; numero?: string }>();
  const { comandas, loading, refreshing, error, refresh } = useComandas(mesaId);

  const [filtro, setFiltro] = useState<FiltroComanda>("TODAS");

  const comanda = comandas[0] ?? null;

  const detallesVisibles = useMemo(() => {
    if (!comanda) return [];
    if (filtro === "TODAS") return comanda.detalles;
    return comanda.detalles.filter((d) => d.estadoDetalleComanda === filtro);
  }, [comanda, filtro]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <AppHeader
          title="Comandas"
          subtitle={`Mesa ${numero ?? ""}`.trim()}
          onBack={() => router.back()}
          logo={logo}
        />

        {!loading && !error && comanda && (
          <ComandaFilter detalles={comanda.detalles} value={filtro} onChange={setFiltro} />
        )}

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
              No hay comandas para esta mesa.
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scroll}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.brand} />
            }
          >
            <ComandaDetalleRecibo comanda={comanda} detallesVisibles={detallesVisibles} />
          </ScrollView>
        )}

        {!loading && !error && comanda && (
          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Pressable
              style={[styles.pagarBtn, { backgroundColor: theme.brand }]}
              onPress={() => {}}
            >
              <ThemedText type="smallBold" style={{ color: theme.brandText }}>
                Ir a Pagar
              </ThemedText>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingBottom: Spacing.five },
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
  },
  pagarBtn: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.three + 2,
    alignItems: "center",
  },
});
