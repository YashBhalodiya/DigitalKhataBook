import { AuthProvider } from "@/src/context/AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(shop-owner)" />
        <Stack.Screen name="(customer)" />
      </Stack>
    </AuthProvider>
  );
}
