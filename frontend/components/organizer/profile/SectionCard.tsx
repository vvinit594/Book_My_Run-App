import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../../constants/spacing";

interface SectionCardProps {
  title: string;
  children: ReactNode;
  infoText?: string;
}

export default function SectionCard({
  title,
  children,
  infoText,
}: SectionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {infoText ? <Text style={styles.infoText}>{infoText}</Text> : null}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  infoText: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  content: {
    gap: Spacing.sm,
  },
});
