import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

const { width } = Dimensions.get("window");

interface TicketHeroSectionProps {
  eventName: string;
  eventTagline?: string;
  eventDate: string;
  eventTime: string;
  location: string;
  bannerImage: string;
}

const TicketHeroSection: React.FC<TicketHeroSectionProps> = ({
  eventName,
  eventTagline,
  eventDate,
  eventTime,
  location,
  bannerImage,
}) => {
  return (
    <View style={styles.container}>
      {/* Success Indicator */}
      <View style={styles.successBanner}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
        </View>
        <Text style={styles.successText}>Payment Successful</Text>
      </View>

      {/* Ticket Card with Banner */}
      <View style={styles.ticketCard}>
        <ImageBackground
          source={{ uri: bannerImage }}
          style={styles.bannerImage}
          imageStyle={styles.bannerImageStyle}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
            style={styles.gradient}
          >
            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>{eventName}</Text>
              {eventTagline && (
                <Text style={styles.eventTagline}>{eventTagline}</Text>
              )}

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar" size={16} color={Colors.primary} />
                  <Text style={styles.detailText}>
                    {eventDate}, {eventTime}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="location" size={16} color={Colors.primary} />
                  <Text style={styles.detailText}>{location}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Perforation Effect */}
        <View style={styles.perforationContainer}>
          <View style={styles.perforationLeft} />
          <View style={styles.dottedLine} />
          <View style={styles.perforationRight} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E9",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
  successIconContainer: {
    marginRight: Spacing.xs,
  },
  successText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.success,
  },
  ticketCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  bannerImage: {
    width: "100%",
    height: 200,
  },
  bannerImageStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: Spacing.md,
  },
  eventInfo: {
    marginBottom: Spacing.xs,
  },
  eventName: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.textWhite,
    marginBottom: 4,
  },
  eventTagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: Spacing.sm,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: Colors.textWhite,
    marginLeft: 6,
  },
  perforationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    paddingVertical: 0,
  },
  perforationLeft: {
    width: 16,
    height: 32,
    backgroundColor: Colors.backgroundSecondary,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    marginLeft: -1,
  },
  dottedLine: {
    flex: 1,
    height: 2,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  perforationRight: {
    width: 16,
    height: 32,
    backgroundColor: Colors.backgroundSecondary,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    marginRight: -1,
  },
});

export default TicketHeroSection;
