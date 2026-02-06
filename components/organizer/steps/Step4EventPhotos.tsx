import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { EventDraft } from '../../../types/organizer';

const MAX_GALLERY_IMAGES = 10;

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
}

export default function Step4EventPhotos({ eventDraft, updateEventDraft }: Props) {
  const { photos } = eventDraft;
  const [isLoading, setIsLoading] = useState(false);

  const updatePhotos = (updates: Partial<typeof photos>) => {
    updateEventDraft({
      photos: { ...photos, ...updates },
    });
  };

  // Request permission to access media library
  const requestPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to upload images.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => {
            // On a real app, you'd open settings here
            Alert.alert('Info', 'Please enable photo access in your device settings.');
          }},
        ]
      );
      return false;
    }
    return true;
  };

  // Handle banner image selection
  const handleSelectBanner = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 1], // 1200x600 aspect ratio
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        updatePhotos({ bannerImage: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle gallery image selection (supports multiple)
  const handleAddGalleryImage = async () => {
    const currentCount = photos.galleryImages.length;
    const remainingSlots = MAX_GALLERY_IMAGES - currentCount;

    if (remainingSlots <= 0) {
      Alert.alert('Limit Reached', `You can only add up to ${MAX_GALLERY_IMAGES} gallery images.`);
      return;
    }

    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImages = result.assets.map(asset => asset.uri);
        
        // Check if adding these would exceed the limit
        if (currentCount + newImages.length > MAX_GALLERY_IMAGES) {
          const allowedImages = newImages.slice(0, remainingSlots);
          updatePhotos({
            galleryImages: [...photos.galleryImages, ...allowedImages],
          });
          Alert.alert(
            'Some Images Not Added',
            `Only ${allowedImages.length} of ${newImages.length} images were added due to the ${MAX_GALLERY_IMAGES} image limit.`
          );
        } else {
          updatePhotos({
            galleryImages: [...photos.galleryImages, ...newImages],
          });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle route map selection
  const handleSelectRouteMap = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        updatePhotos({ routeMapImage: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newImages = [...photos.galleryImages];
    newImages.splice(index, 1);
    updatePhotos({ galleryImages: newImages });
  };

  // Check if banner is missing (for validation display)
  const isBannerMissing = !photos.bannerImage;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="images-outline" size={28} color="#E91E63" />
          </View>
          <Text style={styles.title}>Event Photos</Text>
          <Text style={styles.subtitle}>
            Upload images that showcase your event
          </Text>
        </View>

        {/* Banner Image */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Banner Image *</Text>
          <Text style={styles.sectionSubtitle}>
            This will be the main image on your event page (Recommended: 1200x600px)
          </Text>

          {photos.bannerImage ? (
            <View style={styles.bannerContainer}>
              <Image 
                source={{ uri: photos.bannerImage }} 
                style={styles.bannerImage}
              />
              <TouchableOpacity 
                style={styles.bannerOverlay}
                onPress={handleSelectBanner}
                disabled={isLoading}
              >
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.bannerOverlayText}>Change Banner</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.removeBanner}
                onPress={() => updatePhotos({ bannerImage: '' })}
              >
                <Ionicons name="close-circle" size={28} color="#FF5252" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.uploadPlaceholder, isBannerMissing && styles.uploadPlaceholderError]}
              onPress={handleSelectBanner}
              disabled={isLoading}
            >
              <Ionicons name="cloud-upload-outline" size={40} color={isBannerMissing ? "#E91E63" : "#999"} />
              <Text style={[styles.uploadText, isBannerMissing && styles.uploadTextError]}>
                {isLoading ? 'Opening...' : 'Tap to upload banner'}
              </Text>
              <Text style={styles.uploadHint}>JPG, PNG up to 5MB</Text>
              {isBannerMissing && (
                <Text style={styles.requiredText}>Banner image is required</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Gallery Images */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Gallery Images</Text>
              <Text style={styles.sectionSubtitle}>
                Add more photos of past events, routes, venues (Max 10)
              </Text>
            </View>
            <View style={styles.imageCount}>
              <Text style={styles.imageCountText}>
                {photos.galleryImages.length}/10
              </Text>
            </View>
          </View>

          <View style={styles.galleryGrid}>
            {photos.galleryImages.map((image, index) => (
              <View key={index} style={styles.galleryItem}>
                <Image source={{ uri: image }} style={styles.galleryImage} />
                <TouchableOpacity 
                  style={styles.removeGalleryImage}
                  onPress={() => removeGalleryImage(index)}
                >
                  <Ionicons name="close-circle" size={22} color="#FF5252" />
                </TouchableOpacity>
              </View>
            ))}
            
            {photos.galleryImages.length < 10 && (
              <TouchableOpacity 
                style={styles.addGalleryButton}
                onPress={handleAddGalleryImage}
                disabled={isLoading}
              >
                <Ionicons name="add" size={32} color="#999" />
                <Text style={styles.addGalleryText}>
                  {isLoading ? 'Loading...' : 'Add Photo'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Route Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route Map</Text>
          <Text style={styles.sectionSubtitle}>
            Upload a map showing the race route (optional)
          </Text>

          {photos.routeMapImage ? (
            <View style={styles.routeMapContainer}>
              <Image 
                source={{ uri: photos.routeMapImage }} 
                style={styles.routeMapImage}
              />
              <TouchableOpacity 
                style={styles.removeRouteMap}
                onPress={() => updatePhotos({ routeMapImage: undefined })}
              >
                <Ionicons name="close-circle" size={28} color="#FF5252" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.routeMapPlaceholder}
              onPress={handleSelectRouteMap}
              disabled={isLoading}
            >
              <Ionicons name="map-outline" size={36} color="#999" />
              <Text style={styles.uploadText}>
                {isLoading ? 'Opening...' : 'Upload Route Map'}
              </Text>
              <Text style={styles.uploadHint}>
                Help participants visualize the course
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>📸 Photo Tips</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.tipText}>
              Use high-quality, well-lit images
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.tipText}>
              Show the energy and excitement of running events
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.tipText}>
              Include images of the route and finish line
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FCE4EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  imageCount: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  bannerContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  bannerOverlayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  removeBanner: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
  },
  uploadPlaceholder: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  uploadPlaceholderError: {
    borderColor: '#E91E63',
    backgroundColor: '#FFF5F8',
  },
  uploadText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  uploadTextError: {
    color: '#E91E63',
  },
  uploadHint: {
    fontSize: 12,
    color: '#999',
  },
  requiredText: {
    fontSize: 12,
    color: '#E91E63',
    fontWeight: '500',
    marginTop: 4,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  galleryItem: {
    width: '31%',
    aspectRatio: 1,
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeGalleryImage: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 11,
  },
  addGalleryButton: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addGalleryText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  routeMapContainer: {
    position: 'relative',
  },
  routeMapImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeRouteMap: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
  },
  routeMapPlaceholder: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  tipsCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F57C00',
    marginBottom: 4,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
  },
  bottomSpacing: {
    height: 40,
  },
});
