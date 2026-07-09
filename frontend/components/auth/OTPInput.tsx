import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Pressable,
} from "react-native";
import Colors from "../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../constants/spacing";

const OTP_LENGTH = 6;

interface OTPInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function OTPInput({
  label,
  value,
  onChange,
  error,
}: OTPInputProps) {
  const inputRef = useRef<TextInput>(null);
  const digits = value.padEnd(OTP_LENGTH, " ").split("").slice(0, OTP_LENGTH);

  const handleChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
    onChange(cleaned);
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (event.nativeEvent.key === "Backspace" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.boxRow} onPress={() => inputRef.current?.focus()}>
        {digits.map((digit, index) => (
          <View
            key={`${label}-${index}`}
            style={[
              styles.box,
              index === value.length ? styles.boxActive : null,
              error ? styles.boxError : null,
            ]}
          >
            <Text style={styles.digit}>{digit.trim()}</Text>
          </View>
        ))}
      </Pressable>
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={handleChange}
        onKeyPress={handleKeyPress}
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  boxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.xs,
  },
  box: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  boxActive: {
    borderColor: Colors.primary,
  },
  boxError: {
    borderColor: Colors.error,
  },
  digit: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
  errorText: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.error,
  },
});
