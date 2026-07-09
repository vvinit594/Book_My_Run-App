import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const STEPS = [
  { id: 1, title: 'Event Basics', icon: 'calendar-outline' },
  { id: 2, title: 'Location', icon: 'location-outline' },
  { id: 3, title: 'Description', icon: 'document-text-outline' },
  { id: 4, title: 'Photos', icon: 'images-outline' },
  { id: 5, title: 'GST', icon: 'receipt-outline' },
  { id: 6, title: 'Tickets', icon: 'ticket-outline' },
  { id: 7, title: 'Questions', icon: 'help-circle-outline' },
  { id: 8, title: 'Age Category', icon: 'people-outline' },
  { id: 9, title: 'BIB Number', icon: 'barcode-outline' },
  { id: 10, title: 'Discounts', icon: 'pricetag-outline' },
  { id: 11, title: 'Confirmation', icon: 'checkmark-circle-outline' },
  { id: 12, title: 'Email Preview', icon: 'mail-outline' },
  { id: 13, title: 'Marketing', icon: 'megaphone-outline' },
];

interface EventStepperProps {
  currentStep: number;
  onStepPress: (step: number) => void;
  completedSteps: number[];
}

export default function EventStepper({ currentStep, onStepPress, completedSteps }: EventStepperProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = completedSteps.includes(step.id);
          const isPast = step.id < currentStep;
          const canNavigate = isCompleted || step.id <= Math.max(...completedSteps, 1) + 1;
          
          return (
            <TouchableOpacity
              key={step.id}
              style={[
                styles.stepItem,
                isActive && styles.stepItemActive,
              ]}
              onPress={() => canNavigate && onStepPress(step.id)}
              disabled={!canNavigate}
            >
              <View style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isCompleted && styles.stepCircleCompleted,
                !canNavigate && styles.stepCircleDisabled,
              ]}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : (
                  <Text style={[
                    styles.stepNumber,
                    isActive && styles.stepNumberActive,
                    !canNavigate && styles.stepNumberDisabled,
                  ]}>
                    {step.id}
                  </Text>
                )}
              </View>
              <Text style={[
                styles.stepTitle,
                isActive && styles.stepTitleActive,
                !canNavigate && styles.stepTitleDisabled,
              ]} numberOfLines={1}>
                {step.title}
              </Text>
              {index < STEPS.length - 1 && (
                <View style={[
                  styles.connector,
                  isCompleted && styles.connectorCompleted,
                ]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  stepItem: {
    alignItems: 'center',
    paddingHorizontal: 8,
    flexDirection: 'row',
    gap: 6,
  },
  stepItemActive: {
    // Active styling
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  stepCircleActive: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  stepCircleCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  stepCircleDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  stepNumber: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepNumberDisabled: {
    color: '#bbb',
  },
  stepTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  stepTitleActive: {
    color: '#E91E63',
    fontWeight: '600',
  },
  stepTitleDisabled: {
    color: '#bbb',
  },
  connector: {
    width: 20,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginLeft: 6,
  },
  connectorCompleted: {
    backgroundColor: '#4CAF50',
  },
});
