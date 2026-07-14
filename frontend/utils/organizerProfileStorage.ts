import AsyncStorage from "@react-native-async-storage/async-storage";
import { ORGANIZER_PROFILE_STORAGE_KEY } from "../constants/organizer";
import {
  EMPTY_ORGANIZER_PROFILE,
  OrganizerProfile,
} from "../types/organizer";
import * as organizerService from "../services/organizer.service";

export async function getOrganizerProfile(): Promise<OrganizerProfile> {
  const result = await organizerService.getOrganizerProfile();
  if (result.success && result.profile) {
    return result.profile;
  }

  try {
    const raw = await AsyncStorage.getItem(ORGANIZER_PROFILE_STORAGE_KEY);
    if (!raw) {
      return { ...EMPTY_ORGANIZER_PROFILE };
    }

    const parsed = JSON.parse(raw) as OrganizerProfile;
    return {
      ...EMPTY_ORGANIZER_PROFILE,
      ...parsed,
      bankDetails: {
        ...EMPTY_ORGANIZER_PROFILE.bankDetails,
        ...parsed.bankDetails,
      },
      socialMedia: {
        ...EMPTY_ORGANIZER_PROFILE.socialMedia,
        ...parsed.socialMedia,
      },
    };
  } catch {
    return { ...EMPTY_ORGANIZER_PROFILE };
  }
}

export async function isOrganizerProfileCompleted(): Promise<boolean> {
  const result = await organizerService.getOrganizerProfile();
  return Boolean(result.isProfileCompleted);
}

export async function saveOrganizerProfile(
  profile: OrganizerProfile
): Promise<void> {
  const result = await organizerService.saveOrganizerProfile(profile);
  if (!result.success) {
    throw new Error(result.error || "Failed to save organizer profile");
  }

  // Keep a local cache for offline form restore
  await AsyncStorage.setItem(
    ORGANIZER_PROFILE_STORAGE_KEY,
    JSON.stringify(result.profile ?? { ...profile, completed: true })
  );
}

export async function clearOrganizerProfile(): Promise<void> {
  await AsyncStorage.removeItem(ORGANIZER_PROFILE_STORAGE_KEY);
}
