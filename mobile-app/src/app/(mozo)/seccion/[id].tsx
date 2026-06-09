import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useMemo } from "react";
import {
  Animated,
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ArticuloDetailCard } from "@/components/carta/ArticuloDetailCard";
import { ComboDetailCard } from "@/components/carta/ComboDetailCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Brand, Fonts, Radius, Spacing } from "@/constants/theme";
import { useCart } from "@/context/CartContext";
import { useSeccionDetalle } from "@/hooks/useSeccionDetalle";
import { useTheme } from "@/hooks/use-theme";
import { isDetalleArticulo, isDetalleMenu } from "@/types/carta";
import type { Categoria, DetalleSeccionCartaItem } from "@/types/carta";

const COLUMNS = 2;
const FEATURED_COUNT = 2;

function renderDetalle(detalle: DetalleSeccionCartaItem, featured: boolean, categoria?: Categoria) {
  if (isDetalleArticulo(detalle))
    return <ArticuloDetailCard detalle={detalle} seccionCategoria={categoria} featured={featured} />;
  if (isDetalleMenu(detalle))
    return <ComboDetailCard detalle={detalle} seccionCategoria={categoria} featured={featured} />;
  return null;
}

function getItemMeta(detalle: DetalleSeccionCartaItem): { nombre: string; precio: number } {
  if (isDetalleArticulo(detalle)) return { nombre: detalle.articulo.nombre, precio: detalle.precio };
  return { nombre: detalle.menu.nombre, precio: detalle.menu.precio };
}

interface TappableCardProps {
  detalle: DetalleSeccionCartaItem;
  featured: boolean;
  categoria?: Categoria;
  cartQty: number;
  onAdd: () => void;
}

function TappableCard({ detalle, featured, categoria, cartQty, onAdd }: TappableCardProps) {
  const [scale] = useState(() => new Animated.Value(1));
  const [floatY] = useState(() => new Animated.Value(0));
  const [floatOpacity] = useState(() => new Animated.Value(0));

  function handlePress() {
    onAdd();

    // Scale pulse: squeeze then release
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.93, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    // +1 float: rise and fade
    floatY.setValue(0);
    floatOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(floatY, { toValue: -38, duration: 550, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(floatOpacity, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.delay(200),
        Animated.timing(floatOpacity, { toValue: 0, duration: 270, useNativeDriver: true }),
      ]),
    ]).start();
  }

  return (
    <Pressable onPress={handlePress} style={featured ? undefined : styles.celda}>
      <Animated.View style={{ transform: [{ scale }] }}>
        {renderDetalle(detalle, featured, categoria)}
      </Animated.View>

      {/* Floating +1 badge */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.floatBadge,
          { transform: [{ translateY: floatY }], opacity: floatOpacity },
        ]}
      >
        <ThemedText style={styles.floatText}>+1</ThemedText>
      </Animated.View>

      {/* Persistent qty badge (shown when item already in cart) */}
      {cartQty > 0 && (
        <View style={styles.qtyBadge}>
          <ThemedText style={styles.qtyText}>{cartQty}</ThemedText>
        </View>
      )}
    </Pressable>
  );
}

export default function SeccionDetalleScreen() {
  const router = useRouter();
  const theme = useTheme();
  const cart = useCart();
  const { id } = useLocalSearchParams<{ id: string; cartaId?: string }>();
  const { seccion, loading, refreshing, error, refresh } = useSeccionDetalle(id);

  const detalles = seccion?.detallesSeccionCarta ?? [];
  const destacados = detalles.slice(0, FEATURED_COUNT);
  const resto = detalles.slice(FEATURED_COUNT);

  const filas = useMemo<DetalleSeccionCartaItem[][]>(() => {
    const grupos: DetalleSeccionCartaItem[][] = [];
    for (let i = 0; i < resto.length; i += COLUMNS) grupos.push(resto.slice(i, i + COLUMNS));
    return grupos;
  }, [resto]);

  function cartQtyFor(detalleId: string): number {
    return cart.items.find((i) => i.detalleSeccionCartaId === detalleId)?.cantidad ?? 0;
  }

  function handleAddItem(detalle: DetalleSeccionCartaItem) {
    const { nombre, precio } = getItemMeta(detalle);
    cart.addItem({ detalleSeccionCartaId: detalle.id, nombre, precio });
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <AppHeader
          title={seccion?.nombre ?? "Sección"}
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
                    <TappableCard
                      key={detalle.id}
                      detalle={detalle}
                      featured
                      categoria={seccion?.categoria}
                      cartQty={cartQtyFor(detalle.id)}
                      onAdd={() => handleAddItem(detalle)}
                    />
                  ))}
                </View>
              ) : null
            }
            renderItem={({ item: fila }) => (
              <View style={styles.fila}>
                {fila.map((detalle) => (
                  <TappableCard
                    key={detalle.id}
                    detalle={detalle}
                    featured={false}
                    categoria={seccion?.categoria}
                    cartQty={cartQtyFor(detalle.id)}
                    onAdd={() => handleAddItem(detalle)}
                  />
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
  floatBadge: {
    position: "absolute",
    alignSelf: "center",
    bottom: "40%",
    backgroundColor: Brand[500],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  floatText: {
    fontSize: 13,
    color: "#ffffff",
    fontFamily: Fonts.bold,
  },
  qtyBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: Brand[500],
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 11,
    color: "#ffffff",
    fontFamily: Fonts.bold,
    lineHeight: 13,
  },
});
