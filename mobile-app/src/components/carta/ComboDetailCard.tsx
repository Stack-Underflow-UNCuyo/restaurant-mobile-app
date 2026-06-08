import { StyleSheet, View } from "react-native";

import { ItemImage } from "@/components/carta/ItemImage";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatPrice } from "@/lib/format";
import type { Categoria, DetalleSeccionCartaMenu } from "@/types/carta";

interface Props {
  detalle: DetalleSeccionCartaMenu;
  seccionCategoria?: Categoria;
  /** Los primeros combos de la sección se muestran más grandes, con la lista completa. */
  featured?: boolean;
}

export function ComboDetailCard({ detalle, seccionCategoria, featured = false }: Props) {
  const theme = useTheme();
  const { menu } = detalle;
  // El combo prioriza la imagen del Menu (reutilizable entre cartas) y cae al de su detalle de sección.
  const imagenUrl = menu.imagenUrl ?? detalle.imagenUrl;
  const items = featured ? menu.detallesMenu : menu.detallesMenu.slice(0, 3);

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <ItemImage
        imagenUrl={imagenUrl}
        nombre={menu.nombre}
        categoria={seccionCategoria}
        style={featured ? styles.featuredImage : styles.image}
      />
      <View style={styles.body}>
        <ThemedText type={featured ? "subtitle" : "smallBold"} numberOfLines={featured ? 2 : 1}>
          {menu.nombre}
        </ThemedText>
        {menu.descripcion ? (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
            {menu.descripcion}
          </ThemedText>
        ) : null}
        {items.length > 0 && (
          <View style={styles.lista}>
            {items.map((item) => (
              <ThemedText key={item.id} type="small" themeColor="textSecondary" numberOfLines={1}>
                {item.cantidad}× {item.nombre}
              </ThemedText>
            ))}
          </View>
        )}
        <ThemedText type={featured ? "smallBold" : "small"} style={[styles.precio, { color: theme.brand }]}>
          {formatPrice(menu.precio)}
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
  lista: { gap: 2 },
  precio: { marginTop: Spacing.one },
});
