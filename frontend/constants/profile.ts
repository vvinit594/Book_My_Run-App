import { Ionicons } from "@expo/vector-icons";
import { Href } from "expo-router";

export interface ProfileMenuItemConfig {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: Href;
}

export const ORGANIZING_EVENTS_MENU: ProfileMenuItemConfig[] = [
  {
    id: "organizer-profile",
    title: "Profile",
    description: "Manage Organizer Profile",
    icon: "person-outline",
    route: "/organizer/profile",
  },
  {
    id: "organizer-events",
    title: "Events",
    description: "View all organizer events",
    icon: "calendar-outline",
    route: "/organizer/dashboard",
  },
  {
    id: "organizer-dashboard",
    title: "Dashboard",
    description: "Organizer Dashboard",
    icon: "speedometer-outline",
    route: "/organizer/dashboard",
  },
  {
    id: "financials",
    title: "Financials",
    description: "Manage earnings, payouts and transactions",
    icon: "cash-outline",
    route: "/profile/financials",
  },
  {
    id: "support",
    title: "Raise a Support Ticket",
    description: "Contact BookMyRun Support",
    icon: "headset-outline",
    route: "/profile/support",
  },
];

export const ATTENDING_EVENTS_MENU: ProfileMenuItemConfig[] = [
  {
    id: "runner-profile",
    title: "Profile",
    description: "Manage Runner Profile",
    icon: "person-outline",
    route: "/profile/runner-profile",
  },
  {
    id: "registered-events",
    title: "Events",
    description: "View Registered Events",
    icon: "calendar-outline",
    route: "/profile/registered-events",
  },
];

export const DEFAULT_AVATAR_URI =
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200";
