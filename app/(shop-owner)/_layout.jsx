import { Stack } from "expo-router";

export default function ShopOwnerLayout() {
  return (
    <>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="add-customer-modal" 
          options={{ 
            presentation: "modal",
            headerShown: false,
            animation: "slide_from_bottom"
          }} 
        />
      </Stack>
    </>
  );
}
