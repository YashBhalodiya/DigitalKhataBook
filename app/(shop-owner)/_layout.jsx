import { Stack } from "expo-router";

export default function ShopOwnerLayout() {
  return (
    <>
      <Stack screenOptions={{headerShown: false}}>
        {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}

        <Stack.Screen 
          name="Dashboard" 
          options={{ 
            // headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="ProfileScreen" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="AddCustomerModal" 
          options={{ 
            presentation: "modal",
            headerShown: false,
            animation: "slide_from_bottom"
          }} 
        />
        <Stack.Screen 
          name="ListAllCustomers" 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack>
    </>
  );
}
