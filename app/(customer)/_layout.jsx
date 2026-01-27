import { Stack } from "expo-router";

export default function CustomerLayout() {
  return (
    <Stack>
      <Stack.Screen name="CustomerDashboard" options={{ headerShown: false }} />
      <Stack.Screen name="CustomerProfile" options={{ title: "Profile" }} />
      <Stack.Screen
        name="CustomerTransaction"
        options={{ title: "Transactions" }}
      />
    </Stack>
  );
}
