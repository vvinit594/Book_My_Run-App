import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventDraft } from '../../types/organizer';
import EventStepper from '../../components/organizer/EventStepper';
import StepNavigation from '../../components/organizer/StepNavigation';
import CreateEventHeader from '../../components/organizer/CreateEventHeader';

// Step Components
import Step1EventBasics from '../../components/organizer/steps/Step1EventBasics';
import Step2EventLocation from '../../components/organizer/steps/Step2EventLocation';
import Step3EventDescription from '../../components/organizer/steps/Step3EventDescription';
import Step4EventPhotos from '../../components/organizer/steps/Step4EventPhotos';
import Step5GSTConfirmation from '../../components/organizer/steps/Step5GSTConfirmation';
import Step6Tickets from '../../components/organizer/steps/Step6Tickets';
import Step7RegistrationQuestions from '../../components/organizer/steps/Step7RegistrationQuestions';
import Step8AgeCategory from '../../components/organizer/steps/Step8AgeCategory';
import Step9BibNumber from '../../components/organizer/steps/Step9BibNumber';
import Step10DiscountCoupon from '../../components/organizer/steps/Step10DiscountCoupon';
import Step11BookingConfirmation from '../../components/organizer/steps/Step11BookingConfirmation';
import Step12EmailPreview from '../../components/organizer/steps/Step12EmailPreview';
import Step13MarketingPackages from '../../components/organizer/steps/Step13MarketingPackages';

const TOTAL_STEPS = 13;

const initialEventDraft: EventDraft = {
  id: `draft-${Date.now()}`,
  status: 'draft',
  currentStep: 1,
  completedSteps: [],
  basics: {
    organizerName: '',
    eventName: '',
    eventType: 'Running',
    startDate: '',
    endDate: '',
    hasBibExpo: false,
  },
  location: {
    venueName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  },
  description: {
    about: '',
    rules: '',
    socialLinks: {},
    faqs: [],
  },
  photos: {
    bannerImage: '',
    galleryImages: [],
  },
  gst: {
    hasGST: false,
  },
  tickets: [],
  registrationQuestions: [],
  ageCategories: [],
  bibNumberRanges: [],
  discountCoupons: [],
  bookingConfirmation: {
    confirmationMessage: 'Thank you for registering! Your spot is confirmed.',
    includeQRCode: true,
    includeCalendarInvite: true,
  },
  emailSettings: {
    sendConfirmationEmail: true,
    sendReminders: true,
    reminderDays: [7, 1],
  },
  marketing: {
    selectedPackage: undefined,
    featuredOnHomepage: false,
    socialMediaPromotion: false,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function CreateEventScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [eventDraft, setEventDraft] = useState<EventDraft>(initialEventDraft);
  const [isSaving, setIsSaving] = useState(false);

  const updateEventDraft = useCallback((updates: Partial<EventDraft>) => {
    setEventDraft(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const handleStepPress = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleNext = useCallback(() => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Last step - publish event
      handlePublish();
    }
  }, [currentStep, completedSteps]);

  const handleSaveDraft = useCallback(() => {
    Alert.alert(
      'Save Draft',
      'Your event will be saved as a draft. You can continue editing or return to the dashboard.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        { 
          text: 'Save Draft', 
          style: 'destructive',
          onPress: () => {
            // Save draft logic here
            router.replace('/organizer/dashboard');
          }
        },
      ]
    );
  }, [router]);

  const handlePublish = useCallback(() => {
    Alert.alert(
      'Publish Event',
      'Are you ready to make your event live? Participants will be able to register once published.',
      [
        { text: 'Review Again', style: 'cancel' },
        { 
          text: 'Go Live!', 
          style: 'default',
          onPress: () => {
            setIsSaving(true);
            // Simulate API call
            setTimeout(() => {
              setIsSaving(false);
              Alert.alert(
                '🎉 Event Published!',
                'Your event is now live. Participants can start registering.',
                [{ text: 'View Dashboard', onPress: () => router.replace('/organizer/dashboard') }]
              );
            }, 2000);
          }
        },
      ]
    );
  }, [router]);

  const handleExit = useCallback(() => {
    Alert.alert(
      'Exit Event Creation',
      'Your progress will be saved as a draft.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save & Exit', 
          onPress: () => router.replace('/organizer/dashboard')
        },
      ]
    );
  }, [router]);

  const renderCurrentStep = () => {
    const stepProps = {
      eventDraft,
      updateEventDraft,
    };

    switch (currentStep) {
      case 1:
        return <Step1EventBasics {...stepProps} />;
      case 2:
        return <Step2EventLocation {...stepProps} />;
      case 3:
        return <Step3EventDescription {...stepProps} />;
      case 4:
        return <Step4EventPhotos {...stepProps} />;
      case 5:
        return <Step5GSTConfirmation {...stepProps} />;
      case 6:
        return <Step6Tickets {...stepProps} />;
      case 7:
        return <Step7RegistrationQuestions {...stepProps} />;
      case 8:
        return <Step8AgeCategory {...stepProps} />;
      case 9:
        return <Step9BibNumber {...stepProps} />;
      case 10:
        return <Step10DiscountCoupon {...stepProps} />;
      case 11:
        return <Step11BookingConfirmation {...stepProps} />;
      case 12:
        return <Step12EmailPreview {...stepProps} />;
      case 13:
        return <Step13MarketingPackages {...stepProps} onSaveDraft={handleSaveDraft} />;
      default:
        return <Step1EventBasics {...stepProps} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CreateEventHeader onExit={handleExit} />
      
      <EventStepper
        currentStep={currentStep}
        onStepPress={handleStepPress}
        completedSteps={completedSteps}
      />

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        {renderCurrentStep()}
      </KeyboardAvoidingView>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        onNext={handleNext}
        onSaveDraft={handleSaveDraft}
        isLastStep={currentStep === TOTAL_STEPS}
        isSaving={isSaving}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});
