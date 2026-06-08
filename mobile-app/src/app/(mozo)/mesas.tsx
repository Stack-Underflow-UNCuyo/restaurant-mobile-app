import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { EstadoFilter, type FiltroMesa } from "@/components/mesa/EstadoFilter";
import { MesaCard } from "@/components/mesa/MesaCard";
import { MesaEstadoSheet } from "@/components/mesa/MesaEstadoSheet";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { requiereAtencion } from "@/constants/estadoMesa";
import { Radius, Spacing } from "@/constants/theme";
import { useMesas } from "@/hooks/useMesas";
import { useTheme } from "@/hooks/use-theme";
import type { Mesa } from "@/types/mesa";

const logo = require("../../../assets/images/logo.png");
const COLUMNS = 2;

export default function MesasDashboard() {
  const router = useRouter();
  const theme = useTheme();
  const { mesas, loading, refreshing, error, refresh, cambiarEstado } = useMesas();

  const [filtro, setFiltro] = useState<FiltroMesa>("TODAS");
  const [mesaSel, setMesaSel] = useState<Mesa | null>(null);

  const visibles = useMemo(
    () => (filtro === "TODAS" ? mesas : mesas.filter((m) => m.estadoMesa === filtro)),
    [mesas, filtro],
  );

  // Agrupamos de a COLUMNS para que cada tarjeta conserve su tamaño real:
  // con numColumns + flex:1, la última fila incompleta estira su única
  // tarjeta a todo el ancho. Acá completamos esa fila con un relleno invisible.
  const filas = useMemo(() => {
    const grupos: Mesa[][] = [];
    for (let i = 0; i < visibles.length; i += COLUMNS) grupos.push(visibles.slice(i, i + COLUMNS));
    return grupos;
  }, [visibles]);

  // Mantener sincronizada la mesa abierta en el sheet con la lista (tras refresh).
  const mesaActual = mesaSel ? (mesas.find((m) => m.id === mesaSel.id) ?? mesaSel) : null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <AppHeader
          title="Mesas"
          subtitle={`${mesas.length} en total`}
          onBack={() => router.back()}
          logo={logo}
        />

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
            data={filas}
            keyExtractor={(fila) => fila.map((m) => m.id).join("-")}
            contentContainerStyle={styles.list}
            renderItem={({ item: fila }) => (
              <View style={styles.fila}>
                {fila.map((mesa) => (
                  <MesaCard
                    key={mesa.id}
                    mesa={mesa}
                    onPress={setMesaSel}
                    atencion={requiereAtencion(mesa.estadoMesa)}
                  />
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
