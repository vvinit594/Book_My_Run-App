import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

interface OrganizerCardProps {
  organizerName: string;
  organizerLogo?: string;
  isVerified?: boolean;
  onContactPress: () => void;
}

const OrganizerCard: React.FC<OrganizerCardProps> = ({
  organizerName,
  organizerLogo,
  isVerified = true,
  onContactPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Event Organizer</Text>
      <View style={styles.card}>
        <View style={styles.organizerInfo}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            {organizerLogo ? (
              <Image source={{ uri: organizerLogo }} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Ionicons name="business" size={24} color={Colors.primary} />
              </View>
            )}
          </View>

          {/* Name & Badge */}
          <View style={styles.nameContainer}>
            <Text style={styles.organizerName}>{organizerName}</Text>
            {isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons
                  name="shield-checkmark"
                  size={14}
                  color={Colors.info}
                />
                <Text style={styles.verifiedText}>Verified Organizer</Text>
              </View>
            )}
          </View>
        </View>

        {/* Contact Button */}
        <TouchableOpacity
          style={styles.contactButton}
          onPress={onContactPress}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.primary} />
          <Text style={styles.contactButtonText}>Contact Organizer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  organizerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  logoContainer: {
    marginRight: Spacing.sm,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFE8EC",
    alignItems: "center",
    justifyContent: "center",
  },
  nameContainer: {
    flex: 1,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.info,
    marginLeft: 4,
    fontWeight: "500",
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFE8EC",
    paddingVertical: Spacing.sm,
    borderRadius: 10,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginLeft: Spacing.xs,
  },
});

export default OrganizerCard;
