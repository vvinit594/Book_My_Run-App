// Mock data for Booking Flow
import { TicketCategory, UPIOption, BankOption, WalletOption } from "../types";

export const mockTicketCategories: TicketCategory[] = [
  {
    id: "ticket-10k",
    category: "10K",
    title: "10K Run",
    description: "Challenge yourself with the 10K distance",
    distance: "10 kilometers",
    price: 999,
    originalPrice: 1299,
    slotsRemaining: 234,
    perks: [
      "Finisher Medal",
      "Event T-Shirt",
      "Timing Chip",
      "Hydration Stations",
      "Post-run Breakfast",
      "Digital Certificate",
    ],
    closingDate: "2026-03-17T23:59:59.000Z",
  },
  {
    id: "ticket-5k",
    category: "5K",
    title: "5K Fun Run",
    description: "Perfect for beginners and fitness enthusiasts",
    distance: "5 kilometers",
    price: 699,
    originalPrice: 899,
    slotsRemaining: 567,
    perks: [
      "Finisher Medal",
      "Event T-Shirt",
      "Hydration Stations",
      "Post-run Snacks",
      "Digital Certificate",
    ],
    closingDate: "2026-03-17T23:59:59.000Z",
  },
  {
    id: "ticket-hm",
    category: "HM",
    title: "Half Marathon",
    description: "21.1 km for seasoned runners",
    distance: "21.1 kilometers",
    price: 1499,
    originalPrice: 1999,
    slotsRemaining: 89,
    perks: [
      "Premium Finisher Medal",
      "Exclusive Event T-Shirt",
      "Timing Chip",
      "Multiple Hydration Stations",
      "Energy Gels at Aid Stations",
      "Post-run Breakfast",
      "Digital Certificate",
      "Pace Group Support",
    ],
    closingDate: "2026-03-17T23:59:59.000Z",
  },
  {
    id: "ticket-fm",
    category: "FM",
    title: "Full Marathon",
    description: "The ultimate 42.2 km challenge",
    distance: "42.2 kilometers",
    price: 1999,
    originalPrice: 2499,
    slotsRemaining: 45,
    perks: [
      "Premium Finisher Medal",
      "Exclusive Event T-Shirt",
      "Timing Chip",
      "Multiple Hydration Stations",
      "Energy Gels & Bars",
      "Post-run Breakfast",
      "Digital Certificate",
      "Pace Group Support",
      "Physio Support",
      "Priority Bib Collection",
    ],
    closingDate: "2026-03-17T23:59:59.000Z",
  },
];

export const upiOptions: UPIOption[] = [
  { id: "gpay", name: "Google Pay", icon: "google" },
  { id: "phonepe", name: "PhonePe", icon: "phone-portrait" },
  { id: "paytm", name: "Paytm", icon: "wallet" },
  { id: "bhim", name: "BHIM UPI", icon: "apps" },
];

export const bankOptions: BankOption[] = [
  { id: "hdfc", name: "HDFC Bank", icon: "business" },
  { id: "icici", name: "ICICI Bank", icon: "business" },
  { id: "sbi", name: "State Bank of India", icon: "business" },
  { id: "axis", name: "Axis Bank", icon: "business" },
  { id: "kotak", name: "Kotak Mahindra Bank", icon: "business" },
  { id: "other", name: "Other Banks", icon: "list" },
];

export const walletOptions: WalletOption[] = [
  { id: "paytm", name: "Paytm Wallet", icon: "wallet", balance: 2500 },
  { id: "mobikwik", name: "MobiKwik", icon: "wallet", balance: 1200 },
  { id: "freecharge", name: "Freecharge", icon: "wallet", balance: 500 },
];

export const CONVENIENCE_FEE_PERCENTAGE = 2.5;
export const GST_PERCENTAGE = 18;
