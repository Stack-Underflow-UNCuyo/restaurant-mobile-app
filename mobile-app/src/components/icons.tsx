import { View } from "react-native";

export function ChevronRightIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 16, height: 16, justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: 9, height: 9, borderRightWidth: 2, borderTopWidth: 2, borderColor: color, transform: [{ rotate: "45deg" }] }} />
    </View>
  );
}
