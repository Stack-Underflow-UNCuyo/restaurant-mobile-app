import { Image } from "expo-image";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Gray } from "@/constants/theme";
import { resolveImagenUrl } from "@/lib/cartaImages";

interface Props {
  imagenUrl?: string;
  nombre: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Imagen de un plato/sección con resolución de URL relativa. Si no hay
 * imagen propia, muestra una caja gris de relleno — mismo recurso visual
 * que usa el prototipo para los platos sin foto (Frames 5–6), en vez de
 * portar los placeholders SVG por categoría del sitio web (sin soporte SVG
 * en esta app).
 */
export function ItemImage({ imagenUrl, nombre, style }: Props) {
  const uri = resolveImagenUrl(imagenUrl);

  return (
    <View style={[styles.container, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          accessibilityLabel={nombre}
        />
      ) : (
        <View style={styles.placeholder}>
          <ThemedText type="smallBold" style={styles.placeholderText}>
            Img
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: "hidden", backgroundColor: Gray[200] },
  placeholder: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  placeholderText: { color: Gray[500] },
});
