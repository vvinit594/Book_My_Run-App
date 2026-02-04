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
import { mockTicketCategories, CONVENIENCE_FEE_PERCENTAGE, GST_PERCENTAGE } from "../../constants/mockBookingData";
import { TicketCategory } from "../../types";
import BookingHeader from "../../components/booking/BookingHeader";
import TicketCard from "../../components/booking/TicketCard";
import QuantitySelector from "../../components/booking/QuantitySelector";
import PriceSummary from "../../components/booking/PriceSummary";

export default function SelectTicketScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;
  const eventTitle = params.eventTitle as string || "Mumbai Women's 10K";
  const eventDate = params.eventDate as string || "Mar 23, 2026";
  const eventVenue = params.eventVenue as string || "BKC, Mumbai";

  const [selectedTicket, setSelectedTicket] = useState<TicketCategory | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState<string | undefined>();
  const [couponDiscount, setCouponDiscount] = useState(0);

  const handleSelectTicket = (ticket: TicketCategory) => {
    setSelectedTicket(ticket);
  };

  const handleApplyCoupon = (code: string) => {
    // Mock coupon validation
    if (code.toUpperCase() === "RUN2026") {
      setCouponCode(code.toUpperCase());
      setCouponDiscount(100);
    } else if (code.toUpperCase() === "FIRSTRUN") {
      setCouponCode(code.toUpperCase());
      setCouponDiscount(50);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode(undefined);
    setCouponDiscount(0);
  };

  const handleContinue = () => {
    if (!selectedTicket) return;

    router.push({
      pathname: "/booking/participant-details",
      params: {
        eventId,
        eventTitle,
        eventDate,
        eventVenue,
        ticketId: selectedTicket.id,
        ticketTitle: selectedTicket.title,
        ticketPrice: selectedTicket.price.toString(),
        ticketCategory: selectedTicket.category,
        quantity: quantity.toString(),
        couponCode: couponCode || "",
        couponDiscount: couponDiscount.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <BookingHeader title="Select Ticket" currentStep={1} totalSteps={4} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Info Card */}
        <View style={styles.eventInfoCard}>
          <View style={styles.eventInfoRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.eventInfoText}>{eventDate}</Text>
          </View>
          <View style={styles.eventInfoRow}>
            <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.eventInfoText}>{eventVenue}</Text>
          </View>
          <Text style={styles.eventTitle}>{eventTitle}</Text>
        </View>

        {/* Ticket Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Your Category</Text>
          {mockTicketCategories.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isSelected={selectedTicket?.id === ticket.id}
              onSelect={() => handleSelectTicket(ticket)}
            />
          ))}
        </View>

        {/* Quantity Selector */}
        {selectedTicket && (
          <View style={styles.section}>
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              maxQuantity={Math.min(10, selectedTicket.slotsRemaining)}
            />
          </View>
        )}

        {/* Price Summary */}
        {selectedTicket && (
          <View style={styles.section}>
            <PriceSummary
              ticketPrice={selectedTicket.price}
              quantity={quantity}
              convenienceFee={CONVENIENCE_FEE_PERCENTAGE}
              gst={GST_PERCENTAGE}
              couponCode={couponCode}
              couponDiscount={couponDiscount}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />
          </View>
        )}

        {/* Spacer for bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceContainer}>
          {selectedTicket ? (
            <>
              <Text style={styles.bottomPriceLabel}>
                {quantity} {quantity === 1 ? "Ticket" : "Tickets"}
              </Text>
              <Text style={styles.bottomPrice}>
                ₹{(selectedTicket.price * quantity).toLocaleString()}
              </Text>
            </>
          ) : (
            <Text style={styles.bottomPriceLabel}>Select a ticket</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.continueButton, !selectedTicket && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedTicket}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  eventInfoCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  eventInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  eventInfoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
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
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  continueButtonDisabled: {
    backgroundColor: Colors.textLight,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textWhite,
  },
});
