import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PrimaryButton from "./PrimaryButton";
import Colors from "../../../constants/colors";
import { Spacing } from "../../../constants/spacing";

interface ProfileFooterProps {
  onComplete: () => void;
  loading?: boolean;
}

export default function ProfileFooter({
  onComplete,
  loading = false,
}: ProfileFooterProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
      <PrimaryButton
        title="Complete Profile"
        onPress={onComplete}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
});
