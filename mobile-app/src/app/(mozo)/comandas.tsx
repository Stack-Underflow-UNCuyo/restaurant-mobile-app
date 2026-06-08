import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ComandaCard } from "@/components/comanda/ComandaCard";
import { ComandaFilter, type FiltroComanda } from "@/components/comanda/ComandaFilter";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Radius, Spacing } from "@/constants/theme";
import { useComandas } from "@/hooks/useComandas";
import { useTheme } from "@/hooks/use-theme";

const logo = require("../../../assets/images/logo.png");
const COLUMNS = 2;

/**
 * Comandas de una mesa (cuando se llega tocando una MesaCard, con mesaId +
 * numero por parámetro) o de toda la casa (desde "Estados Comanda" en el home,
 * sin parámetros).
 */
export default function ComandasDashboard() {
  const router = useRouter();
  const theme = useTheme();
  const { mesaId, numero } = useLocalSearchParams<{ mesaId?: string; numero?: string }>();
  const { comandas, loading, refreshing, error, refresh } = useComandas(mesaId ?? null);

  const [filtro, setFiltro] = useState<FiltroComanda>("TODAS");

  const visibles = useMemo(
    () =>
      filtro === "TODAS"
        ? comandas
        : comandas.filter((c) => c.detalles.some((d) => d.estadoDetalleComanda === filtro)),
    [comandas, filtro],
  );

  // Agrupamos de a COLUMNS para que cada tarjeta conserve su tamaño real:
  // con numColumns + flex:1, la última fila incompleta estira su única
  // tarjeta a todo el ancho. Acá completamos esa fila con un relleno invisible.
  const filas = useMemo(() => {
    const grupos: { comanda: (typeof visibles)[number]; numero: number }[][] = [];
    for (let i = 0; i < visibles.length; i += COLUMNS) {
      grupos.push(
        visibles.slice(i, i + COLUMNS).map((comanda, j) => ({ comanda, numero: i + j + 1 })),
      );
    }
    return grupos;
  }, [visibles]);

  const subtitulo = mesaId
    ? `Mesa ${numero ?? ""}`.trim()
    : `${comandas.length} en total`;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <AppHeader title="Comandas" subtitle={subtitulo} onBack={() => router.back()} logo={logo} />

        {!loading && !error && (
          <ComandaFilter
            detalles={comandas.flatMap((c) => c.detalles)}
            value={filtro}
            onChange={setFiltro}
          />
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
        ) : (
          <FlatList
            data={filas}
            keyExtractor={(fila) => fila.map(({ comanda }) => comanda.id).join("-")}
            contentContainerStyle={styles.list}
            renderItem={({ item: fila }) => (
              <View style={styles.fila}>
                {fila.map(({ comanda, numero }) => (
                  <ComandaCard key={comanda.id} comanda={comanda} numero={numero} />
                ))}
                {fila.length < COLUMNS && <View style={styles.relleno} />}
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.brand} />
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
                  No hay comandas{filtro !== "TODAS" ? " con este estado" : ""}.
                </ThemedText>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  list: { padding: Spacing.four, paddingTop: Spacing.two, gap: Spacing.three },
  fila: { flexDirection: "row", gap: Spacing.three },
  relleno: { flex: 1 },
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
});
