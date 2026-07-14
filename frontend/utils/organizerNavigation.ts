/**
 * Opens the Organizer Profile onboarding screen.
 * After the profile is completed on the backend (isProfileCompleted=true),
 * the Profile hub shows the Organizing Events section.
 */
export function openOrganizerProfile(router: {
  push: (href: "/organizer/profile") => void;
}): void {
  router.push("/organizer/profile");
}
