import { Alert } from "react-native";
import * as organizerService from "../services/organizer.service";

export const ORGANIZER_PROFILE_ROUTE = "/organizer/profile";
export const ORGANIZER_DASHBOARD_ROUTE = "/organizer/dashboard";

type ListYourEventRouter = {
  push: (href: "/organizer/profile" | "/organizer/dashboard") => void;
  replace?: (href: "/organizer/profile" | "/organizer/dashboard") => void;
};

/**
 * Source of truth: backend GET /organizer/profile → isProfileCompleted.
 * Completed organizers go to Dashboard; others to Profile form.
 */
export async function navigateListYourEvent(
  router: ListYourEventRouter,
  options?: { replace?: boolean }
): Promise<void> {
  const result = await organizerService.getOrganizerProfile();

  if (!result.success) {
    Alert.alert(
      "Unable to continue",
      result.error || "Could not verify organizer profile. Please try again."
    );
    return;
  }

  const href = result.isProfileCompleted
    ? ORGANIZER_DASHBOARD_ROUTE
    : ORGANIZER_PROFILE_ROUTE;

  if (options?.replace && router.replace) {
    router.replace(href);
    return;
  }

  router.push(href);
}

/** @deprecated Use navigateListYourEvent — always checked the profile form. */
export function openOrganizerProfile(router: {
  push: (href: "/organizer/profile") => void;
}): void {
  router.push("/organizer/profile");
}
