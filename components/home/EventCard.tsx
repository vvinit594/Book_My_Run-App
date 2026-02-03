import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing, FontSize, BorderRadius } from "../../constants/spacing";
import { Event, EventTag } from "../../types";

interface EventCardProps {
  event: Event;
  onPress: (eventId: string) => void;
  onBookPress: (eventId: string) => void;
}

// Tag styling helper
const getTagStyle = (tag: EventTag) => {
  switch (tag) {
    case "EARLY_BIRD":
      return { bg: Colors.earlyBird, text: "EARLY BIRD" };
    case "SELLING_FAST":
      return { bg: Colors.error, text: "SELLING FAST" };
    case "NEW":
      return { bg: Colors.info, text: "NEW" };
    case "RECOMMENDED":
      return { bg: Colors.primary, text: "RECOMMENDED" };
    case "LAST_FEW_SLOTS":
      return { bg: Colors.warning, text: "LAST FEW SLOTS" };
    default:
      return { bg: Colors.textSecondary, text: tag };
  }
};

// Format date to "SEP 23" format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = date.getDate();
  return `${month} ${day}`;
};

// Format close date
const formatCloseDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  return `Closes ${day} ${month}`;
};

export default function EventCard({ event, onPress, onBookPress }: EventCardProps) {
  return (
    <Pressable style={styles.container} onPress={() => onPress(event.id)}>
      {/* Banner Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.bannerImage }} style={styles.image} />
        
        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{formatDate(event.date)}</Text>
        </View>

        {/* Rating */}
        {event.rating && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color={Colors.rating} />
            <Text style={styles.ratingText}>{event.rating}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Tags */}
        {event.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {event.tags.slice(0, 2).map((tag, index) => {
              const tagStyle = getTagStyle(tag);
              return (
                <View
                  key={index}
                  style={[styles.tag, { backgroundColor: tagStyle.bg }]}
                >
                  <Text style={styles.tagText}>{tagStyle.text}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        {/* Location */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {event.location.venue}, {event.location.city}
          </Text>
        </View>

        {/* Categories */}
        <View style={styles.categoriesRow}>
          {event.categories.map((cat, index) => (
            <View key={index} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{cat}</Text>
            </View>
          ))}
          {event.isVirtual && (
            <View style={[styles.categoryChip, styles.virtualChip]}>
              <Text style={[styles.categoryText, styles.virtualText]}>Virtual</Text>
            </View>
          )}
        </View>

        {/* Footer: Close Date, Price, Book Button */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.closeDate}>
              ⏳ {formatCloseDate(event.registrationCloseDate)}
            </Text>
            <Text style={styles.price}>
              ₹{event.price.startingFrom} onwards
            </Text>
          </View>
          <Pressable
            style={styles.bookButton}
            onPress={() => onBookPress(event.id)}
          >
            <Text style={styles.bookButtonText}>Book</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    height: 150,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  dateBadge: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.textWhite,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  dateText: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  ratingBadge: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.textWhite,
  },
  content: {
    padding: Spacing.md,
  },
  tagsRow: {
    flexDirection: "row",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.textWhite,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  locationText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  categoryChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.chipBackground,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  virtualChip: {
    backgroundColor: Colors.virtual + "20",
    borderColor: Colors.virtual,
  },
  virtualText: {
    color: Colors.virtual,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerLeft: {
    flex: 1,
  },
  closeDate: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginBottom: 2,
  },
  price: {
    fontSize: FontSize.md,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  bookButtonText: {
    color: Colors.textWhite,
    fontSize: FontSize.md,
    fontWeight: "600",
  },
});
