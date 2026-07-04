import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../../constants/spacing";

interface ProfileToggleOption<T extends string | boolean> {
  label: string;
  value: T;
}

interface ProfileToggleProps<T extends string | boolean> {
  label: string;
  value: T | "";
  onChange: (value: T) => void;
  options: ProfileToggleOption<T>[];
  required?: boolean;
  error?: string;
}

export default function ProfileToggle<T extends string | boolean>({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
}: ProfileToggleProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <View style={styles.optionsRow}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <TouchableOpacity
              key={option.label}
              style={styles.option}
              onPress={() => onChange(option.value)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.radioOuter,
                  selected ? styles.radioOuterSelected : null,
                ]}
              >
                {selected ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xl,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
  },
  optionLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  errorText: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.error,
  },
});
