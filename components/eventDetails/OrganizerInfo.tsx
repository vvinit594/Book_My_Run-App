import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing, FontSize, BorderRadius } from "../../constants/spacing";
import { OrganizerDetails } from "../../types";

interface OrganizerInfoProps {
  organizer: OrganizerDetails;
  onFollowPress?: () => void;
  onContactPress?: () => void;
}

// Format joined date
const formatJoinedDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export default function OrganizerInfo({
  organizer,
  onFollowPress,
  onContactPress,
}: OrganizerInfoProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollowPress?.();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>About the Organizer</Text>

      {/* Organizer Header */}
      <View style={styles.header}>
        {organizer.logo ? (
          <Image source={{ uri: organizer.logo }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Ionicons name="business" size={24} color={Colors.textLight} />
          </View>
        )}

        <View style={styles.headerInfo}>
          <Text style={styles.organizerName}>{organizer.name}</Text>
          <Text style={styles.joinedDate}>
            Joined {formatJoinedDate(organizer.joinedDate)}
          </Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>
              <Text style={styles.statValue}>{organizer.totalEvents}</Text> Events
            </Text>
            <Text style={styles.statDivider}>•</Text>
            <Text style={styles.statText}>
              <Text style={styles.statValue}>{organizer.followers.toLocaleString()}</Text> Followers
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          style={[styles.followButton, isFollowing && styles.followingButton]}
          onPress={handleFollow}
        >
          <Ionicons
            name={isFollowing ? "checkmark" : "add"}
            size={18}
            color={isFollowing ? Colors.primary : Colors.textWhite}
          />
          <Text style={[styles.followText, isFollowing && styles.followingText]}>
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </Pressable>

        <Pressable style={styles.contactButton} onPress={onContactPress}>
          <Ionicons name="mail-outline" size={18} color={Colors.primary} />
          <Text style={styles.contactText}>Contact</Text>
        </Pressable>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={4}>
        {organizer.description}
      </Text>

      {/* Social Links */}
      {organizer.socialLinks && (
        <View style={styles.socialLinks}>
          {organizer.socialLinks.website && (
            <Pressable style={styles.socialIcon}>
              <Ionicons name="globe-outline" size={20} color={Colors.textSecondary} />
            </Pressable>
          )}
          {organizer.socialLinks.instagram && (
            <Pressable style={styles.socialIcon}>
              <Ionicons name="logo-instagram" size={20} color={Colors.textSecondary} />
            </Pressable>
          )}
          {organizer.socialLinks.facebook && (
            <Pressable style={styles.socialIcon}>
              <Ionicons name="logo-facebook" size={20} color={Colors.textSecondary} />
            </Pressable>
          )}
          {organizer.socialLinks.twitter && (
            <Pressable style={styles.socialIcon}>
              <Ionicons name="logo-twitter" size={20} color={Colors.textSecondary} />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.backgroundSecondary,
  },
  logoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  organizerName: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  joinedDate: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  statText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  statValue: {
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  statDivider: {
    marginHorizontal: Spacing.sm,
    color: Colors.textLight,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  followButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  followingButton: {
    backgroundColor: Colors.textWhite,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  followText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textWhite,
  },
  followingText: {
    color: Colors.primary,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  contactText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.primary,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  socialLinks: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
});
