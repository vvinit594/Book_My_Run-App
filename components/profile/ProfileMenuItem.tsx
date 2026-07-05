import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Href } from "expo-router";
import Colors from "../../constants/colors";
import { FontSize, Spacing } from "../../constants/spacing";

interface ProfileMenuItemProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: Href;
  isLast?: boolean;
}

function ProfileMenuItem({
  title,
  description,
  icon,
  route,
  isLast = false,
}: ProfileMenuItemProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.row, !isLast ? styles.rowBorder : null]}
      onPress={() => router.push(route)}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 68,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE8EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  textWrap: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

export default memo(ProfileMenuItem);
