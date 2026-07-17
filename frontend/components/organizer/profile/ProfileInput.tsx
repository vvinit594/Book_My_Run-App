import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../../constants/spacing";

interface ProfileInputProps extends Omit<TextInputProps, "style"> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  error?: string;
  verified?: boolean;
  showInfoIcon?: boolean;
  editable?: boolean;
  onUpdatePress?: () => void;
  helperText?: string;
}

export default function ProfileInput({
  label,
  value,
  onChangeText,
  required = false,
  error,
  verified = false,
  showInfoIcon = false,
  editable = true,
  onUpdatePress,
  helperText,
  ...textInputProps
}: ProfileInputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
        {showInfoIcon ? (
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={Colors.textLight}
          />
        ) : null}
        {verified ? (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            onUpdatePress ? styles.inputWithAction : null,
            !editable ? styles.inputDisabled : null,
            error ? styles.inputError : null,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={Colors.textLight}
          editable={editable}
          selectTextOnFocus={editable}
          {...textInputProps}
        />
        {onUpdatePress ? (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={onUpdatePress}
            activeOpacity={0.85}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {helperText && !error ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  required: {
    color: Colors.error,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginLeft: "auto",
  },
  verifiedText: {
    fontSize: FontSize.sm,
    color: Colors.success,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 48,
  },
  inputWithAction: {
    flex: 1,
  },
  inputDisabled: {
    backgroundColor: "#EEEEEE",
    color: Colors.textSecondary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  updateButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  updateButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  helperText: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  errorText: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.error,
  },
});
