import { Stack } from "expo-router";
import Colors from "../../constants/colors";

export default function OrganizerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="create-event" />
    </Stack>
  );
}
