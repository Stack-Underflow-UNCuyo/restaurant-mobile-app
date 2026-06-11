import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KanbanColumn } from "@/views/components/cocinero/KanbanColumn";
import { ThemedText } from "@/views/components/themed-text";
import { ThemedView } from "@/views/components/themed-view";
import { TopBar } from "@/views/components/top-bar";
import { Radius, Spacing } from "@/views/constants/theme";
import { useKanban } from "@/controllers/hooks/useKanban";
import { useTheme } from "@/controllers/hooks/use-theme";

const logo = require("../../../assets/images/logo.png");

const COLUMN_MIN_WIDTH = 200;

export default function CocineroKanban() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { pendiente, enProceso, listo, loading, refreshing, error, refresh, moverDetalle } =
    useKanban();

  const columnWidth = Math.max(
    COLUMN_MIN_WIDTH,
    (width - Spacing.three * 2 - Spacing.two * 2) / 3,
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <TopBar title="Cocina" logo={logo} />

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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.board}
            contentContainerStyle={styles.kanban}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                tintColor={theme.brand}
              />
            }
          >
            <KanbanColumn
              title="Pendiente"
              items={pendiente}
              nextEstado="COCINERO_ASIGNADO"
              onAction={moverDetalle}
              width={columnWidth}
            />
            <KanbanColumn
              title="En proceso"
              items={enProceso}
              nextEstado="ENTREGADO_PARA_DESPACHAR"
              onAction={moverDetalle}
              width={columnWidth}
            />
            <KanbanColumn
              title="Listo"
              items={listo}
              nextEstado="ENTREGADO_AL_CLIENTE"
              onAction={moverDetalle}
              width={columnWidth}
            />
          </ScrollView>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  board: { flex: 1 },
  kanban: {
    padding: Spacing.three,
    gap: Spacing.two,
    alignItems: "stretch",
  },
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
