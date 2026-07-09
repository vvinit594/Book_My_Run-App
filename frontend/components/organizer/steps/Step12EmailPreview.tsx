import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventDraft } from '../../../types/organizer';

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
}

export default function Step12EmailPreview({ eventDraft, updateEventDraft }: Props) {
  const { emailSettings, basics, location, bookingConfirmation } = eventDraft;

  const updateEmailSettings = (updates: Partial<typeof emailSettings>) => {
    updateEventDraft({
      emailSettings: { ...emailSettings, ...updates },
    });
  };

  const toggleReminder = (day: number) => {
    const currentDays = emailSettings.reminderDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort((a, b) => b - a);
    updateEmailSettings({ reminderDays: newDays });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={28} color="#E91E63" />
          </View>
          <Text style={styles.title}>Email Communications</Text>
          <Text style={styles.subtitle}>
            Configure emails sent to participants
          </Text>
        </View>

        {/* Email Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Settings</Text>
          
          <View style={styles.optionCard}>
            <View style={[styles.optionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="checkmark-done" size={22} color="#2196F3" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Confirmation Email</Text>
              <Text style={styles.optionSubtitle}>
                Send email immediately after booking
              </Text>
            </View>
            <Switch
              value={emailSettings.sendConfirmationEmail}
              onValueChange={(value) => updateEmailSettings({ sendConfirmationEmail: value })}
              trackColor={{ false: '#e0e0e0', true: '#FCE4EC' }}
              thumbColor={emailSettings.sendConfirmationEmail ? '#E91E63' : '#f4f3f4'}
            />
          </View>

          <View style={styles.optionCard}>
            <View style={[styles.optionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="notifications" size={22} color="#FF9800" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Event Reminders</Text>
              <Text style={styles.optionSubtitle}>
                Send reminder emails before the event
              </Text>
            </View>
            <Switch
              value={emailSettings.sendReminders}
              onValueChange={(value) => updateEmailSettings({ sendReminders: value })}
              trackColor={{ false: '#e0e0e0', true: '#FCE4EC' }}
              thumbColor={emailSettings.sendReminders ? '#E91E63' : '#f4f3f4'}
            />
          </View>

          {emailSettings.sendReminders && (
            <View style={styles.reminderOptions}>
              <Text style={styles.reminderTitle}>Send reminders:</Text>
              <View style={styles.reminderChips}>
                {[7, 3, 1].map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.reminderChip,
                      emailSettings.reminderDays?.includes(day) && styles.reminderChipSelected,
                    ]}
                    onPress={() => toggleReminder(day)}
                  >
                    <Text style={[
                      styles.reminderChipText,
                      emailSettings.reminderDays?.includes(day) && styles.reminderChipTextSelected,
                    ]}>
                      {day} day{day > 1 ? 's' : ''} before
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Email Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Confirmation Email Preview</Text>
            <View style={styles.previewBadge}>
              <Text style={styles.previewBadgeText}>Preview</Text>
            </View>
          </View>
          
          <View style={styles.emailPreview}>
            {/* Email Header */}
            <View style={styles.emailHeader}>
              <View style={styles.emailLogo}>
                <Text style={styles.emailLogoText}>book<Text style={styles.emailLogoAccent}>my</Text>run</Text>
              </View>
            </View>

            {/* Email Content */}
            <View style={styles.emailBody}>
              <Text style={styles.emailSubject}>
                🎉 You're In! Registration Confirmed
              </Text>
              
              <Text style={styles.emailGreeting}>Hi Runner!</Text>
              
              <Text style={styles.emailText}>
                {bookingConfirmation.confirmationMessage || 
                  'Thank you for registering! Your spot is confirmed.'}
              </Text>

              <View style={styles.eventDetailsCard}>
                <Text style={styles.eventDetailsTitle}>Event Details</Text>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="calendar" size={16} color="#E91E63" />
                  <Text style={styles.eventDetailText}>
                    {basics.startDate || 'Event Date'}
                  </Text>
                </View>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="time" size={16} color="#E91E63" />
                  <Text style={styles.eventDetailText}>
                    {basics.startTime || 'Event Time'}
                  </Text>
                </View>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="location" size={16} color="#E91E63" />
                  <Text style={styles.eventDetailText}>
                    {location.venueName || 'Event Venue'}, {location.city || 'City'}
                  </Text>
                </View>
              </View>

              {bookingConfirmation.includeQRCode && (
                <View style={styles.qrPlaceholder}>
                  <Ionicons name="qr-code" size={60} color="#ddd" />
                  <Text style={styles.qrText}>Your Check-in QR Code</Text>
                </View>
              )}

              <View style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>View Ticket</Text>
              </View>
            </View>

            {/* Email Footer */}
            <View style={styles.emailFooter}>
              <Text style={styles.emailFooterText}>
                Need help? Contact the organizer
              </Text>
            </View>
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
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  previewBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  previewBadgeText: {
    fontSize: 11,
    color: '#1976D2',
    fontWeight: '600',
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
    width: 40,
    height: 40,
    borderRadius: 10,
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
  reminderOptions: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 6,
  },
  reminderTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  reminderChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reminderChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  reminderChipSelected: {
    backgroundColor: '#FCE4EC',
  },
  reminderChipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  reminderChipTextSelected: {
    color: '#E91E63',
  },
  emailPreview: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emailHeader: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    alignItems: 'center',
  },
  emailLogo: {
    flexDirection: 'row',
  },
  emailLogoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  emailLogoAccent: {
    color: '#E91E63',
  },
  emailBody: {
    padding: 20,
  },
  emailSubject: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 16,
  },
  emailGreeting: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  eventDetailsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  eventDetailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  eventDetailText: {
    fontSize: 13,
    color: '#666',
  },
  qrPlaceholder: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 16,
  },
  qrText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  ctaButton: {
    backgroundColor: '#E91E63',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  emailFooter: {
    backgroundColor: '#f5f5f5',
    padding: 14,
    alignItems: 'center',
  },
  emailFooterText: {
    fontSize: 12,
    color: '#999',
  },
  bottomSpacing: {
    height: 40,
  },
});
