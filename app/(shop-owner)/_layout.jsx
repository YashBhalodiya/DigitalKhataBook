import { Stack } from "expo-router";

export default function ShopOwnerLayout() {
  return (
    <>
      <Stack screenOptions={{headerShown: false}}>

        <Stack.Screen 
          name="Dashboard"  
        />
        <Stack.Screen 
          name="ProfileScreen" 
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
        />
        <Stack.Screen 
          name="AddCreditEntry"  
        />

      </Stack>
    </>
  );
}
