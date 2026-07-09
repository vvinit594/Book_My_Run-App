/**
 * Temporary frontend-only redirect intent used after authentication.
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
