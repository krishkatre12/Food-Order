/**
 * FoodOrder - Mobile Bottom Navigation Component
 * Modeled after the reference mobile UI: Home, Menu, Orders, Cart, Profile.
 */

import { store } from '../state/store.js';
import { CartDrawer } from './CartDrawer.js';

export const BottomNav = {
  render() {
    const cartSummary = store.getCartSummary();
    const rawHash = window.location.hash.slice(1) || 'home';
    const hash = rawHash.split('?')[0].split('/')[0] || 'home';

    return `
      <nav class="bottom-nav" aria-label="Mobile Navigation">
        <a href="#home" class="bottom-nav-item ${hash === 'home' ? 'active' : ''}">
          <span style="font-size: 1.25rem;">🏠</span>
          <span>Home</span>
        </a>
        <a href="#menu" class="bottom-nav-item ${hash === 'menu' || hash === 'restaurants' ? 'active' : ''}">
          <span style="font-size: 1.25rem;">🍽️</span>
          <span>Menu</span>
        </a>
        <a href="#history" class="bottom-nav-item ${hash === 'history' || hash === 'tracking' ? 'active' : ''}">
          <span style="font-size: 1.25rem;">📦</span>
          <span>Orders</span>
        </a>
        <button type="button" class="bottom-nav-item" id="bottom-cart-btn" style="background: none; border: none; cursor: pointer;">
          <span style="font-size: 1.25rem;">🛒</span>
          <span>Cart</span>
          ${cartSummary.itemCount > 0 ? `<span class="bottom-nav-badge">${cartSummary.itemCount}</span>` : ''}
        </button>
        <a href="#profile" class="bottom-nav-item ${hash === 'profile' || hash === 'auth' ? 'active' : ''}">
          <span style="font-size: 1.25rem;">👤</span>
          <span>Profile</span>
        </a>
      </nav>
    `;
  },

  attachEvents() {
    const bottomCartBtn = document.getElementById('bottom-cart-btn');
    if (bottomCartBtn) {
      bottomCartBtn.addEventListener('click', () => {
        CartDrawer.toggle();
      });
    }
  }
};
