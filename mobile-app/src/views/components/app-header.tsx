import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Animated, Pressable, StyleSheet, View, type ImageSourcePropType } from "react-native";

import { ThemedText } from "@/views/components/themed-text";
import { Brand, Fonts, Gray, Radius, Spacing } from "@/views/constants/theme";
import { useTheme } from "@/controllers/hooks/use-theme";

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  logo?: ImageSourcePropType;
  onCartPress?: () => void;
  cartCount?: number;
}


export function AppHeader({ title, subtitle, onBack, logo, onCartPress, cartCount = 0 }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {onBack && (
          <Pressable
            onPress={onBack}
            hitSlop={8}
            style={({ pressed }) => [styles.back, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </Pressable>
        )}
      </View>

      <View style={styles.texts}>
        <ThemedText type="subtitle" style={styles.centerText}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>

      <View style={[styles.side, styles.sideRight]}>
        {onCartPress ? (
          <Pressable
            onPress={onCartPress}
            hitSlop={10}
            style={({ pressed }) => [styles.cartBtn, { opacity: pressed ? 0.55 : 1 }]}
          >
            <Ionicons name="receipt-outline" size={24} color={theme.text} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>{cartCount > 99 ? "99" : cartCount}</ThemedText>
              </View>
            )}
          </Pressable>
        ) : (
          logo && <Image source={logo} style={styles.logo} contentFit="contain" />
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  side: { width: 48, alignItems: "flex-start" },
  sideRight: { alignItems: "flex-end" },
  back: { padding: Spacing.one },
  texts: { flex: 1, alignItems: "center", gap: Spacing.half },
  centerText: { textAlign: "center" },
  logo: { width: 36, height: 38 },
  cartBtn: { position: "relative", padding: Spacing.one },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    minWidth: 17,
    height: 17,
    borderRadius: Radius.full,
    backgroundColor: Brand[500],
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Gray[50],
  },
  badgeText: {
    fontSize: 10,
    color: "#ffffff",
    fontFamily: Fonts.bold,
    lineHeight: 12,
  },
});
