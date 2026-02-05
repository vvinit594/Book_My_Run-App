import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventDraft, EventType } from '../../../types/organizer';

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
}

const EVENT_TYPES: EventType[] = [
  'Marathon',
  'Half Marathon', 
  '10K',
  '5K',
  'Ultra Marathon',
  'Trail Run',
  'Fun Run',
  'Virtual Run',
  'Relay',
  'Other',
];

export default function Step1EventBasics({ eventDraft, updateEventDraft }: Props) {
  const { basics } = eventDraft;

  const updateBasics = (updates: Partial<typeof basics>) => {
    updateEventDraft({
      basics: { ...basics, ...updates },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar-outline" size={28} color="#E91E63" />
          </View>
          <Text style={styles.title}>Event Basics</Text>
          <Text style={styles.subtitle}>
            Let's start with the fundamental details of your running event
          </Text>
        </View>

        {/* Organizer Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Organizer / Company Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., RunClub India"
            placeholderTextColor="#999"
            value={basics.organizerName}
            onChangeText={(text) => updateBasics({ organizerName: text })}
          />
          <Text style={styles.hint}>This will appear on the event page</Text>
        </View>

        {/* Event Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Mumbai Marathon 2025"
            placeholderTextColor="#999"
            value={basics.eventName}
            onChangeText={(text) => updateBasics({ eventName: text })}
          />
        </View>

        {/* Event Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Type *</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.typeScroll}
          >
            <View style={styles.typeContainer}>
              {EVENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeChip,
                    basics.eventType === type && styles.typeChipSelected,
                  ]}
                  onPress={() => updateBasics({ eventType: type })}
                >
                  <Text style={[
                    styles.typeChipText,
                    basics.eventType === type && styles.typeChipTextSelected,
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Event Dates */}
        <View style={styles.dateRow}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Start Date *</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={[
                styles.dateText,
                !basics.startDate && styles.datePlaceholder,
              ]}>
                {basics.startDate || 'Select date'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={[
                styles.dateText,
                !basics.endDate && styles.datePlaceholder,
              ]}>
                {basics.endDate || 'Select date'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Time */}
        <View style={styles.dateRow}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Start Time *</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={[
                styles.dateText,
                !basics.startTime && styles.datePlaceholder,
              ]}>
                {basics.startTime || 'Select time'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={[
                styles.dateText,
                !basics.endTime && styles.datePlaceholder,
              ]}>
                {basics.endTime || 'Select time'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BIB Expo Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>BIB Expo / Kit Collection</Text>
            <Text style={styles.toggleSubtitle}>
              Will there be a separate BIB collection event before race day?
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggle,
              basics.hasBibExpo && styles.toggleActive,
            ]}
            onPress={() => updateBasics({ hasBibExpo: !basics.hasBibExpo })}
          >
            <View style={[
              styles.toggleKnob,
              basics.hasBibExpo && styles.toggleKnobActive,
            ]} />
          </TouchableOpacity>
        </View>

        {basics.hasBibExpo && (
          <View style={styles.bibExpoFields}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>BIB Expo Date</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={[
                  styles.dateText,
                  !basics.bibExpoDate && styles.datePlaceholder,
                ]}>
                  {basics.bibExpoDate || 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>BIB Expo Venue</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., NSCI Dome, Worli"
                placeholderTextColor="#999"
                value={basics.bibExpoVenue}
                onChangeText={(text) => updateBasics({ bibExpoVenue: text })}
              />
            </View>
          </View>
        )}

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
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  typeScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  typeChipSelected: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  typeChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  typeChipTextSelected: {
    color: '#fff',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  dateText: {
    fontSize: 15,
    color: '#333',
  },
  datePlaceholder: {
    color: '#999',
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#E91E63',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleKnobActive: {
    marginLeft: 22,
  },
  bibExpoFields: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCE4EC',
  },
  bottomSpacing: {
    height: 40,
  },
});
