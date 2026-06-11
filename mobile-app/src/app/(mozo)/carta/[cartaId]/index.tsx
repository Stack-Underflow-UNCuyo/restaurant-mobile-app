import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/views/components/app-header";
import { MenuOptionCard } from "@/views/components/carta/MenuOptionCard";
import { SeccionCard } from "@/views/components/carta/SeccionCard";
import { ThemedText } from "@/views/components/themed-text";
import { ThemedView } from "@/views/components/themed-view";
import { Radius, Spacing } from "@/views/constants/theme";
import { useCart } from "@/controllers/context/CartContext";
import { useCartaDetalle } from "@/controllers/hooks/useCartaDetalle";
import { useTheme } from "@/controllers/hooks/use-theme";
import type { SeccionCarta } from "@/models/types/carta";

const COLUMNS = 2;

type Celda = { tipo: "menu" } | { tipo: "seccion"; seccion: SeccionCarta };

export default function CartaDetalleScreen() {
  const router = useRouter();
  const theme = useTheme();
  const cart = useCart();
  const { cartaId } = useLocalSearchParams<{ cartaId: string }>();
  const { carta, loading, refreshing, error, refresh } = useCartaDetalle(cartaId);

  const verSeccion = (seccion: SeccionCarta) => {
    router.push({
      pathname: "/(mozo)/seccion/[id]",
      params: { id: seccion.id, cartaId: cartaId ?? "" },
    });
  };
  const verMenu = () => {
    router.push({
      pathname: "/(mozo)/carta/[cartaId]/menu",
      params: { cartaId: cartaId ?? "" },
    });
  };

  const [primera, ...resto] = carta?.seccionesCarta ?? [];

  // Celdas del grid: MenuOptionCard + el resto de secciones (sin la primera,
  // que se muestra destacada a todo el ancho como ListHeaderComponent).
  const celdas = useMemo<Celda[]>(() => {
    if (!primera) return [];
    return [{ tipo: "menu" }, ...resto.map((seccion) => ({ tipo: "seccion" as const, seccion }))];
  }, [primera, resto]);

  // Mismo patrón que MesasDashboard: agrupamos de a COLUMNS para que cada
  // tarjeta conserve su flex:1 real, rellenando la última fila incompleta.
  const filas = useMemo<Celda[][]>(() => {
    const grupos: Celda[][] = [];
    for (let i = 0; i < celdas.length; i += COLUMNS) grupos.push(celdas.slice(i, i + COLUMNS));
    return grupos;
  }, [celdas]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <AppHeader
          title={carta?.nombre ?? "Carta"}
          onBack={() => router.back()}
          onCartPress={() => router.push("/(mozo)/carrito")}
          cartCount={cart.items.length}
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
        ) : !primera ? (
          <View style={styles.center}>
            <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
              Todavía no hay secciones cargadas en esta carta.
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={filas}
            keyExtractor={(_, index) => `fila-${index}`}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.brand} />
            }
            ListHeaderComponent={
              <SeccionCard seccion={primera} onPress={verSeccion} featured />
            }
            renderItem={({ item: fila }) => (
              <View style={styles.fila}>
                {fila.map((celda) =>
                  celda.tipo === "menu" ? (
                    <MenuOptionCard key="menu" onPress={verMenu} />
                  ) : (
                    <SeccionCard key={celda.seccion.id} seccion={celda.seccion} onPress={verSeccion} />
                  ),
                )}
                {fila.length < COLUMNS && <View style={styles.relleno} />}
              </View>
            )}
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
