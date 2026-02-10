// Organizer & Event Creation Types

export interface Organizer {
  id: string;
  name: string;
  email: string;
  phone: string;
  logo?: string;
  isVerified: boolean;
}

export type EventType = 
  | 'Running'
  | 'Walking'
  | 'Cycling'
  | 'Triathlon'
  | 'Swimming'
  | 'Virtual'
  | 'Ultra'
  | 'Duathlon'
  | 'Obstacle'
  | 'Stadium Run';

export interface EventDraft {
  id: string;
  status: 'draft' | 'pending_review' | 'published' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  completedSteps: number[];
  basics: EventBasics;
  location: EventLocation;
  description: EventDescription;
  photos: EventPhotos;
  gst: EventGST;
  tickets: EventTicket[];
  registrationQuestions: RegistrationQuestion[];
  ageCategories: AgeCategory[];
  bibNumberRanges: BibNumberRange[];
  discountCoupons: DiscountCoupon[];
  bookingConfirmation: BookingConfirmation;
  emailSettings: EmailSettings;
  marketing: MarketingSettings;
}

export interface EventBasics {
  organizerName: string;
  eventName: string;
  eventType: EventType;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  hasBibExpo: boolean;
  bibExpoDate?: string;
  bibExpoStartTime?: string;
  bibExpoEndTime?: string;
  bibExpoVenue?: string;
}

export interface BibExpoDay {
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  address: string;
}

export interface EventLocation {
  venueName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface EventDescription {
  about: string;
  rules?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  faqs: FAQ[];
}

export interface EventPhotos {
  bannerImage: string;
  galleryImages: string[];
  routeMapImage?: string;
}

export interface EventGST {
  hasGST: boolean;
  gstNumber?: string;
}

export interface EventTicket {
  id: string;
  name: string;
  distance: string;
  price: number;
  quantity: number;
  soldCount: number;
  description?: string;
  earlyBirdPrice?: number;
  earlyBirdEndDate?: string;
  isActive: boolean;
}

export interface RegistrationQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox';
  isRequired: boolean;
  options?: string[];
  order: number;
}

export interface AgeCategory {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  gender?: string;
}

export interface BibNumberRange {
  id: string;
  ticketId: string;
  prefix?: string;
  startNumber: number;
  endNumber: number;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  maxUses?: number;
  usedCount: number;
  validFrom?: string;
  validUntil?: string;
  minPurchaseAmount?: number;
  isActive: boolean;
}

export interface BookingConfirmation {
  confirmationMessage: string;
  includeQRCode: boolean;
  includeCalendarInvite: boolean;
}

export interface EmailSettings {
  sendConfirmationEmail: boolean;
  sendReminders: boolean;
  reminderDays: number[];
}

export interface MarketingSettings {
  selectedPackage?: string;
  featuredOnHomepage: boolean;
  socialMediaPromotion: boolean;
}

// Default Registration Questions - kept for reference
export const DEFAULT_REGISTRATION_FIELDS = [
  'First Name',
  'Last Name', 
  'Email',
  'Mobile Number',
  'Date of Birth',
  'Gender',
  'T-Shirt Size',
  'Address',
  'City',
  'Emergency Contact Name',
  'Emergency Contact Number',
  'Blood Group',
];
