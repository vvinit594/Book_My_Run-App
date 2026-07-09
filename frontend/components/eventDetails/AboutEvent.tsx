import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Colors from "../../constants/colors";
import { Spacing, FontSize, BorderRadius } from "../../constants/spacing";

interface AboutEventProps {
  content: string;
  maxLines?: number;
}

export default function AboutEvent({ content, maxLines = 5 }: AboutEventProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>About the Event</Text>
      
      <Text
        style={styles.content}
        numberOfLines={expanded ? undefined : maxLines}
      >
        {content}
      </Text>

      <Pressable onPress={() => setExpanded(!expanded)}>
        <Text style={styles.readMore}>
          {expanded ? "Show Less" : "Read More"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  content: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  readMore: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: "600",
    marginTop: Spacing.sm,
  },
});
