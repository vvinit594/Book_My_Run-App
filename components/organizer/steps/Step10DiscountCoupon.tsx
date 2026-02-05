import React, { useState } from 'react';
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
import { EventDraft, DiscountCoupon } from '../../../types/organizer';

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
}

export default function Step10DiscountCoupon({ eventDraft, updateEventDraft }: Props) {
  const { discountCoupons } = eventDraft;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<DiscountCoupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    maxUses: 100,
    usedCount: 0,
    isActive: true,
  });

  const addCoupon = () => {
    if (!newCoupon.code?.trim()) return;

    const coupon: DiscountCoupon = {
      id: Date.now().toString(),
      code: newCoupon.code!.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      discountType: newCoupon.discountType || 'percentage',
      discountValue: newCoupon.discountValue || 10,
      maxUses: newCoupon.maxUses,
      usedCount: 0,
      validFrom: newCoupon.validFrom,
      validUntil: newCoupon.validUntil,
      minPurchaseAmount: newCoupon.minPurchaseAmount,
      isActive: true,
    };

    updateEventDraft({
      discountCoupons: [...discountCoupons, coupon],
    });

    setNewCoupon({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      maxUses: 100,
      usedCount: 0,
      isActive: true,
    });
    setShowAddForm(false);
  };

  const removeCoupon = (id: string) => {
    updateEventDraft({
      discountCoupons: discountCoupons.filter(c => c.id !== id),
    });
  };

  const toggleCouponStatus = (id: string) => {
    updateEventDraft({
      discountCoupons: discountCoupons.map(c =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      ),
    });
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCoupon({ ...newCoupon, code });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="pricetag-outline" size={28} color="#E91E63" />
          </View>
          <Text style={styles.title}>Discount Coupons</Text>
          <Text style={styles.subtitle}>
            Create promotional codes for your event
          </Text>
        </View>

        {/* Coupons List */}
        {discountCoupons.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Active Coupons ({discountCoupons.filter(c => c.isActive).length})
            </Text>
            {discountCoupons.map((coupon) => (
              <View key={coupon.id} style={[
                styles.couponCard,
                !coupon.isActive && styles.couponCardInactive,
              ]}>
                <View style={styles.couponHeader}>
                  <View style={styles.couponCodeBadge}>
                    <Text style={styles.couponCode}>{coupon.code}</Text>
                  </View>
                  <View style={styles.couponActions}>
                    <Switch
                      value={coupon.isActive}
                      onValueChange={() => toggleCouponStatus(coupon.id)}
                      trackColor={{ false: '#e0e0e0', true: '#FCE4EC' }}
                      thumbColor={coupon.isActive ? '#E91E63' : '#f4f3f4'}
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeCoupon(coupon.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#FF5252" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.discountBadge}>
                  <Text style={styles.discountValue}>
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discountValue}% OFF`
                      : `₹${coupon.discountValue} OFF`
                    }
                  </Text>
                </View>
                
                <View style={styles.couponDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="ticket-outline" size={14} color="#666" />
                    <Text style={styles.detailText}>
                      {coupon.usedCount}/{coupon.maxUses || '∞'} used
                    </Text>
                  </View>
                  {coupon.minPurchaseAmount && (
                    <View style={styles.detailItem}>
                      <Ionicons name="cart-outline" size={14} color="#666" />
                      <Text style={styles.detailText}>
                        Min ₹{coupon.minPurchaseAmount}
                      </Text>
                    </View>
                  )}
                </View>

                {!coupon.isActive && (
                  <View style={styles.inactiveBadge}>
                    <Text style={styles.inactiveText}>Paused</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {discountCoupons.length === 0 && !showAddForm && (
          <View style={styles.emptyState}>
            <Ionicons name="pricetag-outline" size={48} color="#ddd" />
            <Text style={styles.emptyTitle}>No coupons yet</Text>
            <Text style={styles.emptyText}>
              Create discount codes to attract more participants
            </Text>
          </View>
        )}

        {/* Add Coupon */}
        {!showAddForm ? (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Ionicons name="add-circle" size={24} color="#E91E63" />
            <Text style={styles.addButtonText}>Create Coupon</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.addForm}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Create Coupon</Text>
              <TouchableOpacity onPress={() => setShowAddForm(false)}>
                <Ionicons name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Coupon Code *</Text>
              <View style={styles.codeInputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="e.g., EARLYBIRD20"
                  value={newCoupon.code}
                  onChangeText={(text) => setNewCoupon({ 
                    ...newCoupon, 
                    code: text.toUpperCase().replace(/[^A-Z0-9]/g, '') 
                  })}
                  autoCapitalize="characters"
                  maxLength={12}
                />
                <TouchableOpacity 
                  style={styles.generateButton}
                  onPress={generateRandomCode}
                >
                  <Ionicons name="shuffle" size={20} color="#E91E63" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Discount Type</Text>
              <View style={styles.typeOptions}>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    newCoupon.discountType === 'percentage' && styles.typeOptionSelected,
                  ]}
                  onPress={() => setNewCoupon({ ...newCoupon, discountType: 'percentage' })}
                >
                  <Ionicons 
                    name="trending-down" 
                    size={20} 
                    color={newCoupon.discountType === 'percentage' ? '#E91E63' : '#666'} 
                  />
                  <Text style={[
                    styles.typeOptionText,
                    newCoupon.discountType === 'percentage' && styles.typeOptionTextSelected,
                  ]}>
                    Percentage (%)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    newCoupon.discountType === 'flat' && styles.typeOptionSelected,
                  ]}
                  onPress={() => setNewCoupon({ ...newCoupon, discountType: 'flat' })}
                >
                  <Ionicons 
                    name="cash-outline" 
                    size={20} 
                    color={newCoupon.discountType === 'flat' ? '#E91E63' : '#666'} 
                  />
                  <Text style={[
                    styles.typeOptionText,
                    newCoupon.discountType === 'flat' && styles.typeOptionTextSelected,
                  ]}>
                    Flat Amount (₹)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.rowInput}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>
                  Discount {newCoupon.discountType === 'percentage' ? '(%)' : '(₹)'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={newCoupon.discountType === 'percentage' ? '10' : '500'}
                  keyboardType="numeric"
                  value={newCoupon.discountValue?.toString()}
                  onChangeText={(text) => setNewCoupon({ 
                    ...newCoupon, 
                    discountValue: parseInt(text) || 0 
                  })}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Max Uses</Text>
                <TextInput
                  style={styles.input}
                  placeholder="100 (leave blank for unlimited)"
                  keyboardType="numeric"
                  value={newCoupon.maxUses?.toString()}
                  onChangeText={(text) => setNewCoupon({ 
                    ...newCoupon, 
                    maxUses: parseInt(text) || undefined 
                  })}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Minimum Purchase (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 1000"
                keyboardType="numeric"
                value={newCoupon.minPurchaseAmount?.toString()}
                onChangeText={(text) => setNewCoupon({ 
                  ...newCoupon, 
                  minPurchaseAmount: parseInt(text) || undefined 
                })}
              />
              <Text style={styles.hint}>
                Coupon will only apply if cart total is above this amount
              </Text>
            </View>

            {/* Preview */}
            {newCoupon.code && (
              <View style={styles.previewBox}>
                <Text style={styles.previewLabel}>Preview</Text>
                <View style={styles.previewCoupon}>
                  <Text style={styles.previewCode}>{newCoupon.code}</Text>
                  <Text style={styles.previewDiscount}>
                    {newCoupon.discountType === 'percentage'
                      ? `${newCoupon.discountValue}% OFF`
                      : `₹${newCoupon.discountValue} OFF`
                    }
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={[
                styles.saveButton,
                !newCoupon.code?.trim() && styles.saveButtonDisabled,
              ]}
              onPress={addCoupon}
              disabled={!newCoupon.code?.trim()}
            >
              <Text style={styles.saveButtonText}>Create Coupon</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Promotion Tips</Text>
          <Text style={styles.tipText}>
            • Use memorable codes like "RUN2025" or "FIRST100"{'\n'}
            • Early bird discounts create urgency{'\n'}
            • Share codes on social media for reach
          </Text>
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  couponCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  couponCardInactive: {
    opacity: 0.6,
    backgroundColor: '#fafafa',
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  couponCodeBadge: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    borderStyle: 'dashed',
  },
  couponCode: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  couponActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },
  couponDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  inactiveBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ffebee',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inactiveText: {
    fontSize: 10,
    color: '#f44336',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 2,
    borderColor: '#E91E63',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E91E63',
  },
  addForm: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
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
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  codeInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  generateButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FCE4EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowInput: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  typeOptionSelected: {
    backgroundColor: '#FCE4EC',
  },
  typeOptionText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  typeOptionTextSelected: {
    color: '#E91E63',
  },
  previewBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  previewCoupon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  previewCode: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  previewDiscount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  saveButton: {
    backgroundColor: '#E91E63',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  tipsCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F57C00',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});
