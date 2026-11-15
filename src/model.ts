export type FoodKind = "burger" | "pizza" | "bowl" | "fries" | "brownie";
export type Mode = "Delivery" | "Pickup" | "In-store";
export type OrderStatus =
  | "Awaiting acceptance"
  | "Preparing"
  | "Ready for collection"
  | "On the way"
  | "Collected"
  | "Cancellation under review"
  | "Cancelled"
  | "Refunded";
export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  branch: string;
  rating: string;
  time: string;
  fee: number;
  kind: FoodKind;
  open: boolean;
};
export type Product = {
  id: string;
  name: string;
  price: number;
  kind: FoodKind;
  category: string;
  description: string;
  available: boolean;
};
export type CartItem = {
  key: string;
  productId: string;
  restaurantId: string;
  quantity: number;
  large: boolean;
  cheese: boolean;
  preparation: string;
  note: string;
};
export type Order = {
  id: string;
  restaurantId: string;
  items: CartItem[];
  mode: Mode;
  total: number;
  paid: boolean;
  status: OrderStatus;
  date: string;
  address: string;
  reason?: string;
};
export const restaurants: Restaurant[] = [
  {
    id: "urban",
    name: "Urban Bites",
    branch: "Central branch",
    cuisine: "Burgers · American",
    rating: "4.8",
    time: "20–30",
    fee: 35,
    kind: "burger",
    open: true,
  },
  {
    id: "slice",
    name: "Slice House",
    branch: "North branch",
    cuisine: "Pizza · Italian",
    rating: "4.7",
    time: "25–35",
    fee: 35,
    kind: "pizza",
    open: true,
  },
  {
    id: "rice",
    name: "Rice & Co.",
    branch: "City center",
    cuisine: "Rice bowls · Filipino",
    rating: "4.9",
    time: "15–25",
    fee: 25,
    kind: "bowl",
    open: true,
  },
  {
    id: "kitchen",
    name: "Kanlungan Kitchen",
    branch: "East branch",
    cuisine: "Comfort food · Snacks",
    rating: "4.6",
    time: "15–25",
    fee: 30,
    kind: "bowl",
    open: false,
  },
];
export const products: Product[] = [
  {
    id: "burger",
    name: "Classic Burger",
    price: 120,
    kind: "burger",
    category: "Mains",
    description:
      "Grilled beef, melted cheese, crisp lettuce, and our house sauce.",
    available: true,
  },
  {
    id: "pizza",
    name: "Margherita Pizza",
    price: 140,
    kind: "pizza",
    category: "Mains",
    description: "A golden crust, rich tomato sauce, and melted mozzarella.",
    available: true,
  },
  {
    id: "rice",
    name: "Chicken Rice Bowl",
    price: 140,
    kind: "bowl",
    category: "Mains",
    description: "Tender grilled chicken, fresh greens, and warm rice.",
    available: true,
  },
  {
    id: "salad",
    name: "Garden Salad",
    price: 100,
    kind: "bowl",
    category: "Sides",
    description: "Crisp seasonal greens with our light house dressing.",
    available: true,
  },
  {
    id: "fries",
    name: "Golden Fries",
    price: 85,
    kind: "fries",
    category: "Sides",
    description: "Crisp golden fries, lightly seasoned and made fresh.",
    available: true,
  },
  {
    id: "brownie",
    name: "Chocolate Brownie",
    price: 130,
    kind: "brownie",
    category: "Desserts",
    description:
      "A rich, fudgy chocolate brownie for a little something sweet.",
    available: false,
  },
];
export const menus: Record<string, string[]> = {
  urban: ["burger", "fries", "salad", "brownie"],
  slice: ["pizza", "salad", "fries", "brownie"],
  rice: ["rice", "salad", "fries", "brownie"],
  kitchen: ["rice", "fries", "brownie"],
};
export const money = (value: number) => `₱${value.toLocaleString("en-PH")}`;
export const productById = (id: string) =>
  products.find((product) => product.id === id)!;
export const restaurantById = (id: string) =>
  restaurants.find((restaurant) => restaurant.id === id)!;
export function itemPrice(item: CartItem) {
  return (
    productById(item.productId).price +
    (item.large ? 20 : 0) +
    (item.cheese ? 30 : 0)
  );
}
export function totals(items: CartItem[], mode: Mode) {
  const subtotal = items.reduce(
    (sum, item) => sum + itemPrice(item) * item.quantity,
    0,
  );
  const delivery =
    mode === "Delivery" && items.length
      ? restaurantById(items[0].restaurantId).fee
      : 0;
  const service = mode === "Delivery" && items.length ? 10 : 0;
  return { subtotal, delivery, service, total: subtotal + delivery + service };
}
export function canAdd(items: CartItem[], restaurantId: string) {
  return !items.length || items[0].restaurantId === restaurantId;
}
export function changeQuantity(
  items: CartItem[],
  key: string,
  quantity: number,
) {
  return items
    .map((item) =>
      item.key === key
        ? { ...item, quantity: Math.max(0, Math.min(20, Math.floor(quantity))) }
        : item,
    )
    .filter((item) => item.quantity > 0);
}
export const initialCart: CartItem[] = [
  {
    key: "burger-1",
    productId: "burger",
    restaurantId: "urban",
    quantity: 1,
    large: false,
    cheese: false,
    preparation: "Fresh",
    note: "",
  },
  {
    key: "fries-1",
    productId: "fries",
    restaurantId: "urban",
    quantity: 1,
    large: false,
    cheese: false,
    preparation: "Fresh",
    note: "",
  },
];
export const initialOrders: Order[] = [
  {
    id: "OB-1043",
    restaurantId: "slice",
    items: [
      {
        ...initialCart[0],
        key: "pizza-ticket",
        productId: "pizza",
        restaurantId: "slice",
      },
    ],
    mode: "In-store",
    total: 140,
    paid: false,
    status: "Awaiting acceptance",
    date: "Today · 2:31 PM",
    address: "North branch",
  },
  {
    id: "OB-1041",
    restaurantId: "rice",
    items: [
      {
        ...initialCart[0],
        key: "rice-cancel",
        productId: "rice",
        restaurantId: "rice",
      },
    ],
    mode: "Pickup",
    total: 140,
    paid: true,
    status: "Awaiting acceptance",
    date: "Today · 2:29 PM",
    address: "City center",
  },
  {
    id: "OB-1042",
    restaurantId: "urban",
    items: initialCart,
    mode: "Pickup",
    total: 205,
    paid: true,
    status: "Preparing",
    date: "Today · 2:30 PM",
    address: "Central branch",
  },
  {
    id: "OB-1037",
    restaurantId: "urban",
    items: initialCart,
    mode: "In-store",
    total: 205,
    paid: true,
    status: "Collected",
    date: "8 November · 3:05 PM",
    address: "Central branch",
  },
];
export const isPast = (order: Order) =>
  ["Collected", "Cancelled", "Refunded"].includes(order.status);

export function sameBasket(left: CartItem[], right: CartItem[]) {
  return JSON.stringify(left) === JSON.stringify(right);
}
