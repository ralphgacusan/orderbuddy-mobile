# OrderBuddy mobile

React Native and TypeScript mobile frontend built with Expo from the OrderBuddy Figma design. Grayscale surfaces, DM Sans interface text, Lora branding, and editable SVG food illustrations follow the mobile design.

## Run

Use Node.js 22.13+, 24.3+, or 26+, matching the installed React Native version.

```sh
npm install
npm start
```

Open the project using a compatible Expo Go version or a development build. `npm run ios` opens the iOS simulator when Xcode is configured. `npm run android` opens an installed Android emulator. `npm run web` provides a browser preview of the same React Native mobile screens.

## Screen coverage

- Home, restaurant discovery and merchant menus, item options, unavailable items, cart and restaurant switching.
- Delivery, pickup and in-store checkout, fee breakdown, online payment handoff, processing, failure and confirmation, counter payment ticket.
- Active and past orders, preparation timeline, ready for collection, handover and delivery tracking, order summaries.
- Cancellation request and review, declined request, refund processing and confirmation.
- Sign-in, registration, Google profile completion, password recovery and reset confirmation, account and profile editing.
- Saved addresses, address editing, restaurant details, help, empty carts and order history, empty searches and paused restaurants.

Use **Account → Screen previews** to review alternate states. The normal flow uses the same screens. Use **Preview order updates** on tracking screens to advance sample orders locally.

## Frontend state

Cart edits, profiles, addresses, sample sign-in, and order status changes live in React state and reset when the app restarts. Sign-in and Google buttons demonstrate UI transitions. Payment screens never charge money. No authentication, payment, delivery, database, or restaurant APIs are connected. Use sample credentials only.

A basket contains items from one restaurant. Delivery adds the restaurant's displayed fee plus a ₱10 service fee. Pickup and in-store orders omit these fees. Item options and quantities feed the checkout total. Existing order snapshots stay separate from the editable cart.

## Checks

```sh
npm run typecheck
npm test
npx expo export --platform web
```

`src/model.ts` holds sample data and cart calculations, `src/store.tsx` holds local state and screen history, `src/ui.tsx` contains shared native components and food illustrations. Screen groups live in `browse.tsx`, `purchase.tsx`, `orders.tsx`, and `account.tsx`.

Design reference: https://www.figma.com/design/yz4qsT1ogu37FJW5iIOlXs?node-id=14-613
