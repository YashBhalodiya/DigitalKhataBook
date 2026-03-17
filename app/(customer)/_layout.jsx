import { Stack } from "expo-router";

export default function CustomerLayout() {
  return (
    <Stack>
      <Stack.Screen name="CustomerDashboard" options={{ headerShown: false }} />
      <Stack.Screen name="CustomerProfile" options={{ headerShown: false }} />
      <Stack.Screen
        name="CustomerTransaction"
        options={{ title: "Transactions" }}
      />
      <Stack.Screen name="EditProfileModal" options={{ presentation: "modal", headerShown: false, animation: "slide_from_bottom" }} />
      <Stack.Screen name="ChangePasswordModal" options={{ presentation: "modal", headerShown: false, animation: "slide_from_bottom" }} />
    </Stack>
  );
}
