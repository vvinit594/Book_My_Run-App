import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing, FontSize, BorderRadius } from "../../constants/spacing";
import { Announcement } from "../../types";

interface AnnouncementBannerProps {
  announcement: Announcement;
  onPress?: () => void;
  onDismiss?: () => void;
}

export default function AnnouncementBanner({
  announcement,
  onPress,
  onDismiss,
}: AnnouncementBannerProps) {
  if (!announcement.isActive) return null;

  return (
    <Pressable
      style={[
        styles.container,
        announcement.backgroundColor
          ? { backgroundColor: announcement.backgroundColor }
          : null,
      ]}
      onPress={onPress}
    >
      <Text style={styles.text} numberOfLines={1}>
        {announcement.text}
      </Text>
      {onDismiss && (
        <Pressable style={styles.dismissButton} onPress={onDismiss}>
          <Ionicons name="close" size={18} color={Colors.textWhite} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.announcementBg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.announcementText,
    fontSize: FontSize.sm,
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
  },
  dismissButton: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
});
