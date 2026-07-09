import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  LogoutButton,
  ProfileHeader,
  ProfileMenuItem,
  ProfileSection,
} from "../../components/profile";
import {
  ATTENDING_EVENTS_MENU,
  ORGANIZING_EVENTS_MENU,
} from "../../constants/profile";
import Colors from "../../constants/colors";
import { FontSize, Spacing } from "../../constants/spacing";
import { useAuth } from "../../store/authStore";
import { getUserProfile, UserProfile } from "../../services/profileService";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(tabs)");
      return;
    }

    void getUserProfile(user).then(setProfile);
  }, [isAuthenticated, user, router]);

  const handleLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          setLoggingOut(true);
          void logout().then(() => {
            setLoggingOut(false);
            router.replace("/(tabs)");
          });
        },
      },
    ]);
  }, [logout, router]);

  const displayName = profile?.name ?? user?.name ?? "BookMyRun User";
  const displayEmail = profile?.email ?? user?.email ?? "";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          name={displayName}
          email={displayEmail}
          avatarUri={profile?.avatar ?? user?.avatar}
          isOrganizer={profile?.isOrganizer ?? true}
        />

        <ProfileSection title="Organizing Events">
          {ORGANIZING_EVENTS_MENU.map((item, index) => (
            <ProfileMenuItem
              key={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
              route={item.route}
              isLast={index === ORGANIZING_EVENTS_MENU.length - 1}
            />
          ))}
        </ProfileSection>

        <ProfileSection title="Attending Events">
          {ATTENDING_EVENTS_MENU.map((item, index) => (
            <ProfileMenuItem
              key={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
              route={item.route}
              isLast={index === ATTENDING_EVENTS_MENU.length - 1}
            />
          ))}
        </ProfileSection>

        <LogoutButton onPress={handleLogout} loading={loggingOut} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundDark,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  headerSpacer: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
});
