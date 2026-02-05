import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventDraft, EventTicket } from '../../../types/organizer';

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
}

const DISTANCE_OPTIONS = ['5K', '10K', '21.1K (Half)', '42.2K (Full)', 'Custom'];

export default function Step6Tickets({ eventDraft, updateEventDraft }: Props) {
  const { tickets } = eventDraft;
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<EventTicket | null>(null);
  const [ticketForm, setTicketForm] = useState<Partial<EventTicket>>({
    name: '',
    distance: '',
    price: 0,
    quantity: 100,
    description: '',
    earlyBirdPrice: undefined,
    earlyBirdEndDate: undefined,
  });

  const openAddModal = () => {
    setTicketForm({
      name: '',
      distance: '',
      price: 0,
      quantity: 100,
      description: '',
    });
    setEditingTicket(null);
    setShowAddModal(true);
  };

  const openEditModal = (ticket: EventTicket) => {
    setTicketForm(ticket);
    setEditingTicket(ticket);
    setShowAddModal(true);
  };

  const saveTicket = () => {
    if (!ticketForm.name || !ticketForm.distance || !ticketForm.price) return;

    const newTicket: EventTicket = {
      id: editingTicket?.id || Date.now().toString(),
      name: ticketForm.name!,
      distance: ticketForm.distance!,
      price: ticketForm.price!,
      quantity: ticketForm.quantity || 100,
      soldCount: editingTicket?.soldCount || 0,
      description: ticketForm.description,
      earlyBirdPrice: ticketForm.earlyBirdPrice,
      earlyBirdEndDate: ticketForm.earlyBirdEndDate,
      isActive: true,
    };

    if (editingTicket) {
      updateEventDraft({
        tickets: tickets.map(t => t.id === editingTicket.id ? newTicket : t),
      });
    } else {
      updateEventDraft({
        tickets: [...tickets, newTicket],
      });
    }
    setShowAddModal(false);
  };

  const deleteTicket = (id: string) => {
    updateEventDraft({
      tickets: tickets.filter(t => t.id !== id),
    });
  };

  const toggleTicketStatus = (id: string) => {
    updateEventDraft({
      tickets: tickets.map(t => 
        t.id === id ? { ...t, isActive: !t.isActive } : t
      ),
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="ticket-outline" size={28} color="#E91E63" />
            </View>
            <Text style={styles.title}>Ticket Categories</Text>
            <Text style={styles.subtitle}>
              Create tickets for different race distances
            </Text>
          </View>

          {/* Tickets List */}
          {tickets.length > 0 ? (
            <View style={styles.ticketsList}>
              {tickets.map((ticket) => (
                <View key={ticket.id} style={[
                  styles.ticketCard,
                  !ticket.isActive && styles.ticketCardInactive,
                ]}>
                  <View style={styles.ticketHeader}>
                    <View style={styles.ticketBadge}>
                      <Text style={styles.ticketDistance}>{ticket.distance}</Text>
                    </View>
                    <View style={styles.ticketActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => toggleTicketStatus(ticket.id)}
                      >
                        <Ionicons 
                          name={ticket.isActive ? "eye" : "eye-off"} 
                          size={18} 
                          color={ticket.isActive ? "#4CAF50" : "#999"} 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => openEditModal(ticket)}
                      >
                        <Ionicons name="pencil" size={18} color="#2196F3" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => deleteTicket(ticket.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#FF5252" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <Text style={styles.ticketName}>{ticket.name}</Text>
                  
                  <View style={styles.ticketPriceRow}>
                    <View>
                      <Text style={styles.ticketPriceLabel}>Price</Text>
                      <Text style={styles.ticketPrice}>₹{ticket.price.toLocaleString()}</Text>
                    </View>
                    {ticket.earlyBirdPrice && (
                      <View style={styles.earlyBirdBadge}>
                        <Ionicons name="flash" size={12} color="#FF9800" />
                        <Text style={styles.earlyBirdText}>
                          Early Bird: ₹{ticket.earlyBirdPrice.toLocaleString()}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.ticketMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="people-outline" size={14} color="#666" />
                      <Text style={styles.metaText}>
                        {ticket.soldCount}/{ticket.quantity} sold
                      </Text>
                    </View>
                    {!ticket.isActive && (
                      <View style={styles.inactiveBadge}>
                        <Text style={styles.inactiveText}>Paused</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="ticket-outline" size={48} color="#ddd" />
              <Text style={styles.emptyTitle}>No tickets yet</Text>
              <Text style={styles.emptyText}>
                Add ticket categories for your event
              </Text>
            </View>
          )}

          {/* Add Ticket Button */}
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <Ionicons name="add-circle" size={24} color="#E91E63" />
            <Text style={styles.addButtonText}>Add Ticket Category</Text>
          </TouchableOpacity>

          {/* Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Pricing Tips</Text>
            <Text style={styles.tipText}>
              • Early bird pricing increases urgency and early sign-ups{'\n'}
              • Create multiple distance options for wider appeal{'\n'}
              • Include T-shirt, medal, and refreshments in price
            </Text>
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Add/Edit Ticket Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTicket ? 'Edit Ticket' : 'Add Ticket'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ticket Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 10K Run Category"
                  value={ticketForm.name}
                  onChangeText={(text) => setTicketForm({ ...ticketForm, name: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Distance *</Text>
                <View style={styles.distanceOptions}>
                  {DISTANCE_OPTIONS.map((dist) => (
                    <TouchableOpacity
                      key={dist}
                      style={[
                        styles.distanceChip,
                        ticketForm.distance === dist && styles.distanceChipSelected,
                      ]}
                      onPress={() => setTicketForm({ ...ticketForm, distance: dist })}
                    >
                      <Text style={[
                        styles.distanceChipText,
                        ticketForm.distance === dist && styles.distanceChipTextSelected,
                      ]}>
                        {dist}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.rowInput}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Price (₹) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1500"
                    keyboardType="numeric"
                    value={ticketForm.price?.toString()}
                    onChangeText={(text) => setTicketForm({ 
                      ...ticketForm, 
                      price: parseInt(text) || 0 
                    })}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Quantity *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="100"
                    keyboardType="numeric"
                    value={ticketForm.quantity?.toString()}
                    onChangeText={(text) => setTicketForm({ 
                      ...ticketForm, 
                      quantity: parseInt(text) || 0 
                    })}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, { minHeight: 80 }]}
                  placeholder="What's included? T-shirt, medal, refreshments..."
                  multiline
                  value={ticketForm.description}
                  onChangeText={(text) => setTicketForm({ ...ticketForm, description: text })}
                />
              </View>

              <View style={styles.earlyBirdSection}>
                <Text style={styles.earlyBirdTitle}>Early Bird Pricing (Optional)</Text>
                <View style={styles.rowInput}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Early Bird Price</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="1200"
                      keyboardType="numeric"
                      value={ticketForm.earlyBirdPrice?.toString()}
                      onChangeText={(text) => setTicketForm({ 
                        ...ticketForm, 
                        earlyBirdPrice: parseInt(text) || undefined 
                      })}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Valid Until</Text>
                    <TouchableOpacity style={styles.datePickerButton}>
                      <Text style={styles.datePickerText}>
                        {ticketForm.earlyBirdEndDate || 'Select date'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.saveButton,
                  (!ticketForm.name || !ticketForm.distance || !ticketForm.price) && styles.saveButtonDisabled,
                ]}
                onPress={saveTicket}
                disabled={!ticketForm.name || !ticketForm.distance || !ticketForm.price}
              >
                <Text style={styles.saveButtonText}>
                  {editingTicket ? 'Update' : 'Add Ticket'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  ticketsList: {
    gap: 12,
    marginBottom: 16,
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ticketCardInactive: {
    opacity: 0.6,
    backgroundColor: '#fafafa',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ticketBadge: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ticketDistance: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  ticketActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  ticketPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ticketPriceLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  ticketPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  earlyBirdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  earlyBirdText: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: '600',
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  inactiveBadge: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inactiveText: {
    fontSize: 11,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
  distanceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  distanceChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  distanceChipSelected: {
    backgroundColor: '#E91E63',
  },
  distanceChipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  distanceChipTextSelected: {
    color: '#fff',
  },
  earlyBirdSection: {
    backgroundColor: '#FFF8E1',
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  earlyBirdTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F57C00',
    marginBottom: 12,
  },
  datePickerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  datePickerText: {
    fontSize: 14,
    color: '#999',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#E91E63',
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
});
