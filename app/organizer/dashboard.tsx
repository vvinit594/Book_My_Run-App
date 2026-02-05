import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

export default function OrganizerDashboard() {
  const router = useRouter();

  const handleCreateEvent = () => {
    router.push("/organizer/create-event");
  };

  const handleMyEvents = () => {
    // TODO: Navigate to my events
  };

  const handleDraftEvents = () => {
    // TODO: Navigate to draft events
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Organizer Dashboard</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationCircle}>
              <Ionicons name="calendar" size={40} color={Colors.primary} />
              <View style={styles.runnerIcon}>
                <Ionicons name="walk" size={24} color={Colors.textWhite} />
              </View>
            </View>
          </View>
          
          <Text style={styles.heroTitle}>Create Your Event</Text>
          <Text style={styles.heroSubtitle}>
            Host amazing running events and reach thousands of participants
          </Text>
        </View>

        {/* Primary CTA */}
        <TouchableOpacity 
          style={styles.createEventButton}
          onPress={handleCreateEvent}
          activeOpacity={0.8}
        >
          <View style={styles.createEventContent}>
            <View style={styles.createEventIcon}>
              <Ionicons name="add-circle" size={28} color={Colors.textWhite} />
            </View>
            <View style={styles.createEventText}>
              <Text style={styles.createEventTitle}>Create New Event</Text>
              <Text style={styles.createEventSubtitle}>
                Start building your next running event
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.textWhite} />
        </TouchableOpacity>

        {/* Secondary Options */}
        <View style={styles.secondarySection}>
          <Text style={styles.sectionTitle}>Your Events</Text>
          
          <TouchableOpacity 
            style={styles.secondaryCard}
            onPress={handleMyEvents}
            activeOpacity={0.7}
          >
            <View style={styles.secondaryCardLeft}>
              <View style={[styles.secondaryIcon, { backgroundColor: "#E3F2FD" }]}>
                <Ionicons name="list" size={22} color={Colors.info} />
              </View>
              <View>
                <Text style={styles.secondaryCardTitle}>My Events</Text>
                <Text style={styles.secondaryCardSubtitle}>View all published events</Text>
              </View>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryCard}
            onPress={handleDraftEvents}
            activeOpacity={0.7}
          >
            <View style={styles.secondaryCardLeft}>
              <View style={[styles.secondaryIcon, { backgroundColor: "#FFF3E0" }]}>
                <Ionicons name="document-text" size={22} color={Colors.warning} />
              </View>
              <View>
                <Text style={styles.secondaryCardTitle}>Draft Events</Text>
                <Text style={styles.secondaryCardSubtitle}>Continue editing drafts</Text>
              </View>
            </View>
            <View style={[styles.badge, { backgroundColor: Colors.warning }]}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="people" size={24} color={Colors.primary} />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Total Participants</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="calendar-outline" size={24} color={Colors.success} />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Events Hosted</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="cash-outline" size={24} color={Colors.info} />
              <Text style={styles.statValue}>₹0</Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </View>
          </View>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <View style={styles.helpCard}>
            <Ionicons name="help-circle" size={24} color={Colors.primary} />
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>Need Help?</Text>
              <Text style={styles.helpText}>
                Contact our support team for assistance with event creation
              </Text>
            </View>
            <TouchableOpacity style={styles.helpButton}>
              <Text style={styles.helpButtonText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  illustrationContainer: {
    marginBottom: Spacing.lg,
  },
  illustrationCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFE8EC",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  runnerIcon: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },
  createEventButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createEventContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  createEventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  createEventText: {
    flex: 1,
  },
  createEventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  createEventSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  secondarySection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  secondaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryCardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  secondaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  secondaryCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  secondaryCardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.info,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  statsSection: {
    marginBottom: Spacing.xl,
  },
  statsGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 2,
  },
  helpSection: {
    marginBottom: Spacing.md,
  },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  helpContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  helpText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  helpButton: {
    backgroundColor: "#FFE8EC",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  helpButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
  },
});
