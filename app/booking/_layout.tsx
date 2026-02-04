import { Stack } from "expo-router";
import Colors from "../../constants/colors";

export default function BookingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="select-ticket" />
      <Stack.Screen name="participant-details" />
      <Stack.Screen name="review-summary" />
      <Stack.Screen name="payment" />
      <Stack.Screen 
        name="ticket" 
        options={{
          animation: "fade",
          gestureEnabled: false, // Prevent swipe back from ticket
        }}
      />
    </Stack>
  );
}
