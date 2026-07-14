import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, AUTH_TOKEN_KEY } from "../constants/api";

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
};

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

export async function setAccessToken(token: string | null): Promise<void> {
  if (!token) {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  if (auth) {
    const token = await getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let payload: ApiSuccess<T> | ApiFailure | null = null;
  try {
    payload = (await response.json()) as ApiSuccess<T> | ApiFailure;
  } catch {
    throw new ApiError("Invalid server response", response.status);
  }

  if (!response.ok || !payload.success) {
    const failure = payload as ApiFailure;
    throw new ApiError(
      failure.message || "Request failed",
      response.status,
      failure.code,
      failure.details
    );
  }

  return (payload as ApiSuccess<T>).data;
}
