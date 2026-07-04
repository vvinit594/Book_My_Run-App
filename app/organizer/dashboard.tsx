import React, { useCallback, useMemo, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CreateEventCard,
  DashboardHeader,
  DashboardSearchBar,
  HelpCard,
  OrganizerMenuCard,
  OrganizerMenuId,
  OrganizerMenuItem,
} from "../../components/organizer";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

const DASHBOARD_MENU: OrganizerMenuItem[] = [
  {
    id: "ongoing",
    title: "Ongoing Events",
    subtitle: "View all currently active events",
    count: 12,
    icon: "calendar",
    iconBackground: "#E3F2FD",
    iconColor: Colors.info,
    badgeColor: Colors.info,
  },
  {
    id: "concluded",
    title: "Concluded Events",
    subtitle: "View completed events",
    count: 18,
    icon: "checkmark-done",
    iconBackground: "#E8F5E9",
    iconColor: Colors.success,
    badgeColor: Colors.success,
  },
  {
    id: "saved",
    title: "Saved Events",
    subtitle: "View bookmarked/saved events",
    count: 6,
    icon: "star",
    iconBackground: "#FFF3E0",
    iconColor: Colors.warning,
    badgeColor: Colors.warning,
  },
];

export default function OrganizerDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleCreateEvent = useCallback(() => {
    router.push("/organizer/create-event");
  }, [router]);

  const handleMenuPress = useCallback((id: OrganizerMenuId) => {
    // TODO: Navigate to event list screens
    // ongoing   -> Organizer Events List
    // concluded -> Completed Events List
    // saved     -> Saved Events List
    const labels: Record<OrganizerMenuId, string> = {
      ongoing: "Ongoing Events",
      concluded: "Concluded Events",
      saved: "Saved Events",
    };
    Alert.alert(labels[id], "Event list screen coming soon!");
  }, []);

  const handleContactPress = useCallback(() => {
    Alert.alert("Contact Support", "Support contact options coming soon!");
  }, []);

  const menuItems = useMemo(() => DASHBOARD_MENU, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <DashboardHeader onBack={handleBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <DashboardSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <CreateEventCard onPress={handleCreateEvent} />

        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <OrganizerMenuCard
              key={item.id}
              item={item}
              onPress={handleMenuPress}
            />
          ))}
        </View>

        <HelpCard onContactPress={handleContactPress} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  menuSection: {
    marginBottom: Spacing.lg,
  },
});
