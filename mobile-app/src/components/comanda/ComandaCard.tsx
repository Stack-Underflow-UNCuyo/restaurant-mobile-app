import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { estadoComandaStyle } from "@/constants/estadoComanda";
import { Brand, Fonts, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { ComandaConDetalles } from "@/hooks/useComandas";

interface Props {
  comanda: ComandaConDetalles;
  /** Número secuencial a mostrar ("Comanda #N"); no es un campo del backend. */
  numero: number;
}

/** Formatea "2024-01-15T15:31:00" como "15:31". */
function formatHora(fechaIso: string): string {
  const hora = fechaIso.slice(11, 16);
  return hora || "--:--";
}

function formatMonto(monto: number): string {
  return `$${Math.round(monto)}`;
}

const TOOTH_W = 20;
const TOOTH_H = 13;
const NUM_TEETH = 40;

/**
 * Jagged top border. Each notch is two stacked triangles:
 *  1. A borderColor triangle 1px larger in every direction — provides the outline.
 *  2. A bgColor triangle at normal size centered on top — fills the notch interior.
 * The 1px gap between them shows the border color along the slant edges.
 */
function JaggedBorder({ surfaceColor, bgColor, borderColor }: { surfaceColor: string; bgColor: string; borderColor: string }) {
  // Change this value to make the border thicker or thinner
  const borderThickness = 1.5; 

  return (
    <View style={[styles.jaggedStrip, { backgroundColor: surfaceColor, borderColor }]}>
      {Array.from({ length: NUM_TEETH }).map((_, i) => (
        <View key={i} style={styles.tooth}>
          
          <View style={{
            position: "absolute", 
            top: 0, 
            // Shifts left to perfectly center the larger triangle over the inner one
            left: (TOOTH_W / 2) - borderThickness, 
            width: 0, 
            height: 0,
            borderLeftWidth: (TOOTH_W / 2) + borderThickness,
            borderRightWidth: (TOOTH_W / 2) + borderThickness,
            borderTopWidth: TOOTH_H + borderThickness,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderTopColor: borderColor,
          }} />

          <View style={{
            position: "absolute", 
            top: 0, 
            left: TOOTH_W / 2,
            width: 0, 
            height: 0,
            borderLeftWidth: TOOTH_W / 2,
            borderRightWidth: TOOTH_W / 2,
            borderTopWidth: TOOTH_H,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderTopColor: bgColor,
          }} />

        </View>
      ))}
    </View>
  );
}

/** Tarjeta de una comanda: número, hora, líneas de pedido y estado de comanda. */
export function ComandaCard({ comanda, numero }: Props) {
  const theme = useTheme();
  const s = estadoComandaStyle(comanda.estadoComanda);

  return (
    <View style={styles.wrapper}>
      {/* Pin decorativo — centrado sobre el borde superior de la card */}
      <View style={styles.pinOuter} pointerEvents="none">
        <View style={styles.pinHead} />
        <View style={styles.pinNeedle} />
      </View>

      {/* Jagged strip IS the top border */}
      <JaggedBorder
        surfaceColor={theme.surface}
        bgColor={theme.background}
        borderColor={theme.border}
      />

      {/* Card body — left/right/bottom borders only; top is the jagged strip */}
      <View style={[styles.cardBody, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.dot, { backgroundColor: Brand[500] }]} />
            <ThemedText type="smallBold">Comanda #{numero}</ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {formatHora(comanda.fechaSolicitudComanda)}
          </ThemedText>
        </View>

        <View style={[styles.separador, { borderColor: theme.border }]} />

        <View style={styles.items}>
          {comanda.detalles.map((detalle) => (
            <View key={detalle.id} style={styles.item}>
              <ThemedText type="small" numberOfLines={1} style={styles.itemNombre}>
                {detalle.nombre ?? "Pedido"} x{detalle.cantidad}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {formatMonto(detalle.precio * detalle.cantidad)}
              </ThemedText>
            </View>
          ))}
          {comanda.detalles.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary">
              Sin pedidos cargados.
            </ThemedText>
          )}
        </View>

        <View style={styles.footer}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.idText} numberOfLines={1}>
            #{comanda.id.slice(0, 8).toUpperCase()}
          </ThemedText>
          <View style={[styles.badge, { backgroundColor: s.bg }]}>
            <View style={[styles.badgeDot, { backgroundColor: s.dot }]} />
            <ThemedText type="small" style={[styles.badgeLabel, { color: s.fg }]}>
              {s.label}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ── Wrapper & pin ─────────────────────────────────────────── */
  wrapper: {
    flex: 1,
    paddingTop: 14,
  },
  pinOuter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  pinHead: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#e53935",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  pinNeedle: {
    width: 3,
    height: 8,
    backgroundColor: "#9e9e9e",
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },

  /* ── Jagged top border ──────────────────────────────────────── */
  jaggedStrip: {
    flexDirection: "row",
    height: TOOTH_H,
    overflow: "hidden",
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  tooth: {
    width: TOOTH_W,
    height: TOOTH_H,
  },

  /* ── Card body ──────────────────────────────────────────────── */
  cardBody: {
    flex: 1,
    minHeight: 180,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.one + 2 },
  dot: { width: 8, height: 8, borderRadius: Radius.full },
  separador: { borderBottomWidth: 1, borderStyle: "dashed" },
  items: { gap: Spacing.one + 2 },
  item: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: Spacing.two },
  itemNombre: { flex: 1, fontFamily: Fonts.medium },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: Spacing.two },
  idText: { fontSize: 11, lineHeight: 16, fontFamily: Fonts.regular },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.one + 2,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half + 2,
    borderRadius: Radius.full,
  },
  badgeDot: { width: 7, height: 7, borderRadius: Radius.full },
  badgeLabel: { fontSize: 12, lineHeight: 16 },
});
