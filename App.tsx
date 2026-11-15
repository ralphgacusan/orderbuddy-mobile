import React from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { StoreProvider, useStore } from "./src/store";
import {
  HomeScreen,
  ExploreScreen,
  RestaurantScreen,
  RestaurantInfoScreen,
} from "./src/browse";
import {
  ItemScreen,
  CartScreen,
  CheckoutScreen,
  PaymentScreen,
  SwitchRestaurantScreen,
} from "./src/purchase";
import { OrdersScreen, OrderScreen, CancellationScreen } from "./src/orders";
import {
  AccountScreen,
  AuthScreen,
  EditProfileScreen,
  AddressScreen,
  EditAddressScreen,
  HelpScreen,
  PreviewScreen,
} from "./src/account";
function CurrentScreen() {
  const { route } = useStore();
  switch (route.name) {
    case "Home":
      return <HomeScreen />;
    case "Explore":
      return <ExploreScreen />;
    case "Restaurant":
      return <RestaurantScreen />;
    case "RestaurantInfo":
      return <RestaurantInfoScreen />;
    case "Item":
      return <ItemScreen />;
    case "Cart":
      return <CartScreen />;
    case "Checkout":
      return <CheckoutScreen />;
    case "Payment":
    case "Processing":
    case "PaymentFailed":
    case "Confirmed":
    case "CounterTicket":
      return <PaymentScreen />;
    case "SwitchRestaurant":
      return <SwitchRestaurantScreen />;
    case "Orders":
      return <OrdersScreen />;
    case "Tracking":
    case "OrderDetails":
      return <OrderScreen />;
    case "Cancellation":
    case "CancellationReview":
    case "RefundProcessing":
    case "RefundConfirmed":
    case "CancellationDeclined":
      return <CancellationScreen />;
    case "Account":
      return <AccountScreen />;
    case "EditProfile":
      return <EditProfileScreen />;
    case "Addresses":
      return <AddressScreen />;
    case "EditAddress":
      return <EditAddressScreen />;
    case "SignIn":
    case "Register":
    case "Recovery":
    case "ResetSent":
    case "CompleteProfile":
      return <AuthScreen />;
    case "Legal":
    case "Help":
      return <HelpScreen />;
    case "Previews":
      return <PreviewScreen />;
  }
}
function Navigator() {
  const { route } = useStore();
  return (
    <CurrentScreen
      key={`${route.name}-${route.restaurantId || ""}-${route.productId || ""}-${route.orderId || ""}-${route.variant || ""}`}
    />
  );
}
export default function App() {
  const [loaded, error] = useFonts({
    DM: require("@expo-google-fonts/dm-sans/400Regular/DMSans_400Regular.ttf"),
    DMMedium: require("@expo-google-fonts/dm-sans/500Medium/DMSans_500Medium.ttf"),
    DMBold: require("@expo-google-fonts/dm-sans/700Bold/DMSans_700Bold.ttf"),
    Lora: require("@expo-google-fonts/lora/400Regular/Lora_400Regular.ttf"),
  });
  if (!loaded && !error)
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFF",
        }}
      >
        <ActivityIndicator
          color="#171717"
          accessibilityLabel="Loading OrderBuddy"
        />
      </View>
    );
  if (error)
    return (
      <View style={{ flex: 1, padding: 30, justifyContent: "center" }}>
        <Text>
          OrderBuddy could not load its bundled fonts. Restart the app to try
          again.
        </Text>
      </View>
    );
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View
        style={{ flex: 1, backgroundColor: "#F1F1F1", alignItems: "center" }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 480,
            backgroundColor: "#FFF",
          }}
        >
          <StoreProvider>
            <Navigator />
          </StoreProvider>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
