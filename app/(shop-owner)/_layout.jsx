import { Stack } from "expo-router";
import { CustomerProvider } from "../../src/context/CustomerContext";

export default function ShopOwnerLayout() {
  return (
    <CustomerProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" />
        <Stack.Screen name="ShopOwnerProfile" />
        <Stack.Screen
          name="AddCustomerModal"
          options={{
            presentation: "modal",
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen name="ListAllCustomers" />
        <Stack.Screen name="AddCreditEntry" />
      </Stack>
    </CustomerProvider>
  );
}
