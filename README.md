# 🍔 FoodOrder — Complete Online Food Ordering & Delivery System

A complete, responsive, full-featured online food ordering and simulated delivery web application built for a web development internship.

Inspired by modern food-delivery platforms with a clean culinary aesthetic, **FoodOrder** is architected as a high-performance Single Page Application (SPA) using HTML5, CSS3, and modern modular ES6 JavaScript. It requires no external database or paid services, managing state and data persistence through a robust `LocalStorage` repository.

---

## 📸 Visual Identity & Design System

The visual design is inspired by modern culinary mobile and desktop delivery applications, blending rich warm amber tones with deep forest emerald accents:

- **Primary Amber / Gold**: `#F59E0B` (Amber 500), `#D97706` (Amber 600 hover)
- **Light Yellow / Warm Tint**: `#FEF3C7` (Amber 100)
- **Dark Text**: `#1F2937` (Gray 800)
- **Muted Text**: `#6B7280` (Gray 500)
- **Culinary Emerald Accent**: `#064E3B`, `#047857` (from the reference mobile UI)
- **Soft Neutral Borders & Backgrounds**: `#F9FAFB` (body), `#FFFFFF` (cards), `#E5E7EB` (borders)
- **Dark Mode**: Fully accessible palette with Slate backgrounds (`#0F172A`, `#1E293B`) and persistent toggle.

---

## 🚀 Key Modules & Implemented Features

### 1. Homepage (`#home`)
- **Hero Section**: Headline, enticing food imagery, stats badges (50+ dishes, 25-min delivery, 4.8★ rating), and primary action button.
- **Universal Search**: Live real-time search across all 8 restaurants and 40+ dishes with clear search button and empty state handling.
- **7 Food Category Cards**:
  1. 🍕 **Pizza**
  2. 🍔 **Burgers**
  3. 🍣 **Sushi**
  4. 🍜 **Noodles**
  5. 🥗 **Salads**
  6. 🍰 **Desserts**
  7. 🍹 **Beverages**
- **Featured Restaurants**: Curated cards showing cuisine tags, star ratings, delivery time, delivery fee, and minimum order.
- **Popular Dishes**: High-rated menu items with direct "+ Add" or customization modal triggers.
- **Promotional Discount Banner**: Highlighting active promo code `FOODIE20`.

### 2. Restaurant Details Page (`#restaurant/:id`)
- **Header Banner**: Restaurant cover, logo, cuisine, star rating, delivery fee, min order, description, phone, and address.
- **Categorized Menu Navigation**: Interactive category pill tabs for quick scrolling and menu segmenting.
- **Dietary Filter & Search**: In-menu keyword search and "🌱 Pure Veg Only" quick filter.
- **Food Cards**: Veg/Non-veg dietary dots, chef special tags, spice levels, price, and Add to Cart action.
- **Food Customization Modal**: Selection of crust types, sides, spice levels, and add-ons with dynamic price calculation.
- **Multi-Restaurant Cart Conflict Protection**: Prevents mixing food from multiple restaurants without an explicit confirmation dialog asking whether to clear the cart and start fresh.
- **Customer Reviews & Rating Form**: Displays existing reviews and allows diners to write 1-5 star reviews with text comments.

### 3. Menu Catalog (`#menu`)
- **Universal Food Catalog**: Browse all 40+ dishes across every partner restaurant.
- **Filter by 7 Categories**: Pizza, Burgers, Sushi, Noodles, Salads, Desserts, Beverages.
- **Dietary Mode**: All, Pure Vegetarian, or Non-Vegetarian.
- **Sort Options**: Most Popular, Highest Rated, Price (Low to High), Price (High to Low).
- **Search Bar**: Search dishes by food name or restaurant name.

### 4. Shopping Cart Drawer & Page (`#cart`)
- **Real-Time Slide-Over Drawer**: Slides smoothly into view whenever items are added or when the cart icon is clicked.
- **Dedicated Cart Page**: Accessible at `#cart` for an expanded layout with notes to the kitchen.
- **Quantity Controls**: Add (`+`), decrement (`-`), and remove (`🗑️`) items with instant subtotal and tax recalculation.
- **Minimum Order Requirement Alert**: Visual progress alert indicating the remaining amount needed to satisfy the restaurant's minimum order requirement.
- **Promo Code Engine**: Supports coupon codes with eligibility rules:
  - `FOODIE20`: 20% off entire order ($15 min)
  - `FREEDEL`: Free delivery fee ($15 min)
  - `WELCOME50`: Flat $5 discount ($25 min)
  - `FLAT10`: Flat $10 discount ($40 min)
  - `HUNGRY15`: 15% off ($30 min)
- **Cost Breakdown**: Itemized subtotal, delivery fee, estimated tax (8%), promo discount, and final total.
- **Empty State**: Friendly illustration with "Explore Menu" action.
- **LocalStorage Persistence**: Cart state remains intact on page refresh or browser restart.

### 5. Simulated Checkout (`#checkout`)
- **Authentication Gate**: Requires customer login; provides a 1-click instant demo login button for swift testing.
- **Delivery Address Management**: Choose from saved addresses or fill in a new address form with validation (recipient, phone, street, city, state, postal code, and delivery instructions).
- **Saved Address Sync**: Option to save new addresses directly to profile.
- **5 Simulated Payment Methods**:
  1. 💳 **Credit Card** (Visa, Mastercard, Amex with masked demo card inputs)
  2. 🏧 **Debit Card** (Direct bank card simulation)
  3. ⚡ **UPI** (Unified Payments Interface with simulated VPA/handle)
  4. 💵 **Cash on Delivery** (Rider payment instructions)
  5. 📱 **Mobile Wallet** (Apple Pay / Google Wallet simulated deduction)
- **Duplicate Submission Protection**: Disables button and displays a loading spinner during simulated processing.
- **Order Generation**: Generates unique Order ID (e.g., `#FO-84920`), stores order into history, triggers transactional email notification, clears the cart, and redirects to live Order Tracking.

### 6. Order Tracking (`#tracking/:id`)
- **Order Overview**: Order ID, timestamp, restaurant name, delivery address, payment method, items summary, and total paid.
- **5-Stage State Machine**:
  1. `pending`: Order Received
  2. `preparing`: In the Kitchen
  3. `out_for_delivery`: Out for Delivery
  4. `delivered`: Delivered
  5. `cancelled`: Cancelled
- **Live Visual Progress Bar**: Animated pulsing status rings and real timestamps for each stage.
- **Simulated Real-Time Progression (Bonus 1)**: Automatic background timers advance stages every 25 seconds.
- **Evaluator Fast-Forward Stepper**: Interactive demo buttons to advance status immediately or mark delivered.
- **Order Cancellation**: Allows cancellation only during `pending` or `preparing` states with confirmation dialog and simulated refund notice.
- **Post-Delivery Review CTA**: Prompts diner to review the restaurant once delivered.
- **Simulated Notice**: Clearly communicates that tracking is simulated and does not invoke paid GPS courier APIs.

### 7. Order History & Reordering (`#history`)
- **Order Cards**: Displays order ID, date, item thumbnails, total amount, payment method, and status badge.
- **Filter Tabs**: All Orders, Active / In-Progress, Delivered, and Cancelled.
- **Digital Receipt Modal**: View itemized receipt with printable layout (`window.print()`).
- **Safe 1-Click Reorder (Bonus 6)**: Reconstructs cart verifying that all menu items are still currently in-stock and available; clearly alerts if an item was discontinued.

### 8. Restaurant Dashboard / Admin Hub (`#dashboard`)
- **Role-Protected Access**: Accessible exclusively to `Restaurant Owner` and `Admin` personas with an unauthorized barrier for standard customers.
- **Analytics Metrics**: Total Orders, Active Orders in Kitchen, Delivered Orders, and Total Revenue.
- **Live Order Status Management**: Interactive dropdown to change order status in real time, immediately syncing across the customer's tracking view and order history.
- **Menu Items Catalog (Full CRUD)**:
  - **Create**: Add new dish with name, category, price, description, photo URL, vegetarian flag, and chef special badge.
  - **Read**: Search and view menu items in a responsive data table.
  - **Update**: Edit any dish's price, details, or dietary classification.
  - **Delete**: Remove dishes with modal confirmation.
  - **Stock Toggle**: 1-click button switching items between "In Stock" and "Out of Stock".

### 9. Customer Profile (`#profile`)
- **Personal Details**: Edit Name, Email, and Phone with validation.
- **Saved Delivery Addresses**: Add, edit, set default, and delete saved addresses.
- **Masked Payment Records**: View saved demo payment records.
- **Account Statistics**: Summary of orders placed and reviews contributed.
- **Reset All Demo Data**: Dedicated button with confirmation modal to restore clean initial sample datasets.
- **Sign Out**: Clears user session.

### 10. Reviews & Ratings System (Bonus 2 & 3)
- 1-to-5 star rating selector with written review textarea.
- Recalculates average star ratings and review counts dynamically for restaurants and individual dishes.
- Prevents duplicate review spam from the same user for the same item.

### 11. Simulated Email Notification Center (Bonus 5)
- Accessible via the notification bell (`🔔`) in the navigation bar.
- Maintains a log of all transactional emails dispatched:
  - Welcome email upon account registration
  - Order confirmation receipt with order ID
  - Kitchen preparation notice
  - Out for delivery alert
  - Delivery arrival notice
- Clicking any notification opens a full HTML email preview card with FoodOrder branding and tracking links.

### 12. Dark Mode Toggle (Bonus 4)
- Accessible toggle (`☀️ / 🌙`) in the top navigation bar.
- Changes CSS variables via `data-theme="dark"` on `document.documentElement`.
- Fully persisted in `LocalStorage` across page visits.

---

## 👥 Demo Accounts & Roles

FoodOrder includes 3 pre-configured demo personas with 1-click sign-in buttons on the Sign In page (`#auth`):

| Persona | Name | Role | Email | Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | Sarah Connor | `customer` | `sarah@example.com` | Browse menus, add to cart, checkout, saved addresses, track deliveries, rate dishes |
| **Restaurant Owner** | Chef Marco Rossi | `owner` | `chef.marco@example.com` | Manage Bella Italia Trattoria, update incoming order statuses, Add/Edit/Delete menu items, toggle stock |
| **System Admin** | Alex Admin | `admin` | `admin@foodorder.com` | Oversee all 8 restaurants, full revenue analytics, global dish catalog CRUD, order state control |

*Note: For manual testing, any password (e.g. `demo123`) is accepted in this frontend demonstration.*

---

## 📂 Project Structure

```
Online Food Ordering System/
├── index.html                   # Semantic HTML5 entry shell & mount containers
├── README.md                    # Complete project documentation & guide
├── css/
│   ├── variables.css            # Amber/gold palette, typography tokens & dark theme
│   ├── base.css                 # CSS reset, accessibility outlines, utilities
│   ├── components.css           # Buttons, cards, badges, modal dialogs, toasts, skeletons
│   ├── pages.css                # Page layouts (Hero, Restaurant, Cart, Checkout, Tracking)
│   └── responsive.css           # Breakpoints for 320px, 375px, 768px, 1024px, 1440px
├── js/
│   ├── app.js                   # Application bootstrap & component mounting
│   ├── router.js                # Hash-based SPA routing engine
│   ├── state/
│   │   └── store.js             # Centralized reactive state store, calculations & order machine
│   ├── data/
│   │   ├── initialData.js       # 8 restaurants, 40+ dishes, 7 categories, sample orders & users
│   │   └── storage.js           # LocalStorage CRUD manager & reset demo data utility
│   ├── components/
│   │   ├── Navbar.js            # Top navigation, cart count, dark mode, notification bell
│   │   ├── BottomNav.js         # Mobile bottom bar (Home, Menu, Orders, Cart, Profile)
│   │   ├── CartDrawer.js        # Slide-over cart with live quantity & promo updates
│   │   ├── FoodDetailModal.js   # Item customization modal (sizes, add-ons, price math)
│   │   ├── Modal.js             # Accessible modal dialog & confirmation prompts
│   │   ├── Toast.js             # Floating toast alerts (success, info, warning, error)
│   │   ├── NotificationsModal.js# Simulated transactional email notification center
│   │   └── Footer.js            # Footer with category links, newsletter simulation, disclaimer
│   └── pages/
│       ├── HomePage.js          # Hero, category grid, search, featured restaurants, popular dishes
│       ├── RestaurantsPage.js   # All partner restaurants directory with filters
│       ├── RestaurantPage.js    # Restaurant cover, categorized menu, in-menu search, reviews
│       ├── MenuPage.js          # Universal food catalog, 7 categories filter, diet toggle, sort
│       ├── CartPage.js          # Dedicated cart page, minimum order alert, promo code box
│       ├── CheckoutPage.js      # Saved addresses, validation, 5 payment options, order placement
│       ├── TrackingPage.js      # Visual timeline, status machine, auto progression, cancellation
│       ├── HistoryPage.js       # Previous orders, status filter tabs, receipt viewer, reorder
│       ├── DashboardPage.js     # Owner/Admin analytics, live order updater, dish CRUD
│       ├── ProfilePage.js       # User profile, saved addresses CRUD, reset demo data
│       └── AuthPage.js          # Tabbed Login / Register with 1-click demo switcher
└── test/
    └── suite.js                 # 35 automated unit and integration tests
```

---

## 🛠️ How to Run the Project

Because the project is written in standards-compliant HTML5, CSS3, and native ES6 JavaScript modules, it can be run in seconds using any static web server:

### Option A: Using Python (Recommended)
```bash
# In the project directory:
python -m http.server 3000
```
Then open [http://localhost:3000](http://localhost:3000) in your web browser.

### Option B: Using Node.js
```bash
npx serve . -l 3000
```
Then open [http://localhost:3000](http://localhost:3000).

### Option C: VS Code Live Server
Right-click `index.html` in VS Code and select **"Open with Live Server"**.

---

## 🧪 Testing Checklist & Verification

To run the automated test suite verifying all 35 business assertions:
```bash
node test/suite.js
```

### Manual Testing Workflow:
1. **Browse & Search**:
   - Open `#home`. Try searching for "pizza", "burger", or "sushi".
   - Click a category chip (e.g. 🍕 Pizza) to view filtered dishes in `#menu`.
2. **Add to Cart & Customization**:
   - On `#restaurant/rest-1`, click Margherita Pizza.
   - Select an add-on (e.g. Stuffed Crust). Note the unit price updating dynamically.
   - Click "Add to Cart". Notice the cart drawer sliding in with badge updates.
3. **Multi-Restaurant Conflict**:
   - Navigate to `#restaurant/rest-2` (The Burger Foundry) and try adding a burger.
   - Verify the confirmation modal asks to replace the cart from Bella Italia before proceeding.
4. **Promo Codes**:
   - In the cart, apply `FOODIE20`. Verify 20% discount is deducted from the total.
5. **Checkout Validation**:
   - Click "Proceed to Checkout".
   - Select a saved address or enter custom address fields.
   - Choose a payment method (e.g. Credit Card, UPI, or Cash on Delivery).
   - Click "Place Order" and observe the loading state and redirection to `#tracking/:id`.
6. **Order Progression & Real-Time Updates**:
   - On `#tracking/:id`, observe the active status pulse and timestamp.
   - Use the **Fast-Forward to Next Stage** button to advance to `preparing`, `out_for_delivery`, and `delivered`.
   - Check the notification bell (`🔔`) to inspect the simulated email notifications dispatched.
7. **Reorder**:
   - Visit `#history` and click **"Reorder"** on any past order to rebuild the cart with availability verification.
8. **Owner / Admin Dashboard**:
   - Sign in as Chef Marco via `#auth`.
   - Open `#dashboard`. View order statistics, change incoming order statuses, add a new dish, or toggle stock availability.
9. **Dark Mode & Reset**:
   - Click the theme toggle icon (`🌙 / ☀️`) in the top navigation.
   - In `#profile`, test the **Reset All Demo Data** utility to restore default state.

---

## 🌐 Deployment Instructions

### Deploy to GitHub Pages:
1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Under **Build and deployment > Branch**, select `main` and root directory `/`.
4. Click **Save**. The app will be live at `https://<username>.github.io/<repository-name>/`.

### Deploy to Netlify:
1. Drag and drop the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
2. Or connect your GitHub repository with build command left empty and publish directory set to `.`.

### Deploy to Vercel:
1. Import the repository in [vercel.com](https://vercel.com).
2. Set Framework Preset to **Other** and root directory to `./`.
3. Deploy!

---

## ⚠️ Known Limitations of Frontend-Only Architecture

- **Simulated Backend & Payments**: Payments, courier GPS updates, and emails are simulated for educational demonstration and evaluation purposes. Real banking credentials and SMS/email services are deliberately not integrated.
- **Client-Side Storage**: Data is saved to browser `LocalStorage`. Clearing your browser cache or switching to an incognito window creates a fresh session with default sample data.

