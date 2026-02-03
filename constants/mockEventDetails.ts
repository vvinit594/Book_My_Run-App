// Mock data for Event Details Page
import { EventDetails } from "../types";

export const mockEventDetails: Record<string, EventDetails> = {
  "1": {
    id: "1",
    title: "Mumbai Women's 10K",
    description: "India's largest women's run celebrating fitness and empowerment",
    aboutEvent: `The Mumbai Women's 10K is India's premier women's running event, bringing together thousands of women from all walks of life to celebrate fitness, empowerment, and sisterhood.

Now in its 10th edition, this iconic event has become a symbol of women's strength and determination. Whether you're a seasoned runner or a first-timer, this event welcomes all women who want to challenge themselves and be part of something bigger.

The scenic route takes you through the beautiful streets of BKC, with enthusiastic crowds cheering you on every step of the way. Professional timing, well-stocked hydration stations, and medical support ensure a safe and memorable experience.

Join us for a morning of celebration, fitness, and female empowerment!`,
    bannerImage: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
    date: "2026-03-23T06:00:00.000Z",
    startTime: "06:00 AM",
    endTime: "11:00 AM",
    registrationCloseDate: "2026-03-17T23:59:59.000Z",
    location: {
      venue: "BKC, Bandra Kurla Complex",
      city: "Mumbai",
      address: "MMRDA Grounds, G Block, BKC, Bandra East, Mumbai - 400051",
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
    isPhysical: true,
    eventType: "Running",
    organizer: {
      id: "org1",
      name: "Procam International",
    },
    gallery: [
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600",
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600",
      "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600",
      "https://images.unsplash.com/photo-1486218119243-13883505764c?w=600",
      "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=600",
    ],
    routeMaps: [
      {
        category: "10K",
        mapImage: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600",
        distance: "10 kilometers",
        elevation: "Flat course",
        description: "The 10K route starts at MMRDA grounds and goes through the scenic BKC area.",
      },
      {
        category: "5K",
        mapImage: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600",
        distance: "5 kilometers",
        elevation: "Flat course",
        description: "The 5K route is perfect for beginners, covering the main BKC stretch.",
      },
    ],
    bibExpo: [
      {
        day: 1,
        date: "2026-03-20",
        dayName: "Friday",
        startTime: "12:00 PM",
        endTime: "7:00 PM",
        venue: "Jio Garden",
        address: "G Block, BKC, Mumbai",
      },
      {
        day: 2,
        date: "2026-03-21",
        dayName: "Saturday",
        startTime: "10:00 AM",
        endTime: "8:00 PM",
        venue: "Jio Garden",
        address: "G Block, BKC, Mumbai",
      },
      {
        day: 3,
        date: "2026-03-22",
        dayName: "Sunday",
        startTime: "10:00 AM",
        endTime: "5:00 PM",
        venue: "Jio Garden",
        address: "G Block, BKC, Mumbai",
      },
    ],
    faqs: [
      {
        title: "Event Information",
        questions: [
          {
            id: "faq1",
            question: "What is the minimum age requirement?",
            answer: "Participants must be at least 14 years old for the 5K and 16 years old for the 10K category.",
          },
          {
            id: "faq2",
            question: "Is this event only for women?",
            answer: "Yes, the Mumbai Women's 10K is exclusively for women participants to celebrate women's fitness and empowerment.",
          },
          {
            id: "faq3",
            question: "What time does the event start?",
            answer: "The 10K category starts at 6:00 AM and the 5K category starts at 6:30 AM.",
          },
        ],
      },
      {
        title: "Deliverables",
        questions: [
          {
            id: "faq4",
            question: "What is included in the registration?",
            answer: "Registration includes: Running bib with timing chip, Event t-shirt, Finisher medal, Hydration on course, and Finisher certificate.",
          },
          {
            id: "faq5",
            question: "When will I receive my running kit?",
            answer: "Running kits must be collected at the Bib Expo from March 20-22. Kits will not be available on race day.",
          },
        ],
      },
      {
        title: "Payments & Refunds",
        questions: [
          {
            id: "faq6",
            question: "Can I get a refund after registration?",
            answer: "Registrations are non-refundable. However, you can transfer your registration to another eligible participant up to 7 days before the event.",
          },
          {
            id: "faq7",
            question: "What payment methods are accepted?",
            answer: "We accept all major credit/debit cards, UPI, net banking, and popular wallets like Paytm and PhonePe.",
          },
        ],
      },
    ],
    organizerDetails: {
      id: "org1",
      name: "Procam International",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
      description: "Procam International is India's premier sports management company, organizing world-class running events since 2004. We've hosted over 500,000 runners across India.",
      joinedDate: "2018-01-15",
      totalEvents: 156,
      followers: 45000,
      socialLinks: {
        website: "https://procam.in",
        instagram: "@procaminternational",
        facebook: "ProcamInternational",
        twitter: "@ProcamIntl",
      },
      contactEmail: "support@procam.in",
      contactPhone: "+91 22 6636 7200",
    },
    categoryPricing: [
      {
        category: "10K",
        price: 899,
        originalPrice: 1099,
        slots: 5000,
        slotsRemaining: 1234,
        closingDate: "2026-03-17T23:59:59.000Z",
      },
      {
        category: "5K",
        price: 699,
        originalPrice: 799,
        slots: 3000,
        slotsRemaining: 892,
        closingDate: "2026-03-17T23:59:59.000Z",
      },
    ],
    totalParticipants: 8000,
    ageLimit: "14+ years",
  },
  "2": {
    id: "2",
    title: "Tata Mumbai Marathon",
    description: "Asia's biggest and most prestigious marathon",
    aboutEvent: `The Tata Mumbai Marathon is Asia's largest and most prestigious marathon, attracting elite runners from around the world and amateur enthusiasts from across India.

Since its inception in 2004, the marathon has grown to become a landmark event in the global running calendar. The scenic course takes runners through Mumbai's iconic landmarks, from the Gateway of India to Marine Drive.

With world-class organization, international timing standards, and massive crowd support, the Tata Mumbai Marathon offers an unforgettable running experience.`,
    bannerImage: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
    date: "2026-01-19T05:30:00.000Z",
    startTime: "05:30 AM",
    endTime: "12:00 PM",
    registrationCloseDate: "2026-01-10T23:59:59.000Z",
    location: {
      venue: "CST to Marine Drive",
      city: "Mumbai",
      address: "Chhatrapati Shivaji Terminus, Mumbai",
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
    isPhysical: true,
    eventType: "Running",
    organizer: {
      id: "org1",
      name: "Procam International",
    },
    gallery: [
      "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600",
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600",
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600",
    ],
    routeMaps: [
      {
        category: "FM",
        mapImage: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600",
        distance: "42.195 kilometers",
        elevation: "Mostly flat with few inclines",
        description: "The full marathon covers iconic Mumbai landmarks.",
      },
      {
        category: "HM",
        mapImage: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600",
        distance: "21.097 kilometers",
        elevation: "Flat course",
        description: "Half marathon through South Mumbai.",
      },
      {
        category: "10K",
        mapImage: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600",
        distance: "10 kilometers",
        elevation: "Flat course",
        description: "10K run along Marine Drive.",
      },
    ],
    bibExpo: [
      {
        day: 1,
        date: "2026-01-16",
        dayName: "Thursday",
        startTime: "11:00 AM",
        endTime: "8:00 PM",
        venue: "NSCI Dome",
        address: "Worli, Mumbai",
      },
      {
        day: 2,
        date: "2026-01-17",
        dayName: "Friday",
        startTime: "11:00 AM",
        endTime: "8:00 PM",
        venue: "NSCI Dome",
        address: "Worli, Mumbai",
      },
      {
        day: 3,
        date: "2026-01-18",
        dayName: "Saturday",
        startTime: "10:00 AM",
        endTime: "6:00 PM",
        venue: "NSCI Dome",
        address: "Worli, Mumbai",
      },
    ],
    faqs: [
      {
        title: "Event Information",
        questions: [
          {
            id: "faq1",
            question: "What are the cutoff times?",
            answer: "Full Marathon: 6 hours, Half Marathon: 3.5 hours, 10K: 1.5 hours.",
          },
          {
            id: "faq2",
            question: "Is there a qualifying time requirement?",
            answer: "Full Marathon requires a previous marathon or half marathon completion certificate.",
          },
        ],
      },
      {
        title: "Deliverables",
        questions: [
          {
            id: "faq3",
            question: "What's included in the kit?",
            answer: "Bib, timing chip, event t-shirt, finisher medal, and goodie bag.",
          },
        ],
      },
      {
        title: "Payments & Refunds",
        questions: [
          {
            id: "faq4",
            question: "Is registration transferable?",
            answer: "Registrations can be transferred until 2 weeks before the event with a ₹200 transfer fee.",
          },
        ],
      },
    ],
    organizerDetails: {
      id: "org1",
      name: "Procam International",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
      description: "Procam International is India's premier sports management company.",
      joinedDate: "2018-01-15",
      totalEvents: 156,
      followers: 45000,
      socialLinks: {
        website: "https://procam.in",
        instagram: "@procaminternational",
      },
      contactEmail: "support@procam.in",
    },
    categoryPricing: [
      {
        category: "FM",
        price: 3500,
        originalPrice: 4000,
        slots: 10000,
        slotsRemaining: 234,
        closingDate: "2026-01-10T23:59:59.000Z",
      },
      {
        category: "HM",
        price: 2000,
        originalPrice: 2500,
        slots: 15000,
        slotsRemaining: 1892,
        closingDate: "2026-01-10T23:59:59.000Z",
      },
      {
        category: "10K",
        price: 1500,
        slots: 10000,
        slotsRemaining: 3421,
        closingDate: "2026-01-10T23:59:59.000Z",
      },
    ],
    totalParticipants: 55000,
    ageLimit: "18+ for FM, 16+ for HM, 14+ for 10K",
  },
};

// Helper function to get event details by ID
export const getEventDetails = (eventId: string): EventDetails | undefined => {
  return mockEventDetails[eventId];
};
