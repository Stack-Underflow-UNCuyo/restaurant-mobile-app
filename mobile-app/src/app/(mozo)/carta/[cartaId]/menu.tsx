import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/views/components/app-header";
import { SeccionPreviewRow } from "@/views/components/carta/SeccionPreviewRow";
import { ThemedText } from "@/views/components/themed-text";
import { ThemedView } from "@/views/components/themed-view";
import { Radius, Spacing } from "@/views/constants/theme";
import { useCartaDetalle } from "@/controllers/hooks/useCartaDetalle";
import { useTheme } from "@/controllers/hooks/use-theme";
import type { SeccionCarta } from "@/models/types/carta";

const logo = require("../../../../../assets/images/logo.png");
const MAX_PREVIEW_SECCIONES = 4;

export default function MenuPreviewScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { cartaId } = useLocalSearchParams<{ cartaId: string }>();
  const { carta, loading, refreshing, error, refresh } = useCartaDetalle(cartaId);

  // Solo se muestran secciones con platos cargados, hasta el máximo del preview.
  const secciones = useMemo(
    () =>
      (carta?.seccionesCarta ?? [])
        .filter((seccion) => seccion.detallesSeccionCarta.length > 0)
        .slice(0, MAX_PREVIEW_SECCIONES),
    [carta],
  );

  const verSeccion = (seccion: SeccionCarta) => {
    router.push({
      pathname: "/(mozo)/seccion/[id]",
      params: { id: seccion.id, cartaId: cartaId ?? "" },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <AppHeader
          title="Menú"
          subtitle={carta?.nombre}
          onBack={() => router.back()}
          logo={logo}
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
            data={secciones}
            keyExtractor={(seccion) => seccion.id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.brand} />
            }
            renderItem={({ item }) => <SeccionPreviewRow seccion={item} onVerMas={verSeccion} />}
            ListEmptyComponent={
              <View style={styles.center}>
                <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
                  Todavía no hay platos cargados para mostrar en esta vista previa.
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
  list: { paddingVertical: Spacing.three, gap: Spacing.five },
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
