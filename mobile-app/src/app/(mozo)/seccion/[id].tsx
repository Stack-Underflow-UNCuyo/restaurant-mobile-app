import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ArticuloDetailCard } from "@/components/carta/ArticuloDetailCard";
import { ComboDetailCard } from "@/components/carta/ComboDetailCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Radius, Spacing } from "@/constants/theme";
import { useSeccionDetalle } from "@/hooks/useSeccionDetalle";
import { useTheme } from "@/hooks/use-theme";
import { isDetalleArticulo, isDetalleMenu } from "@/types/carta";
import type { Categoria, DetalleSeccionCartaItem } from "@/types/carta";

const logo = require("../../../../assets/images/logo.png");
const COLUMNS = 2;
const FEATURED_COUNT = 2;

function renderDetalle(detalle: DetalleSeccionCartaItem, featured: boolean, categoria?: Categoria) {
  if (isDetalleArticulo(detalle))
    return <ArticuloDetailCard detalle={detalle} seccionCategoria={categoria} featured={featured} />;
  if (isDetalleMenu(detalle))
    return <ComboDetailCard detalle={detalle} seccionCategoria={categoria} featured={featured} />;
  return null;
}

export default function SeccionDetalleScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string; cartaId?: string }>();
  const { seccion, loading, refreshing, error, refresh } = useSeccionDetalle(id);

  const detalles = seccion?.detallesSeccionCarta ?? [];
  const destacados = detalles.slice(0, FEATURED_COUNT);
  const resto = detalles.slice(FEATURED_COUNT);

  // Agrupamos los platos restantes de a COLUMNS para el grid de 2 columnas.
  const filas = useMemo<DetalleSeccionCartaItem[][]>(() => {
    const grupos: DetalleSeccionCartaItem[][] = [];
    for (let i = 0; i < resto.length; i += COLUMNS) grupos.push(resto.slice(i, i + COLUMNS));
    return grupos;
  }, [resto]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <AppHeader title={seccion?.nombre ?? "Sección"} onBack={() => router.back()} logo={logo} />

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
        ) : detalles.length === 0 ? (
          <View style={styles.center}>
            <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
              Todavía no hay platos cargados en esta sección.
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
              destacados.length > 0 ? (
                <View style={styles.destacados}>
                  {destacados.map((detalle) => (
                    <View key={detalle.id}>{renderDetalle(detalle, true, seccion?.categoria)}</View>
                  ))}
                </View>
              ) : null
            }
            renderItem={({ item: fila }) => (
              <View style={styles.fila}>
                {fila.map((detalle) => (
                  <View key={detalle.id} style={styles.celda}>
                    {renderDetalle(detalle, false, seccion?.categoria)}
                  </View>
                ))}
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
  destacados: { gap: Spacing.three },
  fila: { flexDirection: "row", gap: Spacing.three },
  celda: { flex: 1 },
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
