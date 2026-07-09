import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  isNextDisabled?: boolean;
  isLastStep?: boolean;
  isSaving?: boolean;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSaveDraft,
  isNextDisabled = false,
  isLastStep = false,
  isSaving = false,
}: StepNavigationProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Draft Status */}
        <View style={styles.statusRow}>
          <View style={styles.draftStatus}>
            <Ionicons name="cloud-done-outline" size={14} color="#4CAF50" />
            <Text style={styles.draftText}>Saved ✓</Text>
          </View>
          <TouchableOpacity onPress={onSaveDraft} style={styles.saveDraftButton}>
            <Text style={styles.saveDraftText}>Save & Exit</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(currentStep / totalSteps) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep} of {totalSteps}
          </Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.backButton, currentStep === 1 && styles.backButtonDisabled]}
            onPress={onBack}
            disabled={currentStep === 1}
          >
            <Ionicons 
              name="arrow-back" 
              size={20} 
              color={currentStep === 1 ? '#ccc' : '#333'} 
            />
            <Text style={[
              styles.backButtonText,
              currentStep === 1 && styles.backButtonTextDisabled
            ]}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              isNextDisabled && styles.nextButtonDisabled,
              isLastStep && styles.publishButton,
            ]}
            onPress={onNext}
            disabled={isNextDisabled}
          >
            {isSaving ? (
              <Text style={styles.nextButtonText}>Saving...</Text>
            ) : isLastStep ? (
              <>
                <Ionicons name="rocket-outline" size={18} color="#fff" />
                <Text style={styles.nextButtonText}>Go Live</Text>
              </>
            ) : (
              <>
                <Text style={styles.nextButtonText}>Next</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  draftStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  draftText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  saveDraftButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
  },
  saveDraftText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    minWidth: 50,
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    gap: 6,
  },
  backButtonDisabled: {
    backgroundColor: '#fafafa',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  backButtonTextDisabled: {
    color: '#ccc',
  },
  nextButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#E91E63',
    gap: 6,
  },
  nextButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  publishButton: {
    backgroundColor: '#4CAF50',
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
