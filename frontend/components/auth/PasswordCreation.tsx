import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import PasswordInput from "./PasswordInput";
import { MIN_PASSWORD_LENGTH } from "../../constants/auth";
import Colors from "../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../constants/spacing";
import { useAuth } from "../../store/authStore";

interface PasswordCreationProps {
  onSuccess: () => void;
}

export default function PasswordCreation({ onSuccess }: PasswordCreationProps) {
  const { createPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>(
    {}
  );

  const handleSave = async () => {
    const nextErrors: { password?: string; confirmPassword?: string } = {};

    if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Minimum ${MIN_PASSWORD_LENGTH} characters required`;
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    const result = await createPassword({ password, confirmPassword });
    setLoading(false);

    if (result.success) {
      Alert.alert("Account Created", "Welcome to BookMyRun!");
      onSuccess();
      return;
    }

    Alert.alert("Error", result.error ?? "Unable to create password");
  };

  return (
    <View>
      <PasswordInput
        label="New Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter new password"
        error={errors.password}
        required
      />
      <PasswordInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Re-enter password"
        error={errors.confirmPassword}
        required
      />

      <Text style={styles.hint}>
        Password must be at least {MIN_PASSWORD_LENGTH} characters long.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSave}
        activeOpacity={0.85}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.textWhite} />
        ) : (
          <Text style={styles.primaryButtonText}>Save</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: Colors.textWhite,
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
});
