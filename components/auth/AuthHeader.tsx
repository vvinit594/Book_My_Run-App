import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { FontSize, Spacing } from "../../constants/spacing";

interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export default function AuthHeader({
  title = "Let's get started",
  subtitle = "Welcome to BookMyRun",
  onBack,
  showBack = false,
}: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      {showBack && onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
    marginLeft: -Spacing.xs,
  },
  backPlaceholder: {
    height: 0,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});
