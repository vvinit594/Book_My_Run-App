import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "../../constants/colors";
import {
  mockCities,
  mockAnnouncement,
  mockFeaturedBanners,
  mockEvents,
} from "../../constants/mockData";
import {
  TopAppBar,
  AnnouncementBanner,
  FeaturedCarousel,
  CityChips,
  EventCard,
  SectionHeader,
  LoadMoreButton,
} from "../../components/home";
import { City } from "../../types";

export default function HomeScreen() {
  const router = useRouter();
  
  // State
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter events by selected city (or show all if "All Cities")
  const filteredEvents = mockEvents.filter(
    (event) =>
      selectedCity === "All Cities" || event.location.city === selectedCity
  );

  // Handlers
  const handleCityPress = () => {
    Alert.alert("City Selector", "City selection bottom sheet coming soon!");
  };

  const handleSearchPress = () => {
    Alert.alert("Search", "Search screen coming soon!");
  };

  const handleProfilePress = () => {
    router.push("/(tabs)/profile");
  };

  const handleBannerPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city.name);
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleBookPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleFilterPress = () => {
    Alert.alert("Filters", "Filter bottom sheet coming soon!");
  };

  const handleListEventPress = () => {
    router.push("/organizer/dashboard");
  };

  const handleNotificationsPress = () => {
    Alert.alert("Notifications", "Notifications screen coming soon!");
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    // Simulate API call
    setTimeout(() => {
      setLoadingMore(false);
      Alert.alert("Load More", "More events would load here from API");
    }, 1000);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      {/* Top App Bar */}
      <TopAppBar
        city={selectedCity}
        onCityPress={handleCityPress}
        onSearchPress={handleSearchPress}
        onProfilePress={handleProfilePress}
        onListEventPress={handleListEventPress}
        onNotificationsPress={handleNotificationsPress}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Announcement Banner */}
        {showAnnouncement && (
          <AnnouncementBanner
            announcement={mockAnnouncement}
            onPress={() => handleBannerPress(mockAnnouncement.link || "")}
            onDismiss={() => setShowAnnouncement(false)}
          />
        )}

        {/* Featured Events Carousel */}
        <FeaturedCarousel
          banners={mockFeaturedBanners}
          onBannerPress={handleBannerPress}
        />

        {/* City Quick Chips */}
        <CityChips
          cities={mockCities}
          selectedCity={selectedCity}
          onCitySelect={handleCitySelect}
        />

        {/* Popular Events Section */}
        <SectionHeader
          title="Popular Events Near You"
          icon="🔥"
          showFilter={true}
          onFilterPress={handleFilterPress}
        />

        {/* Event Cards */}
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={handleEventPress}
              onBookPress={handleBookPress}
            />
          ))
        ) : (
          <View style={styles.noEvents}>
            <SectionHeader
              title="No events found in this city"
              icon="😔"
            />
          </View>
        )}

        {/* Load More Button */}
        {filteredEvents.length > 0 && (
          <LoadMoreButton onPress={handleLoadMore} loading={loadingMore} />
        )}

        {/* Bottom Spacing for Tab Bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  noEvents: {
    paddingVertical: 40,
  },
  bottomSpacing: {
    height: 20,
  },
});
