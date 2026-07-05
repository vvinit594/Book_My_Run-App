import { AuthUser } from "../types/auth";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface UserProfile extends AuthUser {
  isOrganizer: boolean;
}

export async function getUserProfile(
  user: AuthUser | null
): Promise<UserProfile | null> {
  await delay(200);
  if (!user) return null;

  return {
    ...user,
    isOrganizer: true,
  };
}

export async function getOrganizerProfile(): Promise<null> {
  await delay(200);
  return null;
}

export async function getOrganizerEvents(): Promise<[]> {
  await delay(200);
  return [];
}

export async function getFinancialData(): Promise<null> {
  await delay(200);
  return null;
}

export async function getRegisteredEvents(): Promise<[]> {
  await delay(200);
  return [];
}
