// TypeScript types for BookMyRun

export interface Event {
  id: string;
  title: string;
  description?: string;
  bannerImage: string;
  date: string; // ISO date string
  registrationCloseDate: string;
  location: {
    venue: string;
    city: string;
    address?: string;
  };
  categories: EventCategory[];
  price: {
    startingFrom: number;
    currency: string;
  };
  rating?: number;
  totalRatings?: number;
  tags: EventTag[];
  isFeatured: boolean;
  isVirtual: boolean;
  organizer: {
    id: string;
    name: string;
    logo?: string;
  };
}

export interface EventDetails extends Event {
  aboutEvent: string;
  startTime: string;
  endTime?: string;
  eventType: "Running" | "Walking" | "Cycling" | "Triathlon";
  isPhysical: boolean;
  gallery: string[];
  routeMaps: RouteMap[];
  bibExpo: BibExpoDay[];
  faqs: FAQSection[];
  organizerDetails: OrganizerDetails;
  categoryPricing: CategoryPricing[];
  totalParticipants?: number;
  ageLimit?: string;
  termsAndConditions?: string;
}

export interface RouteMap {
  category: EventCategory;
  mapImage: string;
  distance: string;
  elevation?: string;
  description?: string;
}

export interface BibExpoDay {
  day: number;
  date: string;
  dayName: string;
  startTime: string;
  endTime: string;
  venue: string;
  address?: string;
}

export interface FAQSection {
  title: string;
  questions: FAQ[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface OrganizerDetails {
  id: string;
  name: string;
  logo?: string;
  description: string;
  joinedDate: string;
  totalEvents: number;
  followers: number;
  socialLinks?: {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
}

export interface CategoryPricing {
  category: EventCategory;
  price: number;
  originalPrice?: number;
  slots: number;
  slotsRemaining: number;
  closingDate: string;
}

export type EventCategory = "5K" | "10K" | "HM" | "FM" | "Virtual" | "Trail" | "Ultra";

export type EventTag = "EARLY_BIRD" | "SELLING_FAST" | "NEW" | "RECOMMENDED" | "LAST_FEW_SLOTS";

export interface City {
  id: string;
  name: string;
  code: string;
  isPopular: boolean;
}

export interface Announcement {
  id: string;
  type: "announcement" | "offer" | "alert";
  text: string;
  link?: string;
  backgroundColor?: string;
  isActive: boolean;
}

export interface FeaturedBanner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  eventId: string;
  ctaText: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  city?: string;
}

export interface FilterOptions {
  city?: string;
  categories?: EventCategory[];
  isVirtual?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
}
