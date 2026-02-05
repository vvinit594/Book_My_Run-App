import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventDraft } from '../../../types/organizer';

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
}

export default function Step4EventPhotos({ eventDraft, updateEventDraft }: Props) {
  const { photos } = eventDraft;

  const updatePhotos = (updates: Partial<typeof photos>) => {
    updateEventDraft({
      photos: { ...photos, ...updates },
    });
  };

  const handleSelectBanner = () => {
    // In a real app, this would open image picker
    // For now, we'll use a placeholder
    updatePhotos({ 
      bannerImage: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800' 
    });
  };

  const handleAddGalleryImage = () => {
    // In a real app, this would open image picker
    const newImage = `https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&t=${Date.now()}`;
    updatePhotos({
      galleryImages: [...photos.galleryImages, newImage],
    });
  };

  const removeGalleryImage = (index: number) => {
    const newImages = [...photos.galleryImages];
    newImages.splice(index, 1);
    updatePhotos({ galleryImages: newImages });
  };

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
              style={styles.uploadPlaceholder}
              onPress={handleSelectBanner}
            >
              <Ionicons name="cloud-upload-outline" size={40} color="#999" />
              <Text style={styles.uploadText}>Tap to upload banner</Text>
              <Text style={styles.uploadHint}>JPG, PNG up to 5MB</Text>
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
              >
                <Ionicons name="add" size={32} color="#999" />
                <Text style={styles.addGalleryText}>Add Photo</Text>
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
              onPress={() => updatePhotos({ 
                routeMapImage: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600' 
              })}
            >
              <Ionicons name="map-outline" size={36} color="#999" />
              <Text style={styles.uploadText}>Upload Route Map</Text>
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
  uploadText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  uploadHint: {
    fontSize: 12,
    color: '#999',
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
