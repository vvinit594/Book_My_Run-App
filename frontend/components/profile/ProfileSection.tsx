import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/colors";
import { FontSize, Spacing } from "../../constants/spacing";

interface ProfileSectionProps {
  title: string;
  children: ReactNode;
}

export default function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
});
