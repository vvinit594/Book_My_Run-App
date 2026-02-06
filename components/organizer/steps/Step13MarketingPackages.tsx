import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventDraft } from '../../../types/organizer';

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
  onSaveDraft?: () => void;
}

const MARKETING_PACKAGES = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Basic event listing',
      'Standard search visibility',
      'Event page with details',
    ],
    recommended: false,
  },
  {
    id: 'boost',
    name: 'Boost',
    price: 2999,
    features: [
      'Everything in Free',
      'Featured in "Upcoming Events"',
      'Priority in search results',
      'Social media mention',
    ],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9999,
    features: [
      'Everything in Boost',
      'Homepage banner placement',
      'Email newsletter feature',
      'Dedicated social media post',
      'Priority customer support',
    ],
    recommended: false,
  },
];

export default function Step13MarketingPackages({ eventDraft, updateEventDraft, onSaveDraft }: Props) {
  const { marketing, basics } = eventDraft;

  const updateMarketing = (updates: Partial<typeof marketing>) => {
    updateEventDraft({
      marketing: { ...marketing, ...updates },
    });
  };

  const selectPackage = (packageId: string) => {
    updateMarketing({ selectedPackage: packageId });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="megaphone-outline" size={28} color="#E91E63" />
          </View>
          <Text style={styles.title}>Marketing & Promotion</Text>
          <Text style={styles.subtitle}>
            Choose a package to boost your event's visibility
          </Text>
        </View>

        {/* Event Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Your Event</Text>
          <Text style={styles.summaryTitle}>
            {basics.eventName || 'Your Running Event'}
          </Text>
          <View style={styles.summaryMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={14} color="#666" />
              <Text style={styles.metaText}>{basics.startDate || 'Date TBD'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="ribbon" size={14} color="#666" />
              <Text style={styles.metaText}>{basics.eventType}</Text>
            </View>
          </View>
        </View>

        {/* Marketing Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a Package</Text>
          
          {MARKETING_PACKAGES.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              style={[
                styles.packageCard,
                marketing.selectedPackage === pkg.id && styles.packageCardSelected,
                pkg.recommended && styles.packageCardRecommended,
              ]}
              onPress={() => selectPackage(pkg.id)}
            >
              {pkg.recommended && (
                <View style={styles.recommendedBadge}>
                  <Ionicons name="star" size={12} color="#fff" />
                  <Text style={styles.recommendedText}>Recommended</Text>
                </View>
              )}
              
              <View style={styles.packageHeader}>
                <View>
                  <Text style={styles.packageName}>{pkg.name}</Text>
                  <Text style={styles.packagePrice}>
                    {pkg.price === 0 ? 'Free' : `₹${pkg.price.toLocaleString()}`}
                  </Text>
                </View>
                <View style={[
                  styles.radioOuter,
                  marketing.selectedPackage === pkg.id && styles.radioOuterSelected,
                ]}>
                  {marketing.selectedPackage === pkg.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
              
              <View style={styles.packageFeatures}>
                {pkg.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons 
                      name="checkmark-circle" 
                      size={16} 
                      color={marketing.selectedPackage === pkg.id ? '#E91E63' : '#4CAF50'} 
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Final Summary */}
        <View style={styles.finalSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel2}>Selected Package</Text>
            <Text style={styles.summaryValue}>
              {MARKETING_PACKAGES.find(p => p.id === marketing.selectedPackage)?.name || 'Free'}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Marketing Cost</Text>
            <Text style={styles.totalValue}>
              ₹{(MARKETING_PACKAGES.find(p => p.id === marketing.selectedPackage)?.price || 0).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Ready to Publish */}
        <View style={styles.readyCard}>
          <View style={styles.readyIcon}>
            <Ionicons name="rocket" size={32} color="#4CAF50" />
          </View>
          <Text style={styles.readyTitle}>Almost There! 🎉</Text>
          <Text style={styles.readyText}>
            Your event is ready to go live. Click "Go Live" below to publish your event and start accepting registrations.
          </Text>
          
          <View style={styles.checklist}>
            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.checkText}>Event details complete</Text>
            </View>
            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.checkText}>Tickets configured</Text>
            </View>
            <View style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.checkText}>Email settings ready</Text>
            </View>
          </View>
        </View>

        {/* Save Draft Option */}
        <View style={styles.draftOption}>
          <Ionicons name="document-outline" size={20} color="#666" />
          <Text style={styles.draftText}>
            Not ready? You can save as draft and publish later.
          </Text>
        </View>

        {/* Save Draft Button */}
        <TouchableOpacity 
          style={styles.saveDraftButton}
          onPress={onSaveDraft}
          activeOpacity={0.7}
        >
          <Ionicons name="save-outline" size={18} color="#E91E63" />
          <Text style={styles.saveDraftButtonText}>Save Draft</Text>
        </TouchableOpacity>

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
  summaryCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  summaryMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#aaa',
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
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  packageCardSelected: {
    borderColor: '#E91E63',
    backgroundColor: '#FFF5F8',
  },
  packageCardRecommended: {
    borderColor: '#FF9800',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF9800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  packageName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  packagePrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#E91E63',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E91E63',
  },
  packageFeatures: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#666',
  },
  finalSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel2: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginBottom: 0,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E91E63',
  },
  readyCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  readyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  readyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
  },
  readyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  checklist: {
    alignSelf: 'stretch',
    gap: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    fontSize: 14,
    color: '#333',
  },
  draftOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
  },
  draftText: {
    fontSize: 13,
    color: '#666',
  },
  saveDraftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderColor: '#E91E63',
    borderRadius: 24,
    backgroundColor: '#FFF5F8',
    alignSelf: 'center',
    marginTop: 4,
  },
  saveDraftButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E91E63',
  },
  bottomSpacing: {
    height: 40,
  },
});
