import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { PaymentMethod } from "../../types";
import BookingHeader from "../../components/booking/BookingHeader";
import {
  PaymentAccordion,
  UPIPayment,
  CardPayment,
  NetBanking,
  WalletPayment,
} from "../../components/booking/PaymentMethods";

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const eventTitle = params.eventTitle as string;
  const totalAmount = parseInt(params.totalAmount as string) || 0;
  const ticketTitle = params.ticketTitle as string;
  const quantity = parseInt(params.quantity as string) || 1;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [expandedMethod, setExpandedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // UPI State
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string | undefined>();

  // Card State
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState<string | undefined>();

  // Wallet State
  const [selectedWallet, setSelectedWallet] = useState<string | undefined>();

  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setExpandedMethod(expandedMethod === method ? null : method);
  };

  const validatePayment = (): boolean => {
    if (!selectedMethod) {
      Alert.alert("Select Payment Method", "Please select a payment method to continue.");
      return false;
    }

    switch (selectedMethod) {
      case "UPI":
        if (!selectedUpiApp && !upiId.trim()) {
          Alert.alert("UPI Details Required", "Please select a UPI app or enter your UPI ID.");
          return false;
        }
        break;
      case "CARD":
        if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
          Alert.alert("Card Details Required", "Please fill in all card details.");
          return false;
        }
        if (cardNumber.replace(/\s/g, "").length !== 16) {
          Alert.alert("Invalid Card", "Please enter a valid 16-digit card number.");
          return false;
        }
        break;
      case "NETBANKING":
        if (!selectedBank) {
          Alert.alert("Select Bank", "Please select a bank to continue.");
          return false;
        }
        break;
      case "WALLET":
        if (!selectedWallet) {
          Alert.alert("Select Wallet", "Please select a wallet to continue.");
          return false;
        }
        break;
    }

    return true;
  };

  const handlePayNow = async () => {
    if (!validatePayment()) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Parse participant data to get first participant details
      let participantName = "Participant";
      let tShirtSize = "M";
      let bloodGroup = "O+";
      
      try {
        const participants = JSON.parse((params.participants as string) || "[]");
        if (participants.length > 0) {
          const p = participants[0];
          participantName = `${p.basic.firstName} ${p.basic.lastName}`;
          tShirtSize = p.personal.tShirtSize;
          bloodGroup = p.personal.bloodGroup;
        }
      } catch (e) {
        // Use defaults
      }

      // Navigate to ticket screen
      router.replace({
        pathname: "/booking/ticket",
        params: {
          eventTitle,
          eventDate: params.eventDate,
          eventVenue: params.eventVenue,
          ticketTitle,
          ticketCategory: params.ticketCategory,
          participantName,
          tShirtSize,
          bloodGroup,
          ticketId: `BMR-${Date.now().toString(36).toUpperCase()}`,
        },
      });
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <BookingHeader title="Payment" currentStep={4} totalSteps={4} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <View style={styles.orderHeader}>
            <Ionicons name="receipt-outline" size={20} color={Colors.primary} />
            <Text style={styles.orderTitle}>Order Summary</Text>
          </View>
          <View style={styles.orderDetails}>
            <Text style={styles.orderEventTitle}>{eventTitle}</Text>
            <Text style={styles.orderTicketInfo}>
              {ticketTitle} × {quantity}
            </Text>
          </View>
          <View style={styles.orderTotal}>
            <Text style={styles.orderTotalLabel}>Total Payable</Text>
            <Text style={styles.orderTotalAmount}>₹{totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        {/* UPI */}
        <PaymentAccordion
          method="UPI"
          title="UPI"
          icon="phone-portrait-outline"
          isSelected={selectedMethod === "UPI"}
          isExpanded={expandedMethod === "UPI"}
          onSelect={() => handleSelectMethod("UPI")}
        >
          <UPIPayment
            upiId={upiId}
            onUpiIdChange={setUpiId}
            selectedApp={selectedUpiApp}
            onSelectApp={setSelectedUpiApp}
          />
        </PaymentAccordion>

        {/* Cards */}
        <PaymentAccordion
          method="CARD"
          title="Credit / Debit Card"
          icon="card-outline"
          isSelected={selectedMethod === "CARD"}
          isExpanded={expandedMethod === "CARD"}
          onSelect={() => handleSelectMethod("CARD")}
        >
          <CardPayment
            cardNumber={cardNumber}
            expiryDate={expiryDate}
            cvv={cvv}
            cardholderName={cardholderName}
            onCardNumberChange={setCardNumber}
            onExpiryDateChange={setExpiryDate}
            onCvvChange={setCvv}
            onCardholderNameChange={setCardholderName}
          />
        </PaymentAccordion>

        {/* Net Banking */}
        <PaymentAccordion
          method="NETBANKING"
          title="Net Banking"
          icon="globe-outline"
          isSelected={selectedMethod === "NETBANKING"}
          isExpanded={expandedMethod === "NETBANKING"}
          onSelect={() => handleSelectMethod("NETBANKING")}
        >
          <NetBanking
            selectedBank={selectedBank}
            onSelectBank={setSelectedBank}
          />
        </PaymentAccordion>

        {/* Wallets */}
        <PaymentAccordion
          method="WALLET"
          title="Wallets"
          icon="wallet-outline"
          isSelected={selectedMethod === "WALLET"}
          isExpanded={expandedMethod === "WALLET"}
          onSelect={() => handleSelectMethod("WALLET")}
        >
          <WalletPayment
            selectedWallet={selectedWallet}
            onSelectWallet={setSelectedWallet}
          />
        </PaymentAccordion>

        {/* Security Info */}
        <View style={styles.securityInfo}>
          <View style={styles.securityRow}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
            <Text style={styles.securityText}>100% Secure Payments</Text>
          </View>
          <View style={styles.securityRow}>
            <Ionicons name="lock-closed" size={20} color={Colors.success} />
            <Text style={styles.securityText}>256-bit SSL Encryption</Text>
          </View>
        </View>

        {/* Spacer for bottom bar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Pay Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.bottomPriceLabel}>Amount to Pay</Text>
          <Text style={styles.bottomPrice}>₹{totalAmount.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.payButton,
            (!selectedMethod || isProcessing) && styles.payButtonDisabled,
          ]}
          onPress={handlePayNow}
          disabled={!selectedMethod || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={Colors.textWhite} />
          ) : (
            <>
              <Ionicons name="lock-closed" size={16} color={Colors.textWhite} />
              <Text style={styles.payButtonText}>Pay Securely</Text>
            </>
          )}
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
  orderSummary: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textWhite,
  },
  orderDetails: {
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  orderEventTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  orderTicketInfo: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  orderTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTotalLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  orderTotalAmount: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  securityInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: Spacing.lg,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  securityText: {
    fontSize: 12,
    color: Colors.textSecondary,
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
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  payButtonDisabled: {
    backgroundColor: Colors.textLight,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textWhite,
  },
});
