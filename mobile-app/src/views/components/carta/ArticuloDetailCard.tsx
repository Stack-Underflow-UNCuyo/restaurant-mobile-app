import { StyleSheet, View } from "react-native";

import { ItemImage } from "@/views/components/carta/ItemImage";
import { ThemedText } from "@/views/components/themed-text";
import { Radius, Spacing } from "@/views/constants/theme";
import { useTheme } from "@/controllers/hooks/use-theme";
import { formatPrice } from "@/lib/format";
import type { Categoria, DetalleSeccionCartaArticuloIndividual } from "@/models/types/carta";

interface Props {
  detalle: DetalleSeccionCartaArticuloIndividual;
  seccionCategoria?: Categoria;
  /** Los primeros platos de la sección se muestran más grandes. */
  featured?: boolean;
}

export function ArticuloDetailCard({ detalle, seccionCategoria, featured = false }: Props) {
  const theme = useTheme();
  const { articulo } = detalle;
  const descripcion = detalle.descripcion ?? articulo.descripcion;

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <ItemImage
        imagenUrl={detalle.imagenUrl}
        nombre={articulo.nombre}
        categoria={seccionCategoria}
        style={featured ? styles.featuredImage : styles.image}
      />
      <View style={styles.body}>
        <ThemedText type={featured ? "subtitle" : "smallBold"} numberOfLines={featured ? 2 : 1}>
          {articulo.nombre}
        </ThemedText>
        {descripcion ? (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={featured ? 3 : 2}>
            {descripcion}
          </ThemedText>
        ) : null}
        <ThemedText type={featured ? "smallBold" : "small"} style={[styles.precio, { color: theme.brand }]}>
          {formatPrice(detalle.precio)}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { overflow: "hidden", borderRadius: Radius.lg, borderWidth: 1 },
  image: { height: 110, width: "100%" },
  featuredImage: { height: 180, width: "100%" },
  body: { gap: Spacing.one, padding: Spacing.three },
  precio: { marginTop: Spacing.one },
});
