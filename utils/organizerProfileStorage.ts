import AsyncStorage from "@react-native-async-storage/async-storage";
import { ORGANIZER_PROFILE_STORAGE_KEY } from "../constants/organizer";
import {
  EMPTY_ORGANIZER_PROFILE,
  OrganizerProfile,
} from "../types/organizer";

export async function getOrganizerProfile(): Promise<OrganizerProfile> {
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
  // Frontend-only: profile completion is not persisted until backend integration.
  return false;
}

export async function saveOrganizerProfile(
  _profile: OrganizerProfile
): Promise<void> {
  // Frontend-only: no profile persistence until backend integration.
}

export async function clearOrganizerProfile(): Promise<void> {
  await AsyncStorage.removeItem(ORGANIZER_PROFILE_STORAGE_KEY);
}
