import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

const NAVBAR_HEIGHT = 56;
const MIN_TOUCH_TARGET = 44;

interface TopAppBarProps {
  city: string;
  onCityPress: () => void;
  onSearchPress: () => void;
  onProfilePress: () => void;
  onListEventPress: () => void;
  onNotificationsPress?: () => void;
}

export default function TopAppBar({
  city,
  onCityPress,
  onSearchPress,
  onProfilePress,
  onListEventPress,
  onNotificationsPress,
}: TopAppBarProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />
      
      <View style={styles.container}>
        {/* Left: Logo */}
        <View style={styles.leftSection}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Center: City Selector */}
        <Pressable 
          style={styles.citySelector} 
          onPress={onCityPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="location" size={14} color={Colors.primary} />
          <Text style={styles.cityText}>{city}</Text>
          <Ionicons name="chevron-down" size={12} color={Colors.textWhite} />
        </Pressable>

        {/* Right: Actions */}
        <View style={styles.rightSection}>
          {/* List Your Event Button */}
          <TouchableOpacity 
            style={styles.listEventButton} 
            onPress={onListEventPress}
            activeOpacity={0.8}
          >
            <Text style={styles.listEventText}>List Your Event</Text>
          </TouchableOpacity>

          {/* Notification Icon */}
          <Pressable 
            style={styles.iconButton} 
            onPress={onNotificationsPress}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.textWhite} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.backgroundDark,
  },
  container: {
    height: NAVBAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.backgroundDark,
    paddingHorizontal: Spacing.lg,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 110,
  },
  logoImage: {
    width: 120,
    height: 42,
  },
  citySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: Spacing.md,
    height: 32,
    borderRadius: 16,
    gap: 4,
  },
  cityText: {
    color: Colors.textWhite,
    fontSize: 13,
    fontWeight: "600",
    marginHorizontal: 2,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  listEventButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  listEventText: {
    color: Colors.textWhite,
    fontSize: 12,
    fontWeight: "700",
  },
  iconButton: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    alignItems: "center",
    justifyContent: "center",
  },
});
