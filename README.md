 <a id="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![React Native][react-native-shield]][react-native-url]
[![Expo][expo-shield]][expo-url]
[![TypeScript][typescript-shield]][typescript-url]

<!-- PROJECT LOGO -->

<br />
<div align="center">
  <h1 align="center">OrderBuddy Mobile</h1>

  <p align="center">
    A mobile food ordering application frontend built with React Native, TypeScript, and Expo, featuring restaurant discovery, menu browsing, cart management, checkout, order tracking, and account management.
    <br />
    <br />
    <a href="#about-the-project">About</a>
    &middot;
    <a href="#getting-started">Getting Started</a>
    &middot;
    <a href="#usage">Usage</a>
  </p>
</div>

---

## Table of Contents

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
        <li><a href="#application-workflow">Application Workflow</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#screen-coverage">Screen Coverage</a></li>
    <li><a href="#application-architecture">Application Architecture</a></li>
    <li><a href="#frontend-state-management">Frontend State Management</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#validation-and-testing">Validation and Testing</a></li>
    <li><a href="#current-development-status">Current Development Status</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

---

## About The Project

**OrderBuddy Mobile** is a mobile food ordering application frontend designed to provide users with a convenient way to discover restaurants, browse menus, customize food items, manage shopping carts, place sample orders, and monitor order progress.

The application is built using **React Native, TypeScript, and Expo**, following the mobile interface and visual direction established in the OrderBuddy Figma design.

It features a collection of complete application screens covering the primary food ordering experience, including restaurant discovery, merchant menus, item customization, checkout, payment demonstrations, order tracking, account management, and other supporting user flows.

The interface follows a grayscale visual system with DM Sans for interface typography, Lora for branding, and editable SVG food illustrations. Reusable UI components and organized screen modules help maintain consistency throughout the application.

The current release focuses exclusively on the frontend. Static sample data and local React state are used to demonstrate application interactions and user flows without requiring backend services or external API integrations.

### Key Features

- Restaurant discovery and browsing
- Restaurant details and merchant menus
- Food item selection and customization
- Item availability and unavailable item states
- Shopping cart management
- Restaurant-specific cart restrictions
- Delivery, pickup, and in-store ordering
- Checkout and order fee breakdowns
- Online payment handoff demonstrations
- Payment processing, failure, and confirmation screens
- Counter payment tickets
- Active and past order management
- Order preparation timeline
- Delivery tracking and collection status
- Order summaries and handover screens
- Order cancellation requests and review
- Refund processing and confirmation screens
- User sign-in and registration interfaces
- Google sign-in demonstration
- Password recovery and reset confirmation
- Account and profile management
- Saved address management and editing
- Help and restaurant information screens
- Empty states and alternative screen previews
- Local frontend state management
- Sample order status progression

### Application Workflow

The application demonstrates the main food ordering journey through interconnected frontend screens.

```text
                    OrderBuddy Mobile
                           |
                           ▼
                    Home / Discovery
                           |
                           ▼
                   Restaurant Selection
                           |
                           ▼
                     Merchant Menu
                           |
                           ▼
                    Food Customization
                           |
                           ▼
                      Shopping Cart
                           |
                           ▼
                       Checkout
                           |
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          Delivery       Pickup       In-Store
             │             │             │
             └─────────────┼─────────────┘
                           |
                           ▼
                   Payment Demonstration
                           |
                           ▼
                    Order Confirmation
                           |
                           ▼
                     Order Tracking
                           |
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
       Order Completed             Cancellation
             │                           │
             ▼                           ▼
       Order History              Refund Status
```

Additional application flows cover authentication, profile management, saved addresses, restaurant information, and customer support.

---

## Built With

The project uses the following technologies, frameworks, and tools:

### Frontend

- React Native
- TypeScript
- Expo
- React
- React Native components
- React Hooks
- React Context API

### Styling & UI

- DM Sans
- Lora
- Editable SVG food illustrations
- Reusable UI components
- Grayscale visual design system

### Development & Build Tools

- Node.js
- npm
- Expo CLI
- TypeScript Compiler
- Expo Application Services (EAS)

### Design

- Figma
- Mobile-first interface design
- Component-based UI organization

---

## Getting Started

Follow the steps below to set up and run OrderBuddy Mobile locally.

### Prerequisites

Make sure the following are installed before running the application.

- Node.js 22.13+, 24.3+, or 26+
- npm
- Git
- Expo Go or a compatible development build
- Xcode (optional, for iOS Simulator)
- Android Studio (optional, for Android Emulator)

You can verify your installed versions using:

```sh
node --version
npm --version
git --version
```

### Installation

#### 1. Clone the Repository

```sh
git clone https://github.com/ralphgacusan/orderbuddy-mobile.git
cd orderbuddy-mobile
```

#### 2. Install Dependencies

Install the required project dependencies:

```sh
npm install
```

#### 3. Start the Development Server

Run the Expo development server:

```sh
npm start
```

Open the application using a compatible Expo Go version or a configured development build.

#### 4. Run on iOS

To launch the application in the iOS Simulator:

```sh
npm run ios
```

This requires Xcode and a properly configured iOS Simulator.

#### 5. Run on Android

To launch the application in an installed Android emulator:

```sh
npm run android
```

This requires Android Studio and a configured Android emulator.

#### 6. Run on Web

To launch a browser preview of the mobile application screens:

```sh
npm run web
```

The web preview uses the same React Native application screens.

---

## Usage

### 1. Explore Restaurants

Users can browse the home screen, discover available restaurants, view merchant details, and explore restaurant menus.

The application provides sample restaurant information and menu items for demonstrating the browsing experience.

### 2. Customize Food Items

Users can select food items and interact with available item options.

The application demonstrates item customization, quantity adjustments, and unavailable item states.

### 3. Manage the Shopping Cart

Users can add items to their cart, update quantities, and review their selected products.

The cart supports one restaurant per basket. Switching restaurants is handled through the application's cart flow.

### 4. Proceed to Checkout

Users can select among the available ordering methods:

- Delivery
- Pickup
- In-store ordering

The checkout interface displays the applicable order breakdown.

Delivery orders include the restaurant's displayed delivery fee and an additional ₱10 service fee. Pickup and in-store orders do not include these fees.

### 5. Complete the Payment Demonstration

The application includes frontend demonstrations of payment-related screens, including:

- Online payment handoff
- Payment processing
- Payment failure
- Payment confirmation
- Counter payment tickets

These screens demonstrate the intended user experience without processing actual financial transactions.

### 6. Track Orders

Users can view their active and past orders and follow sample order progress.

The application includes preparation timelines, ready-for-collection states, delivery tracking, handover screens, and order summaries.

The **Preview order updates** feature allows users to advance sample order statuses locally.

### 7. Manage Accounts

Users can explore the account-related screens, including:

- Sign-in
- Registration
- Google profile completion
- Password recovery
- Password reset confirmation
- Profile editing
- Saved address management

Authentication-related screens demonstrate frontend interactions only and do not perform actual account authentication.

### 8. Explore Additional Screen States

Users can access **Account → Screen previews** to review alternate application states.

These previews include empty carts, empty order histories, empty searches, paused restaurants, and other supporting interface scenarios.

---

## Screen Coverage

OrderBuddy Mobile includes a comprehensive collection of screens covering the application's primary and supporting user journeys.

### Restaurant Discovery & Browsing

- Home screen
- Restaurant discovery
- Restaurant details
- Merchant menus
- Food item options
- Unavailable item states

### Cart & Checkout

- Shopping cart
- Restaurant switching
- Delivery checkout
- Pickup checkout
- In-store checkout
- Fee breakdown
- Online payment handoff
- Payment processing
- Payment failure
- Payment confirmation
- Counter payment ticket

### Orders & Tracking

- Active orders
- Past orders
- Order preparation timeline
- Ready for collection
- Handover
- Delivery tracking
- Order summaries
- Cancellation request
- Cancellation review
- Declined cancellation request
- Refund processing
- Refund confirmation

### Authentication & Account Management

- Sign-in
- Registration
- Google profile completion
- Password recovery
- Password reset confirmation
- Account management
- Profile editing
- Saved addresses
- Address editing

### Supporting Screens

- Restaurant information
- Help screens
- Empty cart
- Empty order history
- Empty search results
- Paused restaurants
- Alternate screen previews

---

## Application Architecture

OrderBuddy Mobile follows a **component-based frontend architecture** built with React Native and TypeScript.

The application organizes its screens, shared components, sample data, and local state management into separate modules.

### Application Layer

The application entry point initializes the main interface and coordinates the screen presentation.

The primary application components handle:

- Screen rendering
- Navigation between application states
- User interactions
- Screen history
- Shared frontend state

### Screen Modules

The application's screens are grouped according to their respective functional areas.

These include:

- Browse and restaurant discovery
- Purchasing and checkout
- Order management and tracking
- Account and profile management

### UI Component Layer

Reusable UI components provide consistent interface elements throughout the application.

This includes shared layouts, interface elements, and editable SVG food illustrations.

### Data Layer

The application uses static sample data and frontend calculations to demonstrate the food ordering experience.

The data layer includes:

- Restaurant information
- Menu items
- Item options
- Sample orders
- Cart calculations
- Order summaries

```text
                 OrderBuddy Mobile
                         |
                         ▼
                  Application Entry
                         |
             ┌───────────┼───────────┐
             │           │           │
             ▼           ▼           ▼
          Browse      Purchase     Account
             │           │           │
             │           ▼           │
             │       Cart / Checkout │
             │           │           │
             └───────────┼───────────┘
                         |
                         ▼
                  Shared UI Layer
                         |
                         ▼
                  Local State Store
                         |
                         ▼
                  Sample Data Model
```

The architecture is currently frontend-only. External backend services and APIs are not connected.

---

## Frontend State Management

OrderBuddy Mobile uses React state and local application state management to demonstrate interactive frontend functionality.

### Local State

The application manages several types of frontend state, including:

- Shopping cart items
- Selected food options
- Item quantities
- User profile information
- Saved addresses
- Sample sign-in state
- Order status changes
- Screen navigation history

### Cart Calculations

The application calculates checkout totals based on selected items, quantities, and applicable ordering fees.

A basket contains items from a single restaurant.

Delivery orders include the restaurant's displayed delivery fee and a ₱10 service fee, while pickup and in-store orders omit these additional fees.

### Order Management

Existing order snapshots remain separate from the editable shopping cart.

This allows users to modify their current cart without changing previously created sample order records.

### State Persistence

Frontend state is maintained locally through React state and resets when the application restarts.

No backend database or persistent server-side storage is currently connected.

---

## Project Structure

The project follows a modular structure to separate application screens, reusable UI components, sample data, and configuration files.

```text
orderbuddy-mobile/
│
├── .claude/
│
├── assets/
│
├── src/
│   ├── model.ts
│   ├── store.tsx
│   ├── ui.tsx
│   ├── browse.tsx
│   ├── purchase.tsx
│   ├── orders.tsx
│   └── account.tsx
│
├── .gitignore
├── AGENTS.md
├── App.tsx
├── app.json
├── eas.json
├── index.ts
├── LICENSE
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

### Core Files

| File | Description |
|---|---|
| `App.tsx` | Main application component and screen composition |
| `index.ts` | Application entry point |
| `model.ts` | Sample data and cart calculations |
| `store.tsx` | Local state management and screen history |
| `ui.tsx` | Shared native UI components and food illustrations |
| `browse.tsx` | Restaurant discovery and browsing screens |
| `purchase.tsx` | Cart, checkout, and purchasing screens |
| `orders.tsx` | Order management and tracking screens |
| `account.tsx` | Authentication and account-related screens |
| `app.json` | Expo application configuration |
| `eas.json` | EAS build configuration |
| `package.json` | Project dependencies and npm scripts |
| `tsconfig.json` | TypeScript configuration |

---

## Validation and Testing

The following commands are available for checking the application and validating the frontend implementation.

### 1. TypeScript Validation

Run the TypeScript checks:

```sh
npm run typecheck
```

### 2. Run Tests

Execute the project's test script:

```sh
npm test
```

### 3. Export for Web

Generate a web build of the application:

```sh
npx expo export --platform web
```

These checks help validate the frontend implementation and identify potential development issues.

---

## Current Development Status

**OrderBuddy Mobile v1.0.0** represents the initial frontend release of the application.

The release includes complete screen implementations and interactive frontend demonstrations using static sample data.

### Implemented

- [x] React Native and Expo project setup
- [x] TypeScript configuration
- [x] Application screen implementation
- [x] Restaurant discovery and browsing
- [x] Merchant menus and item customization
- [x] Shopping cart functionality
- [x] Delivery, pickup, and in-store checkout
- [x] Payment interface demonstrations
- [x] Order management and tracking screens
- [x] Cancellation and refund screen flows
- [x] Authentication and account interfaces
- [x] Profile and address management screens
- [x] Shared UI components
- [x] Local frontend state management
- [x] Static sample data integration
- [x] EAS build configuration

### Not Yet Implemented

- [ ] Backend API integration
- [ ] Database connectivity and persistent storage
- [ ] Actual user authentication and authorization
- [ ] Google authentication integration
- [ ] Real payment gateway integration
- [ ] Restaurant and merchant backend services
- [ ] Actual order submission and processing
- [ ] Real-time order tracking
- [ ] Production notification services
- [ ] Server-side order and refund management

---

## Roadmap

- [x] Complete initial mobile frontend implementation
- [x] Implement primary food ordering screens
- [x] Implement cart and checkout interactions
- [x] Implement order tracking and management screens
- [x] Implement authentication and account interfaces
- [x] Integrate static sample data
- [x] Configure Expo and EAS builds
- [ ] Develop backend services and REST APIs
- [ ] Implement database integration
- [ ] Integrate frontend authentication with backend services
- [ ] Implement actual payment processing
- [ ] Connect restaurant and menu data to backend services
- [ ] Implement persistent cart and order management
- [ ] Integrate real-time order status updates
- [ ] Implement production-ready notifications
- [ ] Conduct end-to-end application testing
- [ ] Prepare the application for production deployment

---

## Contributing

Contributions, suggestions, and improvements are welcome.

To contribute to the project:

1. Fork the Project.

2. Create your Feature Branch.

```sh
git checkout -b feature/AmazingFeature
```

3. Commit your Changes.

```sh
git commit -m "Add AmazingFeature"
```

4. Push to the Branch.

```sh
git push origin feature/AmazingFeature
```

5. Open a Pull Request.

---

## License

Distributed under the license specified in the project's `LICENSE` file.

---

## Acknowledgments

- React Native
- Expo
- TypeScript
- Figma
- DM Sans
- Lora
- Open-source React Native community

**Design Reference:**

[OrderBuddy Mobile – Figma Design](https://www.figma.com/design/yz4qsT1ogu37FJW5iIOlXs?node-id=14-613)

---

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[react-native-shield]: https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-native-url]: https://reactnative.dev/
[expo-shield]: https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white
[expo-url]: https://expo.dev/
[typescript-shield]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/