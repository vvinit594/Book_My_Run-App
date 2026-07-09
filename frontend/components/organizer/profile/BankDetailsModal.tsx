import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProfileInput from "./ProfileInput";
import ProfileDropdown from "./ProfileDropdown";
import PrimaryButton from "./PrimaryButton";
import { BANK_ACCOUNT_TYPE_OPTIONS, IFSC_REGEX } from "../../../constants/organizer";
import Colors from "../../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../../constants/spacing";
import {
  BankAccountType,
  BankDetails,
  EMPTY_BANK_DETAILS,
} from "../../../types/organizer";

interface BankDetailsModalProps {
  visible: boolean;
  initialValues: BankDetails;
  onClose: () => void;
  onSave: (details: BankDetails) => void;
}

type BankErrors = Partial<Record<keyof BankDetails, string>>;

export default function BankDetailsModal({
  visible,
  initialValues,
  onClose,
  onSave,
}: BankDetailsModalProps) {
  const [form, setForm] = useState<BankDetails>(initialValues);
  const [errors, setErrors] = useState<BankErrors>({});

  useEffect(() => {
    if (visible) {
      setForm(initialValues.accountHolderName ? initialValues : { ...EMPTY_BANK_DETAILS });
      setErrors({});
    }
  }, [visible, initialValues]);

  const updateField = <K extends keyof BankDetails>(
    key: K,
    value: BankDetails[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: BankErrors = {};

    if (!form.accountHolderName.trim()) {
      nextErrors.accountHolderName = "Account holder name is required";
    }
    if (!form.accountNumber.trim()) {
      nextErrors.accountNumber = "Account number is required";
    } else if (!/^\d{9,18}$/.test(form.accountNumber.trim())) {
      nextErrors.accountNumber = "Enter a valid account number";
    }
    if (!form.confirmAccountNumber.trim()) {
      nextErrors.confirmAccountNumber = "Confirm account number";
    } else if (form.confirmAccountNumber.trim() !== form.accountNumber.trim()) {
      nextErrors.confirmAccountNumber = "Account numbers do not match";
    }
    if (!form.ifscCode.trim()) {
      nextErrors.ifscCode = "IFSC code is required";
    } else if (!IFSC_REGEX.test(form.ifscCode.trim().toUpperCase())) {
      nextErrors.ifscCode = "Enter a valid IFSC code";
    }
    if (!form.bankName.trim()) {
      nextErrors.bankName = "Bank name is required";
    }
    if (!form.branchName.trim()) {
      nextErrors.branchName = "Branch name is required";
    }
    if (!form.accountType) {
      nextErrors.accountType = "Account type is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      ifscCode: form.ifscCode.trim().toUpperCase(),
      accountNumber: form.accountNumber.trim(),
      confirmAccountNumber: form.confirmAccountNumber.trim(),
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <Text style={styles.title}>Bank Account Details</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.content}
            >
              <ProfileInput
                label="Account Holder Name"
                value={form.accountHolderName}
                onChangeText={(text) => updateField("accountHolderName", text)}
                placeholder="Enter account holder name"
                required
                error={errors.accountHolderName}
              />
              <ProfileInput
                label="Account Number"
                value={form.accountNumber}
                onChangeText={(text) => updateField("accountNumber", text)}
                placeholder="Enter account number"
                keyboardType="number-pad"
                required
                error={errors.accountNumber}
              />
              <ProfileInput
                label="Confirm Account Number"
                value={form.confirmAccountNumber}
                onChangeText={(text) =>
                  updateField("confirmAccountNumber", text)
                }
                placeholder="Re-enter account number"
                keyboardType="number-pad"
                required
                error={errors.confirmAccountNumber}
              />
              <ProfileInput
                label="IFSC Code"
                value={form.ifscCode}
                onChangeText={(text) =>
                  updateField("ifscCode", text.toUpperCase())
                }
                placeholder="e.g. HDFC0001234"
                autoCapitalize="characters"
                required
                error={errors.ifscCode}
              />
              <ProfileInput
                label="Bank Name"
                value={form.bankName}
                onChangeText={(text) => updateField("bankName", text)}
                placeholder="Enter bank name"
                required
                error={errors.bankName}
              />
              <ProfileInput
                label="Branch Name"
                value={form.branchName}
                onChangeText={(text) => updateField("branchName", text)}
                placeholder="Enter branch name"
                required
                error={errors.branchName}
              />
              <ProfileDropdown<BankAccountType>
                label="Account Type"
                value={form.accountType}
                options={BANK_ACCOUNT_TYPE_OPTIONS}
                onSelect={(value) => updateField("accountType", value)}
                placeholder="Select account type"
                required
                error={errors.accountType}
              />
            </ScrollView>

            <View style={styles.footer}>
              <PrimaryButton title="Save Bank Details" onPress={handleSave} />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "flex-end",
  },
  keyboardView: {
    maxHeight: "92%",
  },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: "100%",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginTop: Spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
