import { ActivityIndicator, View } from "react-native";

/**
 * Pantalla de entrada. El <AuthGate> del layout raíz redirige según la sesión,
 * así que acá solo mostramos un indicador mientras se resuelve el destino.
 */
export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
