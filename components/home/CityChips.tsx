import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import Colors from "../../constants/colors";
import { Spacing, FontSize, BorderRadius } from "../../constants/spacing";
import { City } from "../../types";

interface CityChipsProps {
  cities: City[];
  selectedCity: string;
  onCitySelect: (city: City) => void;
}

export default function CityChips({
  cities,
  selectedCity,
  onCitySelect,
}: CityChipsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cities.map((city) => {
          const isSelected = city.name === selectedCity;
          return (
            <Pressable
              key={city.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onCitySelect(city)}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {city.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.chipBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.textWhite,
  },
});
