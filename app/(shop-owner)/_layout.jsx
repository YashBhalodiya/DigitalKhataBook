import { Stack } from "expo-router";

export default function ShopOwner(){
    return(
        <Stack>
            <Stack.Screen name="dashboard" options={{headerShown: false}} />
            <Stack.Screen name="AddCustomerModal" options={{headerShown: false, presentation: 'modal'}} />
        </Stack>
    )
}