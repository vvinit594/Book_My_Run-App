import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import OTPInput from "./OTPInput";
import Colors from "../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../constants/spacing";
import { OTP_RESEND_SECONDS } from "../../constants/auth";
import { useAuth } from "../../store/authStore";

interface OTPVerificationProps {
  onVerified: () => void;
}

export default function OTPVerification({ onVerified }: OTPVerificationProps) {
  const { pendingSignup, verifyOTP } = useAuth();
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    const result = await verifyOTP({ mobileOtp, emailOtp });
    setLoading(false);

    if (result.success) {
      onVerified();
      return;
    }

    setError(result.error ?? "Invalid OTP");
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(OTP_RESEND_SECONDS);
    Alert.alert("OTP Sent", "A new OTP has been sent to your mobile and email.");
  };

  const formattedTime = `00:${String(secondsLeft).padStart(2, "0")}`;

  return (
    <View>
      <Text style={styles.description}>
        Enter the OTP sent to{" "}
        <Text style={styles.highlight}>{pendingSignup?.mobile ?? "your mobile"}</Text>
        {" "}and{" "}
        <Text style={styles.highlight}>{pendingSignup?.email ?? "your email"}</Text>
      </Text>

      <OTPInput
        label="Mobile OTP"
        value={mobileOtp}
        onChange={setMobileOtp}
        error={error ? " " : undefined}
      />
      <OTPInput
        label="Email OTP"
        value={emailOtp}
        onChange={setEmailOtp}
        error={error || undefined}
      />

      <View style={styles.resendRow}>
        <TouchableOpacity
          onPress={handleResend}
          disabled={secondsLeft > 0}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.resendText,
              secondsLeft > 0 ? styles.resendDisabled : null,
            ]}
          >
            Resend OTP
          </Text>
        </TouchableOpacity>
        <Text style={styles.timer}>{formattedTime}</Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleVerify}
        activeOpacity={0.85}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.textWhite} />
        ) : (
          <Text style={styles.primaryButtonText}>Verify OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  highlight: {
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  resendText: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: "600",
  },
  resendDisabled: {
    color: Colors.textLight,
  },
  timer: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
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
