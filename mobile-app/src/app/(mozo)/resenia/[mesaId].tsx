import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts, Gray, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { createResenia } from "@/services/reseniaService";
import { useAuth } from "@/context/AuthContext";
import { useComandas } from "@/hooks/useComandas";
import { Resenia } from "@/types/carta";

const logo = require("../../../../assets/images/logo.png");

const RATINGS: {
  value: number;
  iconOutline: keyof typeof MaterialCommunityIcons.glyphMap;
  iconFilled: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  color: string;
}[] = [
  { value: 1, iconOutline: "emoticon-cry-outline",     iconFilled: "emoticon-cry",     label: "Muy malo",  color: "#dc2626" },
  { value: 2, iconOutline: "emoticon-sad-outline",     iconFilled: "emoticon-sad",     label: "Malo",      color: "#f97316" },
  { value: 3, iconOutline: "emoticon-neutral-outline", iconFilled: "emoticon-neutral", label: "Regular",   color: "#eab308" },
  { value: 4, iconOutline: "emoticon-happy-outline",   iconFilled: "emoticon-happy",   label: "Bueno",     color: "#22c55e" },
  { value: 5, iconOutline: "emoticon-excited-outline", iconFilled: "emoticon-excited", label: "Excelente", color: "#16a34a" },
];

type RatingValue = number;

const CATEGORIES = ["Ambiente", "Servicio", "Comida"] as const;
type Category = (typeof CATEGORIES)[number];

interface RatingPickerProps {
  value: RatingValue | null;
  onChange: (v: RatingValue) => void;
}

function RatingPicker({ value, onChange }: RatingPickerProps) {
  return (
    <View style={styles.iconRow}>
      {RATINGS.map((r) => {
        const selected = value === r.value;
        return (
          <Pressable
            key={r.value}
            onPress={() => onChange(r.value)}
            style={({ pressed }) => [
              styles.iconBtn,
              selected && { backgroundColor: r.color + "18" },
              pressed && { opacity: 0.7 },
            ]}
            hitSlop={4}
          >
            <MaterialCommunityIcons
              name={selected ? r.iconFilled : r.iconOutline}
              size={40}
              color={selected ? r.color : Gray[600]}
            />
            <ThemedText
              style={[styles.iconLabel, { color: selected ? r.color : "transparent" }]}
            >
              {r.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

interface CategoryRowProps {
  label: Category;
  value: RatingValue | null;
  onChange: (v: RatingValue) => void;
}

function CategoryRow({ label, value, onChange }: CategoryRowProps) {
  const theme = useTheme();
  return (
    <View style={[styles.categoryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <RatingPicker value={value} onChange={onChange} />
    </View>
  );
}

export default function ReseniaScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { token } = useAuth();
  const { mesaId, numero } = useLocalSearchParams<{ mesaId: string; numero?: string }>();
  const { comandas } = useComandas(mesaId);
  const comandaId = comandas[0]?.id;

  const [observacion, setObservacion] = useState("");
  const [ratings, setRatings] = useState<Record<Category, RatingValue | null>>({
    Ambiente: null,
    Servicio: null,
    Comida: null,
  });

  const allRated = CATEGORIES.every((c) => ratings[c] !== null);

  function setRating(category: Category, value: RatingValue) {
    setRatings((prev) => ({ ...prev, [category]: value }));
  }

  function handleSubmit() {
    if(!token || !comandaId) return;
    
    const resenia : Resenia = {
      ambiente: ratings["Ambiente"]!,
      servicio: ratings["Servicio"]!,
      comida: ratings["Comida"]!,
      observacion: observacion || undefined,
      comandaId: comandaId
    }

    createResenia(token, resenia, comandaId )
    router.push("/(mozo)/mesas");
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <AppHeader
          title="Reseña"
          subtitle={`Mesa ${numero ?? ""}`.trim()}
          onBack={() => router.back()}
          logo={logo}
        />

        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedText type="default" themeColor="textSecondary" style={styles.intro}>
            ¿Cómo fue tu experiencia? Calificá cada aspecto.
          </ThemedText>

          {CATEGORIES.map((cat) => (
            <CategoryRow
              key={cat}
              label={cat}
              value={ratings[cat]}
              onChange={(v) => setRating(cat, v)}
            />
          ))}

          <View style={[styles.observacionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <ThemedText type="smallBold">Observaciones</ThemedText>
            <TextInput
              style={[styles.observacionInput, { color: theme.text, borderColor: theme.border }]}
              placeholder="Contanos más sobre tu experiencia (Opcional)"
              placeholderTextColor={Gray[400]}
              value={observacion}
              onChangeText={setObservacion}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
            <ThemedText type="small" themeColor="textSecondary" style={styles.charCount}>
              {observacion.length}/500
            </ThemedText>
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              { backgroundColor: allRated ? theme.brand : Gray[300] },
              pressed && allRated && { opacity: 0.8 },
            ]}
            onPress={handleSubmit}
            disabled={!allRated}
          >
            <ThemedText type="smallBold" style={{ color: allRated ? theme.brandText : Gray[500] }}>
              Enviar reseña
            </ThemedText>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.skipBtn, pressed && { opacity: 0.6 }]}
            onPress={() => router.push("/(mozo)/mesas")}
          >
            <ThemedText type="small" themeColor="textSecondary">
              Omitir reseña
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
  intro: {
    textAlign: "center",
    marginBottom: Spacing.one,
  },
  categoryCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  iconRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  iconBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    gap: Spacing.one,
  },
  iconLabel: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    textAlign: "center",
  },
  observacionCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  observacionInput: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    padding: Spacing.three,
    minHeight: 100,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  charCount: { textAlign: "right" },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderTopWidth: 1,
  },
  submitBtn: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.three + 2,
    alignItems: "center",
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: Spacing.two,
  },
});
