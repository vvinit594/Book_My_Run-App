import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../../constants/spacing";

interface OrganizerLogoUploaderProps {
  logoUri: string | null;
  onLogoChange: (uri: string | null) => void;
}

export default function OrganizerLogoUploader({
  logoUri,
  onLogoChange,
}: OrganizerLogoUploaderProps) {
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo library access to upload your organizer logo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      onLogoChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Organizer Logo</Text>
      <TouchableOpacity
        style={styles.previewWrapper}
        onPress={pickImage}
        activeOpacity={0.85}
      >
        {logoUri ? (
          <Image source={{ uri: logoUri }} style={styles.logoImage} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={28} color={Colors.primary} />
            <Text style={styles.placeholderText}>Upload Logo</Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.chooseButton} onPress={pickImage}>
        <Text style={styles.chooseButtonText}>
          {logoUri ? "Change Logo" : "Choose File"}
        </Text>
      </TouchableOpacity>
      {logoUri ? (
        <TouchableOpacity onPress={() => onLogoChange(null)}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.helperText}>No file chosen</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: FontSize.md,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  previewWrapper: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    backgroundColor: Colors.backgroundSecondary,
    marginBottom: Spacing.md,
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  placeholderText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  chooseButton: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  chooseButtonText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  helperText: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  removeText: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: "600",
  },
});
