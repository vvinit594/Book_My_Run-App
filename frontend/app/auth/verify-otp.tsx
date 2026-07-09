import React, { useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AuthHeader, OTPVerification } from "../../components/auth";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { useAuth } from "../../store/authStore";

export default function VerifyOTPScreen() {
  const router = useRouter();
  const { pendingSignup } = useAuth();

  useEffect(() => {
    if (!pendingSignup) {
      router.replace("/(tabs)");
    }
  }, [pendingSignup, router]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader
            title="Verify OTP"
            subtitle="Enter the verification codes sent to you"
            showBack
            onBack={() => router.back()}
          />
          <OTPVerification
            onVerified={() => router.push("/auth/create-password")}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
});
