import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../constants/spacing";

export type OrganizerMenuId = "ongoing" | "concluded" | "saved";

export interface OrganizerMenuItem {
  id: OrganizerMenuId;
  title: string;
  subtitle: string;
  count: number;
  icon: keyof typeof Ionicons.glyphMap;
  iconBackground: string;
  iconColor: string;
  badgeColor: string;
}

interface OrganizerMenuCardProps {
  item: OrganizerMenuItem;
  onPress: (id: OrganizerMenuId) => void;
}

function OrganizerMenuCard({ item, onPress }: OrganizerMenuCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View
          style={[styles.iconWrap, { backgroundColor: item.iconBackground }]}
        >
          <Ionicons name={item.icon} size={22} color={item.iconColor} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
          <Text style={styles.badgeText}>{item.count}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={Colors.textLight}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: Spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  badge: {
    minWidth: 32,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
  },
  badgeText: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.textWhite,
  },
});

export default memo(OrganizerMenuCard);
