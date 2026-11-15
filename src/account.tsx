import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { useStore, Route } from "./store";
import { Tabs } from "./browse";
import {
  Screen,
  Label,
  Heading,
  Card,
  Badge,
  Button,
  Row,
  Icon,
  Field,
  Empty,
  Notice,
  Divider,
} from "./ui";
export function AccountScreen() {
  const { profile, signedIn, setSignedIn, root, go } = useStore();
  return (
    <Screen title="Account" tabs={<Tabs />}>
      <Card>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#F3F3F3",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Label bold>AS</Label>
        </View>
        <Label size={21} bold>
          {profile.name}
        </Label>
        <Label muted>{profile.email}</Label>
        <Label muted>{profile.phone}</Label>
        <Badge>{signedIn ? "Preview account" : "Guest preview"}</Badge>
      </Card>
      {!signedIn && (
        <Button onPress={() => go({ name: "SignIn" })}>Sign in</Button>
      )}
      <Card style={{ padding: 0 }}>
        {(
          [
            ["edit-2", "Edit profile", "EditProfile"],
            ["file-text", "Order history", "Orders"],
            ["map-pin", "Saved addresses", "Addresses"],
            ["help-circle", "Help", "Help"],
            ["grid", "Screen previews", "Previews"],
          ] as const
        ).map(([icon, title, name]) => (
          <Pressable
            key={name}
            accessibilityRole="button"
            accessibilityLabel={title}
            onPress={() => go({ name })}
            style={{ padding: 16, minHeight: 56 }}
          >
            <Row>
              <Icon name={icon} size={18} />
              <Label style={{ flex: 1 }}>{title}</Label>
              <Icon name="chevron-right" size={16} />
            </Row>
          </Pressable>
        ))}
      </Card>
      {signedIn && (
        <Button
          secondary
          onPress={() => {
            setSignedIn(false);
            root({ name: "Home" });
          }}
        >
          Sign out
        </Button>
      )}
      <Label size={12} muted>
        OrderBuddy · Frontend preview
      </Label>
    </Screen>
  );
}
export function AuthScreen() {
  const { route, profile, setProfile, setSignedIn, go, back, root } =
    useStore();
  const register = route.name === "Register";
  const complete = route.name === "CompleteProfile";
  const recovery = route.name === "Recovery";
  const [name, setName] = useState(register ? "" : profile.name);
  const [email, setEmail] = useState(recovery || register ? "" : profile.email);
  const [phone, setPhone] = useState(register ? "" : profile.phone);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  function submit() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (recovery) {
      go({ name: "ResetSent", variant: email });
      return;
    }
    if ((register || complete) && (!name.trim() || phone.trim().length < 7)) {
      setError("Enter your name and a contact number.");
      return;
    }
    if (!complete && password.length < 8) {
      setError("Use a password with at least 8 characters for this preview.");
      return;
    }
    if (register && password !== confirm) {
      setError("Your passwords do not match.");
      return;
    }
    setProfile({
      name: name.trim() || profile.name,
      email: email.trim(),
      phone: phone.trim() || profile.phone,
    });
    setSignedIn(true);
    root({ name: "Home" });
  }
  if (route.name === "ResetSent")
    return (
      <Screen title="Password recovery" onBack={back}>
        <Heading>Check your inbox.</Heading>
        <Label>
          If an account exists for {route.variant}, a reset link would be sent
          by the connected app.
        </Label>
        <Notice title="Email screen preview">
          This frontend preview does not send an email.
        </Notice>
        <Button onPress={() => go({ name: "SignIn" })}>Back to sign in</Button>
        <Button secondary onPress={back}>
          Try another email
        </Button>
      </Screen>
    );
  return (
    <Screen
      title={
        register
          ? "Create account"
          : complete
            ? "Complete profile"
            : recovery
              ? "Password recovery"
              : "OrderBuddy"
      }
      brand={!register && !complete && !recovery}
      onBack={back}
      footer={
        register || complete ? (
          <Button onPress={submit}>
            {register ? "Create preview account" : "Continue"}
          </Button>
        ) : undefined
      }
    >
      {complete && <Badge>Google profile preview</Badge>}
      <Heading
        subtitle={
          register
            ? "A few details, then you’re ready to order."
            : complete
              ? "Add your collection name and contact number."
              : recovery
                ? "Enter the email linked to your account."
                : "Your next great meal starts here."
        }
      >
        {register
          ? "Good food starts here."
          : complete
            ? "One last thing, Alex."
            : recovery
              ? "Reset your password"
              : "Welcome back."}
      </Heading>
      {(register || complete) && (
        <Field
          label="Full name"
          value={name}
          onChange={setName}
          placeholder="Your name"
        />
      )}
      <Field
        label={complete ? "Email returned by Google" : "Email address"}
        value={email}
        onChange={setEmail}
        editable={!complete}
        keyboardType="email-address"
        placeholder="you@example.com"
      />
      {(register || complete) && (
        <Field
          label="Mobile number"
          value={phone}
          onChange={setPhone}
          keyboardType="phone-pad"
          placeholder="09XX XXX XXXX"
        />
      )}
      {!recovery && !complete && (
        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          secure
          placeholder="At least 8 characters"
        />
      )}
      {register && (
        <Field
          label="Confirm password"
          value={confirm}
          onChange={setConfirm}
          secure
          placeholder="Re-enter your password"
        />
      )}
      {!!error && (
        <Label size={13} bold>
          {error}
        </Label>
      )}
      {register && (
        <>
          <Label size={12} muted>
            Account and legal information are shown as a design preview.
          </Label>
          <Row>
            <Button
              secondary
              onPress={() => go({ name: "Legal", variant: "Terms" })}
              style={{ flex: 1 }}
            >
              Terms
            </Button>
            <Button
              secondary
              onPress={() => go({ name: "Legal", variant: "Privacy" })}
              style={{ flex: 1 }}
            >
              Privacy
            </Button>
          </Row>
        </>
      )}
      {!register && !complete && (
        <>
          <Button onPress={submit}>
            {recovery ? "Preview reset link" : "Sign in to preview"}
          </Button>
          {!recovery && (
            <>
              <Button secondary onPress={() => go({ name: "Recovery" })}>
                Forgot password?
              </Button>
              <Divider />
              <Button secondary onPress={() => go({ name: "CompleteProfile" })}>
                Continue with Google preview
              </Button>
              <Button secondary onPress={() => go({ name: "Register" })}>
                Create account
              </Button>
            </>
          )}
          <Button secondary onPress={() => root({ name: "Explore" })}>
            Explore restaurants
          </Button>
        </>
      )}
      <Label size={12} muted>
        Local preview only. Use sample details rather than a real password.
      </Label>
    </Screen>
  );
}
export function EditProfileScreen() {
  const { profile, setProfile, back } = useStore();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [error, setError] = useState("");
  return (
    <Screen
      title="Edit profile"
      onBack={back}
      footer={
        <Button
          onPress={() => {
            if (!name.trim() || phone.trim().length < 7) {
              setError("Enter your name and a contact number.");
              return;
            }
            setProfile({ ...profile, name: name.trim(), phone: phone.trim() });
            back();
          }}
        >
          Save changes
        </Button>
      }
    >
      <Heading subtitle="Keep the name and number for your orders current.">
        Your collection details
      </Heading>
      <Field label="Full name" value={name} onChange={setName} />
      <Field
        label="Mobile number"
        value={phone}
        onChange={setPhone}
        keyboardType="phone-pad"
      />
      <Field
        label="Email address · read-only"
        value={profile.email}
        editable={false}
      />
      {!!error && <Label>{error}</Label>}
      <Button secondary onPress={back}>
        Cancel
      </Button>
    </Screen>
  );
}
export function AddressScreen() {
  const { addresses, addressId, setAddressId, go, back, profile } = useStore();
  return (
    <Screen title="Saved addresses" onBack={back}>
      <Heading>Where should we deliver?</Heading>
      {addresses.map((address) => (
        <Card key={address.id}>
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ checked: address.id === addressId }}
            onPress={() => {
              setAddressId(address.id);
              back();
            }}
          >
            <Row>
              <Label size={17} bold style={{ flex: 1 }}>
                {address.label}
                {address.id === addressId ? " · Default" : ""}
              </Label>
              <Icon
                name={address.id === addressId ? "check-circle" : "circle"}
                size={20}
              />
            </Row>
            <Label style={{ marginTop: 8 }}>{address.street}</Label>
            <Label size={12} muted>
              {profile.name} · {profile.phone}
            </Label>
          </Pressable>
          <Button
            secondary
            onPress={() => go({ name: "EditAddress", variant: address.id })}
          >
            Edit address
          </Button>
        </Card>
      ))}
      <Button onPress={() => go({ name: "EditAddress" })}>
        Add new address
      </Button>
      <Label size={13} muted>
        Choose an address to see restaurants that deliver to your area.
      </Label>
    </Screen>
  );
}
export function EditAddressScreen() {
  const { route, addresses, setAddresses, setAddressId, back } = useStore();
  const original = addresses.find((address) => address.id === route.variant);
  const [label, setLabel] = useState(original?.label || "Home");
  const [street, setStreet] = useState(original?.street || "");
  const [instructions, setInstructions] = useState(
    original?.instructions || "",
  );
  const [error, setError] = useState("");
  return (
    <Screen
      title={original ? "Edit address" : "Add address"}
      onBack={back}
      footer={
        <Button
          onPress={() => {
            if (!label.trim() || street.trim().length < 8) {
              setError("Add an address label and a complete street address.");
              return;
            }
            const address = {
              id: original?.id || `address-${Date.now()}`,
              label: label.trim(),
              street: street.trim(),
              instructions: instructions.trim(),
            };
            setAddresses((current) =>
              original
                ? current.map((entry) =>
                    entry.id === original.id ? address : entry,
                  )
                : [...current, address],
            );
            setAddressId(address.id);
            back();
          }}
        >
          Save address
        </Button>
      }
    >
      <Heading subtitle="Make it easy for your rider to find you.">
        Your delivery address
      </Heading>
      <Field
        label="Address label"
        value={label}
        onChange={setLabel}
        placeholder="Home or Work"
      />
      <Field
        label="Street address and city"
        value={street}
        onChange={setStreet}
        placeholder="House, street, barangay, city"
        multiline
      />
      <Field
        label="Delivery instructions · optional"
        value={instructions}
        onChange={setInstructions}
        multiline
      />
      {!!error && <Label bold>{error}</Label>}
    </Screen>
  );
}
export function HelpScreen() {
  const { route, back } = useStore();
  return (
    <Screen
      title={
        route.name === "Legal" ? route.variant || "Information" : "Get help"
      }
      onBack={back}
    >
      <Heading>
        {route.name === "Legal"
          ? `${route.variant} information`
          : route.variant === "rider"
            ? "Contact your rider"
            : "How can we help?"}
      </Heading>
      <Notice title="Frontend preview">
        {route.name === "Legal"
          ? "Final terms and privacy content will be supplied before account services are connected."
          : "Calling and messaging will be available when restaurant and delivery services are connected."}
      </Notice>
      {route.name !== "Legal" && (
        <Card>
          <Label bold>Order support</Label>
          <Label muted>
            Keep your order number ready when checking a payment, reporting an
            issue, or asking about collection.
          </Label>
        </Card>
      )}
      <Button secondary onPress={back}>
        Go back
      </Button>
    </Screen>
  );
}
export function PreviewScreen() {
  const { go, back, setOrders, orders } = useStore();
  function open(route: Route) {
    if (
      route.orderId === "OB-1045" &&
      !orders.some((order) => order.id === "OB-1045")
    )
      setOrders((current) => [
        {
          ...current.find((order) => order.id === "OB-1042")!,
          id: "OB-1045",
          mode: "Delivery",
          total: 250,
          status: "On the way",
          address: "12 Sample Street, Quezon City",
        },
        ...current,
      ]);
    go(route);
  }
  const groups: [string, [string, Route][]][] = [
    [
      "Account",
      [
        ["Sign in", { name: "SignIn" }],
        ["Create account", { name: "Register" }],
        ["Password recovery", { name: "Recovery" }],
        [
          "Reset email state",
          { name: "ResetSent", variant: "alex@example.com" },
        ],
        ["Complete Google profile", { name: "CompleteProfile" }],
        ["Edit profile", { name: "EditProfile" }],
      ],
    ],
    [
      "Ordering",
      [
        ["Home", { name: "Home" }],
        ["Restaurant discovery", { name: "Explore" }],
        ["Urban Bites menu", { name: "Restaurant", restaurantId: "urban" }],
        [
          "Item details",
          { name: "Item", productId: "burger", restaurantId: "urban" },
        ],
        ["Cart", { name: "Cart" }],
        ["Checkout", { name: "Checkout" }],
        ["Online payment", { name: "Payment", orderId: "OB-1042" }],
        ["Payment processing", { name: "Processing", orderId: "OB-1042" }],
        ["Payment unsuccessful", { name: "PaymentFailed", orderId: "OB-1042" }],
        ["Payment confirmed", { name: "Confirmed", orderId: "OB-1042" }],
        ["Counter ticket", { name: "CounterTicket", orderId: "OB-1043" }],
        ["Saved addresses", { name: "Addresses" }],
        [
          "Switch restaurant",
          { name: "SwitchRestaurant", restaurantId: "slice" },
        ],
      ],
    ],
    [
      "Order states",
      [
        [
          "Preparing",
          { name: "Tracking", orderId: "OB-1042", status: "Preparing" },
        ],
        [
          "Awaiting acceptance",
          {
            name: "Tracking",
            orderId: "OB-1042",
            status: "Awaiting acceptance",
          },
        ],
        [
          "Ready for collection",
          {
            name: "Tracking",
            orderId: "OB-1042",
            status: "Ready for collection",
          },
        ],
        [
          "Collected",
          { name: "Tracking", orderId: "OB-1042", status: "Collected" },
        ],
        [
          "Delivery on the way",
          { name: "Tracking", orderId: "OB-1045", status: "On the way" },
        ],
        ["Past order details", { name: "OrderDetails", orderId: "OB-1037" }],
        ["Cancellation request", { name: "Cancellation", orderId: "OB-1041" }],
        [
          "Cancellation under review",
          { name: "CancellationReview", orderId: "OB-1041" },
        ],
        ["Refund processing", { name: "RefundProcessing", orderId: "OB-1041" }],
        ["Refund confirmed", { name: "RefundConfirmed", orderId: "OB-1041" }],
        [
          "Cancellation declined",
          { name: "CancellationDeclined", orderId: "OB-1041" },
        ],
      ],
    ],
    [
      "Empty and unavailable",
      [
        ["Empty cart", { name: "Cart", variant: "empty" }],
        ["No previous orders", { name: "Orders", variant: "empty" }],
        ["No search results", { name: "Explore", variant: "not-a-restaurant" }],
        ["Restaurant paused", { name: "Restaurant", restaurantId: "kitchen" }],
        [
          "Unavailable item",
          { name: "Item", restaurantId: "urban", productId: "brownie" },
        ],
      ],
    ],
  ];
  return (
    <Screen title="Screen previews" onBack={back}>
      <Heading subtitle="Explore the mobile UI with local sample data.">
        OrderBuddy screens
      </Heading>
      {groups.map(([title, entries]) => (
        <View key={title} style={{ gap: 10 }}>
          <Label size={18} bold>
            {title}
          </Label>
          {entries.map(([label, route]) => (
            <Button key={label} secondary onPress={() => open(route)}>
              {label}
            </Button>
          ))}
        </View>
      ))}
    </Screen>
  );
}
