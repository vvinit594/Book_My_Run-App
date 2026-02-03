// Mock data for development - will be replaced by API calls
import { Event, City, Announcement, FeaturedBanner } from "../types";

export const mockCities: City[] = [
  { id: "1", name: "Mumbai", code: "MUM", isPopular: true },
  { id: "2", name: "Bengaluru", code: "BLR", isPopular: true },
  { id: "3", name: "Pune", code: "PUN", isPopular: true },
  { id: "4", name: "Delhi", code: "DEL", isPopular: true },
  { id: "5", name: "Kolkata", code: "KOL", isPopular: true },
  { id: "6", name: "Hyderabad", code: "HYD", isPopular: true },
  { id: "7", name: "Chennai", code: "CHN", isPopular: false },
  { id: "8", name: "Ahmedabad", code: "AMD", isPopular: false },
];

export const mockAnnouncement: Announcement = {
  id: "1",
  type: "offer",
  text: "🎉 Early Bird Offer on Mumbai Women's 10K! Use code: EARLY20",
  link: "/event/1",
  isActive: true,
};

export const mockFeaturedBanners: FeaturedBanner[] = [
  {
    id: "1",
    title: "Mumbai Women's 10K",
    subtitle: "India's Largest Women's Run",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
    eventId: "1",
    ctaText: "Register Now",
  },
  {
    id: "2",
    title: "Tata Mumbai Marathon 2026",
    subtitle: "The Ultimate Running Experience",
    image: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
    eventId: "2",
    ctaText: "Book Your Slot",
  },
  {
    id: "3",
    title: "Bengaluru Midnight Marathon",
    subtitle: "Run Under the Stars",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800",
    eventId: "3",
    ctaText: "Join Now",
  },
];

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Mumbai Women's 10K",
    description: "India's largest women's run celebrating fitness and empowerment",
    bannerImage: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600",
    date: "2026-03-23T06:00:00.000Z",
    registrationCloseDate: "2026-03-17T23:59:59.000Z",
    location: {
      venue: "BKC, Bandra Kurla Complex",
      city: "Mumbai",
      address: "MMRDA Grounds, BKC",
    },
    categories: ["10K", "5K"],
    price: {
      startingFrom: 699,
      currency: "INR",
    },
    rating: 9.1,
    totalRatings: 2453,
    tags: ["EARLY_BIRD"],
    isFeatured: true,
    isVirtual: false,
    organizer: {
      id: "org1",
      name: "Procam International",
    },
  },
  {
    id: "2",
    title: "Tata Mumbai Marathon",
    description: "Asia's biggest and most prestigious marathon",
    bannerImage: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600",
    date: "2026-01-19T05:30:00.000Z",
    registrationCloseDate: "2026-01-10T23:59:59.000Z",
    location: {
      venue: "CST to Marine Drive",
      city: "Mumbai",
      address: "Chhatrapati Shivaji Terminus",
    },
    categories: ["FM", "HM", "10K"],
    price: {
      startingFrom: 1500,
      currency: "INR",
    },
    rating: 9.5,
    totalRatings: 8921,
    tags: ["SELLING_FAST"],
    isFeatured: true,
    isVirtual: false,
    organizer: {
      id: "org1",
      name: "Procam International",
    },
  },
  {
    id: "3",
    title: "Bengaluru Midnight Marathon",
    description: "Experience the thrill of running under the stars",
    bannerImage: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600",
    date: "2026-04-15T23:00:00.000Z",
    registrationCloseDate: "2026-04-10T23:59:59.000Z",
    location: {
      venue: "Kanteerava Stadium",
      city: "Bengaluru",
      address: "Kasturba Road",
    },
    categories: ["HM", "10K", "5K"],
    price: {
      startingFrom: 899,
      currency: "INR",
    },
    rating: 8.7,
    totalRatings: 1234,
    tags: ["NEW"],
    isFeatured: false,
    isVirtual: false,
    organizer: {
      id: "org2",
      name: "NightRunners India",
    },
  },
  {
    id: "4",
    title: "Virtual Freedom Run",
    description: "Run anywhere, anytime - celebrate Independence Day",
    bannerImage: "https://images.unsplash.com/photo-1486218119243-13883505764c?w=600",
    date: "2026-08-15T00:00:00.000Z",
    registrationCloseDate: "2026-08-14T23:59:59.000Z",
    location: {
      venue: "Virtual Event",
      city: "All India",
    },
    categories: ["10K", "5K", "Virtual"],
    price: {
      startingFrom: 499,
      currency: "INR",
    },
    rating: 8.2,
    totalRatings: 567,
    tags: ["RECOMMENDED"],
    isFeatured: false,
    isVirtual: true,
    organizer: {
      id: "org3",
      name: "FitIndia Movement",
    },
  },
  {
    id: "5",
    title: "Pune International Marathon",
    description: "Run through the beautiful streets of Pune",
    bannerImage: "https://images.unsplash.com/photo-1461896836934- voices-0cc47a?w=600",
    date: "2026-05-10T05:30:00.000Z",
    registrationCloseDate: "2026-05-01T23:59:59.000Z",
    location: {
      venue: "Sanas Ground",
      city: "Pune",
      address: "Near JM Road",
    },
    categories: ["FM", "HM", "10K", "5K"],
    price: {
      startingFrom: 799,
      currency: "INR",
    },
    rating: 8.9,
    totalRatings: 2100,
    tags: ["LAST_FEW_SLOTS"],
    isFeatured: false,
    isVirtual: false,
    organizer: {
      id: "org4",
      name: "Pune Runners",
    },
  },
];

export default {
  mockCities,
  mockAnnouncement,
  mockFeaturedBanners,
  mockEvents,
};
