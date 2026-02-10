import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { EventDraft, EventType } from '../../../types/organizer';

type PickerField = 'startDate' | 'endDate' | 'startTime' | 'endTime' | 'bibExpoDate' | 'bibExpoStartTime' | 'bibExpoEndTime' | null;

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
}

const EVENT_TYPES: EventType[] = [
  'Running',
  'Walking', 
  'Cycling',
  'Triathlon',
  'Swimming',
  'Virtual',
  'Ultra',
  'Duathlon',
  'Obstacle',
  'Stadium Run',
];

// Helper functions
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const parseDate = (dateStr: string | undefined): Date => {
  if (!dateStr) return new Date();
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

const parseTime = (timeStr: string | undefined, baseDate?: Date): Date => {
  const date = baseDate ? new Date(baseDate) : new Date();
  if (!timeStr) return date;
  
  // Parse time like "05:30 AM" or "17:30"
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3];
    
    if (period) {
      if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
      if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
    }
    
    date.setHours(hours, minutes, 0, 0);
  }
  return date;
};

export default function Step1EventBasics({ eventDraft, updateEventDraft }: Props) {
  const { basics } = eventDraft;
  
  // Picker state
  const [activeField, setActiveField] = useState<PickerField>(null);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [tempDate, setTempDate] = useState(new Date());

  const updateBasics = (updates: Partial<typeof basics>) => {
    updateEventDraft({
      basics: { ...basics, ...updates },
    });
  };

  // Get minimum date (today for start date, start date for end date)
  const getMinimumDate = (): Date | undefined => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (activeField === 'startDate' || activeField === 'bibExpoDate') {
      return today;
    }
    if (activeField === 'endDate' && basics.startDate) {
      return parseDate(basics.startDate);
    }
    return today;
  };

  // Open picker for a specific field
  const openPicker = (field: PickerField, mode: 'date' | 'time') => {
    let initialDate = new Date();
    
    switch (field) {
      case 'startDate':
        initialDate = parseDate(basics.startDate);
        break;
      case 'endDate':
        initialDate = basics.endDate ? parseDate(basics.endDate) : parseDate(basics.startDate);
        break;
      case 'startTime':
        initialDate = parseTime(basics.startTime, parseDate(basics.startDate));
        break;
      case 'endTime':
        initialDate = basics.endTime 
          ? parseTime(basics.endTime, parseDate(basics.startDate))
          : parseTime(basics.startTime, parseDate(basics.startDate));
        break;
      case 'bibExpoDate':
        initialDate = basics.bibExpoDate ? parseDate(basics.bibExpoDate) : new Date();
        break;
      case 'bibExpoStartTime':
        initialDate = parseTime(basics.bibExpoStartTime);
        break;
      case 'bibExpoEndTime':
        initialDate = basics.bibExpoEndTime 
          ? parseTime(basics.bibExpoEndTime)
          : parseTime(basics.bibExpoStartTime);
        break;
    }
    
    setTempDate(initialDate);
    setActiveField(field);
    setPickerMode(mode);
  };

  // Handle picker change
  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setActiveField(null);
    }
    
    if (event.type === 'dismissed') {
      setActiveField(null);
      return;
    }
    
    if (selectedDate) {
      setTempDate(selectedDate);
      
      if (Platform.OS === 'android') {
        applySelection(selectedDate);
      }
    }
  };

  // Apply selection (for iOS confirm button)
  const applySelection = (date: Date = tempDate) => {
    switch (activeField) {
      case 'startDate': {
        const formattedDate = formatDate(date);
        updateBasics({ startDate: formattedDate });
        
        // If end date is before new start date, update it
        if (basics.endDate && parseDate(basics.endDate) < date) {
          updateBasics({ startDate: formattedDate, endDate: formattedDate });
        }
        break;
      }
      case 'endDate': {
        const startDate = parseDate(basics.startDate);
        if (date < startDate) {
          Alert.alert('Invalid Date', 'End date cannot be before start date');
          return;
        }
        updateBasics({ endDate: formatDate(date) });
        break;
      }
      case 'startTime': {
        updateBasics({ startTime: formatTime(date) });
        break;
      }
      case 'endTime': {
        // Validate end time > start time if same date
        if (basics.startDate === basics.endDate || !basics.endDate) {
          const startTime = parseTime(basics.startTime);
          const endTime = date;
          
          if (endTime.getHours() < startTime.getHours() || 
              (endTime.getHours() === startTime.getHours() && 
               endTime.getMinutes() <= startTime.getMinutes())) {
            Alert.alert('Invalid Time', 'End time must be after start time');
            return;
          }
        }
        updateBasics({ endTime: formatTime(date) });
        break;
      }
      case 'bibExpoDate': {
        const startDate = parseDate(basics.startDate);
        if (basics.startDate && date >= startDate) {
          Alert.alert('Invalid Date', 'BIB Expo date should be before the event start date');
          return;
        }
        updateBasics({ bibExpoDate: formatDate(date) });
        break;
      }
      case 'bibExpoStartTime': {
        updateBasics({ bibExpoStartTime: formatTime(date) });
        break;
      }
      case 'bibExpoEndTime': {
        // Validate end time > start time
        if (basics.bibExpoStartTime) {
          const startTime = parseTime(basics.bibExpoStartTime);
          const endTime = date;
          
          if (endTime.getHours() < startTime.getHours() || 
              (endTime.getHours() === startTime.getHours() && 
               endTime.getMinutes() <= startTime.getMinutes())) {
            Alert.alert('Invalid Time', 'BIB Expo end time must be after start time');
            return;
          }
        }
        updateBasics({ bibExpoEndTime: formatTime(date) });
        break;
      }
    }
    
    setActiveField(null);
  };

  // Cancel picker (iOS)
  const cancelPicker = () => {
    setActiveField(null);
  };

  // Render iOS picker modal
  const renderIOSPicker = () => {
    if (Platform.OS !== 'ios' || !activeField) return null;

    return (
      <Modal
        visible={!!activeField}
        transparent
        animationType="slide"
        onRequestClose={cancelPicker}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={cancelPicker}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {pickerMode === 'date' ? 'Select Date' : 'Select Time'}
              </Text>
              <TouchableOpacity onPress={() => applySelection()}>
                <Text style={styles.modalDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={tempDate}
              mode={pickerMode}
              display="spinner"
              onChange={handlePickerChange}
              minimumDate={pickerMode === 'date' ? getMinimumDate() : undefined}
              textColor="#333"
            />
          </View>
        </View>
      </Modal>
    );
  };

  // Render Android picker (inline)
  const renderAndroidPicker = () => {
    if (Platform.OS !== 'android' || !activeField) return null;

    return (
      <DateTimePicker
        value={tempDate}
        mode={pickerMode}
        display="default"
        onChange={handlePickerChange}
        minimumDate={pickerMode === 'date' ? getMinimumDate() : undefined}
      />
    );
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
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => openPicker('startDate', 'date')}
            >
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
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => openPicker('endDate', 'date')}
            >
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
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => openPicker('startTime', 'time')}
            >
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
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => openPicker('endTime', 'time')}
            >
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
            {/* BIB Expo Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>BIB Expo Date *</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => openPicker('bibExpoDate', 'date')}
              >
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={[
                  styles.dateText,
                  !basics.bibExpoDate && styles.datePlaceholder,
                ]}>
                  {basics.bibExpoDate || 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* BIB Expo Time Row */}
            <View style={styles.dateRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Start Time *</Text>
                <TouchableOpacity 
                  style={[
                    styles.dateInput,
                    !basics.bibExpoStartTime && basics.bibExpoDate && styles.inputWarning,
                  ]}
                  onPress={() => openPicker('bibExpoStartTime', 'time')}
                >
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <Text style={[
                    styles.dateText,
                    !basics.bibExpoStartTime && styles.datePlaceholder,
                  ]}>
                    {basics.bibExpoStartTime || 'Select time'}
                  </Text>
                </TouchableOpacity>
                {!basics.bibExpoStartTime && basics.bibExpoDate && (
                  <Text style={styles.errorText}>Start time required</Text>
                )}
              </View>
              
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>End Time *</Text>
                <TouchableOpacity 
                  style={[
                    styles.dateInput,
                    !basics.bibExpoEndTime && basics.bibExpoStartTime && styles.inputWarning,
                  ]}
                  onPress={() => openPicker('bibExpoEndTime', 'time')}
                >
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <Text style={[
                    styles.dateText,
                    !basics.bibExpoEndTime && styles.datePlaceholder,
                  ]}>
                    {basics.bibExpoEndTime || 'Select time'}
                  </Text>
                </TouchableOpacity>
                {!basics.bibExpoEndTime && basics.bibExpoStartTime && (
                  <Text style={styles.errorText}>End time required</Text>
                )}
              </View>
            </View>
            
            {/* BIB Expo Venue */}
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

      {/* Date/Time Pickers */}
      {renderIOSPicker()}
      {renderAndroidPicker()}
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
  // iOS Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  modalCancelText: {
    fontSize: 17,
    color: '#666',
  },
  modalDoneText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#E91E63',
  },
  inputWarning: {
    borderColor: '#FFA726',
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 11,
    color: '#E91E63',
    marginTop: 4,
  },
});
