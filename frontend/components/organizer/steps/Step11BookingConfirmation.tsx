import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventDraft } from '../../../types/organizer';

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
}

export default function Step11BookingConfirmation({ eventDraft, updateEventDraft }: Props) {
  const { bookingConfirmation } = eventDraft;

  const updateConfirmation = (updates: Partial<typeof bookingConfirmation>) => {
    updateEventDraft({
      bookingConfirmation: { ...bookingConfirmation, ...updates },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle-outline" size={28} color="#E91E63" />
          </View>
          <Text style={styles.title}>Booking Confirmation</Text>
          <Text style={styles.subtitle}>
            Customize what participants see after booking
          </Text>
        </View>

        {/* Confirmation Message */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmation Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g., Thank you for registering! Your spot is confirmed for Mumbai Marathon 2025..."
            placeholderTextColor="#999"
            value={bookingConfirmation.confirmationMessage}
            onChangeText={(text) => updateConfirmation({ confirmationMessage: text })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={styles.hint}>
            This message will be shown on the confirmation page and email
          </Text>
        </View>

        {/* Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confirmation Page Options</Text>
          
          <View style={styles.optionCard}>
            <View style={styles.optionIcon}>
              <Ionicons name="qr-code-outline" size={24} color="#2196F3" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Include QR Code</Text>
              <Text style={styles.optionSubtitle}>
                QR code for quick check-in at the event
              </Text>
            </View>
            <Switch
              value={bookingConfirmation.includeQRCode}
              onValueChange={(value) => updateConfirmation({ includeQRCode: value })}
              trackColor={{ false: '#e0e0e0', true: '#FCE4EC' }}
              thumbColor={bookingConfirmation.includeQRCode ? '#E91E63' : '#f4f3f4'}
            />
          </View>

          <View style={styles.optionCard}>
            <View style={styles.optionIcon}>
              <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Add to Calendar</Text>
              <Text style={styles.optionSubtitle}>
                Let participants add event to their calendar
              </Text>
            </View>
            <Switch
              value={bookingConfirmation.includeCalendarInvite}
              onValueChange={(value) => updateConfirmation({ includeCalendarInvite: value })}
              trackColor={{ false: '#e0e0e0', true: '#FCE4EC' }}
              thumbColor={bookingConfirmation.includeCalendarInvite ? '#E91E63' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={32} color="#fff" />
              </View>
              <Text style={styles.previewTitle}>Booking Confirmed! 🎉</Text>
            </View>
            
            <Text style={styles.previewMessage}>
              {bookingConfirmation.confirmationMessage || 
                'Your registration is complete. See you at the event!'}
            </Text>

            <View style={styles.previewFeatures}>
              {bookingConfirmation.includeQRCode && (
                <View style={styles.previewFeature}>
                  <Ionicons name="qr-code" size={40} color="#666" />
                  <Text style={styles.previewFeatureText}>QR Code</Text>
                </View>
              )}
              {bookingConfirmation.includeCalendarInvite && (
                <View style={styles.previewFeature}>
                  <Ionicons name="calendar" size={40} color="#666" />
                  <Text style={styles.previewFeatureText}>Calendar</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Ionicons name="bulb-outline" size={20} color="#FF9800" />
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>Best Practices</Text>
            <Text style={styles.tipsText}>
              • Include event date, time, and location{'\n'}
              • Mention what to bring (ID, shoes, etc.){'\n'}
              • Add contact info for queries
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
  inputGroup: {
    marginBottom: 24,
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
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  previewMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  previewFeatures: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
  },
  previewFeature: {
    alignItems: 'center',
    gap: 6,
  },
  previewFeatureText: {
    fontSize: 12,
    color: '#666',
  },
  tipsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F57C00',
    marginBottom: 6,
  },
  tipsText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});
