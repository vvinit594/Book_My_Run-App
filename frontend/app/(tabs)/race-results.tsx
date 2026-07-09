import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors from "../../constants/colors";

// Mock data for past race results
const mockRaceResults = [
  {
    id: "1",
    eventName: "Tata Mumbai Marathon 2025",
    date: "January 19, 2025",
    location: "Mumbai",
    totalParticipants: 55000,
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400",
    categories: ["Full Marathon", "Half Marathon", "10K", "5K"],
  },
  {
    id: "2",
    eventName: "Delhi Half Marathon 2025",
    date: "November 24, 2024",
    location: "Delhi",
    totalParticipants: 35000,
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400",
    categories: ["Half Marathon", "10K"],
  },
  {
    id: "3",
    eventName: "Bengaluru Marathon 2024",
    date: "October 20, 2024",
    location: "Bengaluru",
    totalParticipants: 28000,
    image: "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=400",
    categories: ["Full Marathon", "Half Marathon", "10K"],
  },
];

export default function RaceResultsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewResults = (raceId: string) => {
    router.push(`/race-results/${raceId}`);
  };

  const filteredResults = mockRaceResults.filter(
    (race) =>
      race.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      race.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Race Results</Text>
        <Text style={styles.headerSubtitle}>
          View past race results & standings
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by race name, location, or date..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Results List */}
        {filteredResults.length > 0 ? (
          filteredResults.map((race) => (
            <TouchableOpacity key={race.id} style={styles.raceCard}>
              <Image
                source={{ uri: race.image }}
                style={styles.raceImage}
                resizeMode="cover"
              />
              <View style={styles.raceInfo}>
                <Text style={styles.raceName}>{race.eventName}</Text>
                <View style={styles.raceDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>{race.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>{race.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="people-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>
                      {race.totalParticipants.toLocaleString()} participants
                    </Text>
                  </View>
                </View>
                <View style={styles.categoriesContainer}>
                  {race.categories.slice(0, 3).map((cat, index) => (
                    <View key={index} style={styles.categoryChip}>
                      <Text style={styles.categoryText}>{cat}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity 
                  style={styles.viewResultsButton}
                  onPress={() => handleViewResults(race.id)}
                >
                  <Text style={styles.viewResultsText}>View Results</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>No Results Found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching with different keywords
            </Text>
          </View>
        )}

        {/* Search Results Tip */}
        <View style={styles.comingSoonContainer}>
          <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
          <Text style={styles.comingSoonText}>
            Tap "View Results" to see full leaderboard, filter by category, and search by BIB number or name.
          </Text>
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  raceCard: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  raceImage: {
    width: "100%",
    height: 140,
  },
  raceInfo: {
    padding: 16,
  },
  raceName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  raceDetails: {
    gap: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  viewResultsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    marginTop: 4,
  },
  viewResultsText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginRight: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  comingSoonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  comingSoonText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 20,
  },
});
