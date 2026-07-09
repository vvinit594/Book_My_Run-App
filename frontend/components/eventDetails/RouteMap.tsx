import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import Colors from "../../constants/colors";
import { Spacing, FontSize, BorderRadius } from "../../constants/spacing";
import { RouteMap as RouteMapType, EventCategory } from "../../types";

interface RouteMapProps {
  routeMaps: RouteMapType[];
  onMapPress?: (map: RouteMapType) => void;
}

export default function RouteMap({ routeMaps, onMapPress }: RouteMapProps) {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>(
    routeMaps[0]?.category || "10K"
  );

  const selectedMap = routeMaps.find((map) => map.category === selectedCategory);

  if (!routeMaps || routeMaps.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Route Map</Text>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {routeMaps.map((map) => (
          <Pressable
            key={map.category}
            style={[
              styles.tab,
              selectedCategory === map.category && styles.tabSelected,
            ]}
            onPress={() => setSelectedCategory(map.category)}
          >
            <Text
              style={[
                styles.tabText,
                selectedCategory === map.category && styles.tabTextSelected,
              ]}
            >
              {map.category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Selected Map */}
      {selectedMap && (
        <Pressable
          style={styles.mapContainer}
          onPress={() => onMapPress?.(selectedMap)}
        >
          <Image source={{ uri: selectedMap.mapImage }} style={styles.mapImage} />
          
          <View style={styles.mapOverlay}>
            <Text style={styles.tapToExpand}>Tap to view full map</Text>
          </View>

          {/* Map Info */}
          <View style={styles.mapInfo}>
            <View style={styles.mapInfoItem}>
              <Text style={styles.mapInfoLabel}>Distance</Text>
              <Text style={styles.mapInfoValue}>{selectedMap.distance}</Text>
            </View>
            {selectedMap.elevation && (
              <View style={styles.mapInfoItem}>
                <Text style={styles.mapInfoLabel}>Elevation</Text>
                <Text style={styles.mapInfoValue}>{selectedMap.elevation}</Text>
              </View>
            )}
          </View>

          {selectedMap.description && (
            <Text style={styles.mapDescription}>{selectedMap.description}</Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  tabsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.chipBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  tabTextSelected: {
    color: Colors.textWhite,
  },
  mapContainer: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    backgroundColor: Colors.backgroundSecondary,
  },
  mapImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: 180,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  tapToExpand: {
    color: Colors.textWhite,
    fontSize: FontSize.sm,
    fontWeight: "500",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  mapInfo: {
    flexDirection: "row",
    padding: Spacing.md,
    gap: Spacing.xl,
  },
  mapInfoItem: {},
  mapInfoLabel: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginBottom: 2,
  },
  mapInfoValue: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  mapDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
});
