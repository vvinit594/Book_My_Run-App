import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

interface TicketActionBarProps {
  onDownload: () => void;
  onShare: () => void;
  onAddToCalendar: () => void;
}

const TicketActionBar: React.FC<TicketActionBarProps> = ({
  onDownload,
  onShare,
  onAddToCalendar,
}) => {
  return (
    <View style={styles.container}>
      {/* Primary Actions */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onDownload}
        activeOpacity={0.8}
      >
        <Ionicons name="download-outline" size={20} color={Colors.textWhite} />
        <Text style={styles.primaryButtonText}>Download</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onShare}
        activeOpacity={0.7}
      >
        <Ionicons name="share-social-outline" size={20} color={Colors.primary} />
        <Text style={styles.secondaryButtonText}>Share</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onAddToCalendar}
        activeOpacity={0.7}
      >
        <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
        <Text style={styles.secondaryButtonText}>Calendar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Platform.OS === "ios" ? Spacing.xl : Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    gap: Spacing.sm,
  },
  primaryButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.primary,
    marginTop: 2,
  },
});

export default TicketActionBar;
