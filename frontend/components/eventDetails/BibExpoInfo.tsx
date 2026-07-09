import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing, FontSize, BorderRadius } from "../../constants/spacing";
import { BibExpoDay } from "../../types";

interface BibExpoInfoProps {
  bibExpo: BibExpoDay[];
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function BibExpoInfo({ bibExpo }: BibExpoInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Bib Expo / Kit Collection</Text>
      <Text style={styles.sectionSubtitle}>
        Collect your running kit before the event
      </Text>

      {bibExpo.map((day) => (
        <View key={day.day} style={styles.dayCard}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>Day {day.day}</Text>
          </View>

          <View style={styles.dayInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
              <Text style={styles.infoText}>
                {formatDate(day.date)} ({day.dayName})
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color={Colors.primary} />
              <Text style={styles.infoText}>
                {day.startTime} – {day.endTime}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={Colors.primary} />
              <View style={styles.locationInfo}>
                <Text style={styles.infoText}>{day.venue}</Text>
                {day.address && (
                  <Text style={styles.addressText}>{day.address}</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      ))}
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
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  dayCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  dayBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
    marginBottom: Spacing.md,
  },
  dayBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.textWhite,
  },
  dayInfo: {
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  locationInfo: {
    flex: 1,
  },
  addressText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
