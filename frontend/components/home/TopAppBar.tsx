import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

const NAVBAR_HEIGHT = 56;
const MIN_TOUCH_TARGET = 44;

interface TopAppBarProps {
  onListEventPress: () => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  isLoggedIn?: boolean;
}

export default function TopAppBar({
  onListEventPress,
  onNotificationsPress,
  onProfilePress,
  isLoggedIn = false,
}: TopAppBarProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.container}>
        <View style={styles.leftSection}>
          <Image
            source={require("../../assets/Bookmyrun_logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.listEventButton}
            onPress={onListEventPress}
            activeOpacity={0.8}
          >
            <Text style={styles.listEventText}>List Your Event</Text>
          </TouchableOpacity>

          <Pressable
            style={styles.iconButton}
            onPress={onNotificationsPress}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={Colors.textPrimary}
            />
          </Pressable>

          <Pressable
            style={styles.iconButton}
            onPress={onProfilePress}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Ionicons
              name={isLoggedIn ? "person-circle" : "person-circle-outline"}
              size={24}
              color={isLoggedIn ? Colors.primary : Colors.textPrimary}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background,
  },
  container: {
    height: NAVBAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  logoImage: {
    width: 130,
    height: 36,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
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
