import { Stack } from "expo-router";

import { CartProvider } from "@/controllers/context/CartContext";

/** Grupo de rutas del mozo. Acá vivirán las pantallas propias de mozos. */
export default function MozoLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}
