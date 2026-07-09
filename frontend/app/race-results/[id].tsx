import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import Colors from "../../constants/colors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Types
interface Participant {
  rank: number;
  bibNumber: string;
  name: string;
  time: string;
  pace: string;
  category: string;
  ageGroup: string;
  gender: "M" | "F";
  city: string;
}

interface RaceEvent {
  id: string;
  name: string;
  year: number;
  date: string;
  categories: string[];
}

interface FilterState {
  year: string;
  event: string;
  category: string;
  gender: string;
  ageGroup: string;
  city: string;
  sortBy: string;
}

// Mock Data
const mockYears = [2026, 2025, 2024, 2023];

const mockEvents: RaceEvent[] = [
  { id: "1", name: "Tata Mumbai Marathon", year: 2025, date: "Jan 19, 2025", categories: ["Full Marathon", "Half Marathon", "10K", "5K"] },
  { id: "2", name: "Delhi Half Marathon", year: 2024, date: "Nov 24, 2024", categories: ["Half Marathon", "10K"] },
  { id: "3", name: "Bengaluru Marathon", year: 2024, date: "Oct 20, 2024", categories: ["Full Marathon", "Half Marathon", "10K"] },
  { id: "4", name: "Mumbai Women's 10K", year: 2025, date: "Mar 18, 2025", categories: ["10K", "5K"] },
  { id: "5", name: "Thakur Village Practice Run", year: 2025, date: "Feb 10, 2025", categories: ["5K", "10K"] },
  { id: "6", name: "Tata Mumbai Marathon", year: 2026, date: "Jan 18, 2026", categories: ["Full Marathon", "Half Marathon", "10K", "5K"] },
];

const categoryOptions = ["All", "5K", "10K", "Half Marathon", "Full Marathon"];
const genderOptions = ["All", "Male", "Female"];
const ageGroupOptions = ["All", "18-29", "30-39", "40-49", "50-59", "60+"];
const cityOptions = ["All", "Mumbai", "Delhi", "Bengaluru", "Pune", "Chennai", "Hyderabad", "Kolkata", "Ahmedabad"];
const sortOptions = ["Rank", "Finish Time", "Pace", "Name"];

// Generate mock participants
const generateMockParticipants = (): Participant[] => {
  const firstNames = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Karan", "Neha", "Arjun", "Pooja", "Rohan", "Divya", "Arun", "Meera", "Sanjay", "Kavita", "Nikhil", "Shreya", "Deepak", "Ananya"];
  const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Joshi", "Mehta", "Verma", "Gupta", "Rao", "Reddy", "Iyer", "Nair", "Das", "Banerjee", "Chatterjee"];
  const cities = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Chennai", "Hyderabad", "Kolkata", "Ahmedabad"];
  const categories = ["Full Marathon", "Half Marathon", "10K", "5K"];
  const ageGroups = ["18-29", "30-39", "40-49", "50-59", "60+"];

  const participants: Participant[] = [];

  for (let i = 1; i <= 100; i++) {
    const gender = Math.random() > 0.4 ? "M" : "F";
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    let baseMinutes: number;
    switch (category) {
      case "Full Marathon": baseMinutes = 180 + Math.random() * 180; break;
      case "Half Marathon": baseMinutes = 80 + Math.random() * 100; break;
      case "10K": baseMinutes = 35 + Math.random() * 50; break;
      case "5K": baseMinutes = 18 + Math.random() * 25; break;
      default: baseMinutes = 60;
    }

    const hours = Math.floor(baseMinutes / 60);
    const mins = Math.floor(baseMinutes % 60);
    const secs = Math.floor(Math.random() * 60);
    const time = hours > 0 
      ? `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins}:${secs.toString().padStart(2, "0")}`;

    const distanceKm = category === "Full Marathon" ? 42.195 : category === "Half Marathon" ? 21.0975 : category === "10K" ? 10 : 5;
    const paceMinutes = baseMinutes / distanceKm;
    const paceMin = Math.floor(paceMinutes);
    const paceSec = Math.floor((paceMinutes - paceMin) * 60);
    const pace = `${paceMin}:${paceSec.toString().padStart(2, "0")} /km`;

    participants.push({
      rank: i,
      bibNumber: `${category.charAt(0)}${category.includes("Half") ? "H" : ""}${10000 + i}`,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      time,
      pace,
      category,
      ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
      gender,
      city: cities[Math.floor(Math.random() * cities.length)],
    });
  }

  return participants.sort((a, b) => {
    const timeA = a.time.split(":").reduce((acc, t, i, arr) => acc + parseInt(t) * Math.pow(60, arr.length - 1 - i), 0);
    const timeB = b.time.split(":").reduce((acc, t, i, arr) => acc + parseInt(t) * Math.pow(60, arr.length - 1 - i), 0);
    return timeA - timeB;
  }).map((p, index) => ({ ...p, rank: index + 1 }));
};

const allParticipants = generateMockParticipants();

// Chip Select Component
interface ChipSelectProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

const ChipSelect: React.FC<ChipSelectProps> = ({ options, selected, onSelect }) => (
  <View style={styles.chipSelectContainer}>
    {options.map((option) => (
      <TouchableOpacity
        key={option}
        style={[styles.filterChip, selected === option && styles.filterChipActive]}
        onPress={() => onSelect(option)}
      >
        <Text style={[styles.filterChipText, selected === option && styles.filterChipTextActive]}>
          {option}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// Rank Badge Component
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) {
    return (
      <View style={[styles.rankBadge, styles.rankGold]}>
        <Ionicons name="trophy" size={14} color="#FFD700" />
        <Text style={[styles.rankText, styles.rankTextGold]}>1st</Text>
      </View>
    );
  }
  if (rank === 2) {
    return (
      <View style={[styles.rankBadge, styles.rankSilver]}>
        <Ionicons name="medal" size={14} color="#C0C0C0" />
        <Text style={[styles.rankText, styles.rankTextSilver]}>2nd</Text>
      </View>
    );
  }
  if (rank === 3) {
    return (
      <View style={[styles.rankBadge, styles.rankBronze]}>
        <Ionicons name="medal" size={14} color="#CD7F32" />
        <Text style={[styles.rankText, styles.rankTextBronze]}>3rd</Text>
      </View>
    );
  }
  return (
    <View style={styles.rankBadge}>
      <Text style={styles.rankText}>#{rank}</Text>
    </View>
  );
};

// Participant Card Component
interface ParticipantCardProps {
  participant: Participant;
  displayRank: number;
  onPress?: () => void;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant, displayRank, onPress }) => {
  const isTopThree = displayRank <= 3;

  return (
    <TouchableOpacity 
      style={[styles.participantCard, isTopThree && styles.participantCardHighlight]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <RankBadge rank={displayRank} />
      <View style={styles.participantInfo}>
        <View style={styles.participantHeader}>
          <Text style={styles.participantName}>{participant.name}</Text>
          <View style={styles.bibBadge}>
            <Text style={styles.bibText}>{participant.bibNumber}</Text>
          </View>
        </View>
        <View style={styles.participantDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{participant.time}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.detailText}>{participant.pace}</Text>
          </View>
        </View>
        <View style={styles.participantMeta}>
          <Text style={styles.metaText}>{participant.category}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{participant.gender === "M" ? "Male" : "Female"}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{participant.ageGroup}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{participant.city}</Text>
        </View>
        <View style={styles.viewDetailsRow}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Active Filter Chip Component
interface ActiveFilterChipProps {
  label: string;
  onRemove: () => void;
}

const ActiveFilterChip: React.FC<ActiveFilterChipProps> = ({ label, onRemove }) => (
  <View style={styles.activeFilterChip}>
    <Text style={styles.activeFilterChipText}>{label}</Text>
    <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Ionicons name="close-circle" size={16} color={Colors.primary} />
    </TouchableOpacity>
  </View>
);

export default function RaceResultsDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId?: string }>();

  // Main filter state (applied)
  const [filters, setFilters] = useState<FilterState>({
    year: "2025",
    event: "Tata Mumbai Marathon",
    category: "All",
    gender: "All",
    ageGroup: "All",
    city: "All",
    sortBy: "Rank",
  });

  // Temporary filter state (in modal before apply)
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");

  // Count active filters (excluding year, event, and sortBy)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== "All") count++;
    if (filters.gender !== "All") count++;
    if (filters.ageGroup !== "All") count++;
    if (filters.city !== "All") count++;
    return count;
  }, [filters]);

  // Get active filter labels for display
  const activeFilterLabels = useMemo(() => {
    const labels: { key: keyof FilterState; label: string }[] = [];
    if (filters.category !== "All") labels.push({ key: "category", label: filters.category });
    if (filters.gender !== "All") labels.push({ key: "gender", label: filters.gender });
    if (filters.ageGroup !== "All") labels.push({ key: "ageGroup", label: `Age: ${filters.ageGroup}` });
    if (filters.city !== "All") labels.push({ key: "city", label: filters.city });
    return labels;
  }, [filters]);

  // Get available events for selected year
  const availableEvents = useMemo(() => {
    return mockEvents.filter((e) => e.year === parseInt(tempFilters.year));
  }, [tempFilters.year]);

  // Filtered cities for search
  const filteredCities = useMemo(() => {
    if (!citySearchQuery.trim()) return cityOptions;
    return cityOptions.filter((c) => 
      c.toLowerCase().includes(citySearchQuery.toLowerCase())
    );
  }, [citySearchQuery]);

  // Filter and sort participants
  const filteredParticipants = useMemo(() => {
    let results = [...allParticipants];

    // Filter by category
    if (filters.category !== "All") {
      results = results.filter((p) => p.category === filters.category);
    }

    // Filter by gender
    if (filters.gender !== "All") {
      const genderCode = filters.gender === "Male" ? "M" : "F";
      results = results.filter((p) => p.gender === genderCode);
    }

    // Filter by age group
    if (filters.ageGroup !== "All") {
      results = results.filter((p) => p.ageGroup === filters.ageGroup);
    }

    // Filter by city
    if (filters.city !== "All") {
      results = results.filter((p) => p.city === filters.city);
    }

    // Filter by search query (BIB or Name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.bibNumber.toLowerCase().includes(query) ||
          p.name.toLowerCase().includes(query)
      );
    }

    // Sort results
    if (filters.sortBy === "Finish Time") {
      results.sort((a, b) => {
        const timeA = a.time.split(":").reduce((acc, t, i, arr) => acc + parseInt(t) * Math.pow(60, arr.length - 1 - i), 0);
        const timeB = b.time.split(":").reduce((acc, t, i, arr) => acc + parseInt(t) * Math.pow(60, arr.length - 1 - i), 0);
        return timeA - timeB;
      });
    } else if (filters.sortBy === "Pace") {
      results.sort((a, b) => {
        const paceA = parseFloat(a.pace.replace(" /km", "").replace(":", "."));
        const paceB = parseFloat(b.pace.replace(" /km", "").replace(":", "."));
        return paceA - paceB;
      });
    } else if (filters.sortBy === "Name") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    return results;
  }, [filters, searchQuery]);

  // Handle year change in temp filters
  const handleTempYearChange = (year: string) => {
    setTempFilters((prev) => {
      const eventsInYear = mockEvents.filter((e) => e.year === parseInt(year));
      return {
        ...prev,
        year,
        event: eventsInYear.length > 0 ? eventsInYear[0].name : prev.event,
      };
    });
  };

  // Apply filters
  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilterModal(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      ...tempFilters,
      category: "All",
      gender: "All",
      ageGroup: "All",
      city: "All",
      sortBy: "Rank",
    };
    setTempFilters(clearedFilters);
  };

  // Remove individual filter
  const handleRemoveFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: "All" }));
  };

  // Clear all active filters
  const handleClearAllFilters = () => {
    setFilters((prev) => ({
      ...prev,
      category: "All",
      gender: "All",
      ageGroup: "All",
      city: "All",
    }));
    setSearchQuery("");
  };

  // Open filter modal
  const openFilterModal = () => {
    setTempFilters(filters);
    setCitySearchQuery("");
    setShowFilterModal(true);
  };

  const currentEvent = mockEvents.find(
    (e) => e.name === filters.event && e.year === parseInt(filters.year)
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {filters.event}
          </Text>
          <Text style={styles.headerSubtitle}>
            {currentEvent?.date || "Results"} • {filters.year}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={openFilterModal}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={20} color={Colors.textWhite} />
          <Text style={styles.filterButtonText}>Filters</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by BIB number or participant name..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Active Filter Chips */}
      {(activeFilterLabels.length > 0 || searchQuery) && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeFiltersContent}
          >
            {activeFilterLabels.map((filter) => (
              <ActiveFilterChip
                key={filter.key}
                label={filter.label}
                onRemove={() => handleRemoveFilter(filter.key)}
              />
            ))}
            {searchQuery && (
              <ActiveFilterChip
                label={`"${searchQuery}"`}
                onRemove={() => setSearchQuery("")}
              />
            )}
          </ScrollView>
          <TouchableOpacity 
            style={styles.clearAllButton}
            onPress={handleClearAllFilters}
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results Count & Sort Info */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredParticipants.length} {filteredParticipants.length === 1 ? "Result" : "Results"}
        </Text>
        <View style={styles.sortInfo}>
          <Ionicons name="swap-vertical" size={14} color={Colors.textSecondary} />
          <Text style={styles.sortInfoText}>Sorted by {filters.sortBy}</Text>
        </View>
      </View>

      {/* Results List */}
      <FlatList
        data={filteredParticipants}
        keyExtractor={(item, index) => `${item.bibNumber}-${index}`}
        renderItem={({ item, index }) => (
          <ParticipantCard 
            participant={item} 
            displayRank={index + 1}
            onPress={() => router.push({
              pathname: '/race-results/runner/[runnerId]',
              params: {
                runnerId: item.bibNumber,
                runnerData: JSON.stringify(item),
                eventName: filters.event,
                eventDate: currentEvent?.date || '',
                eventYear: filters.year,
              }
            })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>No Results Found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your filters or search query
            </Text>
          </View>
        }
      />

      {/* Filter Bottom Sheet Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowFilterModal(false)}
          />
          <View style={styles.filterModal}>
            {/* Modal Header */}
            <View style={styles.filterModalHeader}>
              <View style={styles.modalHandle} />
              <View style={styles.filterModalTitleRow}>
                <Text style={styles.filterModalTitle}>Filters</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <Ionicons name="close" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Filter Content */}
            <ScrollView 
              style={styles.filterModalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Year & Event Selection */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.primary} /> Race Selection
                </Text>
                <View style={styles.filterRow}>
                  <View style={styles.filterRowHalf}>
                    <Text style={styles.filterLabel}>Year</Text>
                    <View style={styles.selectButtonsRow}>
                      {mockYears.slice(0, 4).map((year) => (
                        <TouchableOpacity
                          key={year}
                          style={[
                            styles.selectButton,
                            tempFilters.year === String(year) && styles.selectButtonActive,
                          ]}
                          onPress={() => handleTempYearChange(String(year))}
                        >
                          <Text
                            style={[
                              styles.selectButtonText,
                              tempFilters.year === String(year) && styles.selectButtonTextActive,
                            ]}
                          >
                            {year}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>Event</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.chipSelectContainer}>
                      {availableEvents.map((event) => (
                        <TouchableOpacity
                          key={event.id}
                          style={[
                            styles.filterChip,
                            styles.filterChipLarge,
                            tempFilters.event === event.name && styles.filterChipActive,
                          ]}
                          onPress={() => setTempFilters((prev) => ({ ...prev, event: event.name }))}
                        >
                          <Text
                            style={[
                              styles.filterChipText,
                              tempFilters.event === event.name && styles.filterChipTextActive,
                            ]}
                            numberOfLines={1}
                          >
                            {event.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>

              {/* Race Category */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  <Ionicons name="flag-outline" size={16} color={Colors.primary} /> Race Category
                </Text>
                <ChipSelect
                  options={categoryOptions}
                  selected={tempFilters.category}
                  onSelect={(value) => setTempFilters((prev) => ({ ...prev, category: value }))}
                />
              </View>

              {/* Gender */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  <Ionicons name="people-outline" size={16} color={Colors.primary} /> Gender
                </Text>
                <ChipSelect
                  options={genderOptions}
                  selected={tempFilters.gender}
                  onSelect={(value) => setTempFilters((prev) => ({ ...prev, gender: value }))}
                />
              </View>

              {/* Age Group */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  <Ionicons name="fitness-outline" size={16} color={Colors.primary} /> Age Group
                </Text>
                <ChipSelect
                  options={ageGroupOptions}
                  selected={tempFilters.ageGroup}
                  onSelect={(value) => setTempFilters((prev) => ({ ...prev, ageGroup: value }))}
                />
              </View>

              {/* City */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  <Ionicons name="location-outline" size={16} color={Colors.primary} /> City
                </Text>
                <View style={styles.citySearchContainer}>
                  <Ionicons name="search" size={16} color={Colors.textLight} />
                  <TextInput
                    style={styles.citySearchInput}
                    placeholder="Search city..."
                    placeholderTextColor={Colors.textLight}
                    value={citySearchQuery}
                    onChangeText={setCitySearchQuery}
                  />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipSelectContainer}>
                    {filteredCities.map((city) => (
                      <TouchableOpacity
                        key={city}
                        style={[
                          styles.filterChip,
                          tempFilters.city === city && styles.filterChipActive,
                        ]}
                        onPress={() => setTempFilters((prev) => ({ ...prev, city }))}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            tempFilters.city === city && styles.filterChipTextActive,
                          ]}
                        >
                          {city}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Sort By */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  <Ionicons name="swap-vertical-outline" size={16} color={Colors.primary} /> Sort By
                </Text>
                <ChipSelect
                  options={sortOptions}
                  selected={tempFilters.sortBy}
                  onSelect={(value) => setTempFilters((prev) => ({ ...prev, sortBy: value }))}
                />
              </View>

              <View style={styles.filterBottomSpacing} />
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.filterModalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearFilters}
              >
                <Ionicons name="refresh-outline" size={18} color={Colors.textSecondary} />
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundDark,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textWhite,
  },
  filterBadge: {
    backgroundColor: Colors.textWhite,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primary,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 8,
    paddingVertical: 0,
  },
  activeFiltersContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activeFiltersContent: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 8,
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 6,
  },
  activeFilterChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.primary,
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.error,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  sortInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortInfoText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  participantCard: {
    flexDirection: "row",
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  participantCardHighlight: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankGold: {
    backgroundColor: "#FFF8E1",
  },
  rankSilver: {
    backgroundColor: "#F5F5F5",
  },
  rankBronze: {
    backgroundColor: "#FBE9E7",
  },
  rankText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  rankTextGold: {
    color: "#F9A825",
  },
  rankTextSilver: {
    color: "#757575",
  },
  rankTextBronze: {
    color: "#8D6E63",
  },
  participantInfo: {
    flex: 1,
  },
  participantHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  participantName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    flex: 1,
  },
  bibBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  bibText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  participantDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 6,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  participantMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  metaDot: {
    fontSize: 12,
    color: Colors.textLight,
    marginHorizontal: 6,
  },
  viewDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
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
    textAlign: "center",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
  },
  filterModal: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  filterModalHeader: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 12,
  },
  filterModalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  filterModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  filterModalContent: {
    paddingHorizontal: 20,
  },
  filterSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterRowHalf: {
    flex: 1,
  },
  selectButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  selectButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  selectButtonTextActive: {
    color: Colors.textWhite,
  },
  chipSelectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipLarge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.textWhite,
  },
  citySearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
  },
  citySearchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  filterBottomSpacing: {
    height: 20,
  },
  filterModalFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
    gap: 12,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.backgroundSecondary,
    gap: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  applyButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textWhite,
  },
});
