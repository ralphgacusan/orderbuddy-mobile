import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  useEffect,
} from "react";
import { BackHandler } from "react-native";
import {
  CartItem,
  Mode,
  Order,
  initialCart,
  initialOrders,
  OrderStatus,
} from "./model";
export type ScreenName =
  | "Home"
  | "Explore"
  | "Restaurant"
  | "Item"
  | "Cart"
  | "Checkout"
  | "Payment"
  | "Processing"
  | "PaymentFailed"
  | "Confirmed"
  | "CounterTicket"
  | "Tracking"
  | "Orders"
  | "OrderDetails"
  | "Account"
  | "EditProfile"
  | "RestaurantInfo"
  | "Addresses"
  | "EditAddress"
  | "SignIn"
  | "Register"
  | "Recovery"
  | "ResetSent"
  | "CompleteProfile"
  | "SwitchRestaurant"
  | "Cancellation"
  | "CancellationReview"
  | "RefundProcessing"
  | "RefundConfirmed"
  | "CancellationDeclined"
  | "Previews"
  | "Legal"
  | "Help";
export type Route = {
  name: ScreenName;
  restaurantId?: string;
  productId?: string;
  itemKey?: string;
  orderId?: string;
  status?: OrderStatus;
  variant?: string;
  pendingItem?: CartItem;
};
export type Profile = { name: string; email: string; phone: string };
export type Address = {
  id: string;
  label: string;
  street: string;
  instructions: string;
};
function useAppState() {
  const [history, setHistory] = useState<Route[]>([{ name: "Home" }]);
  const [cart, setCart] = useState<CartItem[]>(
    initialCart.map((item) => ({ ...item })),
  );
  const [orders, setOrders] = useState<Order[]>(
    initialOrders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({ ...item })),
    })),
  );
  const [mode, setMode] = useState<Mode>("Delivery");
  const [profile, setProfile] = useState<Profile>({
    name: "Alex Santos",
    email: "alex@example.com",
    phone: "09XX XXX 1234",
  });
  const [signedIn, setSignedIn] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "home",
      label: "Home",
      street: "12 Sample Street, Quezon City",
      instructions: "Meet at the entrance",
    },
  ]);
  const [addressId, setAddressId] = useState("home");
  const route = history[history.length - 1];
  const go = (next: Route) => setHistory((items) => [...items, next]);
  const root = (next: Route) => setHistory([next]);
  const back = () =>
    setHistory((items) =>
      items.length > 1 ? items.slice(0, -1) : [{ name: "Home" }],
    );
  const updateOrder = (id: string, update: Partial<Order>) =>
    setOrders((items) =>
      items.map((order) => (order.id === id ? { ...order, ...update } : order)),
    );
  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (history.length <= 1) return false;
      back();
      return true;
    });
    return () => handler.remove();
  }, [history.length]);
  return {
    route,
    go,
    root,
    back,
    cart,
    setCart,
    orders,
    setOrders,
    updateOrder,
    mode,
    setMode,
    profile,
    setProfile,
    signedIn,
    setSignedIn,
    addresses,
    setAddresses,
    addressId,
    setAddressId,
    address:
      addresses.find((address) => address.id === addressId) || addresses[0],
  };
}
const Context = createContext<ReturnType<typeof useAppState> | null>(null);
export function StoreProvider({ children }: PropsWithChildren) {
  const state = useAppState();
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export function useStore() {
  const state = useContext(Context);
  if (!state) throw new Error("StoreProvider is required");
  return state;
}
