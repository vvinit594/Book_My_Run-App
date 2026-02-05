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
import { EventDraft, RegistrationQuestion } from '../../../types/organizer';

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
}

const QUESTION_TYPES: Array<{ type: RegistrationQuestion['type']; label: string; icon: string }> = [
  { type: 'text', label: 'Short Text', icon: 'text-outline' },
  { type: 'textarea', label: 'Long Text', icon: 'document-text-outline' },
  { type: 'select', label: 'Dropdown', icon: 'chevron-down-circle-outline' },
  { type: 'radio', label: 'Single Choice', icon: 'radio-button-on-outline' },
  { type: 'checkbox', label: 'Multiple Choice', icon: 'checkbox-outline' },
];

const PRESET_QUESTIONS = [
  { label: 'T-Shirt Size', question: 'What is your T-Shirt size?', type: 'select' as const, options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { label: 'Blood Group', question: 'What is your blood group?', type: 'select' as const, options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  { label: 'Emergency Contact', question: 'Emergency contact name and number', type: 'text' as const },
  { label: 'Medical Conditions', question: 'Do you have any medical conditions we should know about?', type: 'textarea' as const },
  { label: 'Running Experience', question: 'What is your running experience?', type: 'radio' as const, options: ['Beginner', 'Intermediate', 'Advanced', 'Professional'] },
];

export default function Step7RegistrationQuestions({ eventDraft, updateEventDraft }: Props) {
  const { registrationQuestions } = eventDraft;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<RegistrationQuestion>>({
    question: '',
    type: 'text',
    isRequired: false,
    options: [],
  });
  const [newOption, setNewOption] = useState('');

  const addPresetQuestion = (preset: typeof PRESET_QUESTIONS[0]) => {
    const question: RegistrationQuestion = {
      id: Date.now().toString(),
      question: preset.question,
      type: preset.type,
      isRequired: false,
      options: preset.options,
      order: registrationQuestions.length,
    };
    updateEventDraft({
      registrationQuestions: [...registrationQuestions, question],
    });
  };

  const addCustomQuestion = () => {
    if (!newQuestion.question?.trim()) return;

    const question: RegistrationQuestion = {
      id: Date.now().toString(),
      question: newQuestion.question!,
      type: newQuestion.type || 'text',
      isRequired: newQuestion.isRequired || false,
      options: newQuestion.options,
      order: registrationQuestions.length,
    };

    updateEventDraft({
      registrationQuestions: [...registrationQuestions, question],
    });

    setNewQuestion({ question: '', type: 'text', isRequired: false, options: [] });
    setShowAddForm(false);
  };

  const removeQuestion = (id: string) => {
    updateEventDraft({
      registrationQuestions: registrationQuestions.filter(q => q.id !== id),
    });
  };

  const toggleRequired = (id: string) => {
    updateEventDraft({
      registrationQuestions: registrationQuestions.map(q =>
        q.id === id ? { ...q, isRequired: !q.isRequired } : q
      ),
    });
  };

  const addOption = () => {
    if (newOption.trim()) {
      setNewQuestion({
        ...newQuestion,
        options: [...(newQuestion.options || []), newOption.trim()],
      });
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    setNewQuestion({
      ...newQuestion,
      options: newQuestion.options?.filter((_, i) => i !== index),
    });
  };

  const needsOptions = ['select', 'radio', 'checkbox'].includes(newQuestion.type || '');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="help-circle-outline" size={28} color="#E91E63" />
          </View>
          <Text style={styles.title}>Registration Questions</Text>
          <Text style={styles.subtitle}>
            Collect additional info from participants
          </Text>
        </View>

        {/* Quick Add Presets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.presetGrid}>
            {PRESET_QUESTIONS.map((preset, index) => {
              const isAdded = registrationQuestions.some(
                q => q.question === preset.question
              );
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.presetButton, isAdded && styles.presetButtonAdded]}
                  onPress={() => !isAdded && addPresetQuestion(preset)}
                  disabled={isAdded}
                >
                  <Text style={[
                    styles.presetButtonText,
                    isAdded && styles.presetButtonTextAdded,
                  ]}>
                    {isAdded ? '✓ ' : '+ '}{preset.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Questions List */}
        {registrationQuestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Your Questions ({registrationQuestions.length})
            </Text>
            {registrationQuestions.map((q, index) => (
              <View key={q.id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <View style={styles.questionNumber}>
                    <Text style={styles.questionNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.questionTypeBadge}>
                    <Text style={styles.questionTypeText}>{q.type}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeQuestion(q.id)}
                  >
                    <Ionicons name="close" size={18} color="#FF5252" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.questionText}>{q.question}</Text>
                
                {q.options && q.options.length > 0 && (
                  <View style={styles.optionsList}>
                    {q.options.map((opt, i) => (
                      <View key={i} style={styles.optionChip}>
                        <Text style={styles.optionChipText}>{opt}</Text>
                      </View>
                    ))}
                  </View>
                )}
                
                <View style={styles.questionFooter}>
                  <Text style={styles.requiredLabel}>Required</Text>
                  <Switch
                    value={q.isRequired}
                    onValueChange={() => toggleRequired(q.id)}
                    trackColor={{ false: '#e0e0e0', true: '#FCE4EC' }}
                    thumbColor={q.isRequired ? '#E91E63' : '#f4f3f4'}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Add Custom Question */}
        {!showAddForm ? (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Ionicons name="add-circle" size={24} color="#E91E63" />
            <Text style={styles.addButtonText}>Add Custom Question</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.addForm}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Add Custom Question</Text>
              <TouchableOpacity onPress={() => setShowAddForm(false)}>
                <Ionicons name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Question *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your question"
                value={newQuestion.question}
                onChangeText={(text) => setNewQuestion({ ...newQuestion, question: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Question Type</Text>
              <View style={styles.typeOptions}>
                {QUESTION_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.type}
                    style={[
                      styles.typeOption,
                      newQuestion.type === type.type && styles.typeOptionSelected,
                    ]}
                    onPress={() => setNewQuestion({ ...newQuestion, type: type.type })}
                  >
                    <Ionicons 
                      name={type.icon as any} 
                      size={18} 
                      color={newQuestion.type === type.type ? '#E91E63' : '#666'} 
                    />
                    <Text style={[
                      styles.typeOptionText,
                      newQuestion.type === type.type && styles.typeOptionTextSelected,
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {needsOptions && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Options</Text>
                <View style={styles.optionsInput}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Add an option"
                    value={newOption}
                    onChangeText={setNewOption}
                  />
                  <TouchableOpacity style={styles.addOptionButton} onPress={addOption}>
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                {newQuestion.options && newQuestion.options.length > 0 && (
                  <View style={styles.optionChips}>
                    {newQuestion.options.map((opt, i) => (
                      <View key={i} style={styles.editableOptionChip}>
                        <Text style={styles.optionChipText}>{opt}</Text>
                        <TouchableOpacity onPress={() => removeOption(i)}>
                          <Ionicons name="close-circle" size={16} color="#999" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            <View style={styles.requiredToggle}>
              <Text style={styles.label}>Make this required?</Text>
              <Switch
                value={newQuestion.isRequired}
                onValueChange={(value) => setNewQuestion({ ...newQuestion, isRequired: value })}
                trackColor={{ false: '#e0e0e0', true: '#FCE4EC' }}
                thumbColor={newQuestion.isRequired ? '#E91E63' : '#f4f3f4'}
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.saveButton,
                !newQuestion.question?.trim() && styles.saveButtonDisabled,
              ]}
              onPress={addCustomQuestion}
              disabled={!newQuestion.question?.trim()}
            >
              <Text style={styles.saveButtonText}>Add Question</Text>
            </TouchableOpacity>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  presetButtonAdded: {
    backgroundColor: '#FCE4EC',
    borderColor: '#FCE4EC',
  },
  presetButtonText: {
    fontSize: 13,
    color: '#E91E63',
    fontWeight: '500',
  },
  presetButtonTextAdded: {
    color: '#999',
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  questionNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  questionTypeBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 'auto',
  },
  questionTypeText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  optionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  optionChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  optionChipText: {
    fontSize: 12,
    color: '#666',
  },
  questionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  requiredLabel: {
    fontSize: 13,
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
  typeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  typeOptionSelected: {
    backgroundColor: '#FCE4EC',
  },
  typeOptionText: {
    fontSize: 13,
    color: '#666',
  },
  typeOptionTextSelected: {
    color: '#E91E63',
    fontWeight: '500',
  },
  optionsInput: {
    flexDirection: 'row',
    gap: 8,
  },
  addOptionButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  editableOptionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f5f5f5',
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 16,
  },
  requiredToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  bottomSpacing: {
    height: 40,
  },
});
