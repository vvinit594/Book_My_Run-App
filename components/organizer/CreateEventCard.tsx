import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

interface CreateEventCardProps {
  onPress: () => void;
}

function CreateEventCard({ onPress }: CreateEventCardProps) {
  return (
    <TouchableOpacity
      style={styles.createEventButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.createEventContent}>
        <View style={styles.createEventIcon}>
          <Ionicons name="add-circle" size={28} color={Colors.textWhite} />
        </View>
        <View style={styles.createEventText}>
          <Text style={styles.createEventTitle}>Create New Event</Text>
          <Text style={styles.createEventSubtitle}>
            Start building your next running event
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={Colors.textWhite} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  createEventButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createEventContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  createEventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  createEventText: {
    flex: 1,
  },
  createEventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  createEventSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
});

export default memo(CreateEventCard);
