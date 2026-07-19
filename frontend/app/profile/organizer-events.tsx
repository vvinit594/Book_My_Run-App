import { Redirect } from "expo-router";

/** Organizing Events → Events uses the existing Organizer Dashboard */
export default function OrganizerEventsScreen() {
  return <Redirect href="/organizer/dashboard" />;
}
