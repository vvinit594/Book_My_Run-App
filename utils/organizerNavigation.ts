import { isOrganizerProfileCompleted } from "./organizerProfileStorage";

type OrganizerRouter = {
  push: (href: "/organizer/dashboard" | "/organizer/profile") => void;
};

/**
 * Routes organizers to profile onboarding when incomplete,
 * otherwise opens the dashboard directly.
 */
export async function navigateToOrganizerFlow(
  router: OrganizerRouter
): Promise<void> {
  const completed = await isOrganizerProfileCompleted();
  if (completed) {
    router.push("/organizer/dashboard");
    return;
  }
  router.push("/organizer/profile");
}
