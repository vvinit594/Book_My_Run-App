import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import PasswordInput from "./PasswordInput";
import AuthFooter from "./AuthFooter";
import Colors from "../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../constants/spacing";
import { useAuth } from "../../store/authStore";

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>(
    {}
  );

  const handleLogin = async () => {
    setLoading(true);
    setErrors({});
    const result = await login({ identifier, password });
    setLoading(false);

    if (result.success) {
      onSuccess();
      return;
    }

    if (result.error) {
      Alert.alert("Login Failed", result.error);
    }
  };

  return (
    <View>
      <View style={styles.field}>
        <Text style={styles.label}>Email or Mobile</Text>
        <TextInput
          style={[styles.input, errors.identifier ? styles.inputError : null]}
          value={identifier}
          onChangeText={setIdentifier}
          placeholder="Email or Mobile"
          placeholderTextColor={Colors.textLight}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <PasswordInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        error={errors.password}
        required
      />

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => Alert.alert("Forgot Password", "Password reset coming soon!")}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleLogin}
        activeOpacity={0.85}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.textWhite} />
        ) : (
          <Text style={styles.primaryButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      <AuthFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  forgotButton: {
    alignSelf: "flex-start",
    marginBottom: Spacing.lg,
  },
  forgotText: {
    fontSize: FontSize.md,
    color: Colors.info,
    fontWeight: "600",
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
