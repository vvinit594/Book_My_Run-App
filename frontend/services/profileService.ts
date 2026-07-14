import { AuthUser } from "../types/auth";
import * as authService from "./auth.service";

export interface UserProfile extends AuthUser {
  isOrganizer: boolean;
}

export async function getUserProfile(
  user: AuthUser | null
): Promise<UserProfile | null> {
  if (!user) return null;

  const fresh = (await authService.getProfile()) ?? user;
  const isOrganizer = Boolean(fresh.organizerProfile?.isProfileCompleted);

  return {
    ...fresh,
    isOrganizer,
  };
}

export async function getOrganizerEvents(): Promise<[]> {
  return [];
}

export async function getFinancialData(): Promise<null> {
  return null;
}

export async function getRegisteredEvents(): Promise<[]> {
  return [];
}
