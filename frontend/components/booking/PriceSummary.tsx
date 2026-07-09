import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

interface PriceSummaryProps {
  ticketPrice: number;
  quantity: number;
  convenienceFee: number;
  gst: number;
  couponDiscount?: number;
  couponCode?: string;
  onApplyCoupon?: (code: string) => void;
  onRemoveCoupon?: () => void;
  showCouponInput?: boolean;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({
  ticketPrice,
  quantity,
  convenienceFee,
  gst,
  couponDiscount = 0,
  couponCode,
  onApplyCoupon,
  onRemoveCoupon,
  showCouponInput = true,
}) => {
  const [inputCode, setInputCode] = useState("");

  const subtotal = ticketPrice * quantity;
  const totalBeforeTax = subtotal - couponDiscount;
  const taxAmount = (totalBeforeTax * gst) / 100;
  const feeAmount = (totalBeforeTax * convenienceFee) / 100;
  const grandTotal = totalBeforeTax + taxAmount + feeAmount;

  const handleApplyCoupon = () => {
    if (inputCode.trim() && onApplyCoupon) {
      onApplyCoupon(inputCode.trim());
      setInputCode("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>
          Ticket Price (₹{ticketPrice} × {quantity})
        </Text>
        <Text style={styles.value}>₹{subtotal.toLocaleString()}</Text>
      </View>

      {couponDiscount > 0 && (
        <View style={styles.row}>
          <View style={styles.couponApplied}>
            <Ionicons name="pricetag" size={14} color={Colors.success} />
            <Text style={styles.couponLabel}>Coupon ({couponCode})</Text>
            {onRemoveCoupon && (
              <TouchableOpacity onPress={onRemoveCoupon}>
                <Ionicons name="close-circle" size={18} color={Colors.error} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.discount}>-₹{couponDiscount.toLocaleString()}</Text>
        </View>
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Convenience Fee ({convenienceFee}%)</Text>
        <Text style={styles.value}>₹{feeAmount.toFixed(0)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>GST ({gst}%)</Text>
        <Text style={styles.value}>₹{taxAmount.toFixed(0)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>₹{grandTotal.toFixed(0)}</Text>
      </View>

      {/* Coupon Input */}
      {showCouponInput && !couponCode && onApplyCoupon && (
        <View style={styles.couponContainer}>
          <View style={styles.couponInputWrapper}>
            <Ionicons name="pricetag-outline" size={18} color={Colors.textLight} />
            <TextInput
              style={styles.couponInput}
              placeholder="Enter coupon code"
              placeholderTextColor={Colors.textLight}
              value={inputCode}
              onChangeText={setInputCode}
              autoCapitalize="characters"
            />
          </View>
          <TouchableOpacity
            style={[
              styles.applyButton,
              !inputCode.trim() && styles.applyButtonDisabled,
            ]}
            onPress={handleApplyCoupon}
            disabled={!inputCode.trim()}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  couponApplied: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  couponLabel: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: "500",
  },
  discount: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
  couponContainer: {
    flexDirection: "row",
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  couponInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  couponInput: {
    flex: 1,
    height: 44,
    marginLeft: Spacing.xs,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    justifyContent: "center",
  },
  applyButtonDisabled: {
    backgroundColor: Colors.textLight,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textWhite,
  },
});

export default PriceSummary;
