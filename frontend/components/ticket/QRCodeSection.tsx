import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

interface QRCodeSectionProps {
  ticketId: string;
  participantName: string;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({
  ticketId,
  participantName,
}) => {
  // Generate a QR code URL using a free QR code API
  // In production, this would be a secure token-based QR
  const qrData = encodeURIComponent(`BOOKMYRUN-${ticketId}-${participantName}`);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}&bgcolor=FFFFFF&color=1A1A2E`;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* QR Code */}
        <View style={styles.qrContainer}>
          <Image
            source={{ uri: qrCodeUrl }}
            style={styles.qrCode}
            resizeMode="contain"
          />
        </View>

        {/* Scan Instruction */}
        <Text style={styles.scanText}>Scan at entry point</Text>

        {/* Secure Badge */}
        <View style={styles.secureBadge}>
          <Ionicons name="lock-closed" size={14} color={Colors.success} />
          <Text style={styles.secureText}>Secure Ticket</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  qrContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qrCode: {
    width: 180,
    height: 180,
  },
  scanText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  secureText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default QRCodeSection;
