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
import { EventDraft } from '../../../types/organizer';

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
}

export default function Step5GSTConfirmation({ eventDraft, updateEventDraft }: Props) {
  const { gst } = eventDraft;

  const updateGST = (updates: Partial<typeof gst>) => {
    updateEventDraft({
      gst: { ...gst, ...updates },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="receipt-outline" size={28} color="#E91E63" />
          </View>
          <Text style={styles.title}>GST Information</Text>
          <Text style={styles.subtitle}>
            Tax details for your event registrations
          </Text>
        </View>

        {/* GST Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleContent}>
            <View style={styles.toggleIcon}>
              <Ionicons name="document-text" size={24} color="#2196F3" />
            </View>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>
                Are you GST registered?
              </Text>
              <Text style={styles.toggleSubtitle}>
                GST will be applicable on ticket prices if registered
              </Text>
            </View>
          </View>
          
          <View style={styles.optionButtons}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                gst.hasGST && styles.optionButtonSelected,
              ]}
              onPress={() => updateGST({ hasGST: true })}
            >
              <Text style={[
                styles.optionButtonText,
                gst.hasGST && styles.optionButtonTextSelected,
              ]}>
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                !gst.hasGST && styles.optionButtonSelected,
              ]}
              onPress={() => updateGST({ hasGST: false, gstNumber: undefined })}
            >
              <Text style={[
                styles.optionButtonText,
                !gst.hasGST && styles.optionButtonTextSelected,
              ]}>
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* GST Details */}
        {gst.hasGST && (
          <View style={styles.gstDetails}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>GST Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 27AABCU9603R1ZM"
                placeholderTextColor="#999"
                value={gst.gstNumber}
                onChangeText={(text) => updateGST({ gstNumber: text.toUpperCase() })}
                autoCapitalize="characters"
                maxLength={15}
              />
              <Text style={styles.hint}>
                15-character alphanumeric GST identification number
              </Text>
            </View>

            {/* GST Rate Info */}
            <View style={styles.gstRateCard}>
              <Text style={styles.gstRateTitle}>Applicable GST Rate</Text>
              <View style={styles.gstRateRow}>
                <Text style={styles.gstRateLabel}>Sports Events (Marathon, Running)</Text>
                <Text style={styles.gstRateValue}>18%</Text>
              </View>
              <Text style={styles.gstRateNote}>
                GST will be calculated and shown separately during checkout
              </Text>
            </View>
          </View>
        )}

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={22} color="#2196F3" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>How GST works?</Text>
              <Text style={styles.infoText}>
                If you're GST registered, 18% GST will be added to the base ticket price. Participants will see the breakup at checkout.
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, styles.warningCard]}>
            <Ionicons name="alert-circle" size={22} color="#FF9800" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Important</Text>
              <Text style={styles.infoText}>
                Providing incorrect GST information may lead to legal implications. Please verify your GST number before proceeding.
              </Text>
            </View>
          </View>
        </View>

        {/* No GST Benefits */}
        {!gst.hasGST && (
          <View style={styles.noGstCard}>
            <Text style={styles.noGstTitle}>Not GST Registered?</Text>
            <Text style={styles.noGstText}>
              No worries! You can still list your event. The ticket prices you set will be the final prices participants pay.
            </Text>
            <View style={styles.noGstBenefits}>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <Text style={styles.benefitText}>Simpler pricing for participants</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <Text style={styles.benefitText}>No additional tax calculations</Text>
              </View>
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
  toggleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  optionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: '#FCE4EC',
    borderColor: '#E91E63',
  },
  optionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  optionButtonTextSelected: {
    color: '#E91E63',
  },
  gstDetails: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
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
    letterSpacing: 1,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  gstRateCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
  },
  gstRateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 10,
  },
  gstRateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gstRateLabel: {
    fontSize: 14,
    color: '#333',
  },
  gstRateValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  gstRateNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  infoSection: {
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 14,
  },
  warningCard: {
    backgroundColor: '#FFF3E0',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  noGstCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  noGstTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  noGstText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  noGstBenefits: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#333',
  },
  bottomSpacing: {
    height: 40,
  },
});
