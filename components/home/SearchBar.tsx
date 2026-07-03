import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

const SEARCH_BAR_HEIGHT = 50;

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={20}
          color={Colors.textLight}
          style={styles.searchIcon}
        />
        <Text style={styles.placeholder}>
          Search for Events, Sports and Activities
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: SEARCH_BAR_HEIGHT,
    backgroundColor: Colors.background,
    borderRadius: SEARCH_BAR_HEIGHT / 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: Spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  placeholder: {
    flex: 1,
    fontSize: 14,
    color: Colors.textLight,
  },
});
