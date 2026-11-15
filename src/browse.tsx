import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { useStore } from "./store";
import {
  restaurants,
  restaurantById,
  menus,
  productById,
  money,
  Restaurant,
  totals,
} from "./model";
import {
  Screen,
  Label,
  Row,
  Heading,
  Button,
  Choices,
  Search,
  Card,
  Badge,
  Food,
  Icon,
  Empty,
  Notice,
  colors,
} from "./ui";
export function Tabs() {
  const { route, root } = useStore();
  return (
    <Row
      style={{
        borderTopWidth: 1,
        borderColor: colors.line,
        justifyContent: "space-around",
        gap: 0,
        paddingTop: 5,
        backgroundColor: "#FFF",
      }}
    >
      {(["Home", "Explore", "Orders", "Account"] as const).map(
        (name, index) => (
          <Pressable
            key={name}
            accessibilityRole="tab"
            accessibilityState={{ selected: route.name === name }}
            accessibilityLabel={name}
            onPress={() => root({ name })}
            style={{
              flex: 1,
              alignItems: "center",
              gap: 4,
              paddingVertical: 10,
              opacity: route.name === name ? 1 : 0.5,
            }}
          >
            <Icon
              name={(["home", "compass", "file-text", "user"] as const)[index]}
              size={21}
            />
            <Label size={10} bold={route.name === name}>
              {name}
            </Label>
          </Pressable>
        ),
      )}
    </Row>
  );
}
export function RestaurantCard({
  restaurant,
  compact = false,
}: {
  restaurant: Restaurant;
  compact?: boolean;
}) {
  const { go } = useStore();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${restaurant.name}, ${restaurant.cuisine}, ${restaurant.open ? "open" : "paused"}`}
      onPress={() => go({ name: "Restaurant", restaurantId: restaurant.id })}
    >
      <Card
        style={
          compact
            ? {
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                gap: 12,
              }
            : { padding: 0, overflow: "hidden" }
        }
      >
        <Food
          kind={restaurant.kind}
          width={compact ? 78 : "100%"}
          height={compact ? 78 : 145}
        />
        <View style={compact ? { flex: 1, gap: 3 } : { padding: 14, gap: 5 }}>
          <Row style={{ justifyContent: "space-between" }}>
            <Label size={compact ? 15 : 17} bold style={{ flex: 1 }}>
              {restaurant.name}
            </Label>
            {!restaurant.open && <Badge>Paused</Badge>}
          </Row>
          <Label size={12} muted>
            {restaurant.cuisine} · {restaurant.rating} ★
          </Label>
          <Label size={12}>
            {restaurant.time} min · {money(restaurant.fee)} delivery
          </Label>
        </View>
      </Card>
    </Pressable>
  );
}
export function HomeScreen() {
  const { go, mode, setMode, address } = useStore();
  return (
    <Screen
      title="OrderBuddy"
      brand
      onProfile={() => go({ name: "Account" })}
      tabs={<Tabs />}
    >
      <Pressable
        accessibilityRole="button"
        onPress={() => go({ name: "Addresses" })}
      >
        <Label size={13} bold>
          Deliver to {address?.label || "your address"} ⌄
        </Label>
        <Label size={12} muted style={{ marginTop: 6 }}>
          Quezon City · Saved address
        </Label>
      </Pressable>
      <Heading>What sounds good?</Heading>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Search food or restaurants"
        onPress={() => go({ name: "Explore" })}
        style={{
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: 10,
          padding: 15,
        }}
      >
        <Row>
          <Icon name="search" size={17} />
          <Label size={13} muted>
            Search food or restaurants
          </Label>
        </Row>
      </Pressable>
      <Choices
        options={["Delivery", "Pickup"]}
        value={mode === "In-store" ? "Pickup" : mode}
        onChange={setMode}
      />
      <Card
        style={{
          backgroundColor: colors.ink,
          borderColor: colors.ink,
          padding: 18,
          gap: 8,
        }}
      >
        <Label size={10} bold style={{ color: "#D4D4D4" }}>
          LOCAL FAVORITES
        </Label>
        <Label serif size={27} style={{ color: "#FFF" }}>
          Big cravings.{"\n"}Good neighbors.
        </Label>
        <Label size={12} style={{ color: "#DDD" }}>
          Discover a new favorite around you.
        </Label>
      </Card>
      <Row style={{ gap: 8 }}>
        {["Burgers", "Pizza", "Rice", "More"].map((label) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            onPress={() =>
              go({ name: "Explore", variant: label === "More" ? "" : label })
            }
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: label === "Burgers" ? colors.ink : colors.soft,
            }}
          >
            <Label
              size={11}
              bold
              style={{
                textAlign: "center",
                color: label === "Burgers" ? "#FFF" : colors.ink,
              }}
            >
              {label}
            </Label>
          </Pressable>
        ))}
      </Row>
      <Label size={18} bold>
        Popular near you
      </Label>
      {restaurants
        .filter((restaurant) => restaurant.open)
        .map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} compact />
        ))}
    </Screen>
  );
}
export function ExploreScreen() {
  const { route, back } = useStore();
  const [search, setSearch] = useState(route.variant || "");
  const [filter, setFilter] = useState("Nearby");
  const list = restaurants
    .filter((restaurant) =>
      `${restaurant.name} ${restaurant.cuisine}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      filter === "Top rated" ? Number(b.rating) - Number(a.rating) : 0,
    );
  return (
    <Screen title="Restaurants" tabs={<Tabs />}>
      <Heading>Find your next favorite</Heading>
      <Search
        value={search}
        onChange={setSearch}
        placeholder="Search restaurants or cuisines"
      />
      <Choices
        options={["Nearby", "Top rated", "Pickup"]}
        value={filter}
        onChange={setFilter}
      />
      {list.length ? (
        list.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))
      ) : (
        <Empty
          icon="search"
          title="No matches this time."
          message="Try another restaurant name or explore a cuisine."
          action="Clear search"
          onPress={() => setSearch("")}
        />
      )}
    </Screen>
  );
}
export function RestaurantScreen() {
  const { route, go, back, cart, mode, setMode } = useStore();
  const restaurant = restaurantById(route.restaurantId || "urban");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Popular");
  const items = menus[restaurant.id]
    .map(productById)
    .filter(
      (item) =>
        `${item.name} ${item.description}`
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (category === "Popular" || item.category === category),
    );
  return (
    <Screen
      title={restaurant.name}
      onBack={back}
      footer={
        cart.length ? (
          <Button onPress={() => go({ name: "Cart" })}>
            View cart · {cart.reduce((sum, item) => sum + item.quantity, 0)}{" "}
            items · {money(totals(cart, "Pickup").total)}
          </Button>
        ) : undefined
      }
    >
      <Heading
        subtitle={`${restaurant.cuisine} · ${restaurant.rating} ★ (120+)`}
      >
        {restaurant.name}
      </Heading>
      <Choices
        options={["Delivery", "Pickup"]}
        value={mode === "In-store" ? "Pickup" : mode}
        onChange={setMode}
      />
      <Label size={12} muted>
        {restaurant.time} min · {money(restaurant.fee)} delivery · ₱100 minimum
      </Label>
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          go({ name: "RestaurantInfo", restaurantId: restaurant.id })
        }
      >
        <Label size={13} bold>
          Restaurant details →
        </Label>
      </Pressable>
      {!restaurant.open && (
        <Notice title="We’re taking a pause.">
          This restaurant is not accepting orders. You can still browse its
          menu.
        </Notice>
      )}
      <Search
        value={search}
        onChange={setSearch}
        placeholder="Search this restaurant"
      />
      <Choices
        options={["Popular", "Mains", "Sides", "Desserts"]}
        value={category}
        onChange={setCategory}
      />
      <Label size={18} bold>
        Popular picks
      </Label>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {items.map((product) => (
          <Pressable
            key={product.id}
            accessibilityRole="button"
            accessibilityLabel={`${product.name}, ${money(product.price)}${product.available ? "" : ", unavailable"}`}
            onPress={() =>
              go({
                name: "Item",
                restaurantId: restaurant.id,
                productId: product.id,
              })
            }
            style={{ width: "48%" }}
          >
            <Card style={{ padding: 10 }}>
              <Food kind={product.kind} height={110} />
              <Label size={13} bold>
                {product.name}
              </Label>
              <Row style={{ justifyContent: "space-between" }}>
                <Label size={13}>{money(product.price)}</Label>
                <Icon
                  name={product.available && restaurant.open ? "plus" : "slash"}
                  size={17}
                />
              </Row>
              {!product.available && (
                <Label size={10} muted>
                  Unavailable
                </Label>
              )}
            </Card>
          </Pressable>
        ))}
      </View>
      {!items.length && (
        <Empty
          icon="search"
          title="No matches this time."
          message="Try another item name or explore a category."
          action="View all items"
          onPress={() => {
            setSearch("");
            setCategory("Popular");
          }}
        />
      )}
    </Screen>
  );
}
export function RestaurantInfoScreen() {
  const { route, go, back } = useStore();
  const restaurant = restaurantById(route.restaurantId || "urban");
  return (
    <Screen title="Restaurant details" onBack={back}>
      <Heading subtitle={`${restaurant.cuisine} · ${restaurant.rating} ★`}>
        {restaurant.name}
      </Heading>
      <Food kind={restaurant.kind} height={200} />
      <Heading
        subtitle={`Delivery and pickup available\n${restaurant.time} minutes · ${money(restaurant.fee)} delivery`}
      >
        {restaurant.branch}
      </Heading>
      <Card>
        <Label bold>Restaurant information</Label>
        <Label muted>
          Address, hours, and contact details are awaiting restaurant
          confirmation.
        </Label>
      </Card>
      <Button
        onPress={() => go({ name: "Restaurant", restaurantId: restaurant.id })}
      >
        Browse {restaurant.name} menu
      </Button>
    </Screen>
  );
}
