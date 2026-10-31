/**
 * FoodOrder - Cart Slide-Over Drawer
 * Provides immediate feedback when adding items, live cost calculations, promo code input, and checkout link.
 */

import { store } from '../state/store.js';
import { Toast } from './Toast.js';

class CartDrawerManager {
  constructor() {
    this.drawerBackdrop = null;
    this.isOpen = false;
  }

  init() {
    this.render();
    store.subscribe((event) => {
      if (event === 'CART_UPDATED') {
        this.updateContent();
      }
    });
  }

  render() {
    const backdrop = document.createElement('div');
    backdrop.className = 'cart-drawer-backdrop';
    backdrop.id = 'cart-drawer-backdrop';

    backdrop.innerHTML = `
      <div class="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Cart">
        <!-- Header -->
        <div class="cart-drawer-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.3rem;">🛒</span>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--color-text-main);">Your Cart</h3>
            <span class="badge badge-primary" id="drawer-item-count">0 items</span>
          </div>
          <button class="modal-close" id="drawer-close-btn" aria-label="Close cart">&times;</button>
        </div>

        <!-- Body / Items List -->
        <div class="cart-drawer-items" id="drawer-items-container">
          <!-- Dynamic items injected here -->
        </div>

        <!-- Footer / Cost Breakdown -->
        <div class="cart-drawer-footer" id="drawer-footer-container">
          <!-- Dynamic summary injected here -->
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    this.drawerBackdrop = backdrop;

    // Events
    backdrop.querySelector('#drawer-close-btn').addEventListener('click', () => this.close());
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.close();
    });

    this.updateContent();
  }

  open() {
    if (!this.drawerBackdrop) return;
    this.updateContent();
    this.drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.isOpen = true;
  }

  close() {
    if (!this.drawerBackdrop) return;
    this.drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    this.isOpen = false;
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  updateContent() {
    if (!this.drawerBackdrop) return;

    const cart = store.getCart();
    const summary = store.getCartSummary();

    const countBadge = this.drawerBackdrop.querySelector('#drawer-item-count');
    const itemsContainer = this.drawerBackdrop.querySelector('#drawer-items-container');
    const footerContainer = this.drawerBackdrop.querySelector('#drawer-footer-container');

    if (countBadge) {
      countBadge.textContent = `${summary.itemCount} ${summary.itemCount === 1 ? 'item' : 'items'}`;
    }

    // Empty Cart State
    if (!cart.items || cart.items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="empty-state" style="border: none; margin: 2rem 0;">
          <div class="empty-state-icon">🍜</div>
          <h4 class="empty-state-title">Your cart is hungry!</h4>
          <p class="empty-state-desc">You have no items in your cart yet. Browse our delicious menus to start your order.</p>
          <button class="btn btn-primary" id="drawer-start-shopping-btn" style="margin-top: 1rem;">
            Explore Menu &rarr;
          </button>
        </div>
      `;

      itemsContainer.querySelector('#drawer-start-shopping-btn')?.addEventListener('click', () => {
        this.close();
        window.location.hash = '#menu';
      });

      footerContainer.innerHTML = '';
      return;
    }

    // Items List
    itemsContainer.innerHTML = `
      <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
        <span>Ordering from: <strong style="color: var(--color-text-main);">${cart.restaurantName}</strong></span>
        <button id="drawer-clear-cart-btn" style="color: var(--color-accent-red); font-size: 0.8rem; font-weight: 600;">Clear All</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${cart.items.map((item, idx) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'">
            <div class="cart-item-details">
              <div style="display: flex; align-items: center; gap: 4px;">
                <span class="diet-indicator ${item.isVeg ? 'veg' : 'non-veg'}" style="width: 12px; height: 12px;"></span>
                <span class="cart-item-name">${item.name}</span>
              </div>
              ${item.customizations && item.customizations.length > 0 ? `
                <div class="cart-item-customizations">${item.customizations.join(', ')}</div>
              ` : ''}
              <div class="cart-item-price">$${(item.unitPrice * item.quantity).toFixed(2)}</div>
            </div>

            <div class="quantity-control" style="transform: scale(0.9);">
              <button type="button" class="cart-qty-btn" data-action="minus" data-index="${idx}" aria-label="Decrease">&minus;</button>
              <span class="qty-value">${item.quantity}</span>
              <button type="button" class="cart-qty-btn" data-action="plus" data-index="${idx}" aria-label="Increase">&plus;</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Hook quantity actions
    itemsContainer.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = btn.getAttribute('data-action');
        const index = Number(btn.getAttribute('data-index'));
        const currentItem = cart.items[index];
        if (!currentItem) return;

        if (action === 'plus') {
          store.updateCartQuantity(index, currentItem.quantity + 1);
        } else if (action === 'minus') {
          store.updateCartQuantity(index, currentItem.quantity - 1);
        }
      });
    });

    itemsContainer.querySelector('#drawer-clear-cart-btn')?.addEventListener('click', () => {
      store.clearCart();
      Toast.info('Cart Cleared', 'All items have been removed.');
    });

    // Min order requirement alert
    let minOrderAlertHtml = '';
    if (!summary.meetsMinOrder) {
      minOrderAlertHtml = `
        <div class="min-order-alert">
          <span>⚠️</span>
          <span>Add <strong>$${summary.amountNeededForMin.toFixed(2)}</strong> more to meet the $${summary.minOrder.toFixed(2)} restaurant minimum.</span>
        </div>
      `;
    }

    // Footer with Promo Code Box & Totals
    footerContainer.innerHTML = `
      ${minOrderAlertHtml}

      <!-- Promo Code Section -->
      <div style="margin-bottom: 0.5rem;">
        ${cart.promoCode ? `
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background-color: var(--color-primary-light);
            border: 1px solid var(--color-primary-border);
            border-radius: var(--radius-lg);
            font-size: 0.85rem;
          ">
            <div>
              <span style="font-weight: 700; color: #92400E;">🎉 Code ${cart.promoCode} Applied</span>
              <div style="font-size: 0.75rem; color: #B45309;">-$${summary.discount.toFixed(2)} off your order</div>
            </div>
            <button id="drawer-remove-promo-btn" style="color: #92400E; font-size: 0.8rem; font-weight: 700; text-decoration: underline;">Remove</button>
          </div>
        ` : `
          <div style="display: flex; gap: 8px;">
            <input type="text" id="drawer-promo-input" class="form-control" placeholder="Promo code (e.g. FOODIE20)" style="text-transform: uppercase;">
            <button type="button" class="btn btn-outline" id="drawer-apply-promo-btn" style="flex-shrink: 0;">Apply</button>
          </div>
        `}
      </div>

      <!-- Cost Summary -->
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div class="cost-breakdown-row">
          <span>Subtotal</span>
          <span>$${summary.subtotal.toFixed(2)}</span>
        </div>
        <div class="cost-breakdown-row">
          <span>Delivery Fee</span>
          <span>${summary.deliveryFee === 0 ? '<strong style="color: var(--color-accent-green);">FREE</strong>' : `$${summary.deliveryFee.toFixed(2)}`}</span>
        </div>
        <div class="cost-breakdown-row">
          <span>Est. Taxes (8%)</span>
          <span>$${summary.tax.toFixed(2)}</span>
        </div>
        ${summary.discount > 0 ? `
          <div class="cost-breakdown-row" style="color: var(--color-accent-green);">
            <span>Discount</span>
            <span>-$${summary.discount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="cost-breakdown-row total-row">
          <span>Total</span>
          <span style="color: var(--color-primary-hover);">$${summary.total.toFixed(2)}</span>
        </div>
      </div>

      <!-- Checkout Button -->
      <button class="btn btn-primary btn-full btn-lg" id="drawer-checkout-btn" ${!summary.meetsMinOrder ? 'disabled' : ''} style="margin-top: 0.5rem;">
        Proceed to Checkout &bull; $${summary.total.toFixed(2)} &rarr;
      </button>
    `;

    // Hook Promo Events
    footerContainer.querySelector('#drawer-apply-promo-btn')?.addEventListener('click', () => {
      const codeInput = footerContainer.querySelector('#drawer-promo-input');
      if (!codeInput || !codeInput.value.trim()) {
        Toast.warning('Enter Promo Code', 'Please type a valid promo code.');
        return;
      }
      const res = store.applyPromoCode(codeInput.value.trim());
      if (res.success) {
        Toast.success('Promo Applied!', res.message);
      } else {
        Toast.error('Promo Code Error', res.message);
      }
    });

    footerContainer.querySelector('#drawer-remove-promo-btn')?.addEventListener('click', () => {
      store.removePromoCode();
      Toast.info('Promo Removed', 'Discount removed from order.');
    });

    // Checkout Navigation
    footerContainer.querySelector('#drawer-checkout-btn')?.addEventListener('click', () => {
      this.close();
      window.location.hash = '#checkout';
    });
  }
}

export const CartDrawer = new CartDrawerManager();

