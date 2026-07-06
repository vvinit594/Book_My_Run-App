type OrganizerRouter = {
  push: (href: "/organizer/profile") => void;
};

/**
 * Opens the Organizer Profile onboarding screen.
 * Profile completion is not persisted until backend integration.
 */
export function openOrganizerProfile(router: OrganizerRouter): void {
  router.push("/organizer/profile");
}
