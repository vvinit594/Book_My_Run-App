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
import { EventDraft, AgeCategory } from '../../../types/organizer';

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
}

const GENDER_OPTIONS = ['Male', 'Female', 'All'];

const PRESET_CATEGORIES: Omit<AgeCategory, 'id'>[] = [
  { name: 'Junior', minAge: 15, maxAge: 18, gender: 'All' },
  { name: 'Open', minAge: 19, maxAge: 39, gender: 'All' },
  { name: 'Masters', minAge: 40, maxAge: 49, gender: 'All' },
  { name: 'Veterans', minAge: 50, maxAge: 59, gender: 'All' },
  { name: 'Super Veterans', minAge: 60, maxAge: 100, gender: 'All' },
];

export default function Step8AgeCategory({ eventDraft, updateEventDraft }: Props) {
  const { ageCategories } = eventDraft;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<AgeCategory>>({
    name: '',
    minAge: 18,
    maxAge: 40,
    gender: 'All',
  });

  const addCategory = () => {
    if (!newCategory.name?.trim()) return;

    const category: AgeCategory = {
      id: Date.now().toString(),
      name: newCategory.name!,
      minAge: newCategory.minAge || 18,
      maxAge: newCategory.maxAge || 100,
      gender: newCategory.gender || 'All',
    };

    updateEventDraft({
      ageCategories: [...ageCategories, category],
    });

    setNewCategory({ name: '', minAge: 18, maxAge: 40, gender: 'All' });
    setShowAddForm(false);
  };

  const addPresetCategories = () => {
    const categories: AgeCategory[] = PRESET_CATEGORIES.map((cat, index) => ({
      ...cat,
      id: `preset-${Date.now()}-${index}`,
    }));
    updateEventDraft({
      ageCategories: [...ageCategories, ...categories],
    });
  };

  const removeCategory = (id: string) => {
    updateEventDraft({
      ageCategories: ageCategories.filter(c => c.id !== id),
    });
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'Male': return 'male';
      case 'Female': return 'female';
      default: return 'people';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="people-outline" size={28} color="#E91E63" />
          </View>
          <Text style={styles.title}>Age Categories</Text>
          <Text style={styles.subtitle}>
            Define categories for prizes and results
          </Text>
        </View>

        {/* Quick Setup */}
        {ageCategories.length === 0 && (
          <TouchableOpacity 
            style={styles.quickSetupCard}
            onPress={addPresetCategories}
          >
            <View style={styles.quickSetupIcon}>
              <Ionicons name="flash" size={24} color="#FF9800" />
            </View>
            <View style={styles.quickSetupContent}>
              <Text style={styles.quickSetupTitle}>Quick Setup</Text>
              <Text style={styles.quickSetupText}>
                Add standard age categories (Junior, Open, Masters, etc.)
              </Text>
            </View>
            <Ionicons name="add-circle" size={28} color="#E91E63" />
          </TouchableOpacity>
        )}

        {/* Categories List */}
        {ageCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Categories ({ageCategories.length})
            </Text>
            {ageCategories.map((category) => (
              <View key={category.id} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryIcon}>
                    <Ionicons 
                      name={getGenderIcon(category.gender || 'All')} 
                      size={18} 
                      color="#E91E63" 
                    />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeCategory(category.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FF5252" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.categoryDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Age Range</Text>
                    <Text style={styles.detailValue}>
                      {category.minAge} - {category.maxAge} years
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Gender</Text>
                    <Text style={styles.detailValue}>{category.gender}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Add Category */}
        {!showAddForm ? (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Ionicons name="add-circle" size={24} color="#E91E63" />
            <Text style={styles.addButtonText}>Add Custom Category</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.addForm}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Add Category</Text>
              <TouchableOpacity onPress={() => setShowAddForm(false)}>
                <Ionicons name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Senior Citizens"
                value={newCategory.name}
                onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
              />
            </View>

            <View style={styles.rowInput}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Min Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="18"
                  keyboardType="numeric"
                  value={newCategory.minAge?.toString()}
                  onChangeText={(text) => setNewCategory({ 
                    ...newCategory, 
                    minAge: parseInt(text) || 0 
                  })}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Max Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="40"
                  keyboardType="numeric"
                  value={newCategory.maxAge?.toString()}
                  onChangeText={(text) => setNewCategory({ 
                    ...newCategory, 
                    maxAge: parseInt(text) || 0 
                  })}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderOptions}>
                {GENDER_OPTIONS.map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderOption,
                      newCategory.gender === gender && styles.genderOptionSelected,
                    ]}
                    onPress={() => setNewCategory({ ...newCategory, gender })}
                  >
                    <Ionicons 
                      name={getGenderIcon(gender)} 
                      size={18} 
                      color={newCategory.gender === gender ? '#E91E63' : '#666'} 
                    />
                    <Text style={[
                      styles.genderOptionText,
                      newCategory.gender === gender && styles.genderOptionTextSelected,
                    ]}>
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={[
                styles.saveButton,
                !newCategory.name?.trim() && styles.saveButtonDisabled,
              ]}
              onPress={addCategory}
              disabled={!newCategory.name?.trim()}
            >
              <Text style={styles.saveButtonText}>Add Category</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#2196F3" />
          <Text style={styles.infoText}>
            Age categories help organize results and prizes. Participants will be grouped based on their age on race day.
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
  quickSetupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  quickSetupIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFE082',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickSetupContent: {
    flex: 1,
  },
  quickSetupTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  quickSetupText: {
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
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FCE4EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryDetails: {
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
  genderOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  genderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  genderOptionSelected: {
    backgroundColor: '#FCE4EC',
  },
  genderOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  genderOptionTextSelected: {
    color: '#E91E63',
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
