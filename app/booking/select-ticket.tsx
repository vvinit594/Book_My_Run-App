import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { mockTicketCategories, CONVENIENCE_FEE_PERCENTAGE, GST_PERCENTAGE } from "../../constants/mockBookingData";
import { TicketCategory } from "../../types";
import BookingHeader from "../../components/booking/BookingHeader";
import TicketCard from "../../components/booking/TicketCard";
import QuantitySelector from "../../components/booking/QuantitySelector";
import PriceSummary from "../../components/booking/PriceSummary";

// Certificate file type
interface CertificateFile {
  uri: string;
  name: string;
  type: 'image' | 'pdf';
}

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
  
  // Certificate state
  const [certificateFile, setCertificateFile] = useState<CertificateFile | null>(null);
  const [certificateLink, setCertificateLink] = useState("");

  // Check if certificate is provided (for status indicator only)
  const isCertificateProvided = certificateFile !== null || (certificateLink.trim().length > 0 && isValidUrl(certificateLink));

  // URL validation helper
  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Handle image upload
  const handleUploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your photo library to upload certificate.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileName = asset.uri.split("/").pop() || "certificate.jpg";
      setCertificateFile({
        uri: asset.uri,
        name: fileName,
        type: "image",
      });
    }
  };

  // Handle document upload (PDF)
  const handleUploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setCertificateFile({
          uri: asset.uri,
          name: asset.name || "certificate.pdf",
          type: "pdf",
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select document. Please try again.");
    }
  };

  // Show upload options
  const handleUploadCertificate = () => {
    Alert.alert(
      "Upload Certificate",
      "Choose upload method",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Photo from Gallery", onPress: handleUploadImage },
        { text: "PDF Document", onPress: handleUploadDocument },
      ]
    );
  };

  // Remove uploaded file
  const handleRemoveCertificate = () => {
    setCertificateFile(null);
  };

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

        {/* Past Running Certificate Section */}
        <View style={styles.certificateSection}>
          <View style={styles.certificateHeader}>
            <View style={styles.certificateTitleRow}>
              <Ionicons name="document-text" size={20} color={Colors.primary} />
              <Text style={styles.certificateSectionTitle}>Past Running Certificate</Text>
              <View style={styles.optionalBadge}>
                <Text style={styles.optionalText}>Optional</Text>
              </View>
            </View>
            <Text style={styles.certificateHint}>
              If you have a past running certificate, you may upload it or share a valid link. This is optional and does not affect ticket booking.
            </Text>
          </View>

          {/* Certificate Status */}
          {isCertificateProvided && (
            <View style={styles.certificateStatus}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.certificateStatusText}>Certificate added</Text>
            </View>
          )}

          {/* Upload Option */}
          <View style={styles.uploadSection}>
            <Text style={styles.uploadLabel}>Option 1: Upload Certificate</Text>
            
            {certificateFile ? (
              <View style={styles.filePreview}>
                {certificateFile.type === "image" ? (
                  <Image source={{ uri: certificateFile.uri }} style={styles.fileImage} />
                ) : (
                  <View style={styles.pdfPreview}>
                    <Ionicons name="document" size={32} color={Colors.primary} />
                  </View>
                )}
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {certificateFile.name}
                  </Text>
                  <Text style={styles.fileType}>
                    {certificateFile.type === "image" ? "Image" : "PDF Document"}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.removeFileButton}
                  onPress={handleRemoveCertificate}
                >
                  <Ionicons name="close-circle" size={24} color="#FF5252" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={handleUploadCertificate}
              >
                <Ionicons name="cloud-upload-outline" size={24} color={Colors.primary} />
                <Text style={styles.uploadButtonText}>Upload Certificate</Text>
                <Text style={styles.uploadFormats}>JPG, PNG, PDF</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Divider */}
          <View style={styles.orDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Link Option */}
          <View style={styles.linkSection}>
            <Text style={styles.uploadLabel}>Option 2: Certificate Link</Text>
            <View style={[
              styles.linkInputContainer,
              certificateLink.length > 0 && !isValidUrl(certificateLink) && styles.linkInputError,
            ]}>
              <Ionicons 
                name="link" 
                size={20} 
                color={certificateLink.length > 0 && isValidUrl(certificateLink) ? "#4CAF50" : Colors.textSecondary} 
              />
              <TextInput
                style={styles.linkInput}
                placeholder="Paste certificate URL"
                placeholderTextColor={Colors.textLight}
                value={certificateLink}
                onChangeText={(text) => {
                  setCertificateLink(text);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              {certificateLink.length > 0 && (
                <TouchableOpacity onPress={() => setCertificateLink("")}>
                  <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            {certificateLink.length > 0 && !isValidUrl(certificateLink) && (
              <Text style={styles.linkErrorText}>Please enter a valid URL</Text>
            )}
          </View>
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
  // Certificate Section Styles
  certificateSection: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  certificateHeader: {
    marginBottom: Spacing.md,
  },
  certificateTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  certificateSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    flex: 1,
  },
  optionalBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  optionalText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1976D2",
  },
  certificateHint: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  certificateStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  certificateStatusText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#4CAF50",
  },
  uploadSection: {
    marginBottom: Spacing.sm,
  },
  uploadLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: "dashed",
    borderRadius: 10,
    padding: Spacing.md,
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  uploadFormats: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 2,
  },
  filePreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  fileImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  pdfPreview: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: "#FCE4EC",
    justifyContent: "center",
    alignItems: "center",
  },
  fileInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  fileName: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  fileType: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  removeFileButton: {
    padding: Spacing.xs,
  },
  orDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  orText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.sm,
    fontWeight: "500",
  },
  linkSection: {},
  linkInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  linkInputError: {
    borderColor: "#FF5252",
  },
  linkInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 4,
  },
  linkErrorText: {
    fontSize: 11,
    color: "#FF5252",
    marginTop: 4,
  },
  // Section Styles
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
