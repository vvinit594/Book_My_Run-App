import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

interface HelpCardProps {
  onContactPress?: () => void;
}

function HelpCard({ onContactPress }: HelpCardProps) {
  return (
    <View style={styles.helpCard}>
      <Ionicons name="help-circle" size={24} color={Colors.primary} />
      <View style={styles.helpContent}>
        <Text style={styles.helpTitle}>Need Help?</Text>
        <Text style={styles.helpText}>
          Contact our support team for assistance with event creation
        </Text>
      </View>
      <TouchableOpacity style={styles.helpButton} onPress={onContactPress}>
        <Text style={styles.helpButtonText}>Contact</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  helpContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  helpText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  helpButton: {
    backgroundColor: "#FFE8EC",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  helpButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
  },
});

export default memo(HelpCard);
