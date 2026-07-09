import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

interface TicketIdentitySectionProps {
  ticketType: string;
  category: string;
  participantName: string;
  ticketId: string;
  bookingStatus: "Confirmed" | "Early Bird" | "Pending";
}

const TicketIdentitySection: React.FC<TicketIdentitySectionProps> = ({
  ticketType,
  category,
  participantName,
  ticketId,
  bookingStatus,
}) => {
  const getStatusColor = () => {
    switch (bookingStatus) {
      case "Confirmed":
        return Colors.success;
      case "Early Bird":
        return Colors.earlyBird;
      case "Pending":
        return Colors.warning;
      default:
        return Colors.success;
    }
  };

  return (
    <View style={styles.container}>
      {/* Ticket Type & Badge Row */}
      <View style={styles.topRow}>
        <View style={styles.ticketTypeContainer}>
          <Ionicons name="ticket" size={20} color={Colors.primary} />
          <Text style={styles.ticketType}>{ticketType}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.badgeText}>{bookingStatus}</Text>
        </View>
      </View>

      {/* Category */}
      <Text style={styles.category}>{category}</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Participant & Ticket ID */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <View style={styles.infoLabelRow}>
            <Ionicons name="person" size={14} color={Colors.textLight} />
            <Text style={styles.infoLabel}>Participant</Text>
          </View>
          <Text style={styles.infoValue}>{participantName}</Text>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoLabelRow}>
            <Ionicons name="document-text" size={14} color={Colors.textLight} />
            <Text style={styles.infoLabel}>Ticket ID</Text>
          </View>
          <Text style={styles.ticketIdValue}>{ticketId}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.cardBackground,
    marginHorizontal: Spacing.md,
    marginTop: -1, // Connects with hero section
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  ticketTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ticketType: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginLeft: Spacing.xs,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  category: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 28, // Aligns with ticket type text
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flex: 1,
  },
  infoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  ticketIdValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: "monospace",
  },
});

export default TicketIdentitySection;
