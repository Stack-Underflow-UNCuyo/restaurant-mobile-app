import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { CartaListItem } from "@/components/carta/CartaListItem";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Radius, Spacing } from "@/constants/theme";
import { useCart } from "@/context/CartContext";
import { useCartas } from "@/hooks/useCartas";
import { useTheme } from "@/hooks/use-theme";
import type { Carta } from "@/types/carta";

const logo = require("../../../../assets/images/logo.png");

export default function CartasScreen() {
  const router = useRouter();
  const theme = useTheme();
  const cart = useCart();
  const { cartas, loading, refreshing, error, refresh } = useCartas();

  const abrirCarta = (carta: Carta) => {
    router.push({ pathname: "/(mozo)/carta/[cartaId]", params: { cartaId: carta.id } });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <AppHeader
          title="Cartas"
          subtitle={loading ? undefined : `${cartas.length} disponibles`}
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
        ) : (
          <FlatList
            data={cartas}
            keyExtractor={(carta) => carta.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <CartaListItem carta={item} onPress={abrirCarta} />}
            ListHeaderComponent={
              <View style={styles.hero}>
                <Image source={logo} style={styles.logo} contentFit="contain" accessibilityLabel="Logo" />
              </View>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.brand} />
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
                  Todavía no hay cartas publicadas.
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
  hero: { alignItems: "center", paddingVertical: Spacing.four },
  logo: { width: 132, height: 140 },
});
