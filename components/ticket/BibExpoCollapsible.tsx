import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface BibExpoInfo {
  date: string;
  dayName: string;
  time: string;
  venue: string;
  address: string;
}

interface BibExpoCollapsibleProps {
  bibExpoInfo: BibExpoInfo[];
}

const BibExpoCollapsible: React.FC<BibExpoCollapsibleProps> = ({
  bibExpoInfo,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="id-card" size={20} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Bib Expo Information</Text>
            <Text style={styles.headerSubtitle}>
              Collect your race kit before the event
            </Text>
          </View>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {bibExpoInfo.map((expo, index) => (
            <View
              key={index}
              style={[
                styles.expoItem,
                index < bibExpoInfo.length - 1 && styles.expoItemBorder,
              ]}
            >
              <View style={styles.dateContainer}>
                <Text style={styles.dayName}>{expo.dayName}</Text>
                <Text style={styles.date}>{expo.date}</Text>
              </View>
              <View style={styles.expoDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={14} color={Colors.textLight} />
                  <Text style={styles.detailText}>{expo.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={14} color={Colors.textLight} />
                  <Text style={styles.detailText}>{expo.venue}</Text>
                </View>
                <Text style={styles.address}>{expo.address}</Text>
              </View>
            </View>
          ))}

          {/* Important Note */}
          <View style={styles.noteContainer}>
            <Ionicons name="information-circle" size={16} color={Colors.warning} />
            <Text style={styles.noteText}>
              Please carry a valid photo ID for bib collection
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE8EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  expoItem: {
    flexDirection: "row",
    paddingVertical: Spacing.md,
  },
  expoItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dateContainer: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.md,
  },
  dayName: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  date: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: 2,
  },
  expoDetails: {
    flex: 1,
    justifyContent: "center",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginLeft: 6,
  },
  address: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
    marginLeft: 20,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: Spacing.sm,
    borderRadius: 8,
    marginTop: Spacing.sm,
  },
  noteText: {
    fontSize: 12,
    color: Colors.warning,
    marginLeft: 6,
    flex: 1,
  },
});

export default BibExpoCollapsible;
