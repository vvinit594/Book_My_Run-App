import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../constants/spacing";

interface LogoutButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export default function LogoutButton({
  onPress,
  loading = false,
}: LogoutButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={Colors.textWhite} />
      ) : (
        <>
          <Ionicons name="log-out-outline" size={20} color={Colors.textWhite} />
          <Text style={styles.text}>Logout</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    minHeight: 52,
    marginTop: Spacing.sm,
  },
  text: {
    color: Colors.textWhite,
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
});
