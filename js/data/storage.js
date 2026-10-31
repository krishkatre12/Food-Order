/**
 * FoodOrder - LocalStorage Data Repository & Manager
 * Handles local persistence, initialization without overwriting changes, and deliberate demo data resets.
 */

import {
  INITIAL_CATEGORIES,
  INITIAL_RESTAURANTS,
  INITIAL_FOOD_ITEMS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_PROMO_CODES
} from './initialData.js';

const STORAGE_KEYS = {
  VERSION: 'foodorder_version_v1.0',
  CATEGORIES: 'foodorder_categories',
  RESTAURANTS: 'foodorder_restaurants',
  FOOD_ITEMS: 'foodorder_food_items',
  USERS: 'foodorder_users',
  CURRENT_USER: 'foodorder_current_user',
  ORDERS: 'foodorder_orders',
  REVIEWS: 'foodorder_reviews',
  CART: 'foodorder_cart',
  PROMO_CODES: 'foodorder_promo_codes',
  NOTIFICATIONS: 'foodorder_notifications',
  THEME: 'foodorder_theme'
};

export const Storage = {
  /**
   * Initializes sample data if not already present in LocalStorage.
   */
  init() {
    try {
      if (!localStorage.getItem(STORAGE_KEYS.VERSION)) {
        this.resetAllData();
        return;
      }

      // Ensure mandatory keys exist if partial storage
      if (!localStorage.getItem(STORAGE_KEYS.RESTAURANTS)) {
        this.setRestaurants(INITIAL_RESTAURANTS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS)) {
        this.setFoodItems(INITIAL_FOOD_ITEMS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
        this.setCategories(INITIAL_CATEGORIES);
      }
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        this.setUsers(INITIAL_USERS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        this.setOrders(INITIAL_ORDERS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
        this.setReviews(INITIAL_REVIEWS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.PROMO_CODES)) {
        this.setPromoCodes(INITIAL_PROMO_CODES);
      }
    } catch (e) {
      console.warn('LocalStorage error during init:', e);
    }
  },

  /**
   * Restores initial sample data cleanly.
   */
  resetAllData() {
    try {
      localStorage.setItem(STORAGE_KEYS.VERSION, '1.0');
      this.setCategories(INITIAL_CATEGORIES);
      this.setRestaurants(INITIAL_RESTAURANTS);
      this.setFoodItems(INITIAL_FOOD_ITEMS);
      this.setUsers(INITIAL_USERS);
      this.setCurrentUser(INITIAL_USERS[0]); // Default to Sarah Connor (Customer)
      this.setOrders(INITIAL_ORDERS);
      this.setReviews(INITIAL_REVIEWS);
      this.setPromoCodes(INITIAL_PROMO_CODES);
      this.setCart({ restaurantId: null, items: [], promoCode: null, discount: 0 });
      this.setNotifications([
        {
          id: 'notif-welcome',
          title: 'Welcome to FoodOrder! 🍕',
          message: 'Explore 8 top restaurants with free delivery on select meals. Use code FOODIE20 for 20% off!',
          type: 'welcome',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: 'Today',
          read: false
        }
      ]);
    } catch (e) {
      console.error('Failed to reset demo data in LocalStorage:', e);
    }
  },

  // Categories
  getCategories() {
    return this._get(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },
  setCategories(data) {
    this._set(STORAGE_KEYS.CATEGORIES, data);
  },

  // Restaurants
  getRestaurants() {
    return this._get(STORAGE_KEYS.RESTAURANTS, INITIAL_RESTAURANTS);
  },
  setRestaurants(data) {
    this._set(STORAGE_KEYS.RESTAURANTS, data);
  },

  // Food Items
  getFoodItems() {
    return this._get(STORAGE_KEYS.FOOD_ITEMS, INITIAL_FOOD_ITEMS);
  },
  setFoodItems(data) {
    this._set(STORAGE_KEYS.FOOD_ITEMS, data);
  },

  // Users
  getUsers() {
    return this._get(STORAGE_KEYS.USERS, INITIAL_USERS);
  },
  setUsers(data) {
    this._set(STORAGE_KEYS.USERS, data);
  },

  // Current User Session
  getCurrentUser() {
    return this._get(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },
  setCurrentUser(user) {
    this._set(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Orders
  getOrders() {
    return this._get(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },
  setOrders(orders) {
    this._set(STORAGE_KEYS.ORDERS, orders);
  },

  // Reviews
  getReviews() {
    return this._get(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  },
  setReviews(reviews) {
    this._set(STORAGE_KEYS.REVIEWS, reviews);
  },

  // Promo Codes
  getPromoCodes() {
    return this._get(STORAGE_KEYS.PROMO_CODES, INITIAL_PROMO_CODES);
  },
  setPromoCodes(codes) {
    this._set(STORAGE_KEYS.PROMO_CODES, codes);
  },

  // Cart
  getCart() {
    return this._get(STORAGE_KEYS.CART, {
      restaurantId: null,
      restaurantName: '',
      items: [],
      promoCode: null,
      discount: 0,
      deliveryInstructions: ''
    });
  },
  setCart(cart) {
    this._set(STORAGE_KEYS.CART, cart);
  },

  // Notifications (Bonus Feature 5)
  getNotifications() {
    return this._get(STORAGE_KEYS.NOTIFICATIONS, []);
  },
  setNotifications(notifications) {
    this._set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  // Theme (Bonus Feature 4)
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },
  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Internal Helpers
  _get(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading key ${key} from LocalStorage:`, e);
      return defaultValue;
    }
  },
  _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving key ${key} to LocalStorage:`, e);
    }
  }
};

