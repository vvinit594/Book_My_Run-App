import React from "react";
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
import { PaymentMethod } from "../../types";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
}

interface PaymentAccordionProps {
  method: PaymentMethod;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}

const PaymentAccordion: React.FC<PaymentAccordionProps> = ({
  title,
  icon,
  isSelected,
  isExpanded,
  onSelect,
  children,
}) => {
  return (
    <View style={[styles.accordion, isSelected && styles.accordionSelected]}>
      <TouchableOpacity style={styles.accordionHeader} onPress={onSelect}>
        <View style={styles.accordionLeft}>
          <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
          <Ionicons name={icon} size={22} color={Colors.textPrimary} />
          <Text style={styles.accordionTitle}>{title}</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>
      {isExpanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

// UPI Payment Section
interface UPIPaymentProps {
  upiId: string;
  onUpiIdChange: (id: string) => void;
  selectedApp?: string;
  onSelectApp: (app: string) => void;
}

export const UPIPayment: React.FC<UPIPaymentProps> = ({
  upiId,
  onUpiIdChange,
  selectedApp,
  onSelectApp,
}) => {
  const upiApps = [
    { id: "gpay", name: "Google Pay", icon: "logo-google" },
    { id: "phonepe", name: "PhonePe", icon: "phone-portrait-outline" },
    { id: "paytm", name: "Paytm", icon: "wallet-outline" },
  ];

  return (
    <View>
      <Text style={styles.subLabel}>Select UPI App</Text>
      <View style={styles.upiAppsContainer}>
        {upiApps.map((app) => (
          <TouchableOpacity
            key={app.id}
            style={[
              styles.upiAppButton,
              selectedApp === app.id && styles.upiAppButtonSelected,
            ]}
            onPress={() => onSelectApp(app.id)}
          >
            <Ionicons
              name={app.icon as keyof typeof Ionicons.glyphMap}
              size={24}
              color={selectedApp === app.id ? Colors.primary : Colors.textSecondary}
            />
            <Text
              style={[
                styles.upiAppText,
                selectedApp === app.id && styles.upiAppTextSelected,
              ]}
            >
              {app.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.orDivider}>OR</Text>

      <Text style={styles.subLabel}>Enter UPI ID</Text>
      <TextInput
        style={styles.upiInput}
        value={upiId}
        onChangeText={onUpiIdChange}
        placeholder="yourname@upi"
        placeholderTextColor={Colors.textLight}
        autoCapitalize="none"
        keyboardType="email-address"
      />
    </View>
  );
};

// Card Payment Section
interface CardPaymentProps {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  onCardNumberChange: (value: string) => void;
  onExpiryDateChange: (value: string) => void;
  onCvvChange: (value: string) => void;
  onCardholderNameChange: (value: string) => void;
}

export const CardPayment: React.FC<CardPaymentProps> = ({
  cardNumber,
  expiryDate,
  cvv,
  cardholderName,
  onCardNumberChange,
  onExpiryDateChange,
  onCvvChange,
  onCardholderNameChange,
}) => {
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <View>
      <View style={styles.inputGroup}>
        <Text style={styles.subLabel}>Card Number</Text>
        <TextInput
          style={styles.cardInput}
          value={cardNumber}
          onChangeText={(text) => onCardNumberChange(formatCardNumber(text))}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor={Colors.textLight}
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.cardRow}>
        <View style={styles.cardHalf}>
          <Text style={styles.subLabel}>Expiry Date</Text>
          <TextInput
            style={styles.cardInput}
            value={expiryDate}
            onChangeText={(text) => onExpiryDateChange(formatExpiryDate(text))}
            placeholder="MM/YY"
            placeholderTextColor={Colors.textLight}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
        <View style={styles.cardHalf}>
          <Text style={styles.subLabel}>CVV</Text>
          <TextInput
            style={styles.cardInput}
            value={cvv}
            onChangeText={onCvvChange}
            placeholder="123"
            placeholderTextColor={Colors.textLight}
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.subLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.cardInput}
          value={cardholderName}
          onChangeText={onCardholderNameChange}
          placeholder="Name on card"
          placeholderTextColor={Colors.textLight}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.secureNotice}>
        <Ionicons name="lock-closed" size={14} color={Colors.success} />
        <Text style={styles.secureText}>
          Your card details are secured with 256-bit encryption
        </Text>
      </View>
    </View>
  );
};

// Net Banking Section
interface NetBankingProps {
  selectedBank?: string;
  onSelectBank: (bank: string) => void;
}

export const NetBanking: React.FC<NetBankingProps> = ({
  selectedBank,
  onSelectBank,
}) => {
  const popularBanks = [
    { id: "hdfc", name: "HDFC Bank" },
    { id: "icici", name: "ICICI Bank" },
    { id: "sbi", name: "State Bank of India" },
    { id: "axis", name: "Axis Bank" },
    { id: "kotak", name: "Kotak Mahindra" },
    { id: "yes", name: "Yes Bank" },
  ];

  return (
    <View>
      <Text style={styles.subLabel}>Popular Banks</Text>
      <View style={styles.banksGrid}>
        {popularBanks.map((bank) => (
          <TouchableOpacity
            key={bank.id}
            style={[
              styles.bankButton,
              selectedBank === bank.id && styles.bankButtonSelected,
            ]}
            onPress={() => onSelectBank(bank.id)}
          >
            <View style={styles.bankIconPlaceholder}>
              <Ionicons
                name="business-outline"
                size={20}
                color={selectedBank === bank.id ? Colors.primary : Colors.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.bankName,
                selectedBank === bank.id && styles.bankNameSelected,
              ]}
              numberOfLines={2}
            >
              {bank.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Wallet Section
interface WalletPaymentProps {
  selectedWallet?: string;
  onSelectWallet: (wallet: string) => void;
}

export const WalletPayment: React.FC<WalletPaymentProps> = ({
  selectedWallet,
  onSelectWallet,
}) => {
  const wallets = [
    { id: "paytm", name: "Paytm", balance: 2500 },
    { id: "mobikwik", name: "MobiKwik", balance: 1200 },
    { id: "freecharge", name: "Freecharge", balance: 500 },
    { id: "amazonpay", name: "Amazon Pay", balance: 3000 },
  ];

  return (
    <View>
      <Text style={styles.subLabel}>Available Wallets</Text>
      {wallets.map((wallet) => (
        <TouchableOpacity
          key={wallet.id}
          style={[
            styles.walletItem,
            selectedWallet === wallet.id && styles.walletItemSelected,
          ]}
          onPress={() => onSelectWallet(wallet.id)}
        >
          <View style={styles.walletLeft}>
            <View
              style={[
                styles.walletRadio,
                selectedWallet === wallet.id && styles.walletRadioSelected,
              ]}
            >
              {selectedWallet === wallet.id && (
                <View style={styles.walletRadioInner} />
              )}
            </View>
            <View style={styles.walletIconPlaceholder}>
              <Ionicons name="wallet-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.walletName}>{wallet.name}</Text>
          </View>
          <Text style={styles.walletBalance}>₹{wallet.balance}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>
      {/* Individual payment components will be rendered by parent */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  accordion: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  accordionSelected: {
    borderColor: Colors.primary,
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
  },
  accordionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  accordionContent: {
    padding: Spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  subLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  upiAppsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  upiAppButton: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  upiAppButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#FFE8EC",
  },
  upiAppText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  upiAppTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
  orDivider: {
    textAlign: "center",
    color: Colors.textLight,
    marginVertical: Spacing.md,
    fontSize: 13,
  },
  upiInput: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputGroup: {
    marginBottom: Spacing.sm,
  },
  cardInput: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  cardHalf: {
    flex: 1,
  },
  secureNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: Spacing.sm,
  },
  secureText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  banksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  bankButton: {
    width: "31%",
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bankButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#FFE8EC",
  },
  bankIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  bankName: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  bankNameSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
  walletItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  walletItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#FFE8EC",
  },
  walletLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  walletRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  walletRadioSelected: {
    borderColor: Colors.primary,
  },
  walletRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  walletIconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FFE8EC",
    alignItems: "center",
    justifyContent: "center",
  },
  walletName: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  walletBalance: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.success,
  },
});

export { PaymentAccordion };
export default PaymentMethodSelector;
