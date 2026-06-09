import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Gray, Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/hooks/use-theme";
import { formatPrice } from "@/lib/format";
import { addDetalleComanda, createComanda } from "@/services/comandaService";

function formatMonto(monto: number): string {
  return `$${Math.round(monto).toLocaleString("es-AR")}`;
}

export default function CarritoScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { token } = useAuth();
  const cart = useCart();
  const { items, total, mesaId, comandaId, mesaNumero, increment, decrement, clearCart } = cart;

  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  function handleEnviar() {
    if (items.length === 0 || !mesaId || !token) return;
    setEnviando(true);
    setErrorEnvio(null);

    const obtenerComandaId: Promise<string> = comandaId
      ? Promise.resolve(comandaId)
      : createComanda(token, mesaId).then((c) => c.id);

    obtenerComandaId
      .then((cId) =>
        Promise.all(
          items.map((item) =>
            addDetalleComanda(token, cId, item.detalleSeccionCartaId, item.cantidad),
          ),
        ).then(() => cId),
      )
      .then(() => {
        const mid = mesaId;
        const num = mesaNumero;
        clearCart();
        router.replace({
          pathname: "/(mozo)/comanda/[mesaId]",
          params: { mesaId: mid!, ...(num ? { numero: num } : {}) },
        });
      })
      .catch((e: Error) =>
        setErrorEnvio(e?.message ?? "No se pudo enviar la comanda."),
      )
      .finally(() => setEnviando(false));
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <AppHeader title="Comanda #1" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.scroll}>
          {items.length === 0 ? (
            <View style={styles.empty}>
              <ThemedText type="default" themeColor="textSecondary" style={styles.emptyText}>
                {`No hay pedidos. Tocá "+" para agregar desde la carta.`}
              </ThemedText>
            </View>
          ) : (
            <View style={styles.items}>
              {items.map((item) => (
                <View
                  key={item.detalleSeccionCartaId}
                  style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.imgPlaceholder, { backgroundColor: Gray[300] }]} />

                  <View style={styles.info}>
                    <ThemedText type="smallBold" numberOfLines={1}>
                      {item.nombre}
                    </ThemedText>
                    <ThemedText type="small" style={{ color: theme.brand }}>
                      {formatPrice(item.precio)}
                    </ThemedText>
                  </View>

                  <View style={styles.controls}>
                    <Pressable
                      style={[styles.controlBtn, { borderColor: Gray[400] }]}
                      onPress={() => decrement(item.detalleSeccionCartaId)}
                      hitSlop={8}
                      disabled={enviando}
                    >
                      <ThemedText type="smallBold" themeColor="textSecondary">
                        −
                      </ThemedText>
                    </Pressable>

                    <ThemedText type="smallBold" style={styles.qty}>
                      {item.cantidad}
                    </ThemedText>

                    <Pressable
                      style={[styles.controlBtn, { borderColor: Gray[400] }]}
                      onPress={() => increment(item.detalleSeccionCartaId)}
                      hitSlop={8}
                      disabled={enviando}
                    >
                      <ThemedText type="smallBold" themeColor="textSecondary">
                        +
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Pressable
            style={[styles.addButton, { borderColor: Gray[400] }]}
            onPress={() => router.push("/(mozo)/carta")}
            disabled={enviando}
          >
            <ThemedText type="smallBold" themeColor="textSecondary">
              +
            </ThemedText>
          </Pressable>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <View style={styles.totalRow}>
            <ThemedText type="default">Total</ThemedText>
            <ThemedText type="default" style={styles.totalMonto}>
              {formatMonto(total)}
            </ThemedText>
          </View>

          {errorEnvio ? (
            <ThemedText type="small" style={[styles.error, { color: theme.error }]}>
              {errorEnvio}
            </ThemedText>
          ) : null}

          <Pressable
            style={[
              styles.enviarBtn,
              { backgroundColor: items.length === 0 ? Gray[300] : theme.brand },
            ]}
            onPress={handleEnviar}
            disabled={items.length === 0 || enviando}
          >
            {enviando ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <ThemedText type="smallBold" style={{ color: theme.brandText }}>
                Enviar a Cocina
              </ThemedText>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, padding: Spacing.four, gap: Spacing.three },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.six,
  },
  emptyText: { textAlign: "center" },
  items: { gap: Spacing.three },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.three,
  },
  imgPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: Radius.sm,
    flexShrink: 0,
  },
  info: { flex: 1, gap: Spacing.one },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  controlBtn: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  qty: { minWidth: 20, textAlign: "center" },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.two,
  },
  footer: {
    padding: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
    borderTopWidth: 1,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalMonto: { fontWeight: "700" },
  error: { textAlign: "center" },
  enviarBtn: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.three + 2,
    alignItems: "center",
  },
});
