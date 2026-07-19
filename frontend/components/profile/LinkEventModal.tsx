import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../organizer/profile/PrimaryButton";
import Colors from "../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../constants/spacing";

interface LinkEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (eventName: string) => void;
  loading?: boolean;
}

export default function LinkEventModal({
  visible,
  onClose,
  onSubmit,
  loading = false,
}: LinkEventModalProps) {
  const [eventName, setEventName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      setEventName("");
      setError("");
    }
  }, [visible]);

  const handleClose = () => {
    setEventName("");
    setError("");
    onClose();
  };

  const handleSubmit = () => {
    const trimmed = eventName.trim();
    if (!trimmed) {
      setError("Event name is required");
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.center}
        >
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <Text style={styles.title}>Link Event</Text>
              <TouchableClose onPress={handleClose} />
            </View>
            <Text style={styles.label}>Event name</Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              value={eventName}
              onChangeText={(text) => {
                setEventName(text);
                setError("");
              }}
              placeholder="Enter event name"
              placeholderTextColor={Colors.textLight}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <PrimaryButton title="Link Event" onPress={handleSubmit} loading={loading} />
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

function TouchableClose({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Ionicons name="close" size={22} color={Colors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "center",
    padding: Spacing.lg,
  },
  center: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    color: Colors.error,
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
  },
});
