import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing, FontSize } from "../../constants/spacing";

interface SectionHeaderProps {
  title: string;
  icon?: string;
  showFilter?: boolean;
  onFilterPress?: () => void;
}

export default function SectionHeader({
  title,
  icon,
  showFilter = false,
  onFilterPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {icon && (
          <Text style={styles.icon}>{icon}</Text>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {showFilter && (
        <Pressable style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons name="options-outline" size={20} color={Colors.primary} />
          <Text style={styles.filterText}>Filter</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  icon: {
    fontSize: FontSize.xl,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: "500",
  },
});
