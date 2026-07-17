import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Colors from "../../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../../constants/spacing";
import { EMAIL_REGEX, PHONE_REGEX } from "../../../constants/organizer";
import * as userService from "../../../services/user.service";

type ContactType = "email" | "phone";
type Step = "verify_current" | "enter_new" | "verify_new";

interface ContactUpdateModalProps {
  visible: boolean;
  type: ContactType;
  currentValue: string;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
}

export default function ContactUpdateModal({
  visible,
  type,
  currentValue,
  onClose,
  onSuccess,
}: ContactUpdateModalProps) {
  const [step, setStep] = useState<Step>("verify_current");
  const [otp, setOtp] = useState("");
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label = type === "email" ? "Email" : "Phone";

  useEffect(() => {
    if (!visible) return;

    let mounted = true;
    setStep("verify_current");
    setOtp("");
    setNewValue("");
    setError(null);
    setLoading(true);

    void (async () => {
      const result =
        type === "email"
          ? await userService.requestEmailUpdate()
          : await userService.requestPhoneUpdate();

      if (!mounted) return;
      setLoading(false);
      if (!result.success) {
        setError(result.error || "Failed to start update");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [visible, type]);

  const handleVerifyCurrent = async () => {
    if (otp.trim().length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    setError(null);
    const result =
      type === "email"
        ? await userService.verifyCurrentEmail(otp.trim())
        : await userService.verifyCurrentPhone(otp.trim());
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Invalid OTP");
      return;
    }

    setOtp("");
    setStep("enter_new");
  };

  const handleSendNewOtp = async () => {
    const value = newValue.trim();
    if (type === "email" && !EMAIL_REGEX.test(value.toLowerCase())) {
      setError("Enter a valid email address");
      return;
    }
    if (
      type === "phone" &&
      !PHONE_REGEX.test(value.replace(/\D/g, "").slice(-10))
    ) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError(null);
    const result =
      type === "email"
        ? await userService.sendNewEmailOtp(value.toLowerCase())
        : await userService.sendNewPhoneOtp(value.replace(/\D/g, "").slice(-10));
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to send OTP");
      return;
    }

    setOtp("");
    setStep("verify_new");
  };

  const handleVerifyNew = async () => {
    if (otp.trim().length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    setError(null);
    const value =
      type === "email"
        ? newValue.trim().toLowerCase()
        : newValue.replace(/\D/g, "").slice(-10);

    const result =
      type === "email"
        ? await userService.verifyNewEmail(value, otp.trim())
        : await userService.verifyNewPhone(value, otp.trim());
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to update");
      return;
    }

    await onSuccess();
    onClose();
  };

  const title =
    step === "verify_current"
      ? `Verify Existing ${label}`
      : step === "enter_new"
        ? `Enter New ${label}`
        : `Verify New ${label}`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {step === "verify_current"
              ? `OTP sent to ${currentValue}. Use 123456 in development.`
              : step === "enter_new"
                ? `Enter your new ${label.toLowerCase()} to continue.`
                : `OTP sent to ${newValue}. Use 123456 in development.`}
          </Text>

          {step === "enter_new" ? (
            <TextInput
              style={styles.input}
              value={newValue}
              onChangeText={setNewValue}
              placeholder={
                type === "email" ? "new@email.com" : "10-digit mobile number"
              }
              keyboardType={type === "email" ? "email-address" : "phone-pad"}
              autoCapitalize="none"
              maxLength={type === "phone" ? 10 : undefined}
              placeholderTextColor={Colors.textLight}
            />
          ) : (
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={6}
              placeholderTextColor={Colors.textLight}
            />
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={
                step === "verify_current"
                  ? handleVerifyCurrent
                  : step === "enter_new"
                    ? handleSendNewOtp
                    : handleVerifyNew
              }
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.textWhite} />
              ) : (
                <Text style={styles.primaryText}>
                  {step === "enter_new" ? "Send OTP" : "Verify"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  subtitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  error: {
    marginTop: Spacing.sm,
    color: Colors.error,
    fontSize: FontSize.sm,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: Colors.textWhite,
    fontWeight: "700",
  },
});
