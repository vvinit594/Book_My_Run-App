import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * API base URL for the BookMyRun backend.
 * Override with EXPO_PUBLIC_API_URL (e.g. http://10.20.98.241:5000/api).
 */
function resolveDefaultHost(): string {
  const hostUri = Constants.expoConfig?.hostUri;

  if (hostUri) {
    const host = hostUri.split(":")[0];
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return `http://${host}:5000/api`;
    }
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000/api";
  }

  return "http://localhost:5000/api";
}

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") || resolveDefaultHost();

/** Origin without `/api` — used for static uploads */
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const AUTH_TOKEN_KEY = "@bookmyrun/auth_token";
