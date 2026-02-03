import React, { useRef, useState, useEffect } from "react";
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
import { FeaturedBanner } from "../../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - Spacing.lg * 2;
const CARD_HEIGHT = 180;

interface FeaturedCarouselProps {
  banners: FeaturedBanner[];
  onBannerPress: (eventId: string) => void;
}

export default function FeaturedCarousel({
  banners,
  onBannerPress,
}: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex, banners.length]);

  const renderBanner = ({ item }: { item: FeaturedBanner }) => (
    <Pressable
      style={styles.bannerContainer}
      onPress={() => onBannerPress(item.eventId)}
    >
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
      <View style={styles.overlay} />
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        )}
        <View style={styles.ctaButton}>
          <Text style={styles.ctaText}>{item.ctaText}</Text>
        </View>
      </View>
    </Pressable>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + Spacing.md}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH + Spacing.md,
          offset: (CARD_WIDTH + Spacing.md) * index,
          index,
        })}
      />
      
      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.dotActive : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  bannerContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginRight: Spacing.md,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  bannerContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
  },
  bannerTitle: {
    color: Colors.textWhite,
    fontSize: FontSize.xl,
    fontWeight: "bold",
    marginBottom: Spacing.xs,
  },
  bannerSubtitle: {
    color: Colors.textWhite,
    fontSize: FontSize.sm,
    opacity: 0.9,
    marginBottom: Spacing.md,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignSelf: "flex-start",
  },
  ctaText: {
    color: Colors.textWhite,
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 20,
  },
});
