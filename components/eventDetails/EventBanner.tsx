import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing, FontSize, BorderRadius } from "../../constants/spacing";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_HEIGHT = 240;

interface EventBannerProps {
  image: string;
  date: string;
  rating?: number;
  totalRatings?: number;
}

// Format date to "MAR 23" format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = date.getDate();
  return { month, day };
};

export default function EventBanner({
  image,
  date,
  rating,
  totalRatings,
}: EventBannerProps) {
  const formattedDate = formatDate(date);

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      
      {/* Gradient Overlay */}
      <View style={styles.overlay} />

      {/* Date Badge */}
      <View style={styles.dateBadge}>
        <Text style={styles.dateMonth}>{formattedDate.month}</Text>
        <Text style={styles.dateDay}>{formattedDate.day}</Text>
      </View>

      {/* Rating Badge */}
      {rating && (
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color={Colors.rating} />
          <Text style={styles.ratingText}>{rating}</Text>
          {totalRatings && (
            <Text style={styles.votesText}>({totalRatings.toLocaleString()} votes)</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  dateBadge: {
    position: "absolute",
    top: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: Colors.textWhite,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    minWidth: 50,
  },
  dateMonth: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.primary,
  },
  dateDay: {
    fontSize: FontSize.xxl,
    fontWeight: "bold",
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  ratingBadge: {
    position: "absolute",
    bottom: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  ratingText: {
    fontSize: FontSize.md,
    fontWeight: "bold",
    color: Colors.textWhite,
  },
  votesText: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
});
