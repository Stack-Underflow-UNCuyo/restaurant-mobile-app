import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ItemPreviewCard, type PreviewItem } from "@/views/components/carta/ItemPreviewCard";
import { ThemedText } from "@/views/components/themed-text";
import { Spacing } from "@/views/constants/theme";
import { useTheme } from "@/controllers/hooks/use-theme";
import { isDetalleArticulo, isDetalleMenu } from "@/models/types/carta";
import type { Categoria, DetalleSeccionCartaItem, SeccionCarta } from "@/models/types/carta";

function toPreviewItem(detalle: DetalleSeccionCartaItem, categoria?: Categoria): PreviewItem | null {
  if (isDetalleArticulo(detalle)) {
    return {
      id: detalle.id,
      nombre: detalle.articulo.nombre,
      precio: detalle.precio,
      imagenUrl: detalle.imagenUrl,
      categoria,
    };
  }
  if (isDetalleMenu(detalle)) {
    return {
      id: detalle.id,
      nombre: detalle.menu.nombre,
      precio: detalle.menu.precio,
      imagenUrl: detalle.menu.imagenUrl ?? detalle.imagenUrl,
      categoria,
    };
  }
  return null;
}

interface Props {
  seccion: SeccionCarta;
  onVerMas: (seccion: SeccionCarta) => void;
}

/** Fila con el título de una sección, su acceso "Ver más" y un carrusel horizontal de platos. */
export function SeccionPreviewRow({ seccion, onVerMas }: Props) {
  const theme = useTheme();
  const items = seccion.detallesSeccionCarta
    .map((d) => toPreviewItem(d, seccion.categoria))
    .filter((item): item is PreviewItem => item !== null);

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={[styles.header, { borderColor: theme.border }]}>
        <ThemedText type="smallBold" numberOfLines={1} style={styles.titulo}>
          {seccion.nombre}
        </ThemedText>
        <Pressable onPress={() => onVerMas(seccion)} hitSlop={8}>
          <ThemedText type="small" style={{ color: theme.brand }}>
            Ver más ›
          </ThemedText>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <ItemPreviewCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.three },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
  },
  titulo: { flex: 1 },
  row: { gap: Spacing.three, paddingHorizontal: Spacing.four },
});
