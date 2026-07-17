import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authService from "../services/auth.service";
import { getAccessToken } from "../services/apiClient";
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
  token: null,
  pendingSignup: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  const refreshUser = useCallback(async () => {
    const user = await authService.getProfile();
    const token = await getAccessToken();
    setState((prev) => ({
      ...prev,
      isAuthenticated: Boolean(user && token),
      user,
      token,
    }));
  }, []);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      const token = await getAccessToken();
      const stored = await authService.getStoredSession();

      if (!mounted) return;

      // Mark hydrated immediately from local session so UI actions (profile icon)
      // are not blocked while /auth/me is in flight.
      if (token && stored) {
        setState({
          isAuthenticated: true,
          isHydrated: true,
          user: stored,
          token,
          pendingSignup: null,
        });

        try {
          const user = (await authService.getProfile()) ?? stored;
          if (!mounted) return;
          setState((prev) => ({
            ...prev,
            isAuthenticated: true,
            user,
            token,
          }));
        } catch {
          // Keep local session if network refresh fails.
        }
        return;
      }

      setState({
        isAuthenticated: false,
        isHydrated: true,
        user: null,
        token: null,
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
    if (result.success && result.user && result.token) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: result.user!,
        token: result.token!,
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

  const verifyOTP = useCallback(
    async (payload: OTPVerificationPayload) => {
      if (!state.pendingSignup) {
        return { success: false, error: "Signup session expired. Please try again." };
      }
      const result = await authService.verifyOTP({
        ...payload,
        ...state.pendingSignup,
      });
      return { success: result.success, error: result.error };
    },
    [state.pendingSignup]
  );

  const createPassword = useCallback(
    async (payload: CreatePasswordPayload) => {
      if (!state.pendingSignup) {
        return { success: false, error: "Signup session expired. Please try again." };
      }

      const result = await authService.createPassword(state.pendingSignup, payload);
      if (result.success && result.user && result.token) {
        setState({
          isAuthenticated: true,
          isHydrated: true,
          user: result.user,
          token: result.token,
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
      token: null,
      pendingSignup: null,
    });
  }, []);

  const clearPendingSignup = useCallback(() => {
    setState((prev) => ({ ...prev, pendingSignup: null }));
  }, []);

  const isOrganizerProfileCompleted = Boolean(
    state.user?.organizerProfile?.isProfileCompleted
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      sendOTP,
      verifyOTP,
      createPassword,
      logout,
      clearPendingSignup,
      refreshUser,
      isOrganizerProfileCompleted,
    }),
    [
      state,
      login,
      sendOTP,
      verifyOTP,
      createPassword,
      logout,
      clearPendingSignup,
      refreshUser,
      isOrganizerProfileCompleted,
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
