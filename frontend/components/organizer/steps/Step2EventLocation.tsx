import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventDraft } from '../../../types/organizer';
import { COUNTRY_OPTIONS } from '../../../constants/organizer';

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
}

export default function Step2EventLocation({ eventDraft, updateEventDraft }: Props) {
  const { location } = eventDraft;
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);

  const updateLocation = (updates: Partial<typeof location>) => {
    updateEventDraft({
      location: { ...location, ...updates },
    });
  };

  const selectedCountry = location.country || 'India';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="location-outline" size={28} color="#E91E63" />
          </View>
          <Text style={styles.title}>Event Location</Text>
          <Text style={styles.subtitle}>
            Where will the race take place?
          </Text>
        </View>

        {/* Address Line 1 (maps to venueName) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address Line 1 *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Marine Drive, Near NCPA"
            placeholderTextColor="#999"
            value={location.venueName}
            onChangeText={(text) => updateLocation({ venueName: text })}
          />
        </View>

        {/* Address Line 2 (maps to address) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address Line 2 *</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Apartment, landmark, or additional details"
            placeholderTextColor="#999"
            value={location.address}
            onChangeText={(text) => updateLocation({ address: text })}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Country */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Country *</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setCountryPickerOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownText}>{selectedCountry}</Text>
            <Ionicons name="chevron-down" size={18} color="#666" />
          </TouchableOpacity>
        </View>

        {/* City & State Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.col]}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Mumbai"
              placeholderTextColor="#999"
              value={location.city}
              onChangeText={(text) => updateLocation({ city: text })}
            />
          </View>

          <View style={[styles.inputGroup, styles.col]}>
            <Text style={styles.label}>State *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Maharashtra"
              placeholderTextColor="#999"
              value={location.state}
              onChangeText={(text) => updateLocation({ state: text })}
            />
          </View>
        </View>

        {/* Pincode */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pincode *</Text>
          <TextInput
            style={[styles.input, { width: 150 }]}
            placeholder="400001"
            placeholderTextColor="#999"
            value={location.pincode}
            onChangeText={(text) => updateLocation({ pincode: text })}
            keyboardType="numeric"
            maxLength={6}
          />
        </View>

        {/* Map Placeholder */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pin Location on Map</Text>
          <TouchableOpacity style={styles.mapPlaceholder}>
            <View style={styles.mapContent}>
              <Ionicons name="map-outline" size={40} color="#999" />
              <Text style={styles.mapText}>Tap to select location on map</Text>
              <Text style={styles.mapHint}>
                This helps participants find the venue
              </Text>
            </View>
          </TouchableOpacity>
          {location.coordinates && (
            <View style={styles.coordinatesBox}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.coordinatesText}>
                Location pinned: {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#2196F3" />
          <Text style={styles.infoText}>
            Make sure to provide accurate location details. This will be shown on the event page and used for navigation.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </View>

      <Modal
        visible={countryPickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCountryPickerOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCountryPickerOpen(false)}
        >
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Country</Text>
            <FlatList
              data={COUNTRY_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const selected = item === selectedCountry;
                return (
                  <TouchableOpacity
                    style={[styles.optionRow, selected && styles.optionRowSelected]}
                    onPress={() => {
                      updateLocation({ country: item });
                      setCountryPickerOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[styles.optionText, selected && styles.optionTextSelected]}
                    >
                      {item}
                    </Text>
                    {selected ? (
                      <Ionicons name="checkmark" size={18} color="#E91E63" />
                    ) : null}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: 14,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
    minWidth: 0,
  },
  mapPlaceholder: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    borderStyle: 'dashed',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContent: {
    alignItems: 'center',
    gap: 8,
  },
  mapText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  mapHint: {
    fontSize: 12,
    color: '#999',
  },
  coordinatesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#2E7D32',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 34,
    maxHeight: '55%',
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e0e0e0',
    marginTop: 10,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionRowSelected: {
    backgroundColor: '#FCE4EC',
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  optionTextSelected: {
    color: '#E91E63',
    fontWeight: '600',
  },
});
