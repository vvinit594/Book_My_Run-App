import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {/* Tab Navigation - Main screens */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        {/* Other Screens - Full screen flows outside tabs */}
        <Stack.Screen name="event/[id]" />
        <Stack.Screen name="booking" />
        <Stack.Screen name="organizer" />
        <Stack.Screen name="race-results" />
      </Stack>
    </SafeAreaProvider>
  );
}
