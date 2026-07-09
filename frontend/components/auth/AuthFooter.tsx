import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import Colors from "../../constants/colors";
import { FontSize, Spacing } from "../../constants/spacing";

export default function AuthFooter() {
  const openLink = (url: string) => {
    void Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <Text style={styles.text}>
        By continuing, you agree to BookMyRun{" "}
        <Text
          style={styles.link}
          onPress={() => openLink("https://bookmyrun.com/terms")}
        >
          Terms of Service
        </Text>{" "}
        and{" "}
        <Text
          style={styles.link}
          onPress={() => openLink("https://bookmyrun.com/privacy")}
        >
          Privacy Policy
        </Text>
        .
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  text: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: "center",
  },
  link: {
    color: Colors.info,
    fontWeight: "600",
  },
});
