/**
 * Temporary redirect intent used after authentication.
 * Consumed once the user completes login or signup.
 */
let postAuthRedirect: string | null = null;

export function setPostAuthRedirect(route: string): void {
  postAuthRedirect = route;
}

export function consumePostAuthRedirect(): string | null {
  const route = postAuthRedirect;
  postAuthRedirect = null;
  return route;
}

export function clearPostAuthRedirect(): void {
  postAuthRedirect = null;
}

export const ORGANIZER_PROFILE_ROUTE = "/organizer/profile";
export const ORGANIZER_DASHBOARD_ROUTE = "/organizer/dashboard";

/** Special intent: resolve profile vs dashboard from backend after auth. */
export const LIST_YOUR_EVENT_INTENT = "list-your-event";
