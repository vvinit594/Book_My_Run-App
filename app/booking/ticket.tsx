import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import {
  TicketHeroSection,
  TicketIdentitySection,
  QRCodeSection,
  RaceEssentials,
  BibExpoCollapsible,
  OrganizerCard,
  TicketActionBar,
} from "../../components/ticket";

export default function TicketScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract params (in real app, fetch from backend)
  const eventTitle = (params.eventTitle as string) || "Mumbai Women's 10K";
  const eventDate = (params.eventDate as string) || "Sep 23, 2026";
  const eventVenue = (params.eventVenue as string) || "BKC, Mumbai";
  const ticketTitle = (params.ticketTitle as string) || "10 KM Run";
  const ticketCategory = (params.ticketCategory as string) || "10K";
  const participantName = (params.participantName as string) || "Priya Sharma";
  const ticketId = (params.ticketId as string) || "BMR-2026-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const tShirtSize = (params.tShirtSize as string) || "M";
  const bloodGroup = (params.bloodGroup as string) || "O+";

  // Mock data for the ticket
  const ticketData = {
    eventName: eventTitle,
    eventTagline: "The Ultimate Running Experience",
    eventDate: eventDate,
    eventTime: "4:30 AM",
    location: eventVenue,
    bannerImage: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
    ticketType: ticketTitle,
    category: `${ticketCategory} – Women's Run`,
    participantName: participantName,
    ticketId: ticketId,
    bookingStatus: "Confirmed" as const,
    reportingTime: "5:00 AM",
    flagOffTime: "6:00 AM",
    bloodGroup: bloodGroup,
    jerseySize: tShirtSize,
    bibExpoInfo: [
      {
        date: "Sep 21",
        dayName: "Friday",
        time: "12:00 PM - 7:00 PM",
        venue: "Jio Garden",
        address: "G Block, BKC, Mumbai",
      },
      {
        date: "Sep 22",
        dayName: "Saturday",
        time: "10:00 AM - 8:00 PM",
        venue: "Jio Garden",
        address: "G Block, BKC, Mumbai",
      },
    ],
    organizerName: "Procam International",
    organizerLogo: undefined,
  };

  // Action handlers
  const handleDownload = () => {
    Alert.alert(
      "Download Ticket",
      "Your ticket PDF will be downloaded shortly.",
      [{ text: "OK" }]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎉 I'm participating in ${ticketData.eventName}!\n\n📅 ${ticketData.eventDate}\n📍 ${ticketData.location}\n🎫 Ticket ID: ${ticketData.ticketId}\n\nJoin me! Book your tickets on BookMyRun.`,
        title: `My ${ticketData.eventName} Ticket`,
      });
    } catch (error) {
      Alert.alert("Error", "Could not share ticket");
    }
  };

  const handleAddToCalendar = () => {
    Alert.alert(
      "Add to Calendar",
      "Event has been added to your calendar.",
      [{ text: "OK" }]
    );
  };

  const handleContactOrganizer = () => {
    Alert.alert(
      "Contact Organizer",
      `For any queries, please contact:\n\nEmail: support@procam.in\nPhone: +91 22 6666 7777`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Email", onPress: () => {} },
        { text: "Call", onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1️⃣ Hero Section */}
        <TicketHeroSection
          eventName={ticketData.eventName}
          eventTagline={ticketData.eventTagline}
          eventDate={ticketData.eventDate}
          eventTime={ticketData.eventTime}
          location={ticketData.location}
          bannerImage={ticketData.bannerImage}
        />

        {/* 2️⃣ Ticket Identity Section */}
        <TicketIdentitySection
          ticketType={ticketData.ticketType}
          category={ticketData.category}
          participantName={ticketData.participantName}
          ticketId={ticketData.ticketId}
          bookingStatus={ticketData.bookingStatus}
        />

        {/* 3️⃣ QR Code Section */}
        <QRCodeSection
          ticketId={ticketData.ticketId}
          participantName={ticketData.participantName}
        />

        {/* 4️⃣ Race Essentials */}
        <RaceEssentials
          reportingTime={ticketData.reportingTime}
          flagOffTime={ticketData.flagOffTime}
          bloodGroup={ticketData.bloodGroup}
          jerseySize={ticketData.jerseySize}
        />

        {/* 5️⃣ Bib Expo Information */}
        <BibExpoCollapsible bibExpoInfo={ticketData.bibExpoInfo} />

        {/* 6️⃣ Organizer Section */}
        <OrganizerCard
          organizerName={ticketData.organizerName}
          organizerLogo={ticketData.organizerLogo}
          isVerified={true}
          onContactPress={handleContactOrganizer}
        />

        {/* Bottom spacing for action bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 7️⃣ Bottom Action Bar */}
      <View style={styles.actionBarContainer}>
        <TicketActionBar
          onDownload={handleDownload}
          onShare={handleShare}
          onAddToCalendar={handleAddToCalendar}
        />
      </View>
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
    paddingBottom: Spacing.lg,
  },
  actionBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
