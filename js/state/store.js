/**
 * FoodOrder - Centralized Reactive State Store
 * Manages reactive data, calculations, validations, auth, and state persistence.
 */

import { Storage } from '../data/storage.js';

class StateStore {
  constructor() {
    this.listeners = [];
    this.timerHandles = {};
  }

  init() {
    Storage.init();
    this.applyTheme(Storage.getTheme());
    this.startActiveOrdersProgression();
  }

  // Listener pattern
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(event, payload = {}) {
    this.listeners.forEach(cb => {
      try {
        cb(event, payload);
      } catch (err) {
        console.error('Error in state subscriber:', err);
      }
    });
  }

  /* ------------------------------------------------------------------------
     Theme Management
     ------------------------------------------------------------------------ */
  getTheme() {
    return Storage.getTheme();
  }

  toggleTheme() {
    const nextTheme = this.getTheme() === 'dark' ? 'light' : 'dark';
    Storage.setTheme(nextTheme);
    this.applyTheme(nextTheme);
    this.notify('THEME_CHANGED', { theme: nextTheme });
    return nextTheme;
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  /* ------------------------------------------------------------------------
     Authentication & User Profile
     ------------------------------------------------------------------------ */
  getCurrentUser() {
    return Storage.getCurrentUser();
  }

  getUsers() {
    return Storage.getUsers();
  }

  login(email, password) {
    const users = Storage.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, message: 'No account found with this email. Try demo accounts or register.' };
    }
    // Safe demo authentication check
    Storage.setCurrentUser(user);
    this.notify('AUTH_CHANGED', { user });
    return { success: true, user };
  }

  register(userData) {
    const users = Storage.getUsers();
    if (users.some(u => u.email.toLowerCase() === userData.email.trim().toLowerCase())) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const initials = userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      phone: userData.phone.trim(),
      role: userData.role || 'customer',
      avatar: initials,
      restaurantId: userData.role === 'owner' ? 'rest-1' : null,
      restaurantName: userData.role === 'owner' ? 'Bella Italia Trattoria' : null,
      addresses: userData.addresses || []
    };

    users.push(newUser);
    Storage.setUsers(users);
    Storage.setCurrentUser(newUser);

    // Send simulated welcome email notification
    this.addNotification({
      title: 'Welcome to FoodOrder! 🎉',
      message: `Hi ${newUser.name}, your FoodOrder account has been registered successfully. Enjoy free delivery on your first feast!`,
      type: 'account'
    });

    this.notify('AUTH_CHANGED', { user: newUser });
    return { success: true, user: newUser };
  }

  logout() {
    Storage.setCurrentUser(null);
    this.notify('AUTH_CHANGED', { user: null });
  }

  switchDemoUser(role) {
    const users = Storage.getUsers();
    const demoUser = users.find(u => u.role === role);
    if (demoUser) {
      Storage.setCurrentUser(demoUser);
      this.notify('AUTH_CHANGED', { user: demoUser });
      return demoUser;
    }
    return null;
  }

  updateProfile(updatedFields) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Please log in to edit profile.' };

    const users = Storage.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedFields };
      Storage.setUsers(users);
      Storage.setCurrentUser(users[index]);
      this.notify('PROFILE_UPDATED', { user: users[index] });
      return { success: true, user: users[index] };
    }
    return { success: false, message: 'User not found in storage.' };
  }

  addAddress(addressData) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Must be logged in.' };

    const newAddress = {
      id: `addr-${Date.now()}`,
      ...addressData,
      isDefault: addressData.isDefault || (!user.addresses || user.addresses.length === 0)
    };

    let addresses = user.addresses ? [...user.addresses] : [];
    if (newAddress.isDefault) {
      addresses = addresses.map(a => ({ ...a, isDefault: false }));
    }
    addresses.push(newAddress);

    this.updateProfile({ addresses });
    return { success: true, address: newAddress };
  }

  updateAddress(addressId, updatedData) {
    const user = this.getCurrentUser();
    if (!user || !user.addresses) return { success: false };

    let addresses = user.addresses.map(a => {
      if (a.id === addressId) {
        return { ...a, ...updatedData };
      }
      if (updatedData.isDefault) {
        return { ...a, isDefault: false };
      }
      return a;
    });

    this.updateProfile({ addresses });
    return { success: true };
  }

  deleteAddress(addressId) {
    const user = this.getCurrentUser();
    if (!user || !user.addresses) return { success: false };

    let addresses = user.addresses.filter(a => a.id !== addressId);
    if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
      addresses[0].isDefault = true;
    }
    this.updateProfile({ addresses });
    return { success: true };
  }

  setDefaultAddress(addressId) {
    const user = this.getCurrentUser();
    if (!user || !user.addresses) return { success: false };

    const addresses = user.addresses.map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));
    this.updateProfile({ addresses });
    return { success: true };
  }

  /* ------------------------------------------------------------------------
     Restaurants & Food Catalog
     ------------------------------------------------------------------------ */
  getRestaurants() {
    return Storage.getRestaurants();
  }

  getRestaurantById(id) {
    return this.getRestaurants().find(r => r.id === id) || null;
  }

  getCategories() {
    return Storage.getCategories();
  }

  getFoodItems(restaurantId = null) {
    const items = Storage.getFoodItems();
    if (restaurantId) {
      return items.filter(item => item.restaurantId === restaurantId);
    }
    return items;
  }

  getFoodItemById(id) {
    return Storage.getFoodItems().find(item => item.id === id) || null;
  }

  /* ------------------------------------------------------------------------
     Shopping Cart
     ------------------------------------------------------------------------ */
  getCart() {
    return Storage.getCart();
  }

  addToCart(foodItem, quantity = 1, selectedCustomizations = [], forceReplace = false) {
    let cart = this.getCart();

    // Check multi-restaurant conflict
    if (cart.restaurantId && cart.items.length > 0 && cart.restaurantId !== foodItem.restaurantId) {
      if (!forceReplace) {
        return {
          conflict: true,
          currentRestaurantName: cart.restaurantName || 'another restaurant',
          newRestaurantName: foodItem.restaurantName,
          foodItem
        };
      } else {
        // Clear cart to start with new restaurant
        cart = {
          restaurantId: foodItem.restaurantId,
          restaurantName: foodItem.restaurantName,
          items: [],
          promoCode: null,
          discount: 0,
          deliveryInstructions: ''
        };
      }
    }

    if (!cart.restaurantId) {
      cart.restaurantId = foodItem.restaurantId;
      cart.restaurantName = foodItem.restaurantName;
    }

    // Compute unit price including selected customization add-ons
    let unitPrice = Number(foodItem.price);
    const customLabels = [];

    if (Array.isArray(selectedCustomizations)) {
      selectedCustomizations.forEach(opt => {
        unitPrice += Number(opt.price || 0);
        customLabels.push(`${opt.groupName}: ${opt.name}${opt.price > 0 ? ` (+$${opt.price.toFixed(2)})` : ''}`);
      });
    }

    // Check if exact same item with same customizations already exists
    const customKey = customLabels.sort().join('|');
    const existingIndex = cart.items.findIndex(i => i.foodId === foodItem.id && i.customKey === customKey);

    if (existingIndex !== -1) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].subtotal = Number((cart.items[existingIndex].quantity * cart.items[existingIndex].unitPrice).toFixed(2));
    } else {
      cart.items.push({
        foodId: foodItem.id,
        name: foodItem.name,
        image: foodItem.image,
        unitPrice: Number(unitPrice.toFixed(2)),
        quantity: quantity,
        subtotal: Number((unitPrice * quantity).toFixed(2)),
        customizations: customLabels,
        customKey: customKey,
        isVeg: foodItem.isVeg
      });
    }

    Storage.setCart(cart);
    this.recalculateCartPromo();
    this.notify('CART_UPDATED', { cart: this.getCart() });
    return { success: true };
  }

  updateCartQuantity(itemIndex, newQty) {
    const cart = this.getCart();
    if (!cart.items[itemIndex]) return;

    if (newQty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].subtotal = Number((newQty * cart.items[itemIndex].unitPrice).toFixed(2));
    }

    if (cart.items.length === 0) {
      cart.restaurantId = null;
      cart.restaurantName = '';
      cart.promoCode = null;
      cart.discount = 0;
    }

    Storage.setCart(cart);
    this.recalculateCartPromo();
    this.notify('CART_UPDATED', { cart: this.getCart() });
  }

  removeFromCart(itemIndex) {
    this.updateCartQuantity(itemIndex, 0);
  }

  clearCart() {
    const emptyCart = {
      restaurantId: null,
      restaurantName: '',
      items: [],
      promoCode: null,
      discount: 0,
      deliveryInstructions: ''
    };
    Storage.setCart(emptyCart);
    this.notify('CART_UPDATED', { cart: emptyCart });
  }

  applyPromoCode(codeStr) {
    const code = codeStr.trim().toUpperCase();
    const codes = Storage.getPromoCodes();
    const promo = codes.find(p => p.code === code);

    if (!promo) {
      return { success: false, message: 'Invalid promo code. Try FOODIE20, FREEDEL, or WELCOME50.' };
    }

    const summary = this.getCartSummary();
    if (summary.subtotal < (promo.minOrder || 0)) {
      return { success: false, message: `This code requires a minimum food order of $${promo.minOrder.toFixed(2)}.` };
    }

    const cart = this.getCart();
    cart.promoCode = promo.code;

    Storage.setCart(cart);
    this.recalculateCartPromo();
    this.notify('CART_UPDATED', { cart: this.getCart() });
    return { success: true, message: `Promo code ${promo.code} applied successfully!` };
  }

  removePromoCode() {
    const cart = this.getCart();
    cart.promoCode = null;
    cart.discount = 0;
    Storage.setCart(cart);
    this.notify('CART_UPDATED', { cart });
  }

  recalculateCartPromo() {
    const cart = this.getCart();
    if (!cart.promoCode) {
      cart.discount = 0;
      Storage.setCart(cart);
      return;
    }

    const codes = Storage.getPromoCodes();
    const promo = codes.find(p => p.code === cart.promoCode);
    const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

    if (!promo || subtotal < (promo.minOrder || 0)) {
      cart.promoCode = null;
      cart.discount = 0;
      Storage.setCart(cart);
      return;
    }

    let discount = 0;
    if (promo.discountPercent) {
      discount = (subtotal * promo.discountPercent) / 100;
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount;
      }
    } else if (promo.discountAmount) {
      discount = Math.min(promo.discountAmount, subtotal);
    } else if (promo.discountType === 'free_delivery') {
      discount = 0; // handled in deliveryFee reduction
    }

    cart.discount = Number(discount.toFixed(2));
    Storage.setCart(cart);
  }

  getCartSummary() {
    const cart = this.getCart();
    const restaurant = cart.restaurantId ? this.getRestaurantById(cart.restaurantId) : null;
    
    const subtotal = Number(cart.items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
    let deliveryFee = restaurant ? Number(restaurant.deliveryFee || 0) : 0;
    
    // Free delivery promos or orders above $35
    if (cart.promoCode === 'FREEDEL' || subtotal >= 35.00) {
      deliveryFee = 0;
    }

    const tax = Number((subtotal * 0.08).toFixed(2)); // 8% estimated tax
    const discount = Number((cart.discount || 0).toFixed(2));
    const total = Number(Math.max(0, subtotal + deliveryFee + tax - discount).toFixed(2));

    const minOrder = restaurant ? Number(restaurant.minOrder || 0) : 0;
    const meetsMinOrder = subtotal >= minOrder;
    const amountNeededForMin = Number(Math.max(0, minOrder - subtotal).toFixed(2));

    return {
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      itemCount: cart.items.reduce((sum, i) => sum + i.quantity, 0),
      minOrder,
      meetsMinOrder,
      amountNeededForMin,
      restaurant
    };
  }

  /* ------------------------------------------------------------------------
     Orders & Checkout
     ------------------------------------------------------------------------ */
  getOrders(userId = null) {
    const orders = Storage.getOrders();
    if (userId) {
      return orders.filter(o => o.userId === userId);
    }
    return orders;
  }

  getOrderById(orderId) {
    return Storage.getOrders().find(o => o.id === orderId) || null;
  }

  placeOrder({ address, paymentMethod, instructions = '' }) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'You must be logged in to complete checkout.' };

    const cart = this.getCart();
    if (!cart.items || cart.items.length === 0) {
      return { success: false, message: 'Your cart is empty. Please add delicious items first.' };
    }

    const summary = this.getCartSummary();
    if (!summary.meetsMinOrder) {
      return {
        success: false,
        message: `Order does not meet the restaurant's minimum order requirement of $${summary.minOrder.toFixed(2)}.`
      };
    }

    const orderId = `FO-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();

    const newOrder = {
      id: orderId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      restaurantId: cart.restaurantId,
      restaurantName: cart.restaurantName,
      restaurantImage: summary.restaurant ? summary.restaurant.image : '',
      items: [...cart.items],
      subtotal: summary.subtotal,
      deliveryFee: summary.deliveryFee,
      tax: summary.tax,
      discount: summary.discount,
      promoCode: cart.promoCode,
      total: summary.total,
      deliveryAddress: { ...address },
      deliveryInstructions: instructions || cart.deliveryInstructions || '',
      paymentMethod: paymentMethod,
      status: 'pending',
      createdAt: now.toISOString(),
      statusHistory: [
        {
          status: 'pending',
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'Order placed by customer and sent to restaurant'
        }
      ]
    };

    const orders = Storage.getOrders();
    orders.unshift(newOrder);
    Storage.setOrders(orders);

    // Simulated email confirmation
    this.addNotification({
      title: `Order Placed: #${orderId} 🍽️`,
      message: `Thank you for your order at ${newOrder.restaurantName}! Your total is $${newOrder.total.toFixed(2)}. We're getting your food ready!`,
      type: 'order',
      orderId: orderId
    });

    // Clear cart
    this.clearCart();

    // Start auto-progression simulation for this order
    this.scheduleNextOrderStage(orderId);

    this.notify('ORDER_PLACED', { order: newOrder });
    return { success: true, order: newOrder };
  }

  cancelOrder(orderId, reason = 'Customer requested cancellation') {
    const orders = Storage.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      return { success: false, message: 'Order not found.' };
    }

    const order = orders[orderIndex];
    if (order.status !== 'pending' && order.status !== 'preparing') {
      return {
        success: false,
        message: `Order cannot be cancelled because it is already ${order.status.replace(/_/g, ' ')}.`
      };
    }

    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: `Cancelled: ${reason}`
    });

    orders[orderIndex] = order;
    Storage.setOrders(orders);

    if (this.timerHandles[orderId]) {
      clearTimeout(this.timerHandles[orderId]);
      delete this.timerHandles[orderId];
    }

    this.addNotification({
      title: `Order Cancelled: #${orderId}`,
      message: `Your order at ${order.restaurantName} was successfully cancelled. Refund has been simulated.`,
      type: 'order',
      orderId: orderId
    });

    this.notify('ORDER_UPDATED', { order });
    return { success: true, order };
  }

  updateOrderStatus(orderId, targetStatus, customNote = '') {
    const orders = Storage.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) return { success: false, message: 'Order not found' };

    const order = orders[orderIndex];
    order.status = targetStatus;

    const noteMap = {
      pending: 'Order confirmed',
      preparing: 'Kitchen is preparing your food',
      out_for_delivery: 'Courier has picked up your food and is on the way',
      delivered: 'Order delivered to recipient. Enjoy your meal!',
      cancelled: 'Order was cancelled'
    };

    order.statusHistory.push({
      status: targetStatus,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: customNote || noteMap[targetStatus] || `Status updated to ${targetStatus}`
    });

    orders[orderIndex] = order;
    Storage.setOrders(orders);

    // Send email notification update
    const statusTitles = {
      preparing: `Kitchen is preparing your meal! 👨‍🍳`,
      out_for_delivery: `Your order is on the way! 🛵`,
      delivered: `Your order has arrived! 😋`,
      cancelled: `Order #${orderId} was cancelled`
    };

    if (statusTitles[targetStatus]) {
      this.addNotification({
        title: statusTitles[targetStatus],
        message: `Order #${orderId} from ${order.restaurantName}: ${order.statusHistory[order.statusHistory.length - 1].note}`,
        type: 'order',
        orderId: orderId
      });
    }

    this.notify('ORDER_UPDATED', { order });
    return { success: true, order };
  }

  reorder(orderId) {
    const order = this.getOrderById(orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    const restaurant = this.getRestaurantById(order.restaurantId);
    if (!restaurant) {
      return { success: false, message: 'This restaurant is no longer available on FoodOrder.' };
    }

    // Verify item availability
    const allItems = Storage.getFoodItems();
    const availableItems = [];
    const unavailableNames = [];

    for (const item of order.items) {
      const liveItem = allItems.find(f => f.id === item.foodId);
      if (liveItem && liveItem.available !== false) {
        availableItems.push({
          food: liveItem,
          qty: item.quantity,
          customizations: item.customizations
        });
      } else {
        unavailableNames.push(item.name);
      }
    }

    if (availableItems.length === 0) {
      return {
        success: false,
        message: 'None of the items from this previous order are currently available in the menu.'
      };
    }

    // Rebuild cart
    this.clearCart();
    for (const entry of availableItems) {
      this.addToCart(entry.food, entry.qty, [], true);
    }

    let message = 'Items added to your cart!';
    if (unavailableNames.length > 0) {
      message += ` (Note: ${unavailableNames.join(', ')} were unavailable and omitted).`;
    }

    return { success: true, message };
  }

  /* ------------------------------------------------------------------------
     Simulated Real-Time Order Progression (Bonus Feature 1)
     ------------------------------------------------------------------------ */
  startActiveOrdersProgression() {
    const orders = Storage.getOrders();
    orders.forEach(order => {
      if (order.status === 'pending' || order.status === 'preparing' || order.status === 'out_for_delivery') {
        this.scheduleNextOrderStage(order.id);
      }
    });
  }

  scheduleNextOrderStage(orderId) {
    if (this.timerHandles[orderId]) return;

    // Simulate next stage every 20-30 seconds for engaging interactive demo
    this.timerHandles[orderId] = setTimeout(() => {
      delete this.timerHandles[orderId];
      const order = this.getOrderById(orderId);
      if (!order) return;

      if (order.status === 'pending') {
        this.updateOrderStatus(orderId, 'preparing');
        this.scheduleNextOrderStage(orderId);
      } else if (order.status === 'preparing') {
        this.updateOrderStatus(orderId, 'out_for_delivery');
        this.scheduleNextOrderStage(orderId);
      } else if (order.status === 'out_for_delivery') {
        this.updateOrderStatus(orderId, 'delivered');
      }
    }, 25000);
  }

  /* ------------------------------------------------------------------------
     Restaurant Dashboard & Menu CRUD (Module H)
     ------------------------------------------------------------------------ */
  addFoodItem(itemData) {
    const items = Storage.getFoodItems();
    const newItem = {
      id: `food-${Date.now()}`,
      ...itemData,
      rating: 5.0,
      ratingCount: 1,
      available: itemData.available !== false
    };

    items.push(newItem);
    Storage.setFoodItems(items);
    this.notify('CATALOG_UPDATED', { item: newItem, action: 'add' });
    return { success: true, item: newItem };
  }

  updateFoodItem(itemId, updatedData) {
    const items = Storage.getFoodItems();
    const index = items.findIndex(i => i.id === itemId);
    if (index === -1) return { success: false, message: 'Dish not found' };

    items[index] = { ...items[index], ...updatedData };
    Storage.setFoodItems(items);
    this.notify('CATALOG_UPDATED', { item: items[index], action: 'update' });
    return { success: true, item: items[index] };
  }

  deleteFoodItem(itemId) {
    let items = Storage.getFoodItems();
    items = items.filter(i => i.id !== itemId);
    Storage.setFoodItems(items);
    this.notify('CATALOG_UPDATED', { itemId, action: 'delete' });
    return { success: true };
  }

  toggleFoodAvailability(itemId) {
    const items = Storage.getFoodItems();
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.available = !item.available;
      Storage.setFoodItems(items);
      this.notify('CATALOG_UPDATED', { item, action: 'toggle' });
      return { success: true, available: item.available };
    }
    return { success: false };
  }

  /* ------------------------------------------------------------------------
     Reviews & Ratings (Bonus Features 2 & 3)
     ------------------------------------------------------------------------ */
  getReviews(restaurantId = null, foodId = null) {
    let reviews = Storage.getReviews();
    if (restaurantId) {
      reviews = reviews.filter(r => r.restaurantId === restaurantId);
    }
    if (foodId) {
      reviews = reviews.filter(r => r.foodId === foodId);
    }
    return reviews;
  }

  addReview({ restaurantId, foodId = null, rating, comment }) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Please log in to submit a review.' };

    const reviews = Storage.getReviews();

    // Prevent duplicate review for same item/restaurant by this user today
    const existing = reviews.find(r => r.userName === user.name && r.restaurantId === restaurantId && r.foodId === foodId);
    if (existing) {
      return { success: false, message: 'You have already submitted a review for this.' };
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      restaurantId,
      foodId,
      userName: user.name,
      userAvatar: user.avatar || 'U',
      rating: Number(rating),
      comment: comment.trim(),
      date: 'Just now',
      helpfulCount: 0
    };

    reviews.unshift(newReview);
    Storage.setReviews(reviews);

    // Recalculate restaurant rating
    const restReviews = reviews.filter(r => r.restaurantId === restaurantId);
    const avgRestRating = restReviews.reduce((sum, r) => sum + r.rating, 0) / restReviews.length;

    const restaurants = Storage.getRestaurants();
    const rest = restaurants.find(r => r.id === restaurantId);
    if (rest) {
      rest.rating = Number(avgRestRating.toFixed(1));
      rest.reviewCount = restReviews.length;
      Storage.setRestaurants(restaurants);
    }

    // Recalculate food item rating if applicable
    if (foodId) {
      const foodReviews = reviews.filter(r => r.foodId === foodId);
      const avgFoodRating = foodReviews.reduce((sum, r) => sum + r.rating, 0) / foodReviews.length;
      const foodItems = Storage.getFoodItems();
      const food = foodItems.find(f => f.id === foodId);
      if (food) {
        food.rating = Number(avgFoodRating.toFixed(1));
        food.ratingCount = foodReviews.length;
        Storage.setFoodItems(foodItems);
      }
    }

    this.notify('REVIEW_ADDED', { review: newReview });
    return { success: true, review: newReview };
  }

  /* ------------------------------------------------------------------------
     Simulated Email Notification Center (Bonus Feature 5)
     ------------------------------------------------------------------------ */
  getNotifications() {
    return Storage.getNotifications();
  }

  getUnreadNotificationsCount() {
    return this.getNotifications().filter(n => !n.read).length;
  }

  addNotification(notif) {
    const notifications = Storage.getNotifications();
    const newNotif = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      read: false,
      ...notif
    };
    notifications.unshift(newNotif);
    Storage.setNotifications(notifications);
    this.notify('NOTIFICATIONS_UPDATED', { notifications });
  }

  markAllNotificationsRead() {
    const notifications = Storage.getNotifications().map(n => ({ ...n, read: true }));
    Storage.setNotifications(notifications);
    this.notify('NOTIFICATIONS_UPDATED', { notifications });
  }
}

export const store = new StateStore();

