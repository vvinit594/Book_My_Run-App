export type AuthTab = "login" | "signup";

export type UserRole = "USER" | "ORGANIZER" | "ADMIN";

export interface OrganizerProfileSummary {
  id?: string;
  organizerName?: string;
  isProfileCompleted: boolean;
  completedAt?: string | null;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role?: UserRole;
  isVerified?: boolean;
  organizerProfile?: OrganizerProfileSummary;
}

export interface PendingSignup {
  mobile: string;
  email: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface SignupCredentials {
  mobile: string;
  email: string;
}

export interface OTPVerificationPayload {
  mobileOtp: string;
  emailOtp: string;
}

export interface CreatePasswordPayload {
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isHydrated: boolean;
  user: AuthUser | null;
  token: string | null;
  pendingSignup: PendingSignup | null;
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  sendOTP: (credentials: SignupCredentials) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (payload: OTPVerificationPayload) => Promise<{ success: boolean; error?: string }>;
  createPassword: (payload: CreatePasswordPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearPendingSignup: () => void;
  refreshUser: () => Promise<void>;
  isOrganizerProfileCompleted: boolean;
}
