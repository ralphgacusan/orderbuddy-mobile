import test from "node:test";
import assert from "node:assert/strict";
import {
  initialCart,
  totals,
  itemPrice,
  canAdd,
  changeQuantity,
  sameBasket,
} from "./model.ts";
test("pickup preserves recorded item prices and delivery includes explicit fees", () => {
  assert.equal(totals(initialCart, "Pickup").total, 205);
  assert.deepEqual(totals(initialCart, "Delivery"), {
    subtotal: 205,
    delivery: 35,
    service: 10,
    total: 250,
  });
  assert.equal(
    itemPrice({ ...initialCart[0], large: true, cheese: true }),
    170,
  );
  assert.equal(totals([], "Delivery").total, 0);
});
test("basket stays within one restaurant and zero quantity removes an item", () => {
  assert.equal(canAdd(initialCart, "urban"), true);
  assert.equal(canAdd(initialCart, "slice"), false);
  assert.equal(canAdd([], "slice"), true);
  assert.equal(changeQuantity(initialCart, "burger-1", 0).length, 1);
  assert.equal(changeQuantity(initialCart, "burger-1", 99)[0].quantity, 20);
  assert.equal(initialCart[0].quantity, 1);
});

test("pending order comparison preserves a basket changed after checkout", () => {
  const snapshot = initialCart.map((item) => ({ ...item }));
  assert.equal(sameBasket(initialCart, snapshot), true);
  snapshot[0].cheese = true;
  assert.equal(sameBasket(initialCart, snapshot), false);
  assert.equal(initialCart[0].cheese, false);
});
