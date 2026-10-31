/**
 * FoodOrder - Top Navigation Component
 * Features logo, active route highlighting, live cart counter, dark mode toggle,
 * simulated notification bell with unread counter, and user profile / role controls.
 */

import { store } from '../state/store.js';
import { CartDrawer } from './CartDrawer.js';
import { NotificationsModal } from './NotificationsModal.js';

export const Navbar = {
  render() {
    const user = store.getCurrentUser();
    const cartSummary = store.getCartSummary();
    const unreadNotifs = store.getUnreadNotificationsCount();
    const isDark = store.getTheme() === 'dark';

    return `
      <header class="navbar" id="main-navbar">
        <div class="container nav-container">
          <!-- Brand Logo -->
          <a href="#home" class="brand-logo" aria-label="FoodOrder Homepage">
            <span class="logo-icon">🍔</span>
            <span>Food<span class="brand-highlight">Order</span></span>
          </a>

          <!-- Navigation Links (Desktop) -->
          <nav class="nav-links" aria-label="Main Navigation">
            <a href="#home" class="nav-link" data-route="home">Home</a>
            <a href="#restaurants" class="nav-link" data-route="restaurants">Restaurants</a>
            <a href="#menu" class="nav-link" data-route="menu">Menu</a>
            <a href="#history" class="nav-link" data-route="history">My Orders</a>
            ${user && (user.role === 'owner' || user.role === 'admin') ? `
              <a href="#dashboard" class="nav-link" data-route="dashboard" style="color: var(--color-primary-hover); font-weight: 700;">
                📊 Dashboard
              </a>
            ` : ''}
          </nav>

          <!-- Action Controls -->
          <div class="nav-actions">
            <!-- Dark Mode Toggle Button (Bonus Feature 4) -->
            <button class="nav-action-btn" id="theme-toggle-btn" aria-label="Toggle Dark Mode" title="Toggle Dark/Light Mode">
              <span id="theme-icon">${isDark ? '☀️' : '🌙'}</span>
            </button>

            <!-- Notification Bell (Bonus Feature 5) -->
            <button class="nav-action-btn" id="notif-btn" aria-label="Simulated Email Notifications" title="Simulated Email Notifications">
              <span>🔔</span>
              ${unreadNotifs > 0 ? `<span class="nav-badge" id="notif-badge">${unreadNotifs}</span>` : ''}
            </button>

            <!-- Cart Trigger Button -->
            <button class="nav-action-btn" id="cart-btn" aria-label="Open Shopping Cart" title="Shopping Cart">
              <span>🛒</span>
              ${cartSummary.itemCount > 0 ? `<span class="nav-badge" id="cart-badge">${cartSummary.itemCount}</span>` : ''}
            </button>

            <!-- User Auth / Profile Badge -->
            ${user ? `
              <a href="#profile" class="user-profile-badge" title="Go to Profile (${user.role})">
                <span class="user-avatar">${user.avatar || 'U'}</span>
                <span class="user-info-text">
                  <span class="user-name">${user.name.split(' ')[0]}</span>
                  <span class="user-role-tag">${user.role}</span>
                </span>
              </a>
            ` : `
              <a href="#auth" class="btn btn-primary btn-sm">Sign In</a>
            `}
          </div>
        </div>
      </header>
    `;
  },

  attachEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const nextTheme = store.toggleTheme();
        const icon = document.getElementById('theme-icon');
        if (icon) icon.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
      });
    }

    // Cart Drawer Toggle
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        CartDrawer.toggle();
      });
    }

    // Notification Center Modal
    const notifBtn = document.getElementById('notif-btn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        NotificationsModal.open();
      });
    }

    this.updateActiveLink();
  },

  updateActiveLink() {
    const rawHash = window.location.hash.slice(1) || 'home';
    const baseRoute = rawHash.split('?')[0].split('/')[0] || 'home';
    document.querySelectorAll('.nav-link').forEach(link => {
      const route = link.getAttribute('data-route');
      if (route === baseRoute) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
};
