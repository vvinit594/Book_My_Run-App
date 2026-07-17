import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AuthHeader from "./AuthHeader";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Colors from "../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../constants/spacing";
import { AuthTab } from "../../types/auth";
import {
  clearPostAuthRedirect,
  consumePostAuthRedirect,
  LIST_YOUR_EVENT_INTENT,
} from "../../utils/navigationIntent";
import { navigateListYourEvent } from "../../utils/organizerNavigation";

interface AuthenticationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AuthenticationModal({
  visible,
  onClose,
}: AuthenticationModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  const handleClose = () => {
    clearPostAuthRedirect();
    onClose();
  };

  const handleLoginSuccess = async () => {
    const redirect = consumePostAuthRedirect();
    onClose();
    if (redirect === LIST_YOUR_EVENT_INTENT) {
      await navigateListYourEvent(router);
      return;
    }
    if (redirect) {
      router.push(redirect as "/organizer/profile");
    }
  };

  const handleSendOTP = () => {
    onClose();
    router.push("/auth/verify-otp");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <AuthHeader />

            <View style={styles.tabRow}>
              <Pressable
                style={[styles.tab, activeTab === "login" ? styles.tabActive : null]}
                onPress={() => setActiveTab("login")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "login" ? styles.tabTextActive : null,
                  ]}
                >
                  Login
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tab, activeTab === "signup" ? styles.tabActive : null]}
                onPress={() => setActiveTab("signup")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "signup" ? styles.tabTextActive : null,
                  ]}
                >
                  Signup
                </Text>
              </Pressable>
            </View>

            {activeTab === "login" ? (
              <LoginForm onSuccess={handleLoginSuccess} />
            ) : (
              <SignupForm onSendOTP={handleSendOTP} />
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  tabRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  tabTextActive: {
    color: Colors.textWhite,
  },
});
