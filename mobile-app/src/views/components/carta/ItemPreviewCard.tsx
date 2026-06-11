import { StyleSheet, View } from "react-native";

import { ItemImage } from "@/views/components/carta/ItemImage";
import { ThemedText } from "@/views/components/themed-text";
import { Radius, Spacing } from "@/views/constants/theme";
import { useTheme } from "@/controllers/hooks/use-theme";
import { formatPrice } from "@/lib/format";
import type { Categoria } from "@/models/types/carta";

export interface PreviewItem {
  id: string;
  nombre: string;
  precio: number;
  imagenUrl?: string;
  categoria?: Categoria;
}

/** Tarjeta angosta para el carrusel horizontal de la vista previa del menú. */
export function ItemPreviewCard({ item }: { item: PreviewItem }) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <ItemImage imagenUrl={item.imagenUrl} nombre={item.nombre} categoria={item.categoria} style={styles.image} />
      <View style={styles.body}>
        <ThemedText type="small" numberOfLines={1}>
          {item.nombre}
        </ThemedText>
        <ThemedText type="smallBold" style={{ color: theme.brand }}>
          {formatPrice(item.precio)}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: 132, overflow: "hidden", borderRadius: Radius.lg, borderWidth: 1 },
  image: { height: 90, width: "100%" },
  body: { gap: 2, padding: Spacing.two },
});
