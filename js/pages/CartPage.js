/**
 * FoodOrder - Dedicated Shopping Cart Page View (Module D)
 * Comprehensive cart management, live recalculation, item quantity +/- controls,
 * minimum order progress meter, promo code manager, and checkout trigger.
 */

import { store } from '../state/store.js';
import { Toast } from '../components/Toast.js';

export const CartPage = {
  render() {
    const cart = store.getCart();
    const summary = store.getCartSummary();

    if (!cart.items || cart.items.length === 0) {
      return `
        <div class="cart-page container">
          <nav class="breadcrumbs" aria-label="Breadcrumbs">
            <a href="#home">Home</a>
            <span class="sep">/</span>
            <span class="current">Shopping Cart</span>
          </nav>

          <div class="empty-state" style="margin: 4rem 0;">
            <div class="empty-state-icon">🛒</div>
            <h2 class="empty-state-title">Your Shopping Cart is Empty</h2>
            <p class="empty-state-desc">You haven't added any items to your cart yet. Explore our delicious menus and start ordering!</p>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
              <a href="#home" class="btn btn-outline">Explore Home</a>
              <a href="#menu" class="btn btn-primary">Browse Full Menu &rarr;</a>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="cart-page container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Breadcrumbs">
          <a href="#home">Home</a>
          <span class="sep">/</span>
          <a href="#restaurant/${cart.restaurantId}">${cart.restaurantName}</a>
          <span class="sep">/</span>
          <span class="current">Shopping Cart (${summary.itemCount} items)</span>
        </nav>

        <div class="section-header">
          <div>
            <h1 class="section-title">Your Order Cart 🛒</h1>
            <p class="section-subtitle">
              Ordering from: <strong style="color: var(--color-primary-hover);">${cart.restaurantName}</strong>
            </p>
          </div>
          <button class="btn btn-danger btn-sm" id="cart-page-clear-btn">
            Clear Entire Cart
          </button>
        </div>

        <!-- Min Order Progress Alert -->
        ${!summary.meetsMinOrder ? `
          <div class="min-order-alert" style="margin-bottom: 2rem; padding: 1rem; border-radius: var(--radius-xl); font-size: 0.95rem;">
            <span style="font-size: 1.25rem;">⚠️</span>
            <div>
              <strong>Restaurant Minimum Order: $${summary.minOrder.toFixed(2)}</strong>
              <div style="font-size: 0.85rem; margin-top: 2px;">
                You need <strong>$${summary.amountNeededForMin.toFixed(2)}</strong> more in delicious food to checkout from ${cart.restaurantName}.
              </div>
            </div>
          </div>
        ` : ''}

        <div class="checkout-grid">
          <!-- Items List Column -->
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="background-color: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-2xl); padding: 1.5rem;">
              <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--color-text-main);">
                Items in Cart (${summary.itemCount})
              </h3>

              <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                ${cart.items.map((item, index) => `
                  <div style="display: flex; gap: 1rem; align-items: center; padding-bottom: 1.25rem; border-bottom: 1px dashed var(--color-border);">
                    <img src="${item.image}" alt="${item.name}" style="width: 72px; height: 72px; border-radius: var(--radius-lg); object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'">

                    <div style="flex: 1;">
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <span class="diet-indicator ${item.isVeg ? 'veg' : 'non-veg'}" style="width: 14px; height: 14px;"></span>
                        <h4 style="font-size: 1rem; font-weight: 700; color: var(--color-text-main);">${item.name}</h4>
                      </div>
                      ${item.customizations && item.customizations.length > 0 ? `
                        <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 2px;">${item.customizations.join(' • ')}</div>
                      ` : ''}
                      <div style="font-size: 0.9rem; font-weight: 700; color: var(--color-primary-hover); margin-top: 4px;">
                        $${item.unitPrice.toFixed(2)} each &bull; <span style="color: var(--color-text-main);">$${item.subtotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div class="quantity-control">
                      <button type="button" class="page-cart-qty-btn" data-action="minus" data-index="${index}">&minus;</button>
                      <span class="qty-value">${item.quantity}</span>
                      <button type="button" class="page-cart-qty-btn" data-action="plus" data-index="${index}">&plus;</button>
                    </div>

                    <button type="button" class="btn btn-ghost btn-sm remove-item-btn" data-index="${index}" style="color: var(--color-accent-red); font-size: 1.1rem;" title="Remove item">
                      🗑️
                    </button>
                  </div>
                `).join('')}
              </div>

              <!-- Note to Kitchen / Delivery Instructions -->
              <div style="margin-top: 1.5rem;">
                <label style="font-size: 0.85rem; font-weight: 600; color: var(--color-text-main); display: block; margin-bottom: 6px;">
                  Special Instructions for the Kitchen (Optional)
                </label>
                <textarea id="cart-kitchen-instructions" class="form-control" rows="2" placeholder="e.g. Extra napkins, dressing on the side, ring bell twice...">${cart.deliveryInstructions || ''}</textarea>
              </div>
            </div>
          </div>

          <!-- Cost Breakdown & Checkout Sidebar -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Promo Code Card -->
            <div style="background-color: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-2xl); padding: 1.5rem;">
              <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-text-main);">
                Have a Promo Code?
              </h3>

              ${cart.promoCode ? `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background-color: var(--color-primary-light); border-radius: var(--radius-lg); border: 1px solid var(--color-primary-border);">
                  <div>
                    <strong style="color: #92400E; font-size: 0.95rem;">Code: ${cart.promoCode}</strong>
                    <div style="font-size: 0.8rem; color: #B45309;">-$${summary.discount.toFixed(2)} applied to total</div>
                  </div>
                  <button id="cart-page-remove-promo" style="color: #92400E; font-weight: 700; font-size: 0.85rem; text-decoration: underline;">Remove</button>
                </div>
              ` : `
                <div style="display: flex; gap: 8px;">
                  <input type="text" id="cart-page-promo-input" class="form-control" placeholder="Try FOODIE20 or FREEDEL" style="text-transform: uppercase;">
                  <button type="button" class="btn btn-outline" id="cart-page-apply-promo">Apply</button>
                </div>
              `}
            </div>

            <!-- Summary Breakdown Card -->
            <div style="background-color: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-2xl); padding: 1.5rem;">
              <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--color-text-main);">
                Order Summary
              </h3>

              <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.5rem;">
                <div class="cost-breakdown-row">
                  <span>Items Subtotal</span>
                  <span>$${summary.subtotal.toFixed(2)}</span>
                </div>
                <div class="cost-breakdown-row">
                  <span>Delivery Fee</span>
                  <span>${summary.deliveryFee === 0 ? '<strong style="color: var(--color-accent-green);">FREE</strong>' : `$${summary.deliveryFee.toFixed(2)}`}</span>
                </div>
                <div class="cost-breakdown-row">
                  <span>Estimated Tax (8%)</span>
                  <span>$${summary.tax.toFixed(2)}</span>
                </div>
                ${summary.discount > 0 ? `
                  <div class="cost-breakdown-row" style="color: var(--color-accent-green); font-weight: 600;">
                    <span>Promo Discount</span>
                    <span>-$${summary.discount.toFixed(2)}</span>
                  </div>
                ` : ''}
                <div class="cost-breakdown-row total-row">
                  <span>Estimated Total</span>
                  <span style="color: var(--color-primary-hover);">$${summary.total.toFixed(2)}</span>
                </div>
              </div>

              <button class="btn btn-primary btn-full btn-lg" id="cart-page-checkout-btn" ${!summary.meetsMinOrder ? 'disabled' : ''}>
                Proceed to Checkout &bull; $${summary.total.toFixed(2)} &rarr;
              </button>

              <div style="margin-top: 1rem; text-align: center;">
                <a href="#restaurant/${cart.restaurantId}" style="font-size: 0.85rem; color: var(--color-primary-hover); font-weight: 600;">
                  + Add more items from ${cart.restaurantName}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    const cart = store.getCart();

    // Quantity +/- controls
    document.querySelectorAll('.page-cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        const index = Number(btn.getAttribute('data-index'));
        const item = cart.items[index];
        if (!item) return;

        if (action === 'plus') {
          store.updateCartQuantity(index, item.quantity + 1);
        } else if (action === 'minus') {
          store.updateCartQuantity(index, item.quantity - 1);
        }
        if (typeof window.FoodOrderRefresh === 'function') {
          window.FoodOrderRefresh();
        } else {
          window.location.reload();
        }
      });
    });

    // Remove single item
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = Number(btn.getAttribute('data-index'));
        store.removeFromCart(index);
        Toast.info('Item Removed', 'Removed dish from cart.');
        if (typeof window.FoodOrderRefresh === 'function') {
          window.FoodOrderRefresh();
        } else {
          window.location.reload();
        }
      });
    });

    // Clear entire cart
    document.getElementById('cart-page-clear-btn')?.addEventListener('click', () => {
      store.clearCart();
      Toast.info('Cart Cleared', 'All items removed.');
      if (typeof window.FoodOrderRefresh === 'function') {
        window.FoodOrderRefresh();
      } else {
        window.location.reload();
      }
    });

    // Instructions
    const instructionsEl = document.getElementById('cart-kitchen-instructions');
    instructionsEl?.addEventListener('change', () => {
      const c = store.getCart();
      c.deliveryInstructions = instructionsEl.value;
      store.setCart(c);
    });

    // Promo code apply
    document.getElementById('cart-page-apply-promo')?.addEventListener('click', () => {
      const input = document.getElementById('cart-page-promo-input');
      if (!input || !input.value.trim()) return;

      const res = store.applyPromoCode(input.value.trim());
      if (res.success) {
        Toast.success('Promo Code Applied!', res.message);
        if (typeof window.FoodOrderRefresh === 'function') {
          window.FoodOrderRefresh();
        } else {
          window.location.reload();
        }
      } else {
        Toast.error('Promo Error', res.message);
      }
    });

    // Promo code remove
    document.getElementById('cart-page-remove-promo')?.addEventListener('click', () => {
      store.removePromoCode();
      Toast.info('Promo Removed', 'Discount cleared.');
      if (typeof window.FoodOrderRefresh === 'function') {
        window.FoodOrderRefresh();
      } else {
        window.location.reload();
      }
    });

    // Checkout navigation
    document.getElementById('cart-page-checkout-btn')?.addEventListener('click', () => {
      window.location.hash = '#checkout';
    });
  }
};
