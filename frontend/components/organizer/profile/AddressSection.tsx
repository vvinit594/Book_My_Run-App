import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ProfileTextArea from "./ProfileTextArea";
import Colors from "../../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../../constants/spacing";

interface AddressSectionProps {
  permanentAddress: string;
  billingAddress: string;
  billingAddressSameAsPermanent: boolean;
  onPermanentAddressChange: (value: string) => void;
  onBillingAddressChange: (value: string) => void;
  onBillingSameToggle: () => void;
  permanentAddressError?: string;
  billingAddressError?: string;
}

export default function AddressSection({
  permanentAddress,
  billingAddress,
  billingAddressSameAsPermanent,
  onPermanentAddressChange,
  onBillingAddressChange,
  onBillingSameToggle,
  permanentAddressError,
  billingAddressError,
}: AddressSectionProps) {
  return (
    <View>
      <ProfileTextArea
        label="Permanent Address"
        value={permanentAddress}
        onChangeText={onPermanentAddressChange}
        placeholder="Enter permanent address"
        required
        error={permanentAddressError}
        numberOfLines={3}
      />

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={onBillingSameToggle}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.checkbox,
            billingAddressSameAsPermanent ? styles.checkboxChecked : null,
          ]}
        >
          {billingAddressSameAsPermanent ? (
            <Text style={styles.checkmark}>✓</Text>
          ) : null}
        </View>
        <Text style={styles.checkboxLabel}>
          Billing Address same as Permanent Address
        </Text>
      </TouchableOpacity>

      {!billingAddressSameAsPermanent ? (
        <ProfileTextArea
          label="Billing Address"
          value={billingAddress}
          onChangeText={onBillingAddressChange}
          placeholder="Enter billing address"
          required
          error={billingAddressError}
          numberOfLines={3}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: "700",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});
