import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors from "../../constants/colors";

// Mock user data
const mockUser = {
  name: "Rahul Sharma",
  email: "rahul.sharma@email.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200",
  isOrganizer: true,
  totalRaces: 12,
  upcomingRaces: 2,
  draftEvents: 1,
};

// Mock bookings
const mockBookings = [
  {
    id: "1",
    eventName: "Tata Mumbai Marathon 2026",
    date: "Jan 18, 2026",
    category: "Half Marathon",
    status: "confirmed",
    bibNumber: "HM-4523",
  },
  {
    id: "2",
    eventName: "Mumbai Women's 10K",
    date: "Mar 18, 2026",
    category: "10K",
    status: "confirmed",
    bibNumber: "10K-1287",
  },
];

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
  showChevron?: boolean;
  danger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  danger = false,
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Ionicons
          name={icon}
          size={20}
          color={danger ? Colors.error : Colors.primary}
        />
      </View>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
        {label}
      </Text>
    </View>
    <View style={styles.menuItemRight}>
      {value && <Text style={styles.menuValue}>{value}</Text>}
      {showChevron && (
        <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
      )}
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing coming soon!");
  };

  const handleMyBookings = () => {
    Alert.alert("My Bookings", "Full bookings list coming soon!");
  };

  const handleDraftEvents = () => {
    router.push("/organizer/dashboard");
  };

  const handlePaymentMethods = () => {
    Alert.alert("Payment Methods", "Payment management coming soon!");
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => Alert.alert("Logged Out", "You have been logged out."),
        },
      ]
    );
  };

  const handleHelp = () => {
    Alert.alert("Help & Support", "Contact us at support@bookmyrun.com");
  };

  const handleAbout = () => {
    Alert.alert("About", "BookMyRun v1.0.0\n\nYour one-stop platform for running events!");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: mockUser.avatar }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{mockUser.name}</Text>
            <Text style={styles.userEmail}>{mockUser.email}</Text>
            {mockUser.isOrganizer && (
              <View style={styles.organizerBadge}>
                <Ionicons name="ribbon" size={12} color={Colors.textWhite} />
                <Text style={styles.organizerText}>Event Organizer</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mockUser.totalRaces}</Text>
            <Text style={styles.statLabel}>Total Races</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mockUser.upcomingRaces}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          {mockUser.isOrganizer && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockUser.draftEvents}</Text>
                <Text style={styles.statLabel}>Draft Events</Text>
              </View>
            </>
          )}
        </View>

        {/* Upcoming Bookings Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
            <TouchableOpacity onPress={handleMyBookings}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {mockBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingEvent}>{booking.eventName}</Text>
                <View style={styles.bibBadge}>
                  <Text style={styles.bibText}>{booking.bibNumber}</Text>
                </View>
              </View>
              <View style={styles.bookingDetails}>
                <View style={styles.bookingDetail}>
                  <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.bookingDetailText}>{booking.date}</Text>
                </View>
                <View style={styles.bookingDetail}>
                  <Ionicons name="fitness-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.bookingDetailText}>{booking.category}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Account</Text>
          <MenuItem
            icon="person-outline"
            label="Edit Profile"
            onPress={handleEditProfile}
          />
          <MenuItem
            icon="ticket-outline"
            label="My Bookings"
            value={`${mockUser.totalRaces} races`}
            onPress={handleMyBookings}
          />
          <MenuItem
            icon="card-outline"
            label="Payment Methods"
            onPress={handlePaymentMethods}
          />
        </View>

        {mockUser.isOrganizer && (
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Organizer</Text>
            <MenuItem
              icon="calendar-outline"
              label="My Events"
              onPress={handleDraftEvents}
            />
            <MenuItem
              icon="document-text-outline"
              label="Draft Events"
              value={`${mockUser.draftEvents}`}
              onPress={handleDraftEvents}
            />
          </View>
        )}

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Support</Text>
          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={handleHelp}
          />
          <MenuItem
            icon="information-circle-outline"
            label="About"
            onPress={handleAbout}
          />
          <MenuItem
            icon="log-out-outline"
            label="Logout"
            onPress={handleLogout}
            showChevron={false}
            danger
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.backgroundDark,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  organizerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
    alignSelf: "flex-start",
    gap: 4,
  },
  organizerText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textWhite,
  },
  editButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
  },
  bookingCard: {
    backgroundColor: Colors.cardBackground,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  bookingEvent: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginRight: 10,
  },
  bibBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bibText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  bookingDetails: {
    flexDirection: "row",
    gap: 16,
  },
  bookingDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bookingDetailText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  menuSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cardBackground,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconDanger: {
    backgroundColor: "#FEE7E7",
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  menuLabelDanger: {
    color: Colors.error,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  menuValue: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bottomSpacing: {
    height: 30,
  },
});
