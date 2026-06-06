import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { EstadoFilter, type FiltroMesa } from "@/components/mesa/EstadoFilter";
import { MesaCard } from "@/components/mesa/MesaCard";
import { MesaEstadoSheet } from "@/components/mesa/MesaEstadoSheet";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useMesas } from "@/hooks/useMesas";
import { useTheme } from "@/hooks/use-theme";
import type { Mesa } from "@/types/mesa";

const COLUMNS = 2;

export default function MesasDashboard() {
  const { logout } = useAuth();
  const theme = useTheme();
  const { mesas, loading, refreshing, error, refresh, cambiarEstado } = useMesas();

  const [filtro, setFiltro] = useState<FiltroMesa>("TODAS");
  const [mesaSel, setMesaSel] = useState<Mesa | null>(null);

  const visibles = useMemo(
    () => (filtro === "TODAS" ? mesas : mesas.filter((m) => m.estadoMesa === filtro)),
    [mesas, filtro],
  );

  // Mantener sincronizada la mesa abierta en el sheet con la lista (tras refresh).
  const mesaActual = mesaSel ? (mesas.find((m) => m.id === mesaSel.id) ?? mesaSel) : null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <AppHeader title="Mesas" subtitle={`${mesas.length} en total`} onLogout={logout} />

        {!loading && !error && <EstadoFilter mesas={mesas} value={filtro} onChange={setFiltro} />}

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.brand} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <ThemedText type="default" style={styles.centerText}>
              {error}
            </ThemedText>
            <Pressable
              onPress={refresh}
              style={[styles.retry, { backgroundColor: theme.brand }]}
            >
              <ThemedText type="smallBold" style={{ color: theme.brandText }}>
                Reintentar
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={visibles}
            keyExtractor={(m) => m.id}
            numColumns={COLUMNS}
            columnWrapperStyle={styles.column}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <MesaCard mesa={item} onPress={setMesaSel} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.brand} />
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
                  No hay mesas{filtro !== "TODAS" ? " con este estado" : ""}.
                </ThemedText>
              </View>
            }
          />
        )}
      </SafeAreaView>

      <MesaEstadoSheet
        mesa={mesaActual}
        onClose={() => setMesaSel(null)}
        onSelect={cambiarEstado}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  list: { padding: Spacing.four, paddingTop: Spacing.two, gap: Spacing.three },
  column: { gap: Spacing.three },
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
