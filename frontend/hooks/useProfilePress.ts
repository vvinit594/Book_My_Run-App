import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "../store/authStore";

export function useProfilePress(onOpenAuth: () => void) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  const pendingPressRef = useRef(false);

  const runProfileAction = useCallback(() => {
    if (isAuthenticated) {
      router.push("/profile");
      return;
    }
    onOpenAuth();
  }, [isAuthenticated, onOpenAuth, router]);

  const handleProfilePress = useCallback(() => {
    // On first launch, auth hydration can lag a beat — queue the tap instead of ignoring it.
    if (!isHydrated) {
      pendingPressRef.current = true;
      return;
    }

    runProfileAction();
  }, [isHydrated, runProfileAction]);

  useEffect(() => {
    if (!isHydrated || !pendingPressRef.current) return;
    pendingPressRef.current = false;
    runProfileAction();
  }, [isHydrated, runProfileAction]);

  return { handleProfilePress, isAuthenticated, isHydrated };
}
