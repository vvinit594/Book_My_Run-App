import React from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { getEventDetails } from "../../constants/mockEventDetails";
import {
  EventDetailsHeader,
  EventBanner,
  EventInfoCard,
  StickyBookingBar,
  AboutEvent,
  BibExpoInfo,
  EventGallery,
  RouteMap,
  EventFAQs,
  OrganizerInfo,
} from "../../components/eventDetails";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  // Get event details from mock data
  const event = getEventDetails(id || "1");

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <EventDetailsHeader title="Event Not Found" />
        <View style={styles.notFound}>
          {/* Could add a "Event not found" UI here */}
        </View>
      </SafeAreaView>
    );
  }

  // Handlers
  const handleSharePress = () => {
    Alert.alert("Share", "Share functionality coming soon!");
  };

  const handleLocationPress = () => {
    Alert.alert("Location", "Open in Maps coming soon!");
  };

  const handleBookPress = () => {
    // Format date for display
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    router.push({
      pathname: "/booking/select-ticket",
      params: {
        eventId: event.id,
        eventTitle: event.title,
        eventDate: formattedDate,
        eventVenue: `${event.location.venue}, ${event.location.city}`,
      },
    });
  };

  const handleGalleryImagePress = (index: number) => {
    Alert.alert("Gallery", `Full screen view for image ${index + 1}`);
  };

  const handleMapPress = (map: any) => {
    Alert.alert("Route Map", `Full screen map for ${map.category}`);
  };

  const handleFollowPress = () => {
    Alert.alert("Follow", `Following ${event.organizerDetails.name}`);
  };

  const handleContactPress = () => {
    Alert.alert(
      "Contact Organizer",
      `Email: ${event.organizerDetails.contactEmail}\nPhone: ${event.organizerDetails.contactPhone || "N/A"}`
    );
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <EventDetailsHeader title={event.title} onSharePress={handleSharePress} />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Event Banner */}
        <EventBanner
          image={event.bannerImage}
          date={event.date}
          rating={event.rating}
          totalRatings={event.totalRatings}
        />

        {/* Event Info Card */}
        <EventInfoCard event={event} onLocationPress={handleLocationPress} />

        {/* About the Event */}
        <AboutEvent content={event.aboutEvent} maxLines={5} />

        {/* Bib Expo Information */}
        {event.bibExpo && event.bibExpo.length > 0 && (
          <BibExpoInfo bibExpo={event.bibExpo} />
        )}

        {/* Event Gallery */}
        {event.gallery && event.gallery.length > 0 && (
          <EventGallery
            images={event.gallery}
            onImagePress={handleGalleryImagePress}
          />
        )}

        {/* Route Map */}
        {event.routeMaps && event.routeMaps.length > 0 && (
          <RouteMap routeMaps={event.routeMaps} onMapPress={handleMapPress} />
        )}

        {/* FAQs */}
        {event.faqs && event.faqs.length > 0 && (
          <EventFAQs faqs={event.faqs} />
        )}

        {/* Organizer Info */}
        <OrganizerInfo
          organizer={event.organizerDetails}
          onFollowPress={handleFollowPress}
          onContactPress={handleContactPress}
        />

        {/* Bottom padding for sticky bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Sticky Booking Bar */}
      <StickyBookingBar
        price={event.price.startingFrom}
        currency={event.price.currency}
        onBookPress={handleBookPress}
      />
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
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomPadding: {
    height: 100, // Space for sticky booking bar
  },
});
