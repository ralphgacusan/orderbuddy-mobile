import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { useStore } from "./store";
import {
  CartItem,
  Mode,
  Order,
  productById,
  restaurantById,
  canAdd,
  changeQuantity,
  totals,
  money,
  itemPrice,
  sameBasket,
} from "./model";
import {
  Screen,
  Label,
  Heading,
  Button,
  Choices,
  Card,
  Badge,
  Food,
  Row,
  Pair,
  Divider,
  Counter,
  Field,
  Notice,
  Empty,
} from "./ui";

export function ItemScreen() {
  const { route, go, back, cart, setCart } = useStore();
  const product = productById(route.productId || "burger");
  const restaurant = restaurantById(route.restaurantId || "urban");
  const editing = cart.find((item) => item.key === route.itemKey);
  const [quantity, setQuantity] = useState(editing?.quantity || 1);
  const [size, setSize] = useState(editing?.large ? "Large" : "Regular");
  const [preparation, setPreparation] = useState(
    editing?.preparation || "Fresh",
  );
  const [cheese, setCheese] = useState(editing?.cheese ? "+1 slice" : "None");
  const [note, setNote] = useState(editing?.note || "");
  const item: CartItem = {
    key: editing?.key || `${product.id}-${Date.now()}`,
    productId: product.id,
    restaurantId: restaurant.id,
    quantity,
    large: size === "Large",
    cheese: cheese !== "None",
    preparation,
    note,
  };
  const available = product.available && restaurant.open;
  function add() {
    if (!canAdd(cart, restaurant.id)) {
      go({
        name: "SwitchRestaurant",
        pendingItem: item,
        restaurantId: restaurant.id,
      });
      return;
    }
    setCart((items) =>
      editing
        ? items.map((entry) => (entry.key === editing.key ? item : entry))
        : [...items, item],
    );
    go({ name: "Cart" });
  }
  return (
    <Screen
      title={restaurant.name}
      onBack={back}
      footer={
        <Row>
          <Counter
            value={quantity}
            onChange={(value) => setQuantity(Math.max(1, Math.min(20, value)))}
          />
          <Button disabled={!available} onPress={add} style={{ flex: 1 }}>
            {available
              ? `${editing ? "Save changes" : "Add to cart"} · ${money(itemPrice(item) * quantity)}`
              : "Unavailable"}
          </Button>
        </Row>
      }
    >
      <Food kind={product.kind} height={210} />
      <Row style={{ justifyContent: "space-between" }}>
        <Label size={25} bold style={{ flex: 1 }}>
          {product.name}
        </Label>
        <Label bold>{money(product.price)}</Label>
      </Row>
      <Label muted>{product.description}</Label>
      {!available && (
        <Notice title="Currently unavailable">
          This item can’t be added right now. Explore another restaurant
          favorite.
        </Notice>
      )}
      <Label size={13} bold>
        Preparation
      </Label>
      <Choices
        options={["Fresh", "Toasted"]}
        value={preparation}
        onChange={setPreparation}
      />
      <Label size={13} bold>
        Size
      </Label>
      <Choices options={["Regular", "Large"]} value={size} onChange={setSize} />
      <Label size={12} muted>
        Regular {money(product.price)} · Large {money(product.price + 20)}
      </Label>
      <Label size={13} bold>
        Extra cheese
      </Label>
      <Choices
        options={["None", "+1 slice"]}
        value={cheese}
        onChange={setCheese}
      />
      <Label size={12} muted>
        Extra cheese +₱30
      </Label>
      <Field
        label="Kitchen note · optional"
        value={note}
        onChange={setNote}
        placeholder="Any simple requests?"
        multiline
      />
    </Screen>
  );
}
export function BasketItems({
  items,
  editable = false,
}: {
  items: CartItem[];
  editable?: boolean;
}) {
  const { setCart, go } = useStore();
  return (
    <>
      {items.map((item) => {
        const product = productById(item.productId);
        return (
          <Card key={item.key}>
            <Row style={{ alignItems: "flex-start" }}>
              <Food kind={product.kind} width={60} height={64} />
              <View style={{ flex: 1, gap: 5 }}>
                <Label bold>{product.name}</Label>
                <Label size={12} muted>
                  {item.preparation} · {item.large ? "Large" : "Regular"} ·{" "}
                  {item.cheese ? "Extra cheese" : "No extras"}
                </Label>
                {!!item.note && (
                  <Label size={12} muted>
                    {item.note}
                  </Label>
                )}
                <Label bold>{money(itemPrice(item) * item.quantity)}</Label>
              </View>
              {!editable && <Label size={12}>×{item.quantity}</Label>}
            </Row>
            {editable && (
              <Row style={{ justifyContent: "space-between", gap: 4 }}>
                <Counter
                  value={item.quantity}
                  onChange={(quantity) =>
                    setCart((current) =>
                      changeQuantity(current, item.key, quantity),
                    )
                  }
                />
                <Button
                  secondary
                  onPress={() =>
                    go({
                      name: "Item",
                      restaurantId: item.restaurantId,
                      productId: item.productId,
                      itemKey: item.key,
                    })
                  }
                  style={{ minHeight: 44 }}
                >
                  Edit
                </Button>
                <Button
                  secondary
                  onPress={() =>
                    setCart((current) =>
                      current.filter((entry) => entry.key !== item.key),
                    )
                  }
                  style={{ minHeight: 44 }}
                >
                  Remove
                </Button>
              </Row>
            )}
          </Card>
        );
      })}
    </>
  );
}
export function CartScreen() {
  const { cart: storedCart, go, back, root, route } = useStore();
  const cart = route.variant === "empty" ? [] : storedCart;
  const amount = totals(cart, "Pickup");
  return (
    <Screen
      title="Cart"
      onBack={back}
      footer={
        cart.length ? (
          <Button
            disabled={amount.subtotal < 100}
            onPress={() => go({ name: "Checkout" })}
          >
            {amount.subtotal < 100
              ? "₱100 minimum order"
              : `Checkout · ${money(amount.total)}`}
          </Button>
        ) : undefined
      }
    >
      {cart.length ? (
        <>
          <Label size={12} bold>
            {restaurantById(cart[0].restaurantId).name} ·{" "}
            {restaurantById(cart[0].restaurantId).branch}
          </Label>
          <Label muted>
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </Label>
          <BasketItems items={cart} editable />
          <Divider />
          <Pair label="Subtotal" value={money(amount.subtotal)} bold />
          <Button
            secondary
            onPress={() =>
              go({ name: "Restaurant", restaurantId: cart[0].restaurantId })
            }
          >
            Add more items
          </Button>
          <Label size={12} muted>
            Delivery and service fees appear at checkout.
          </Label>
        </>
      ) : (
        <Empty
          title="Your cart is empty."
          message="Find something good for your next little pause."
          action="Explore the menu"
          onPress={() => root({ name: "Explore" })}
        />
      )}
    </Screen>
  );
}
export function CheckoutScreen() {
  const store = useStore();
  const {
    cart,
    mode,
    setMode,
    go,
    back,
    address,
    profile,
    setOrders,
    setCart,
  } = store;
  const [payment, setPayment] = useState("Pay online");
  if (!cart.length) return <CartScreen />;
  const restaurant = restaurantById(cart[0].restaurantId);
  const amount = totals(cart, mode);
  const counter = mode === "In-store" && payment === "Pay at counter";
  function place() {
    const pending = store.orders.find(
      (order) =>
        !order.paid &&
        order.status === "Awaiting acceptance" &&
        order.mode === mode &&
        order.total === amount.total &&
        sameBasket(order.items, cart),
    );
    const id =
      pending?.id ||
      `OB-${Math.max(1044, ...store.orders.map((order) => Number(order.id.replace("OB-", "")))) + 1}`;
    const order: Order = {
      id,
      restaurantId: restaurant.id,
      items: cart.map((item) => ({ ...item })),
      mode,
      total: amount.total,
      paid: false,
      status: "Awaiting acceptance",
      date: "Today · Just now",
      address: mode === "Delivery" ? address.street : restaurant.branch,
    };
    if (!pending) setOrders((current) => [order, ...current]);
    if (counter) setCart([]);
    go({ name: counter ? "CounterTicket" : "Payment", orderId: id });
  }
  return (
    <Screen
      title="Checkout"
      onBack={back}
      footer={
        <Button
          disabled={amount.subtotal < 100 || (mode === "Delivery" && !address)}
          onPress={place}
        >
          {counter ? "Place order" : "Pay online"} · {money(amount.total)}
        </Button>
      }
    >
      <Choices
        options={["Delivery", "Pickup", "In-store"] as const}
        value={mode}
        onChange={setMode}
      />
      <Heading>
        {mode === "Delivery" ? "Delivery from" : "Pickup at"} {restaurant.name}
      </Heading>
      <Card>
        <Label bold>
          {mode === "Delivery"
            ? `${address.label} · ${profile.name}`
            : restaurant.name + " · " + restaurant.branch}
        </Label>
        <Label>
          {mode === "Delivery"
            ? address.street
            : "Collect at the restaurant counter"}
        </Label>
        <Label size={12} muted>
          {profile.phone}
          {mode === "Delivery" ? ` · ${address.instructions}` : ""}
        </Label>
        <Button
          secondary
          onPress={() =>
            go({ name: mode === "Delivery" ? "Addresses" : "EditProfile" })
          }
        >
          Edit {mode === "Delivery" ? "address" : "details"}
        </Button>
      </Card>
      <Card>
        <Label size={16} bold>
          Your order · {restaurant.name}
        </Label>
        {cart.map((item) => (
          <Pair
            key={item.key}
            label={`${item.quantity} × ${productById(item.productId).name}`}
            value={money(itemPrice(item) * item.quantity)}
          />
        ))}
        <Divider />
        <Pair label="Subtotal" value={money(amount.subtotal)} />
        {mode === "Delivery" && (
          <>
            <Pair label="Delivery fee" value={money(amount.delivery)} />
            <Pair label="Service fee" value={money(amount.service)} />
          </>
        )}
        <Pair label="Total" value={money(amount.total)} bold />
      </Card>
      {mode === "In-store" && (
        <Choices
          options={["Pay online", "Pay at counter"]}
          value={payment}
          onChange={setPayment}
        />
      )}
      <Label bold>
        {counter ? "Pay at the counter" : "GCash via PayMongo"}
      </Label>
      <Label size={13} muted>
        {counter
          ? "Submit once, then show your order number to the cashier."
          : "Online payment is represented by a local preview. No payment will be taken."}
      </Label>
      {mode === "Delivery" && (
        <Label size={13}>Estimated arrival · {restaurant.time} minutes</Label>
      )}
    </Screen>
  );
}
export function SwitchRestaurantScreen() {
  const { route, cart, setCart, go, back } = useStore();
  const restaurant = restaurantById(route.restaurantId || "slice");
  return (
    <Screen title="Switch restaurant" onBack={back}>
      <Heading>Start a new basket?</Heading>
      <Label>
        Your basket has {cart.length} items from{" "}
        {cart.length
          ? restaurantById(cart[0].restaurantId).name
          : "another restaurant"}
        . Each order is placed with one restaurant.
      </Label>
      <Card>
        <Label size={20} bold>
          {restaurant.name}
        </Label>
        <Label muted>Starting here replaces the current basket.</Label>
      </Card>
      <Button secondary onPress={back}>
        Keep current basket
      </Button>
      <Button
        onPress={() => {
          if (route.pendingItem) setCart([route.pendingItem]);
          else setCart([]);
          go({ name: "Cart" });
        }}
      >
        Start {restaurant.name} basket
      </Button>
    </Screen>
  );
}
export function PaymentScreen() {
  const { route, orders, go, back, root, updateOrder, setCart } = useStore();
  const order = orders.find((entry) => entry.id === route.orderId) || orders[0];
  const merchant = restaurantById(order.restaurantId);
  const complete = () => {
    updateOrder(order.id, { paid: true });
    setCart((current) => (sameBasket(current, order.items) ? [] : current));
    go({ name: "Confirmed", orderId: order.id });
  };
  if (route.name === "Processing")
    return (
      <Screen title="Online payment" onBack={back}>
        <Badge>Payment processing</Badge>
        <Heading subtitle="We’re waiting for provider confirmation.">
          Checking your payment.
        </Heading>
        <Label size={28} bold>
          {order.id}
        </Label>
        <Pair label="Amount" value={money(order.total)} />
        <Notice title="Please don’t pay again yet">
          A redirect or screenshot does not confirm payment. Check the current
          status for this order.
        </Notice>
        <Label size={12} muted>
          Choose an outcome to preview the payment screens.
        </Label>
        <Button onPress={complete}>Preview confirmed payment</Button>
        <Button
          secondary
          onPress={() => go({ name: "PaymentFailed", orderId: order.id })}
        >
          Preview unsuccessful payment
        </Button>
        <Button secondary onPress={() => root({ name: "Orders" })}>
          Back to orders
        </Button>
      </Screen>
    );
  if (route.name === "PaymentFailed")
    return (
      <Screen title="Online payment" onBack={back}>
        <Badge>Payment unsuccessful</Badge>
        <Heading subtitle="This preview attempt was unsuccessful.">
          Your order is still here.
        </Heading>
        <Label size={26} bold>
          {order.id}
        </Label>
        <BasketItems items={order.items} />
        <Pair label="Total" value={money(order.total)} bold />
        <Button onPress={() => go({ name: "Payment", orderId: order.id })}>
          Retry payment
        </Button>
        <Button
          secondary
          onPress={() => go({ name: "Processing", orderId: order.id })}
        >
          Check payment status
        </Button>
        <Label size={12} muted>
          If your wallet was debited, check the status before another attempt.
        </Label>
      </Screen>
    );
  if (route.name === "Confirmed")
    return (
      <Screen
        title="Payment confirmed"
        onBack={back}
        footer={
          <Button onPress={() => root({ name: "Tracking", orderId: order.id })}>
            Track order
          </Button>
        }
      >
        <Label size={12} bold>
          {merchant.name} · {merchant.branch}
        </Label>
        <Badge dark>✓ Payment confirmed</Badge>
        <Heading subtitle={`${merchant.name} is reviewing your order.`}>
          Payment confirmed
        </Heading>
        <Label size={32} bold>
          {order.id}
        </Label>
        <Badge>Awaiting acceptance</Badge>
        <Card>
          <Pair label="Mode" value={order.mode} />
          <Pair label="Total paid" value={money(order.total)} />
          <Pair label="Payment" value="GCash" />
          <Pair label="Verified" value="Just now · Preview" />
        </Card>
        <Label muted>
          {order.mode === "Delivery"
            ? `For delivery to ${order.address}. Track preparation and rider updates.`
            : "Collect at the restaurant counter when your order is ready."}
        </Label>
        <Button secondary onPress={() => root({ name: "Home" })}>
          Back to home
        </Button>
      </Screen>
    );
  if (route.name === "CounterTicket")
    return (
      <Screen
        title="Counter payment ticket"
        onBack={back}
        footer={
          <Button onPress={() => root({ name: "Tracking", orderId: order.id })}>
            View order
          </Button>
        }
      >
        <Label size={12} bold>
          {merchant.name} · {merchant.branch}
        </Label>
        <Badge>Unpaid · Pay at counter</Badge>
        <Heading subtitle="Your order is saved. No need to order again.">
          Show this to the cashier.
        </Heading>
        <Label size={32} bold>
          {order.id}
        </Label>
        <BasketItems items={order.items} />
        <Pair label="Total" value={money(order.total)} bold />
        <Label muted>
          The cashier retrieves this same order and confirms payment before
          preparation.
        </Label>
        <Button
          secondary
          onPress={() => {
            updateOrder(order.id, { status: "Cancelled" });
            root({ name: "Orders" });
          }}
        >
          Cancel unpaid order
        </Button>
      </Screen>
    );
  return (
    <Screen
      title="Online payment"
      onBack={back}
      footer={
        <Button onPress={() => go({ name: "Processing", orderId: order.id })}>
          Continue to payment preview · {money(order.total)}
        </Button>
      }
    >
      <Badge>External checkout preview</Badge>
      <Heading subtitle="Authorize your payment with the provider.">
        Pay securely.
      </Heading>
      <Label size={34} bold>
        {money(order.total)}
      </Label>
      <Card>
        <Label bold>GCash via PayMongo</Label>
        <Label size={12} muted>
          Order reference · {order.id}
        </Label>
      </Card>
      <Notice title="Frontend preview">
        This screen demonstrates the payment handoff. No wallet is connected and
        no money will be charged.
      </Notice>
      <Label size={13} muted>
        In the connected app, enter wallet credentials only on the provider’s
        secure screen.
      </Label>
      <Button secondary onPress={back}>
        Back to checkout
      </Button>
    </Screen>
  );
}
