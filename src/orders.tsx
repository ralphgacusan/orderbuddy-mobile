import React, { useState } from "react";
import { View } from "react-native";
import { useStore } from "./store";
import {
  Order,
  isPast,
  money,
  restaurantById,
  productById,
  OrderStatus,
} from "./model";
import { BasketItems } from "./purchase";
import { Tabs } from "./browse";
import {
  Badge,
  Button,
  Card,
  Choices,
  Divider,
  Empty,
  Field,
  Heading,
  Icon,
  Label,
  Notice,
  Pair,
  Row,
  Screen,
  colors,
} from "./ui";
export function OrdersScreen() {
  const { orders, go, root, route } = useStore();
  const [tab, setTab] = useState(route.variant === "past" ? "Past" : "Active");
  const list =
    route.variant === "empty"
      ? []
      : orders.filter((order) =>
          tab === "Past" ? isPast(order) : !isPast(order),
        );
  return (
    <Screen title="My orders" tabs={<Tabs />}>
      <Choices options={["Active", "Past"]} value={tab} onChange={setTab} />
      {list.length ? (
        list.map((order) => (
          <Card key={order.id}>
            <Label size={12} bold>
              {restaurantById(order.restaurantId).name}
            </Label>
            <Row>
              <Badge>{order.status}</Badge>
              <Badge>{order.paid ? "Paid" : "Unpaid"}</Badge>
            </Row>
            <Label size={23} bold>
              {order.id}
            </Label>
            <Label size={12} muted>
              {order.date}
            </Label>
            <Label size={13}>
              {order.items
                .map((item) => productById(item.productId).name)
                .join(" + ")}
            </Label>
            <Pair
              label={`${order.mode} · ${order.items.reduce((sum, item) => sum + item.quantity, 0)} items`}
              value={money(order.total)}
            />
            <Button
              onPress={() =>
                go({
                  name: isPast(order) ? "OrderDetails" : "Tracking",
                  orderId: order.id,
                })
              }
            >
              {isPast(order) ? "View details" : "Track order"}
            </Button>
          </Card>
        ))
      ) : (
        <Empty
          icon="file-text"
          title={
            tab === "Past" ? "No previous orders yet." : "No active orders."
          }
          message={
            tab === "Past"
              ? "Your completed and cancelled orders will appear here."
              : "Your next favorite meal is waiting."
          }
          action="Explore restaurants"
          onPress={() => root({ name: "Explore" })}
        />
      )}
    </Screen>
  );
}
function Timeline({ order, status }: { order: Order; status: OrderStatus }) {
  const labels = [
    "Awaiting acceptance",
    "Preparing",
    ...(order.mode === "Delivery"
      ? ["On the way", "Delivered"]
      : ["Ready for collection", "Collected"]),
  ];
  const stage =
    status === "Collected" ? 3 : Math.max(0, labels.indexOf(status));
  return (
    <View style={{ gap: 18 }}>
      {labels.map((label, index) => (
        <Row key={label} style={{ alignItems: "flex-start" }}>
          <View
            style={{
              width: 25,
              height: 25,
              borderRadius: 13,
              backgroundColor: index <= stage ? colors.ink : "#EEE",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {index <= stage && (
              <Icon
                name={index === stage ? "clock" : "check"}
                size={13}
                color="#FFF"
              />
            )}
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Label bold={index === stage}>{label}</Label>
            <Label muted size={12}>
              {index > stage
                ? "Waiting for an update"
                : index === stage
                  ? "Current order status"
                  : "Confirmed in this preview"}
            </Label>
          </View>
        </Row>
      ))}
    </View>
  );
}
export function OrderScreen() {
  const { route, orders, go, back, root, updateOrder } = useStore();
  const order = orders.find((entry) => entry.id === route.orderId) || orders[0];
  const merchant = restaurantById(order.restaurantId);
  const status = route.status || order.status;
  const details = route.name === "OrderDetails";
  const [controls, setControls] = useState(false);
  const stateOptions: OrderStatus[] =
    order.mode === "Delivery"
      ? ["Awaiting acceptance", "Preparing", "On the way", "Collected"]
      : [
          "Awaiting acceptance",
          "Preparing",
          "Ready for collection",
          "Collected",
        ];
  const stage = stateOptions.indexOf(status);
  return (
    <Screen
      title={details ? "Past order details" : "Your order"}
      onBack={back}
      footer={
        status === "Collected" ? (
          <Button onPress={() => root({ name: "Home" })}>Back to home</Button>
        ) : undefined
      }
    >
      <Label size={12} bold>
        {merchant.name} · {merchant.branch}
      </Label>
      <Row>
        <Badge dark={status === "Ready for collection"}>{status}</Badge>
        <Badge>{order.paid ? "Paid · GCash" : "Awaiting payment"}</Badge>
      </Row>
      <Heading subtitle={`${order.mode} for Alex Santos`}>{order.id}</Heading>
      {!order.paid && !isPast(order) ? (
        <>
          <Notice title="Payment is still required">
            {order.mode === "In-store"
              ? "Show your order number to the cashier. Preparation starts after payment is confirmed."
              : "Complete the payment preview before the restaurant can accept this order."}
          </Notice>
          <Button
            onPress={() =>
              go({
                name: order.mode === "In-store" ? "CounterTicket" : "Payment",
                orderId: order.id,
              })
            }
          >
            {order.mode === "In-store"
              ? "Show counter ticket"
              : "Continue to payment"}
          </Button>
        </>
      ) : (
        <>
          {status === "Ready for collection" && (
            <Heading subtitle="Collect at the restaurant counter.">
              Your order is ready.
            </Heading>
          )}
          {status === "On the way" && (
            <>
              <Heading subtitle="Your rider has collected the order.">
                Your food is on its way.
              </Heading>
              <Card>
                <Label size={21} bold>
                  Arrives in 10–20 minutes
                </Label>
                <Label>Jamie · Delivery partner</Label>
                <Label size={13} muted>
                  {order.address}
                </Label>
                <Button
                  secondary
                  onPress={() => go({ name: "Help", variant: "rider" })}
                >
                  Contact rider
                </Button>
              </Card>
            </>
          )}
          {status === "Collected" && (
            <Heading subtitle="Your items have been handed over.">
              Enjoy your meal.
            </Heading>
          )}
          <Timeline order={order} status={status} />
        </>
      )}
      <Pair
        label={order.paid ? "Total paid" : "Total due"}
        value={money(order.total)}
        bold
      />
      {details ||
      status === "Ready for collection" ||
      status === "Collected" ? (
        <BasketItems items={order.items} />
      ) : (
        <Button
          secondary
          onPress={() =>
            go({ name: "OrderDetails", orderId: order.id, status })
          }
        >
          View order summary
        </Button>
      )}
      {order.paid && status === "Awaiting acceptance" && (
        <Button
          secondary
          onPress={() => go({ name: "Cancellation", orderId: order.id })}
        >
          Request cancellation
        </Button>
      )}
      {!order.paid && !isPast(order) && (
        <Button
          secondary
          onPress={() => {
            updateOrder(order.id, { status: "Cancelled" });
            root({ name: "Orders" });
          }}
        >
          Cancel unpaid order
        </Button>
      )}
      {status === "Cancellation under review" && (
        <Button
          secondary
          onPress={() => go({ name: "CancellationReview", orderId: order.id })}
        >
          View cancellation request
        </Button>
      )}
      {["Cancelled", "Refunded"].includes(status) && order.paid && (
        <Button
          secondary
          onPress={() =>
            go({
              name:
                status === "Refunded" ? "RefundConfirmed" : "RefundProcessing",
              orderId: order.id,
            })
          }
        >
          View refund status
        </Button>
      )}
      <Button
        secondary
        onPress={() => go({ name: "Help", restaurantId: order.restaurantId })}
      >
        Contact restaurant
      </Button>
      <Divider />
      <Button secondary onPress={() => setControls(!controls)}>
        {controls ? "Hide preview controls" : "Preview order updates"}
      </Button>
      {controls && (
        <Notice title="Local screen preview">
          <Label size={12} muted>
            Choose a status to explore the interface. These updates stay on this
            device.
          </Label>
          {!order.paid ? (
            <Button onPress={() => updateOrder(order.id, { paid: true })}>
              Preview cashier confirmation
            </Button>
          ) : (
            <Button
              disabled={stage >= stateOptions.length - 1 || stage < 0}
              onPress={() =>
                updateOrder(order.id, { status: stateOptions[stage + 1] })
              }
            >
              Preview {stateOptions[stage + 1] || "completed order"}
            </Button>
          )}
        </Notice>
      )}
    </Screen>
  );
}
export function CancellationScreen() {
  const { route, orders, updateOrder, go, back, root } = useStore();
  const order = orders.find((entry) => entry.id === route.orderId) || orders[0];
  const [reason, setReason] = useState("Ordered by mistake");
  const [note, setNote] = useState("");
  const name = route.name;
  if (name === "Cancellation")
    return (
      <Screen
        title="Request cancellation"
        onBack={back}
        footer={
          <Button
            onPress={() => {
              updateOrder(order.id, {
                status: "Cancellation under review",
                reason: `${reason}${note ? " · " + note : ""}`,
              });
              go({ name: "CancellationReview", orderId: order.id });
            }}
          >
            Submit cancellation request
          </Button>
        }
      >
        <Label size={12} bold>
          {restaurantById(order.restaurantId).name}
        </Label>
        <Badge>Awaiting acceptance</Badge>
        <Heading subtitle={`${money(order.total)} paid via GCash`}>
          {order.id}
        </Heading>
        <Label bold size={13}>
          Cancellation reason
        </Label>
        <Choices
          options={["Ordered by mistake", "Change of plans"]}
          value={reason}
          onChange={setReason}
        />
        <Field
          label="Additional note · optional"
          value={note}
          onChange={setNote}
          multiline
        />
        <Notice title="Your request will be reviewed">
          Submitting a request does not cancel your order or confirm a refund.
          The restaurant reviews it before preparation.
        </Notice>
        <Button secondary onPress={back}>
          Keep my order
        </Button>
      </Screen>
    );
  const refunded = name === "RefundConfirmed";
  const refund = refunded || name === "RefundProcessing";
  const declined = name === "CancellationDeclined";
  return (
    <Screen
      title={refund ? "Refund status" : "Cancellation update"}
      onBack={back}
    >
      <Label size={12} bold>
        {restaurantById(order.restaurantId).name}
      </Label>
      <Badge>
        {refunded
          ? "Refunded"
          : refund
            ? "Processing"
            : declined
              ? "Request declined"
              : "Cancellation under review"}
      </Badge>
      <Heading>
        {refunded
          ? "Refund confirmed."
          : refund
            ? "Your refund is processing."
            : declined
              ? "Your order is preparing."
              : "The restaurant is reviewing it."}
      </Heading>
      <Label size={27} bold>
        {order.id}
      </Label>
      <Card>
        <Pair
          label={refund ? "Refund amount" : "Amount paid"}
          value={money(order.total)}
        />
        <Pair
          label={refund ? "Return channel" : "Payment"}
          value="Original GCash"
        />
        {refunded && (
          <Pair
            label="Refund reference"
            value={`RF-DEMO-${order.id.replace("OB-", "")}`}
          />
        )}
      </Card>
      <Notice
        title={
          refund
            ? refunded
              ? "Payment return confirmed"
              : "Refund initiated"
            : declined
              ? "Message from the restaurant"
              : "Your order is not cancelled yet"
        }
      >
        {refund
          ? refunded
            ? "The provider has confirmed the return in this preview."
            : "The restaurant initiated the full refund. This status changes once the provider confirms it."
          : declined
            ? "Preparation had already started when the request was reviewed."
            : "Your request is pending. We’ll show the restaurant’s decision here."}
      </Notice>
      <Button onPress={() => root({ name: "Orders" })}>Back to orders</Button>
      <Button
        secondary
        onPress={() => go({ name: "Help", restaurantId: order.restaurantId })}
      >
        Contact restaurant
      </Button>
      {name === "CancellationReview" && (
        <>
          <Divider />
          <Label size={12} muted>
            Preview a restaurant decision
          </Label>
          <Button
            secondary
            onPress={() => {
              updateOrder(order.id, { status: "Cancelled" });
              go({ name: "RefundProcessing", orderId: order.id });
            }}
          >
            Preview approval and refund
          </Button>
          <Button
            secondary
            onPress={() => {
              updateOrder(order.id, { status: "Preparing" });
              go({ name: "CancellationDeclined", orderId: order.id });
            }}
          >
            Preview declined request
          </Button>
        </>
      )}
      {name === "RefundProcessing" && (
        <Button
          secondary
          onPress={() => {
            updateOrder(order.id, { status: "Refunded" });
            go({ name: "RefundConfirmed", orderId: order.id });
          }}
        >
          Preview refund confirmation
        </Button>
      )}
    </Screen>
  );
}
