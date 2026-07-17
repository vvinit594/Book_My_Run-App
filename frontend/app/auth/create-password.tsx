import React from "react";
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AuthHeader, PasswordCreation } from "../../components/auth";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { consumePostAuthRedirect, LIST_YOUR_EVENT_INTENT } from "../../utils/navigationIntent";
import { navigateListYourEvent } from "../../utils/organizerNavigation";

export default function CreatePasswordScreen() {
  const router = useRouter();

  const handleSuccess = async () => {
    const redirect = consumePostAuthRedirect();
    if (redirect === LIST_YOUR_EVENT_INTENT) {
      await navigateListYourEvent(router, { replace: true });
      return;
    }
    if (redirect) {
      router.replace(redirect as "/organizer/profile");
      return;
    }
    router.replace("/(tabs)");
  };

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
            title="Create Password"
            subtitle="Set a secure password for your account"
            showBack
            onBack={() => router.back()}
          />
          <PasswordCreation onSuccess={handleSuccess} />
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
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
});
