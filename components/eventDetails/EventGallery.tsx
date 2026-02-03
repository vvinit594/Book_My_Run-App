import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import Colors from "../../constants/colors";
import { Spacing, FontSize, BorderRadius } from "../../constants/spacing";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.md * 2) / 2.5;

interface EventGalleryProps {
  images: string[];
  onImagePress?: (index: number) => void;
}

export default function EventGallery({ images, onImagePress }: EventGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Event Gallery</Text>
      
      <FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.imageContainer}
            onPress={() => onImagePress?.(index)}
          >
            <Image source={{ uri: item }} style={styles.image} />
          </Pressable>
        )}
      />

      <Text style={styles.imageCount}>{images.length} photos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  imageContainer: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    resizeMode: "cover",
  },
  imageCount: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
});
