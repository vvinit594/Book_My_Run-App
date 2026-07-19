import { Redirect } from "expo-router";

/** Kept for old links — Organizing Events → Profile now goes to /organizer/profile */
export default function OrganizerProfileScreen() {
  return <Redirect href="/organizer/profile" />;
}
