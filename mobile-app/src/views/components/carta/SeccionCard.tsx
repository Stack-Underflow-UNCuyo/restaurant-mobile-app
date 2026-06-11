import { Pressable, StyleSheet, View } from "react-native";

import { ItemImage } from "@/views/components/carta/ItemImage";
import { ThemedText } from "@/views/components/themed-text";
import { Brand, Radius, Spacing } from "@/views/constants/theme";
import { useTheme } from "@/controllers/hooks/use-theme";
import type { SeccionCarta } from "@/models/types/carta";

interface Props {
  seccion: SeccionCarta;
  onPress: (seccion: SeccionCarta) => void;
  /** La primera sección de la carta se destaca a todo el ancho con la imagen de fondo. */
  featured?: boolean;
}

export function SeccionCard({ seccion, onPress, featured = false }: Props) {
  const theme = useTheme();

  if (featured) {
    return (
      <Pressable
        onPress={() => onPress(seccion)}
        style={({ pressed }) => [styles.featuredCard, { opacity: pressed ? 0.92 : 1 }]}
      >
        <ItemImage imagenUrl={seccion.imagenUrl} nombre={seccion.nombre} categoria={seccion.categoria} style={StyleSheet.absoluteFill} />
        <View style={styles.featuredOverlay} />
        <View style={styles.featuredContent}>
          {seccion.categoria && (
            <View style={styles.badgeOnImage}>
              <ThemedText type="small" style={styles.badgeOnImageText}>
                {seccion.categoria.nombre}
              </ThemedText>
            </View>
          )}
          <ThemedText type="subtitle" style={styles.featuredTitle}>
            {seccion.nombre}
          </ThemedText>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => onPress(seccion)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <ItemImage imagenUrl={seccion.imagenUrl} nombre={seccion.nombre} categoria={seccion.categoria} style={styles.image} />
      <View style={styles.body}>
        {seccion.categoria && (
          <View style={[styles.badge, { backgroundColor: Brand[50] }]}>
            <ThemedText type="small" style={{ color: theme.brand }}>
              {seccion.categoria.nombre}
            </ThemedText>
          </View>
        )}
        <ThemedText type="smallBold" numberOfLines={1}>
          {seccion.nombre}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  featuredCard: {
    height: 180,
    borderRadius: Radius.lg,
    overflow: "hidden",
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Brand[950],
    opacity: 0.45,
  },
  featuredContent: {
    flex: 1,
    justifyContent: "flex-end",
    gap: Spacing.two,
    padding: Spacing.four,
  },
  featuredTitle: { color: "#fff" },
  badgeOnImage: {
    alignSelf: "flex-start",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.half + 2,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  badgeOnImageText: { color: "#fff" },
  card: {
    flex: 1,
    overflow: "hidden",
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  image: { height: 100, width: "100%" },
  body: { gap: Spacing.one + 2, padding: Spacing.three },
  badge: {
    alignSelf: "flex-start",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.half + 2,
  },
});
