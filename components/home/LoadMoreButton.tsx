import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import Colors from "../../constants/colors";
import { Spacing, FontSize, BorderRadius } from "../../constants/spacing";

interface LoadMoreButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export default function LoadMoreButton({ onPress, loading = false }: LoadMoreButtonProps) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Colors.primary} />
      ) : (
        <>
          <Text style={styles.icon}>⬇️</Text>
          <Text style={styles.text}>Show More Events</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundSecondary,
  },
  icon: {
    fontSize: FontSize.md,
  },
  text: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
});
