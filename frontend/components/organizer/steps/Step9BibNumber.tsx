import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventDraft, BibNumberRange } from '../../../types/organizer';

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
}

export default function Step9BibNumber({ eventDraft, updateEventDraft }: Props) {
  const { bibNumberRanges, tickets } = eventDraft;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRange, setNewRange] = useState<Partial<BibNumberRange>>({
    ticketId: '',
    prefix: '',
    startNumber: 1,
    endNumber: 999,
  });

  const addRange = () => {
    if (!newRange.ticketId) return;

    const range: BibNumberRange = {
      id: Date.now().toString(),
      ticketId: newRange.ticketId!,
      prefix: newRange.prefix || '',
      startNumber: newRange.startNumber || 1,
      endNumber: newRange.endNumber || 999,
    };

    updateEventDraft({
      bibNumberRanges: [...bibNumberRanges, range],
    });

    setNewRange({ ticketId: '', prefix: '', startNumber: 1, endNumber: 999 });
    setShowAddForm(false);
  };

  const removeRange = (id: string) => {
    updateEventDraft({
      bibNumberRanges: bibNumberRanges.filter(r => r.id !== id),
    });
  };

  const getTicketName = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    return ticket ? `${ticket.name} (${ticket.distance})` : 'Unknown';
  };

  const formatBibExample = (range: BibNumberRange) => {
    const prefix = range.prefix ? `${range.prefix}-` : '';
    return `${prefix}${String(range.startNumber).padStart(4, '0')}`;
  };

  const autoGenerateRanges = () => {
    let currentStart = 1;
    const ranges: BibNumberRange[] = tickets.map((ticket) => {
      const quantity = ticket.quantity || 100;
      const range: BibNumberRange = {
        id: `auto-${ticket.id}`,
        ticketId: ticket.id,
        prefix: ticket.distance?.replace(/[^A-Z0-9]/gi, '').substring(0, 2).toUpperCase() || '',
        startNumber: currentStart,
        endNumber: currentStart + quantity - 1,
      };
      currentStart += quantity;
      return range;
    });
    
    updateEventDraft({ bibNumberRanges: ranges });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="barcode-outline" size={28} color="#E91E63" />
          </View>
          <Text style={styles.title}>BIB Numbers</Text>
          <Text style={styles.subtitle}>
            Set up BIB number ranges for each category
          </Text>
        </View>

        {/* Auto Generate */}
        {bibNumberRanges.length === 0 && tickets.length > 0 && (
          <TouchableOpacity 
            style={styles.autoGenerateCard}
            onPress={autoGenerateRanges}
          >
            <View style={styles.autoGenerateIcon}>
              <Ionicons name="flash" size={24} color="#FF9800" />
            </View>
            <View style={styles.autoGenerateContent}>
              <Text style={styles.autoGenerateTitle}>Auto Generate</Text>
              <Text style={styles.autoGenerateText}>
                Automatically create BIB ranges based on ticket categories
              </Text>
            </View>
            <Ionicons name="sparkles" size={24} color="#E91E63" />
          </TouchableOpacity>
        )}

        {/* No Tickets Warning */}
        {tickets.length === 0 && (
          <View style={styles.warningCard}>
            <Ionicons name="alert-circle" size={24} color="#FF9800" />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>No Ticket Categories</Text>
              <Text style={styles.warningText}>
                Please create ticket categories first (Step 6) before setting up BIB numbers.
              </Text>
            </View>
          </View>
        )}

        {/* BIB Ranges List */}
        {bibNumberRanges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BIB Number Ranges</Text>
            {bibNumberRanges.map((range) => (
              <View key={range.id} style={styles.rangeCard}>
                <View style={styles.rangeHeader}>
                  <View style={styles.bibBadge}>
                    <Text style={styles.bibBadgeText}>
                      {formatBibExample(range)}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeRange(range.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FF5252" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.rangeCategoryName}>
                  {getTicketName(range.ticketId)}
                </Text>
                
                <View style={styles.rangeDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Prefix</Text>
                    <Text style={styles.detailValue}>
                      {range.prefix || '(none)'}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Range</Text>
                    <Text style={styles.detailValue}>
                      {range.startNumber} - {range.endNumber}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Total</Text>
                    <Text style={styles.detailValue}>
                      {range.endNumber - range.startNumber + 1}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Add Range */}
        {tickets.length > 0 && (
          <>
            {!showAddForm ? (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAddForm(true)}
              >
                <Ionicons name="add-circle" size={24} color="#E91E63" />
                <Text style={styles.addButtonText}>Add BIB Range</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.addForm}>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Add BIB Range</Text>
                  <TouchableOpacity onPress={() => setShowAddForm(false)}>
                    <Ionicons name="close" size={22} color="#666" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Ticket Category *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.categoryOptions}>
                      {tickets.map((ticket) => {
                        const isUsed = bibNumberRanges.some(r => r.ticketId === ticket.id);
                        return (
                          <TouchableOpacity
                            key={ticket.id}
                            style={[
                              styles.categoryOption,
                              newRange.ticketId === ticket.id && styles.categoryOptionSelected,
                              isUsed && styles.categoryOptionDisabled,
                            ]}
                            onPress={() => !isUsed && setNewRange({ ...newRange, ticketId: ticket.id })}
                            disabled={isUsed}
                          >
                            <Text style={[
                              styles.categoryOptionText,
                              newRange.ticketId === ticket.id && styles.categoryOptionTextSelected,
                              isUsed && styles.categoryOptionTextDisabled,
                            ]}>
                              {ticket.distance} {isUsed ? '✓' : ''}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Prefix (optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., FM for Full Marathon"
                    value={newRange.prefix}
                    onChangeText={(text) => setNewRange({ ...newRange, prefix: text.toUpperCase() })}
                    maxLength={3}
                    autoCapitalize="characters"
                  />
                  <Text style={styles.hint}>Max 3 characters. Appears before the number.</Text>
                </View>

                <View style={styles.rowInput}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Start Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="1"
                      keyboardType="numeric"
                      value={newRange.startNumber?.toString()}
                      onChangeText={(text) => setNewRange({ 
                        ...newRange, 
                        startNumber: parseInt(text) || 1 
                      })}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>End Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="999"
                      keyboardType="numeric"
                      value={newRange.endNumber?.toString()}
                      onChangeText={(text) => setNewRange({ 
                        ...newRange, 
                        endNumber: parseInt(text) || 999 
                      })}
                    />
                  </View>
                </View>

                {/* Preview */}
                {newRange.ticketId && (
                  <View style={styles.previewBox}>
                    <Text style={styles.previewLabel}>BIB Preview</Text>
                    <View style={styles.previewBib}>
                      <Text style={styles.previewBibText}>
                        {newRange.prefix ? `${newRange.prefix}-` : ''}
                        {String(newRange.startNumber || 1).padStart(4, '0')}
                      </Text>
                    </View>
                  </View>
                )}

                <TouchableOpacity 
                  style={[
                    styles.saveButton,
                    !newRange.ticketId && styles.saveButtonDisabled,
                  ]}
                  onPress={addRange}
                  disabled={!newRange.ticketId}
                >
                  <Text style={styles.saveButtonText}>Add Range</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#2196F3" />
          <Text style={styles.infoText}>
            BIB numbers help identify participants during the race. Each category should have a unique range to avoid duplicates.
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
  autoGenerateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  autoGenerateIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFE082',
    justifyContent: 'center',
    alignItems: 'center',
  },
  autoGenerateContent: {
    flex: 1,
  },
  autoGenerateTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  autoGenerateText: {
    fontSize: 13,
    color: '#666',
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 2,
  },
  warningText: {
    fontSize: 13,
    color: '#666',
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
  rangeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rangeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bibBadge: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bibBadgeText: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeCategoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  rangeDetails: {
    flexDirection: 'row',
    gap: 20,
  },
  detailItem: {},
  detailLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
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
  rowInput: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  categoryOptionSelected: {
    backgroundColor: '#FCE4EC',
  },
  categoryOptionDisabled: {
    backgroundColor: '#E8F5E9',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryOptionTextSelected: {
    color: '#E91E63',
  },
  categoryOptionTextDisabled: {
    color: '#4CAF50',
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
  previewBib: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1a1a2e',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  previewBibText: {
    fontFamily: 'monospace',
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: 2,
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 14,
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
});
