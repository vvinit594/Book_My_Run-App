import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing, FontSize, BorderRadius } from "../../constants/spacing";
import { EventDetails, EventCategory } from "../../types";

interface EventInfoCardProps {
  event: EventDetails;
  onLocationPress?: () => void;
}

// Format full date with day
const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Format registration close date
const formatCloseDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function EventInfoCard({ event, onLocationPress }: EventInfoCardProps) {
  return (
    <View style={styles.container}>
      {/* Event Title */}
      <Text style={styles.title}>{event.title}</Text>

      {/* Date & Time */}
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Date & Time</Text>
          <Text style={styles.infoValue}>
            {formatFullDate(event.date)}
          </Text>
          <Text style={styles.infoSubtext}>
            {event.startTime} {event.endTime ? `- ${event.endTime}` : "onwards"}
          </Text>
        </View>
      </View>

      {/* Location */}
      <Pressable style={styles.infoRow} onPress={onLocationPress}>
        <Ionicons name="location-outline" size={18} color={Colors.primary} />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Venue</Text>
          <Text style={styles.infoValue}>{event.location.venue}</Text>
          <Text style={styles.infoSubtext}>{event.location.city}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
      </Pressable>

      {/* Distance Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionLabel}>Distance Categories</Text>
        <View style={styles.categoriesRow}>
          {event.categories.map((cat, index) => (
            <View key={index} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{cat}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Event Type */}
      <View style={styles.eventTypeRow}>
        <View style={styles.eventTypeChip}>
          <Ionicons name="fitness-outline" size={16} color={Colors.primary} />
          <Text style={styles.eventTypeText}>{event.eventType}</Text>
        </View>
        <View style={[
          styles.eventTypeChip,
          event.isVirtual ? styles.virtualChip : styles.physicalChip
        ]}>
          <Ionicons 
            name={event.isVirtual ? "globe-outline" : "location-outline"} 
            size={16} 
            color={event.isVirtual ? Colors.virtual : Colors.physical} 
          />
          <Text style={[
            styles.eventTypeText,
            event.isVirtual ? styles.virtualText : styles.physicalText
          ]}>
            {event.isVirtual ? "Virtual" : "Physical"}
          </Text>
        </View>
      </View>

      {/* Registration Closing */}
      <View style={styles.closingRow}>
        <Ionicons name="time-outline" size={16} color={Colors.warning} />
        <Text style={styles.closingText}>
          Registration closes on {formatCloseDate(event.registrationCloseDate)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.xl,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  infoLabel: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  infoSubtext: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  categoriesSection: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary + "15",
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.primary,
  },
  eventTypeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  eventTypeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.chipBackground,
    borderRadius: BorderRadius.md,
  },
  eventTypeText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  virtualChip: {
    backgroundColor: Colors.virtual + "15",
  },
  physicalChip: {
    backgroundColor: Colors.physical + "15",
  },
  virtualText: {
    color: Colors.virtual,
  },
  physicalText: {
    color: Colors.physical,
  },
  closingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.warning + "15",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  closingText: {
    fontSize: FontSize.sm,
    color: Colors.warning,
    fontWeight: "500",
  },
});
