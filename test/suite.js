/**
 * FoodOrder - Comprehensive Test Suite
 * Tests business logic, calculations, promo codes, order state progression,
 * multi-restaurant conflict prevention, reordering, and data persistence.
 */

// Mock localStorage for Node environment
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

// Mock browser objects
global.window = {
  scrollTo: () => {},
  location: { hash: '#home' }
};
global.document = {
  documentElement: {
    setAttribute: () => {},
    getAttribute: () => 'light'
  }
};

import { store } from '../js/state/store.js';
import { Storage } from '../js/data/storage.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

console.log('🧪 Starting FoodOrder Automated Verification Suite...\n');

// 1. Storage & Initialization
console.log('1. Testing Storage & Initial Data Initialization:');
store.init();
const restaurants = store.getRestaurants();
const dishes = store.getFoodItems();
const categories = store.getCategories();
const users = store.getUsers();

assert(restaurants.length >= 8, `Loaded ${restaurants.length} restaurants (>= 8 required)`);
assert(categories.length === 7, `Loaded ${categories.length} food categories (7 required: Pizza, Burgers, Sushi, Noodles, Salads, Desserts, Beverages)`);
assert(dishes.length >= 40, `Loaded ${dishes.length} menu items (>= 40 required, ~5 per restaurant)`);
assert(users.length >= 3, `Loaded ${users.length} sample users (Customer, Owner, Admin)`);

// 2. Authentication & Role Switching
console.log('\n2. Testing Authentication & Roles:');
const customerUser = store.switchDemoUser('customer');
assert(customerUser && customerUser.role === 'customer', 'Switch to Customer demo account works');

const ownerUser = store.switchDemoUser('owner');
assert(ownerUser && ownerUser.role === 'owner', 'Switch to Restaurant Owner demo account works');

const adminUser = store.switchDemoUser('admin');
assert(adminUser && adminUser.role === 'admin', 'Switch to Admin demo account works');

// Switch back to customer for ordering tests
store.switchDemoUser('customer');

// 3. Cart & Calculations
console.log('\n3. Testing Cart Calculations & Business Rules:');
store.clearCart();
assert(store.getCart().items.length === 0, 'Cart is initialized empty');

const pizzaDish = dishes.find(d => d.id === 'food-101'); // Margherita $15.99 at Bella Italia (rest-1)
assert(pizzaDish !== undefined, 'Found test pizza item');

// Add item to cart
store.addToCart(pizzaDish, 2, [{ groupName: 'Crust Type', name: 'Garlic Butter Stuffed Crust', price: 2.50 }]);
let cart = store.getCart();
assert(cart.items.length === 1, 'Cart has 1 item type');
assert(cart.items[0].quantity === 2, 'Item quantity is 2');
assert(cart.items[0].unitPrice === 18.49, `Unit price with add-on calculated correctly: $18.49 ($15.99 + $2.50), got $${cart.items[0].unitPrice}`);

let summary = store.getCartSummary();
assert(summary.subtotal === 36.98, `Subtotal is $36.98, got $${summary.subtotal}`);
assert(summary.tax === 2.96, `Tax (8%) is $2.96, got $${summary.tax}`);

// 4. Multi-Restaurant Cart Replacement Prevention (Module B)
console.log('\n4. Testing Multi-Restaurant Cart Replacement Conflict:');
const burgerDish = dishes.find(d => d.id === 'food-201'); // The Burger Foundry (rest-2)
const conflictRes = store.addToCart(burgerDish, 1, [], false);
assert(conflictRes.conflict === true, 'Prevented mixing items from different restaurant without confirmation');
assert(conflictRes.currentRestaurantName === 'Bella Italia Trattoria', 'Reports correct active restaurant name');

// 5. Promo Codes & Discounts (Bonus Feature 7)
console.log('\n5. Testing Promo Code Engine:');
// Apply FOODIE20 (20% off)
const promoRes = store.applyPromoCode('FOODIE20');
assert(promoRes.success === true, 'Applied promo code FOODIE20');
summary = store.getCartSummary();
const expectedDiscount = Number((36.98 * 0.20).toFixed(2)); // 7.40
assert(summary.discount === expectedDiscount, `Discount is 20% ($${expectedDiscount}), got $${summary.discount}`);

// Test invalid promo
const badPromo = store.applyPromoCode('INVALID_CODE');
assert(badPromo.success === false, 'Rejected invalid promo code');

// 6. Checkout & Order Placement (Module E)
console.log('\n6. Testing Simulated Checkout & Order Placement:');
const orderRes = store.placeOrder({
  address: {
    recipient: 'Sarah Connor',
    phone: '+1 (555) 234-5678',
    street: 'Apt 4B, 742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    postalCode: '97477'
  },
  paymentMethod: 'Credit Card (ending 4242)',
  instructions: 'Please leave on porch'
});

assert(orderRes.success === true, `Order placed successfully with ID: ${orderRes.order?.id}`);
assert(orderRes.order.status === 'pending', 'Initial order status is pending');
assert(store.getCart().items.length === 0, 'Cart is automatically cleared after checkout');

// 7. Order Status Progression & Cancellation (Module F)
console.log('\n7. Testing Order Status Updates & Cancellation:');
const orderId = orderRes.order.id;
const updateRes = store.updateOrderStatus(orderId, 'preparing');
assert(updateRes.success === true && updateRes.order.status === 'preparing', 'Order transitioned to preparing state');

const nextUpdate = store.updateOrderStatus(orderId, 'out_for_delivery');
assert(nextUpdate.success === true && nextUpdate.order.status === 'out_for_delivery', 'Order transitioned to out_for_delivery');

// Cannot cancel when out_for_delivery
const failCancel = store.cancelOrder(orderId, 'Too late');
assert(failCancel.success === false, 'Order cancellation correctly rejected when out for delivery');

// Mark delivered
const deliverRes = store.updateOrderStatus(orderId, 'delivered');
assert(deliverRes.order.status === 'delivered', 'Order transitioned to delivered state');

// 8. Reorder Functionality (Bonus Feature 6 & Module G)
console.log('\n8. Testing 1-Click Reorder & Availability Check:');
const reorderRes = store.reorder(orderId);
assert(reorderRes.success === true, 'Reorder executed successfully');
assert(store.getCart().items.length > 0, 'Cart repopulated with reordered items');

// 9. Restaurant Dashboard CRUD (Module H)
console.log('\n9. Testing Restaurant Dashboard Menu CRUD:');
const newDish = store.addFoodItem({
  restaurantId: 'rest-1',
  restaurantName: 'Bella Italia Trattoria',
  name: 'Rigatoni Alla Vodka',
  category: 'Noodles',
  price: 16.50,
  description: 'Tubes of rigatoni pasta tossed in rich tomato-cream vodka sauce with crispy pancetta.',
  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  isVeg: false,
  isChefSpecial: true,
  cookingTime: '15 min',
  customizations: []
});
assert(newDish.success === true && newDish.item.name === 'Rigatoni Alla Vodka', 'Created new dish in restaurant catalog');

const toggleRes = store.toggleFoodAvailability(newDish.item.id);
assert(toggleRes.success === true && toggleRes.available === false, 'Toggled dish availability to Out of Stock');

const editRes = store.updateFoodItem(newDish.item.id, { price: 17.50 });
assert(editRes.success === true && editRes.item.price === 17.50, 'Updated dish price to $17.50');

const deleteRes = store.deleteFoodItem(newDish.item.id);
assert(deleteRes.success === true, 'Deleted menu item cleanly');

// 10. Reviews & Ratings Recalculation (Module J & Bonus Feature 2/3)
console.log('\n10. Testing Reviews & Dynamic Rating Recalculation:');
// Attempt duplicate review on food-101 by Sarah Connor (should be blocked)
const dupReview = store.addReview({
  restaurantId: 'rest-1',
  foodId: 'food-101',
  rating: 5,
  comment: 'Trying duplicate review.'
});
assert(dupReview.success === false, 'Duplicate review prevented for same user & dish');

// New review on food-102
const reviewRes = store.addReview({
  restaurantId: 'rest-1',
  foodId: 'food-102',
  rating: 5,
  comment: 'Sensational truffle pizza! Perfectly charred crust and aromatic mushrooms.'
});
assert(reviewRes.success === true, 'New review added successfully');
const updatedRest = store.getRestaurantById('rest-1');
assert(updatedRest.rating >= 4.0, `Restaurant rating recalculated: ${updatedRest.rating}`);

// Summary
console.log(`\n========================================`);
console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
