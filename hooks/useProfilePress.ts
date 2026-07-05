import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useAuth } from "../store/authStore";

export function useProfilePress(onOpenAuth: () => void) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  const handleProfilePress = useCallback(() => {
    if (!isHydrated) return;

    if (isAuthenticated) {
      router.push("/profile");
      return;
    }

    onOpenAuth();
  }, [isAuthenticated, isHydrated, onOpenAuth, router]);

  return { handleProfilePress, isAuthenticated, isHydrated };
}
