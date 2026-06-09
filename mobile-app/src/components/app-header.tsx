import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { Animated, Pressable, StyleSheet, View, type ImageSourcePropType } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Brand, Fonts, Gray, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  logo?: ImageSourcePropType;
  onCartPress?: () => void;
  cartCount?: number;
}

function ReceiptIcon({ color }: { color: string }) {
  return (
    <View style={[receipt.paper, { borderColor: color }]}>
      <View style={[receipt.line, { width: "78%", backgroundColor: color }]} />
      <View style={[receipt.line, { width: "55%", backgroundColor: color }]} />
      <View style={[receipt.line, { width: "78%", backgroundColor: color }]} />
      <View style={[receipt.line, { width: "40%", backgroundColor: color }]} />
    </View>
  );
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
            <SymbolView
              name={{ ios: "chevron.left", android: "chevron_left" }}
              size={24}
              tintColor={theme.text}
              weight="semibold"
            />
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
            <ReceiptIcon color={theme.text} />
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

const receipt = StyleSheet.create({
  paper: {
    width: 22,
    height: 28,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    gap: 3.5,
    paddingHorizontal: 3,
  },
  line: {
    height: 1.5,
    borderRadius: 1,
  },
});

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
