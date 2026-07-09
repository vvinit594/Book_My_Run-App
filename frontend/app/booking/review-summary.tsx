import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { ParticipantDetails } from "../../types";
import { CONVENIENCE_FEE_PERCENTAGE, GST_PERCENTAGE } from "../../constants/mockBookingData";
import BookingHeader from "../../components/booking/BookingHeader";
import PriceSummary from "../../components/booking/PriceSummary";

export default function ReviewSummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const eventTitle = params.eventTitle as string;
  const eventDate = params.eventDate as string;
  const eventVenue = params.eventVenue as string;
  const ticketTitle = params.ticketTitle as string;
  const ticketPrice = parseInt(params.ticketPrice as string) || 0;
  const ticketCategory = params.ticketCategory as string;
  const quantity = parseInt(params.quantity as string) || 1;
  const couponCode = params.couponCode as string || undefined;
  const couponDiscount = parseInt(params.couponDiscount as string) || 0;
  const participants: ParticipantDetails[] = JSON.parse(
    (params.participants as string) || "[]"
  );

  const [expandedParticipant, setExpandedParticipant] = useState<number | null>(0);

  const toggleParticipant = (index: number) => {
    setExpandedParticipant(expandedParticipant === index ? null : index);
  };

  const handleEditTicket = () => {
    router.back();
    router.back();
  };

  const handleEditParticipant = (index: number) => {
    router.back();
  };

  const handleProceedToPayment = () => {
    const subtotal = ticketPrice * quantity;
    const totalBeforeTax = subtotal - (couponDiscount || 0);
    const taxAmount = (totalBeforeTax * GST_PERCENTAGE) / 100;
    const feeAmount = (totalBeforeTax * CONVENIENCE_FEE_PERCENTAGE) / 100;
    const grandTotal = totalBeforeTax + taxAmount + feeAmount;

    router.push({
      pathname: "/booking/payment",
      params: {
        ...params,
        totalAmount: grandTotal.toFixed(0),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <BookingHeader title="Review & Summary" currentStep={3} totalSteps={4} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Event Details</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.eventTitle}>{eventTitle}</Text>
            <View style={styles.eventInfoRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.eventInfoText}>{eventDate}</Text>
            </View>
            <View style={styles.eventInfoRow}>
              <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.eventInfoText}>{eventVenue}</Text>
            </View>
          </View>
        </View>

        {/* Ticket Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ticket Selection</Text>
            <TouchableOpacity onPress={handleEditTicket}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <View style={styles.ticketRow}>
              <View style={styles.ticketBadge}>
                <Text style={styles.ticketBadgeText}>{ticketCategory}</Text>
              </View>
              <View style={styles.ticketInfo}>
                <Text style={styles.ticketTitle}>{ticketTitle}</Text>
                <Text style={styles.ticketQuantity}>
                  {quantity} {quantity === 1 ? "Participant" : "Participants"}
                </Text>
              </View>
              <Text style={styles.ticketPrice}>
                ₹{(ticketPrice * quantity).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Participant Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Participant Details</Text>
          </View>

          {participants.map((participant, index) => (
            <View key={index} style={styles.participantCard}>
              <TouchableOpacity
                style={styles.participantHeader}
                onPress={() => toggleParticipant(index)}
              >
                <View style={styles.participantHeaderLeft}>
                  <View style={styles.participantAvatar}>
                    <Ionicons name="person" size={18} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.participantName}>
                      {participant.basic.firstName} {participant.basic.lastName}
                    </Text>
                    <Text style={styles.participantMeta}>
                      {participant.personal.tShirtSize} • {participant.personal.bloodGroup}
                    </Text>
                  </View>
                </View>
                <View style={styles.participantHeaderRight}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditParticipant(index)}
                  >
                    <Ionicons name="create-outline" size={16} color={Colors.primary} />
                  </TouchableOpacity>
                  <Ionicons
                    name={expandedParticipant === index ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </View>
              </TouchableOpacity>

              {expandedParticipant === index && (
                <View style={styles.participantDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>{participant.basic.email}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone</Text>
                    <Text style={styles.detailValue}>{participant.basic.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Gender</Text>
                    <Text style={styles.detailValue}>{participant.personal.gender}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date of Birth</Text>
                    <Text style={styles.detailValue}>
                      {participant.personal.dateOfBirth}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Emergency Contact</Text>
                    <Text style={styles.detailValue}>
                      {participant.emergency.name} ({participant.emergency.phone})
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Address</Text>
                    <Text style={styles.detailValue}>
                      {participant.address.addressLine1}, {participant.address.city},{" "}
                      {participant.address.state} - {participant.address.pincode}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Price Summary */}
        <View style={styles.section}>
          <PriceSummary
            ticketPrice={ticketPrice}
            quantity={quantity}
            convenienceFee={CONVENIENCE_FEE_PERCENTAGE}
            gst={GST_PERCENTAGE}
            couponCode={couponCode || undefined}
            couponDiscount={couponDiscount}
            showCouponInput={false}
          />
        </View>

        {/* Terms Notice */}
        <View style={styles.termsNotice}>
          <Ionicons name="shield-checkmark" size={18} color={Colors.success} />
          <Text style={styles.termsText}>
            By proceeding to payment, you confirm that all participant details are
            accurate. Refunds are subject to the event's cancellation policy.
          </Text>
        </View>

        {/* Spacer for bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.bottomPriceLabel}>Total Amount</Text>
          <Text style={styles.bottomPrice}>
            ₹
            {(() => {
              const subtotal = ticketPrice * quantity;
              const totalBeforeTax = subtotal - (couponDiscount || 0);
              const taxAmount = (totalBeforeTax * GST_PERCENTAGE) / 100;
              const feeAmount = (totalBeforeTax * CONVENIENCE_FEE_PERCENTAGE) / 100;
              return (totalBeforeTax + taxAmount + feeAmount).toFixed(0);
            })()}
          </Text>
        </View>
        <TouchableOpacity style={styles.payButton} onPress={handleProceedToPayment}>
          <Text style={styles.payButtonText}>Proceed to Payment</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  editLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  eventInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  eventInfoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  ticketRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ticketBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  ticketBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  ticketQuantity: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ticketPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  participantCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  participantHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
  },
  participantHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE8EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  participantMeta: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  participantHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  editButton: {
    padding: Spacing.xs,
  },
  participantDetails: {
    padding: Spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 0,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
    marginLeft: Spacing.md,
  },
  termsNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E8F5E9",
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomPriceContainer: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bottomPrice: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textWhite,
  },
});
