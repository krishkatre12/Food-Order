/**
 * FoodOrder - Main Application Entry & Bootstrap
 * Initializes reactive store, mounts persistent navigation components,
 * sets up global observers, and starts the client router.
 */

import { store } from './state/store.js';
import { Router } from './router.js';
import { Navbar } from './components/Navbar.js';
import { BottomNav } from './components/BottomNav.js';
import { Footer } from './components/Footer.js';
import { CartDrawer } from './components/CartDrawer.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize reactive store & LocalStorage
  store.init();

  // 2. Initialize Cart Drawer slide-over
  CartDrawer.init();

  // 3. Mount persistent chrome components
  const navMount = document.getElementById('navbar-mount');
  const bottomNavMount = document.getElementById('bottom-nav-mount');
  const footerMount = document.getElementById('footer-mount');

  const renderChrome = () => {
    if (navMount) {
      navMount.innerHTML = Navbar.render();
      Navbar.attachEvents();
    }
    if (bottomNavMount) {
      bottomNavMount.innerHTML = BottomNav.render();
      BottomNav.attachEvents();
    }
    if (footerMount) {
      footerMount.innerHTML = Footer.render();
      Footer.attachEvents();
    }
  };

  renderChrome();

  // 4. Subscribe chrome to state updates
  store.subscribe((event) => {
    if (event === 'AUTH_CHANGED' || event === 'CART_UPDATED' || event === 'NOTIFICATIONS_UPDATED' || event === 'THEME_CHANGED') {
      renderChrome();
    }
  });

  // 5. Initialize client-side SPA routing
  Router.init('main-view');

  console.log('%c🍔 FoodOrder Online System Initialized', 'color: #F59E0B; font-weight: bold; font-size: 14px;');
});

