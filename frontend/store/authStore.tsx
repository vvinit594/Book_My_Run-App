import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authService from "../services/authService";
import { clearOrganizerProfile } from "../utils/organizerProfileStorage";
import { clearPostAuthRedirect } from "../utils/navigationIntent";
import {
  AuthContextValue,
  AuthState,
  CreatePasswordPayload,
  LoginCredentials,
  OTPVerificationPayload,
  SignupCredentials,
} from "../types/auth";

const initialState: AuthState = {
  isAuthenticated: false,
  isHydrated: false,
  user: null,
  pendingSignup: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      const user = await authService.getStoredSession();
      if (!mounted) return;
      setState({
        isAuthenticated: Boolean(user),
        isHydrated: true,
        user,
        pendingSignup: null,
      });
    }

    void hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await authService.login(credentials);
    if (result.success && result.user) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: result.user!,
        pendingSignup: null,
      }));
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const sendOTP = useCallback(async (credentials: SignupCredentials) => {
    const result = await authService.sendOTP(credentials);
    if (result.success && result.pending) {
      setState((prev) => ({
        ...prev,
        pendingSignup: result.pending!,
      }));
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const verifyOTP = useCallback(async (payload: OTPVerificationPayload) => {
    const result = await authService.verifyOTP(payload);
    return { success: result.success, error: result.error };
  }, []);

  const createPassword = useCallback(
    async (payload: CreatePasswordPayload) => {
      if (!state.pendingSignup) {
        return { success: false, error: "Signup session expired. Please try again." };
      }

      const result = await authService.createPassword(state.pendingSignup, payload);
      if (result.success && result.user) {
        setState({
          isAuthenticated: true,
          isHydrated: true,
          user: result.user,
          pendingSignup: null,
        });
        return { success: true };
      }
      return { success: false, error: result.error };
    },
    [state.pendingSignup]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    await clearOrganizerProfile();
    clearPostAuthRedirect();
    setState({
      isAuthenticated: false,
      isHydrated: true,
      user: null,
      pendingSignup: null,
    });
  }, []);

  const clearPendingSignup = useCallback(() => {
    setState((prev) => ({ ...prev, pendingSignup: null }));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      sendOTP,
      verifyOTP,
      createPassword,
      logout,
      clearPendingSignup,
    }),
    [
      state,
      login,
      sendOTP,
      verifyOTP,
      createPassword,
      logout,
      clearPendingSignup,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
