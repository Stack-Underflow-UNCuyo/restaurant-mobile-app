import { Image } from "expo-image";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import type { Categoria } from "@/types/carta";
import { imageForCategoria, resolveImagenUrl } from "@/lib/cartaImages";

interface Props {
  imagenUrl?: string;
  nombre: string;
  categoria?: Categoria;
  style?: StyleProp<ViewStyle>;
}

export function ItemImage({ imagenUrl, nombre, categoria, style }: Props) {
  const uri = resolveImagenUrl(imagenUrl);
  const fallback = imageForCategoria(categoria);

  return (
    <View style={[styles.container, style]}>
      <Image
        source={uri ? { uri } : fallback}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        accessibilityLabel={nombre}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: "hidden", backgroundColor: "#c8a07a" },
});
