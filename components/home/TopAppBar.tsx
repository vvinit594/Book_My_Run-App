import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing, FontSize } from "../../constants/spacing";

interface TopAppBarProps {
  city: string;
  onCityPress: () => void;
  onSearchPress: () => void;
  onProfilePress: () => void;
}

export default function TopAppBar({
  city,
  onCityPress,
  onSearchPress,
  onProfilePress,
}: TopAppBarProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />
      
      {/* City Selector */}
      <Pressable style={styles.citySelector} onPress={onCityPress}>
        <Ionicons name="location-sharp" size={20} color={Colors.primary} />
        <Text style={styles.cityText}>{city}</Text>
        <Ionicons name="chevron-down" size={18} color={Colors.textWhite} />
      </Pressable>

      {/* Right Icons */}
      <View style={styles.rightIcons}>
        <Pressable style={styles.iconButton} onPress={onSearchPress}>
          <Ionicons name="search-outline" size={24} color={Colors.textWhite} />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={onProfilePress}>
          <Ionicons name="person-circle-outline" size={26} color={Colors.textWhite} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.backgroundDark,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + Spacing.md : Spacing.md,
  },
  citySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  cityText: {
    color: Colors.textWhite,
    fontSize: FontSize.lg,
    fontWeight: "600",
    marginLeft: Spacing.xs,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconButton: {
    padding: Spacing.xs,
  },
});
