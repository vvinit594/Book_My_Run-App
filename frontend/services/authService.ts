import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AUTH_STORAGE_KEY,
  EMAIL_REGEX,
  MIN_PASSWORD_LENGTH,
  MOCK_VALID_OTP,
  PHONE_REGEX,
} from "../constants/auth";
import {
  AuthUser,
  CreatePasswordPayload,
  LoginCredentials,
  OTPVerificationPayload,
  PendingSignup,
  SignupCredentials,
} from "../types/auth";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getStoredSession(): Promise<AuthUser | null> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function persistSession(user: AuthUser): Promise<void> {
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function login(
  credentials: LoginCredentials
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  await delay(600);

  const identifier = credentials.identifier.trim();
  const password = credentials.password.trim();

  if (!identifier || !password) {
    return { success: false, error: "Email/mobile and password are required" };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      success: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    };
  }

  const isEmail = EMAIL_REGEX.test(identifier);
  const isPhone = PHONE_REGEX.test(identifier.replace(/\D/g, "").slice(-10));

  if (!isEmail && !isPhone) {
    return { success: false, error: "Enter a valid email or mobile number" };
  }

  const user: AuthUser = {
    id: "mock-user-1",
    name: isEmail ? identifier.split("@")[0] : "BookMyRun User",
    email: isEmail ? identifier : "user@bookmyrun.com",
    phone: isPhone
      ? identifier.replace(/\D/g, "").slice(-10)
      : "9876543210",
  };

  await persistSession(user);
  return { success: true, user };
}

export async function sendOTP(
  credentials: SignupCredentials
): Promise<{ success: boolean; pending?: PendingSignup; error?: string }> {
  await delay(800);

  const mobile = credentials.mobile.trim();
  const email = credentials.email.trim().toLowerCase();

  if (!mobile || !email) {
    return { success: false, error: "Mobile number and email are required" };
  }

  if (!PHONE_REGEX.test(mobile)) {
    return { success: false, error: "Enter a valid 10-digit mobile number" };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { success: false, error: "Enter a valid email address" };
  }

  return { success: true, pending: { mobile, email } };
}

export async function verifyOTP(
  payload: OTPVerificationPayload
): Promise<{ success: boolean; error?: string }> {
  await delay(700);

  const mobileOtp = payload.mobileOtp.trim();
  const emailOtp = payload.emailOtp.trim();

  if (mobileOtp.length !== 6 || emailOtp.length !== 6) {
    return { success: false, error: "Please enter 6-digit OTP for both fields" };
  }

  if (mobileOtp !== MOCK_VALID_OTP || emailOtp !== MOCK_VALID_OTP) {
    return { success: false, error: "Invalid OTP" };
  }

  return { success: true };
}

export async function createPassword(
  pending: PendingSignup,
  payload: CreatePasswordPayload
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  await delay(700);

  const password = payload.password.trim();
  const confirmPassword = payload.confirmPassword.trim();

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      success: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" };
  }

  const user: AuthUser = {
    id: `mock-user-${Date.now()}`,
    name: pending.email.split("@")[0],
    email: pending.email,
    phone: pending.mobile,
  };

  await persistSession(user);
  return { success: true, user };
}

export async function logout(): Promise<void> {
  await delay(300);
  await clearSession();
}

export async function getProfile(): Promise<AuthUser | null> {
  await delay(200);
  return getStoredSession();
}
