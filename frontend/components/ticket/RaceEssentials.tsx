import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

interface RaceEssentialsProps {
  reportingTime: string;
  flagOffTime: string;
  bloodGroup: string;
  jerseySize: string;
}

const RaceEssentials: React.FC<RaceEssentialsProps> = ({
  reportingTime,
  flagOffTime,
  bloodGroup,
  jerseySize,
}) => {
  const essentials = [
    {
      icon: "time-outline" as const,
      label: "Reporting",
      value: reportingTime,
      color: Colors.info,
    },
    {
      icon: "flag" as const,
      label: "Flag Off",
      value: flagOffTime,
      color: Colors.success,
    },
    {
      icon: "water" as const,
      label: "Blood Group",
      value: bloodGroup,
      color: Colors.error,
    },
    {
      icon: "shirt-outline" as const,
      label: "Jersey Size",
      value: jerseySize,
      color: Colors.primary,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Race Essentials</Text>
      <View style={styles.card}>
        <View style={styles.grid}>
          {essentials.map((item, index) => (
            <View key={index} style={styles.essentialItem}>
              <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.essentialValue}>{item.value}</Text>
              <Text style={styles.essentialLabel}>{item.label}</Text>
            </View>
          ))}
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
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  essentialItem: {
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  essentialValue: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: 4,
  },
  essentialLabel: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 2,
  },
});

export default RaceEssentials;
