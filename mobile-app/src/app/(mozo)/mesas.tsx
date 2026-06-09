import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useMesas } from "@/hooks/useMesas";
import { useTheme } from "@/hooks/use-theme";
import { getComandas } from "@/services/comandaService";
import type { Mesa } from "@/types/mesa";

const logo = require("../../../assets/images/logo.png");
const COLUMNS = 2;

export default function MesasDashboard() {
  const router = useRouter();
  const theme = useTheme();
  const { token } = useAuth();
  const cart = useCart();
  const { mesas, loading, refreshing, error, refresh, cambiarEstado } = useMesas();

  const [filtro, setFiltro] = useState<FiltroMesa>("TODAS");
  const [mesaSel, setMesaSel] = useState<Mesa | null>(null);
  // IDs de mesas OCUPADA que ya tienen al menos una comanda abierta.
  const [mesasConComanda, setMesasConComanda] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!token) return;
    getComandas(token)
      .then((cs) => {
        const ids = new Set(
          cs
            .filter((c) => c.estadoComanda === "ABIERTA" && c.mesaRestauranteId)
            .map((c) => c.mesaRestauranteId as string),
        );
        setMesasConComanda(ids);
      })
      .catch(() => {});
  }, [token]);

  const verComandas = (mesa: Mesa) => {
    router.push({
      pathname: "/(mozo)/comanda/[mesaId]",
      params: { mesaId: mesa.id, numero: String(mesa.identificadorMesa) },
    });
  };

  const handlePress = (mesa: Mesa) => {
    if (mesa.estadoMesa === "OCUPADA") {
      verComandas(mesa);
    } else {
      setMesaSel(mesa);
    }
  };

  const handleCrearComanda = (mesa: Mesa) => {
    cart.startCart(mesa.id, null, String(mesa.identificadorMesa));
    router.push("/(mozo)/carta");
  };

  const visibles = useMemo(
    () => (filtro === "TODAS" ? mesas : mesas.filter((m) => m.estadoMesa === filtro)),
    [mesas, filtro],
  );

  const filas = useMemo(() => {
    const grupos: Mesa[][] = [];
    for (let i = 0; i < visibles.length; i += COLUMNS) grupos.push(visibles.slice(i, i + COLUMNS));
    return grupos;
  }, [visibles]);

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
                    onPress={handlePress}
                    onLongPress={setMesaSel}
                    atencion={requiereAtencion(mesa.estadoMesa)}
                    onCrearComanda={
                      mesa.estadoMesa === "OCUPADA" && !mesasConComanda.has(mesa.id)
                        ? () => handleCrearComanda(mesa)
                        : undefined
                    }
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
