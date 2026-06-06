import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts, Radius, Spacing } from "@/constants/theme";

const logo = require("../../assets/images/logo.png");
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme";

export default function LoginScreen() {
  const { login } = useAuth();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (submitting) return;
    setError(null);

    if (!email.trim() || !clave) {
      setError("Ingresá tu email y contraseña.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), clave);
      // El AuthGate del layout raíz se encarga de redirigir según el rol.
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Image
                source={logo}
                style={styles.logo}
                contentFit="contain"
                accessibilityLabel="Aromas de Viña"
              />
              <ThemedText type="subtitle" style={styles.centerText}>
                Iniciar sesión
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
                Ingresá tus datos para continuar
              </ThemedText>
            </View>

            <View style={styles.form}>
              <View style={styles.field}>
                <ThemedText type="smallBold">Email</ThemedText>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="mozo@restaurant.com"
                  placeholderTextColor={theme.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  editable={!submitting}
                  style={inputStyle}
                />
              </View>

              <View style={styles.field}>
                <ThemedText type="smallBold">Contraseña</ThemedText>
                <TextInput
                  value={clave}
                  onChangeText={setClave}
                  placeholder="••••••"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry
                  editable={!submitting}
                  onSubmitEditing={handleSubmit}
                  returnKeyType="go"
                  style={inputStyle}
                />
              </View>

              {error && (
                <ThemedText type="small" themeColor="error">
                  {error}
                </ThemedText>
              )}

              <Pressable
                onPress={handleSubmit}
                disabled={submitting}
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: pressed ? theme.brandHover : theme.brand },
                  submitting && { opacity: 0.7 },
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color={theme.brandText} />
                ) : (
                  <ThemedText type="smallBold" style={{ color: theme.brandText }}>
                    Ingresar
                  </ThemedText>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
  },
  header: { gap: Spacing.two, alignItems: "center" },
  logo: {
    width: 132,
    height: 140,
    marginBottom: Spacing.two,
  },
  centerText: { textAlign: "center" },
  form: { gap: Spacing.three },
  field: { gap: Spacing.two },
  input: {
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
    fontFamily: Fonts.regular,
  },
  button: {
    height: 50,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.two,
  },
});
