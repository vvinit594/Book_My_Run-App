import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors from "../../constants/colors";
import { Spacing, FontSize } from "../../constants/spacing";

interface EventDetailsHeaderProps {
  title: string;
  onSharePress?: () => void;
}

export default function EventDetailsHeader({
  title,
  onSharePress,
}: EventDetailsHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />
      
      {/* Back Button */}
      <Pressable style={styles.iconButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.textWhite} />
      </Pressable>

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Share Button */}
      <Pressable style={styles.iconButton} onPress={onSharePress}>
        <Ionicons name="share-social-outline" size={22} color={Colors.textWhite} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.backgroundDark,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + Spacing.md : Spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    color: Colors.textWhite,
    fontSize: FontSize.lg,
    fontWeight: "600",
    textAlign: "center",
    marginHorizontal: Spacing.sm,
  },
});
