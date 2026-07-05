import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../store/authStore";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="event/[id]" />
          <Stack.Screen name="booking" />
          <Stack.Screen name="organizer" />
          <Stack.Screen name="race-results" />
          <Stack.Screen name="auth" />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
