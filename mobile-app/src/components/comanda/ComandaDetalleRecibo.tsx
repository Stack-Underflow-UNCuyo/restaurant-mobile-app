import { Pressable, StyleSheet, View } from "react-native";

import { Ionicons } from "@/components/icons";
import { ThemedText } from "@/components/themed-text";
import { estadoDetalleStyle } from "@/constants/estadoComanda";
import { Fonts, Gray, Radius, Spacing, Success } from "@/constants/theme";
import { formatHora } from "@/lib/format";
import { useTheme } from "@/hooks/use-theme";
import type { ComandaConDetalles } from "@/hooks/useComandas";
import type { DetalleComanda } from "@/types/comanda";

interface Props {
  comanda: ComandaConDetalles;
  /** Detalles ya filtrados por el chip activo. */
  detallesVisibles: DetalleComanda[];
  /** Navega a la carta para agregar nuevos ítems a la comanda. */
  onAdd?: () => void;
  /** Cambia el estado de un ítem ENTREGADO_PARA_DESPACHAR a ENTREGADO_AL_CLIENTE. */
  onDespachar?: (detalle: DetalleComanda) => void;
}

function formatMonto(monto: number): string {
  return `$${Math.round(monto).toLocaleString("es-AR")}`;
}

function DashedSeparator() {
  const theme = useTheme();
  return <View style={[styles.separador, { borderColor: theme.border }]} />;
}


const TOOTH_W = 26;
const TOOTH_H = 17;
const NUM_TEETH = 26;

/**
 * Jagged top border. Each notch is two stacked triangles:
 *  1. A borderColor triangle 1px larger in every direction — provides the outline.
 *  2. A bgColor triangle at normal size centered on top — fills the notch interior.
 * The 1px gap between them shows the border color along the slant edges.
 */
function JaggedBorder({ surfaceColor, bgColor, borderColor }: { surfaceColor: string; bgColor: string; borderColor: string }) {
  // Change this value to make the border thicker or thinner
  const borderThickness = 3; 

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

/** Tarjeta de recibo para una comanda: cada DetalleComanda como fila con punto de color. */
export function ComandaDetalleRecibo({ comanda, detallesVisibles, onAdd, onDespachar }: Props) {
  const theme = useTheme();

  const total = comanda.detalles.reduce(
    (acc, d) => acc + d.precio * d.cantidad,
    0,
  );

  return (
    <View style={styles.wrapper}>

      <JaggedBorder
        surfaceColor={theme.surface}
        bgColor={theme.background}
        borderColor={theme.border}
      />

      {/* Pin decorativo — centrado sobre el borde superior de la card */}
      <View style={styles.pinOuter} pointerEvents="none">
        <View style={styles.pinHead} />
        <View style={styles.pinNeedle} />
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            
          },
        ]}
      >
        <View style={styles.header}>
          <ThemedText style={[styles.totalMonto]}>Comanda #1</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {formatHora(comanda.fechaSolicitudComanda)}
          </ThemedText>
        </View>

        <DashedSeparator />

        <View style={styles.items}>
          {detallesVisibles.map((detalle) => {
            const { dot } = estadoDetalleStyle(detalle.estadoDetalleComanda);
            const esDespachar = detalle.estadoDetalleComanda === "ENTREGADO_PARA_DESPACHAR";
            return (
              <Pressable
                key={detalle.id}
                onPress={esDespachar && onDespachar ? () => onDespachar(detalle) : undefined}
                style={({ pressed }) => [
                  styles.fila,
                  esDespachar && styles.filaDespachar,
                  esDespachar && pressed && styles.filaDespacharPressed,
                ]}
              >
                <View style={[styles.dot, { backgroundColor: dot }]} />
                <ThemedText type="small" style={styles.nombre} numberOfLines={1}>
                  {detalle.nombre ?? "Pedido"}
                </ThemedText>
                {detalle.cantidad > 1 && (
                  <View style={[styles.cantBadge, { backgroundColor: Success[50] }]}>
                    <ThemedText style={[styles.cantText, { color: Success[600] }]}>
                      ×{detalle.cantidad}
                    </ThemedText>
                  </View>
                )}
                <View style={styles.guiones} />
                <ThemedText style={{fontSize: 16, fontWeight: 500}} themeColor="textSecondary">
                  {formatMonto(detalle.precio * detalle.cantidad)}
                </ThemedText>
                {esDespachar && onDespachar && (
                  <Ionicons name="checkmark-circle-outline" size={22} color={Success[500]} />
                )}
              </Pressable>
            );
          })}

          {detallesVisibles.length === 0 && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.vacio}>
              Sin pedidos con este estado.
            </ThemedText>
          )}
        </View>

        <Pressable style={[styles.addButton, { borderColor: Gray[400] }]} onPress={onAdd}>
          <ThemedText type="defaultBold" themeColor="textSecondary">
            +
          </ThemedText>
        </Pressable>

        <DashedSeparator />

        <View style={styles.totalFila}>
          <ThemedText style={{fontSize: 21, fontWeight: 800}}>Total</ThemedText>
          <ThemedText style={styles.totalMonto}>
            {formatMonto(total)}
          </ThemedText>
        </View>

        {/* Corner fold — debe coincidir con el fondo de la pantalla */}
        <View style={[{ backgroundColor: theme.background }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ── Wrapper & pin ─────────────────────────────────────────── */
  wrapper: {
    marginHorizontal: Spacing.four,
    marginTop: Spacing.two,
    paddingTop: 14, // espacio para que el pin sobresalga
  },
  pinOuter: {
    position: "absolute",
    top: 10,
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

  /* ── Card ───────────────────────────────────────────────────── */
  card: {
    borderWidth: 2,
    borderTopWidth: 0,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  separador: {
    borderBottomWidth: 2,
    borderStyle: "dashed",
  },

  /* ── Items ──────────────────────────────────────────────────── */
  items: { gap: Spacing.two + 2 },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginVertical: 4,
    borderRadius: Radius.md,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  filaDespachar: {
    backgroundColor: Success[50],
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  filaDespacharPressed: {
    opacity: 0.6,
  },
  dot: { width: 11, height: 11, borderRadius: Radius.full, flexShrink: 0 },
  nombre: { fontFamily: Fonts.regular, flexShrink: 1, fontSize: 16 },
  cantBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.one + 2,
    paddingVertical: 1,
    flexShrink: 0,
  },
  cantText: { fontSize: 12, fontFamily: Fonts.bold },
  guiones: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#d0d5dd",
    marginBottom: -2,
  },
  vacio: { textAlign: "center", paddingVertical: Spacing.two },

  /* ── Add button ─────────────────────────────────────────────── */
  addButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── Total ──────────────────────────────────────────────────── */
  totalFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalMonto: { fontFamily: Fonts.bold, fontSize: 21, fontWeight: 600},

  /* ── Jagged top border ──────────────────────────────────────── */
  jaggedStrip: {
    flexDirection: "row",
    height: TOOTH_H,
    overflow: "hidden",
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  tooth: {
    width: TOOTH_W,
    height: TOOTH_H,
  },


});