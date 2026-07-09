import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import Colors from "../../constants/colors";
import { Spacing, FontSize, BorderRadius } from "../../constants/spacing";

interface StickyBookingBarProps {
  price: number;
  currency?: string;
  onBookPress: () => void;
}

export default function StickyBookingBar({
  price,
  currency = "INR",
  onBookPress,
}: StickyBookingBarProps) {
  const formatPrice = (amount: number) => {
    if (currency === "INR") {
      return `₹${amount.toLocaleString()}`;
    }
    return `${currency} ${amount.toLocaleString()}`;
  };

  return (
    <View style={styles.container}>
      {/* Price */}
      <View style={styles.priceSection}>
        <Text style={styles.priceLabel}>Starting from</Text>
        <Text style={styles.price}>{formatPrice(price)} <Text style={styles.onwards}>onwards</Text></Text>
      </View>

      {/* Book Button */}
      <Pressable style={styles.bookButton} onPress={onBookPress}>
        <Text style={styles.bookButtonText}>Book Tickets</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Platform.OS === "ios" ? Spacing.xl : Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  price: {
    fontSize: FontSize.xl,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  onwards: {
    fontSize: FontSize.sm,
    fontWeight: "normal",
    color: Colors.textSecondary,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  bookButtonText: {
    color: Colors.textWhite,
    fontSize: FontSize.lg,
    fontWeight: "bold",
  },
});
