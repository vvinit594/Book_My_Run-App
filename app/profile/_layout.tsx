import { Stack } from "expo-router";
import Colors from "../../constants/colors";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.backgroundSecondary },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="organizer-profile" />
      <Stack.Screen name="organizer-events" />
      <Stack.Screen name="organizer-dashboard" />
      <Stack.Screen name="financials" />
      <Stack.Screen name="support" />
      <Stack.Screen name="runner-profile" />
      <Stack.Screen name="registered-events" />
    </Stack>
  );
}
