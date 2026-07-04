import React, { memo } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { FontSize, Spacing } from "../../constants/spacing";

const SEARCH_BAR_HEIGHT = 48;

interface DashboardSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

function DashboardSearchBar({
  value,
  onChangeText,
  placeholder = "Search Events...",
}: DashboardSearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={20}
          color={Colors.textLight}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 ? (
          <TouchableOpacity
            onPress={() => onChangeText("")}
            hitSlop={8}
            style={styles.clearButton}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: SEARCH_BAR_HEIGHT,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      default: {},
    }),
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: Spacing.xs,
  },
});

export default memo(DashboardSearchBar);
