import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { TicketCategory } from "../../types";

interface TicketCardProps {
  ticket: TicketCategory;
  isSelected: boolean;
  onSelect: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  isSelected,
  onSelect,
}) => {
  const discountPercentage = ticket.originalPrice
    ? Math.round(((ticket.originalPrice - ticket.price) / ticket.originalPrice) * 100)
    : 0;

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.radioContainer}>
          <View
            style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}
          >
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{ticket.title}</Text>
          <Text style={styles.distance}>{ticket.distance}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{ticket.price}</Text>
          {ticket.originalPrice && (
            <Text style={styles.originalPrice}>₹{ticket.originalPrice}</Text>
          )}
          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.description}>{ticket.description}</Text>

      {/* Slots Remaining */}
      <View style={styles.slotsContainer}>
        <Ionicons name="people-outline" size={14} color={Colors.warning} />
        <Text style={styles.slotsText}>
          Only {ticket.slotsRemaining} slots remaining
        </Text>
      </View>

      {/* Perks */}
      <View style={styles.perksContainer}>
        <Text style={styles.perksTitle}>What's Included:</Text>
        <View style={styles.perksList}>
          {ticket.perks.slice(0, 4).map((perk, index) => (
            <View key={index} style={styles.perkItem}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={Colors.success}
              />
              <Text style={styles.perkText}>{perk}</Text>
            </View>
          ))}
          {ticket.perks.length > 4 && (
            <Text style={styles.morePerks}>
              +{ticket.perks.length - 4} more perks
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  containerSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#FFF5F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  radioContainer: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  distance: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: 13,
    color: Colors.textLight,
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    marginLeft: 30,
  },
  slotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    marginLeft: 30,
    backgroundColor: "#FFF3E0",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  slotsText: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: "600",
    marginLeft: 4,
  },
  perksContainer: {
    marginTop: Spacing.md,
    marginLeft: 30,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  perksTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  perksList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  perkItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 4,
  },
  perkText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  morePerks: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
    marginTop: 4,
  },
});

export default TicketCard;
