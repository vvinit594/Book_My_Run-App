import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity?: number;
  minQuantity?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  maxQuantity = 10,
  minQuantity = 1,
}) => {
  const handleDecrease = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Number of Participants</Text>
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={[styles.button, quantity <= minQuantity && styles.buttonDisabled]}
          onPress={handleDecrease}
          disabled={quantity <= minQuantity}
        >
          <Ionicons
            name="remove"
            size={20}
            color={quantity <= minQuantity ? Colors.textLight : Colors.primary}
          />
        </TouchableOpacity>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantity}>{quantity}</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, quantity >= maxQuantity && styles.buttonDisabled]}
          onPress={handleIncrease}
          disabled={quantity >= maxQuantity}
        >
          <Ionicons
            name="add"
            size={20}
            color={quantity >= maxQuantity ? Colors.textLight : Colors.primary}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>
        Max {maxQuantity} participants per booking
      </Text>
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
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  selectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  quantityContainer: {
    minWidth: 60,
    alignItems: "center",
    marginHorizontal: Spacing.lg,
  },
  quantity: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  hint: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
});

export default QuantitySelector;
