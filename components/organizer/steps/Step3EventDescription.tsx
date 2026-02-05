import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventDraft, FAQ } from '../../../types/organizer';

interface Props {
  eventDraft: EventDraft;
  updateEventDraft: (updates: Partial<EventDraft>) => void;
}

export default function Step3EventDescription({ eventDraft, updateEventDraft }: Props) {
  const { description } = eventDraft;
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  const updateDescription = (updates: Partial<typeof description>) => {
    updateEventDraft({
      description: { ...description, ...updates },
    });
  };

  const addFaq = () => {
    if (newFaqQuestion.trim() && newFaqAnswer.trim()) {
      const newFaq: FAQ = {
        id: Date.now().toString(),
        question: newFaqQuestion.trim(),
        answer: newFaqAnswer.trim(),
        order: description.faqs.length,
      };
      updateDescription({
        faqs: [...description.faqs, newFaq],
      });
      setNewFaqQuestion('');
      setNewFaqAnswer('');
    }
  };

  const removeFaq = (id: string) => {
    updateDescription({
      faqs: description.faqs.filter(faq => faq.id !== id),
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text-outline" size={28} color="#E91E63" />
          </View>
          <Text style={styles.title}>Event Description</Text>
          <Text style={styles.subtitle}>
            Tell participants what makes your event special
          </Text>
        </View>

        {/* About Event */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>About the Event *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your event, what to expect, highlights, etc."
            placeholderTextColor="#999"
            value={description.about}
            onChangeText={(text) => updateDescription({ about: text })}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {description.about.length} / 2000 characters
          </Text>
        </View>

        {/* Rules & Guidelines */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Rules & Guidelines</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="List important rules, eligibility criteria, what to bring, etc."
            placeholderTextColor="#999"
            value={description.rules}
            onChangeText={(text) => updateDescription({ rules: text })}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Links</Text>
          <Text style={styles.sectionSubtitle}>
            Connect participants to your online presence
          </Text>
          
          <View style={styles.socialInput}>
            <View style={styles.socialIcon}>
              <Ionicons name="globe-outline" size={20} color="#666" />
            </View>
            <TextInput
              style={styles.socialTextInput}
              placeholder="Website URL"
              placeholderTextColor="#999"
              value={description.socialLinks?.website}
              onChangeText={(text) => updateDescription({ 
                socialLinks: { ...description.socialLinks, website: text }
              })}
            />
          </View>

          <View style={styles.socialInput}>
            <View style={[styles.socialIcon, { backgroundColor: '#E4405F15' }]}>
              <Ionicons name="logo-instagram" size={20} color="#E4405F" />
            </View>
            <TextInput
              style={styles.socialTextInput}
              placeholder="Instagram handle"
              placeholderTextColor="#999"
              value={description.socialLinks?.instagram}
              onChangeText={(text) => updateDescription({ 
                socialLinks: { ...description.socialLinks, instagram: text }
              })}
            />
          </View>

          <View style={styles.socialInput}>
            <View style={[styles.socialIcon, { backgroundColor: '#1DA1F215' }]}>
              <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
            </View>
            <TextInput
              style={styles.socialTextInput}
              placeholder="Twitter/X handle"
              placeholderTextColor="#999"
              value={description.socialLinks?.twitter}
              onChangeText={(text) => updateDescription({ 
                socialLinks: { ...description.socialLinks, twitter: text }
              })}
            />
          </View>

          <View style={styles.socialInput}>
            <View style={[styles.socialIcon, { backgroundColor: '#1877F215' }]}>
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
            </View>
            <TextInput
              style={styles.socialTextInput}
              placeholder="Facebook page URL"
              placeholderTextColor="#999"
              value={description.socialLinks?.facebook}
              onChangeText={(text) => updateDescription({ 
                socialLinks: { ...description.socialLinks, facebook: text }
              })}
            />
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAQs</Text>
          <Text style={styles.sectionSubtitle}>
            Add common questions and answers
          </Text>

          {description.faqs.map((faq, index) => (
            <View key={faq.id} style={styles.faqCard}>
              <View style={styles.faqHeader}>
                <Text style={styles.faqNumber}>Q{index + 1}</Text>
                <TouchableOpacity 
                  style={styles.faqRemove}
                  onPress={() => removeFaq(faq.id)}
                >
                  <Ionicons name="close-circle" size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            </View>
          ))}

          <View style={styles.addFaqCard}>
            <TextInput
              style={styles.faqInput}
              placeholder="Enter question"
              placeholderTextColor="#999"
              value={newFaqQuestion}
              onChangeText={setNewFaqQuestion}
            />
            <TextInput
              style={[styles.faqInput, styles.faqAnswerInput]}
              placeholder="Enter answer"
              placeholderTextColor="#999"
              value={newFaqAnswer}
              onChangeText={setNewFaqAnswer}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <TouchableOpacity 
              style={[
                styles.addFaqButton,
                (!newFaqQuestion.trim() || !newFaqAnswer.trim()) && styles.addFaqButtonDisabled,
              ]}
              onPress={addFaq}
              disabled={!newFaqQuestion.trim() || !newFaqAnswer.trim()}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addFaqButtonText}>Add FAQ</Text>
            </TouchableOpacity>
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
  textArea: {
    minHeight: 120,
    paddingTop: 14,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  socialInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  socialIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialTextInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
  },
  faqCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  faqNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E91E63',
    backgroundColor: '#FCE4EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  faqRemove: {
    padding: 4,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  addFaqCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    borderStyle: 'dashed',
  },
  faqInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  faqAnswerInput: {
    minHeight: 70,
    paddingTop: 10,
  },
  addFaqButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E91E63',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 6,
  },
  addFaqButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  addFaqButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacing: {
    height: 40,
  },
});
