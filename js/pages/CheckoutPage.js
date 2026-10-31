/**
 * FoodOrder - Checkout View (Module E)
 * Safe simulated checkout, saved delivery address selector, new address validation,
 * 5 simulated payment methods, promo codes, duplicate submission protection, and order creation.
 */

import { store } from '../state/store.js';
import { Toast } from '../components/Toast.js';

export const CheckoutPage = {
  render() {
    const user = store.getCurrentUser();
    const cart = store.getCart();
    const summary = store.getCartSummary();

    // 1. Guard: Check if Cart is Empty
    if (!cart.items || cart.items.length === 0) {
      return `
        <div class="checkout-page container">
          <nav class="breadcrumbs" aria-label="Breadcrumbs">
            <a href="#home">Home</a>
            <span class="sep">/</span>
            <span class="current">Checkout</span>
          </nav>

          <div class="empty-state" style="margin: 4rem 0;">
            <div class="empty-state-icon">🛒</div>
            <h2 class="empty-state-title">Your Cart is Empty</h2>
            <p class="empty-state-desc">You cannot checkout without any items in your cart. Choose your favorites first!</p>
            <a href="#menu" class="btn btn-primary" style="margin-top: 1rem;">Browse Menu &rarr;</a>
          </div>
        </div>
      `;
    }

    // 2. Guard: Check if User is Logged In
    if (!user) {
      return `
        <div class="checkout-page container">
          <nav class="breadcrumbs" aria-label="Breadcrumbs">
            <a href="#home">Home</a>
            <span class="sep">/</span>
            <span class="current">Checkout &bull; Authentication Required</span>
          </nav>

          <div class="empty-state" style="margin: 4rem 0; max-width: 500px; margin-left: auto; margin-right: auto;">
            <div class="empty-state-icon">🔐</div>
            <h2 class="empty-state-title">Sign In to Complete Order</h2>
            <p class="empty-state-desc">Please log in to your account or register to set your delivery address and track your order.</p>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; margin-top: 1rem;">
              <a href="#auth" class="btn btn-primary btn-full btn-lg">Sign In / Register &rarr;</a>
              <button type="button" class="btn btn-outline btn-full" id="checkout-instant-login-btn">
                ⚡ 1-Click Instant Demo Login (Sarah Connor)
              </button>
            </div>
          </div>
        </div>
      `;
    }

    const savedAddresses = user.addresses || [];
    const defaultAddress = savedAddresses.find(a => a.isDefault) || savedAddresses[0] || null;

    return `
      <div class="checkout-page container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Breadcrumbs">
          <a href="#home">Home</a>
          <span class="sep">/</span>
          <a href="#cart">Shopping Cart</a>
          <span class="sep">/</span>
          <span class="current">Checkout</span>
        </nav>

        <div class="section-header">
          <div>
            <h1 class="section-title">Finalize Your Order 🛍️</h1>
            <p class="section-subtitle">Delivering from: <strong>${cart.restaurantName}</strong></p>
          </div>
        </div>

        <form id="checkout-form" novalidate>
          <div class="checkout-grid">
            <!-- Left Column: Delivery Address & Payment Methods -->
            <div>
              <!-- STEP 1: Delivery Address -->
              <div class="checkout-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                  <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--color-text-main); display: flex; align-items: center; gap: 8px;">
                    <span style="background: var(--color-primary-light); color: #92400E; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">1</span>
                    Delivery Address
                  </h3>
                  <button type="button" class="btn btn-ghost btn-sm" id="toggle-new-address-btn" style="color: var(--color-primary-hover); font-weight: 600;">
                    + Add New Address
                  </button>
                </div>

                <!-- Saved Addresses Selector (if user has any) -->
                ${savedAddresses.length > 0 ? `
                  <div id="saved-addresses-list" style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem;">
                    ${savedAddresses.map((addr, idx) => `
                      <label style="
                        display: flex;
                        gap: 12px;
                        padding: 12px 14px;
                        border: 1.5px solid ${addr.isDefault || idx === 0 ? 'var(--color-primary)' : 'var(--color-border)'};
                        border-radius: var(--radius-xl);
                        background-color: ${addr.isDefault || idx === 0 ? 'var(--color-primary-subtle)' : 'var(--color-bg-surface)'};
                        cursor: pointer;
                        transition: all 0.15s ease;
                      " class="saved-addr-card">
                        <input type="radio" name="selectedSavedAddress" value="${addr.id}" ${addr.isDefault || idx === 0 ? 'checked' : ''} style="margin-top: 3px; accent-color: var(--color-primary);">
                        <div style="flex: 1;">
                          <div style="display: flex; align-items: center; gap: 8px;">
                            <strong style="color: var(--color-text-main); font-size: 0.95rem;">${addr.title || 'Address'}</strong>
                            ${addr.isDefault ? '<span class="badge badge-primary">Default</span>' : ''}
                          </div>
                          <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 2px;">
                            ${addr.street}, ${addr.area ? addr.area + ', ' : ''}${addr.city}, ${addr.state} ${addr.postalCode}
                          </div>
                          <div style="font-size: 0.8rem; color: var(--color-text-subtle); margin-top: 2px;">
                            Recipient: ${addr.recipient} &bull; ${addr.phone}
                          </div>
                        </div>
                      </label>
                    `).join('')}
                  </div>
                ` : ''}

                <!-- New Address Form (Shown if no saved address or user clicks "+ Add New") -->
                <div id="new-address-form-wrap" style="${savedAddresses.length > 0 ? 'display: none;' : 'display: block;'}">
                  <div style="font-size: 0.9rem; font-weight: 600; color: var(--color-text-main); margin-bottom: 1rem;">
                    ${savedAddresses.length > 0 ? 'Enter Custom / New Delivery Details:' : 'Enter Your Delivery Details:'}
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                      <label class="form-label" for="addr-recipient">Recipient Full Name <span class="required">*</span></label>
                      <input type="text" id="addr-recipient" class="form-control" value="${user.name || ''}" required placeholder="Sarah Connor">
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="addr-phone">Phone Number <span class="required">*</span></label>
                      <input type="tel" id="addr-phone" class="form-control" value="${user.phone || ''}" required placeholder="+1 (555) 000-0000">
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="addr-street">House / Flat / Street Address <span class="required">*</span></label>
                    <input type="text" id="addr-street" class="form-control" placeholder="Apt 4B, 742 Evergreen Terrace" required>
                  </div>

                  <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 0.75rem;">
                    <div class="form-group">
                      <label class="form-label" for="addr-city">City <span class="required">*</span></label>
                      <input type="text" id="addr-city" class="form-control" value="Springfield" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="addr-state">State <span class="required">*</span></label>
                      <input type="text" id="addr-state" class="form-control" value="OR" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="addr-zip">Postal Code <span class="required">*</span></label>
                      <input type="text" id="addr-zip" class="form-control" value="97477" required>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="addr-instructions">Delivery Instructions (Gate code, landmarks, etc.)</label>
                    <input type="text" id="addr-instructions" class="form-control" placeholder="Leave on doorstep, gate code is #4321">
                  </div>

                  <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--color-text-muted); cursor: pointer; margin-top: 0.5rem;">
                    <input type="checkbox" id="save-address-to-profile-check" checked style="accent-color: var(--color-primary);">
                    Save this address to my profile for future orders
                  </label>
                </div>
              </div>

              <!-- STEP 2: Simulated Payment Method -->
              <div class="checkout-card">
                <div style="margin-bottom: 1.25rem;">
                  <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--color-text-main); display: flex; align-items: center; gap: 8px;">
                    <span style="background: var(--color-primary-light); color: #92400E; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">2</span>
                    Payment Method
                  </h3>
                  <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #047857; background-color: #ECFDF5; padding: 6px 10px; border-radius: var(--radius-md); margin-top: 8px;">
                    <span>🛡️</span>
                    <span><strong>Safe Demo Mode:</strong> Payments are simulated. Never enter real card or banking credentials.</span>
                  </div>
                </div>

                <!-- 5 Required Payment Options -->
                <div class="payment-method-options" id="payment-options-container">
                  <!-- 1. Credit Card -->
                  <label class="payment-method-card active" data-method="credit_card">
                    <input type="radio" name="paymentMethod" value="Credit Card" checked>
                    <div style="flex: 1;">
                      <div style="font-weight: 700; color: var(--color-text-main); font-size: 0.95rem;">💳 Credit Card</div>
                      <div style="font-size: 0.8rem; color: var(--color-text-muted);">Visa, Mastercard, American Express (Simulated)</div>
                    </div>
                  </label>

                  <!-- 2. Debit Card -->
                  <label class="payment-method-card" data-method="debit_card">
                    <input type="radio" name="paymentMethod" value="Debit Card">
                    <div style="flex: 1;">
                      <div style="font-weight: 700; color: var(--color-text-main); font-size: 0.95rem;">🏧 Debit Card</div>
                      <div style="font-size: 0.8rem; color: var(--color-text-muted);">Instant bank debit card checkout</div>
                    </div>
                  </label>

                  <!-- 3. UPI -->
                  <label class="payment-method-card" data-method="upi">
                    <input type="radio" name="paymentMethod" value="UPI">
                    <div style="flex: 1;">
                      <div style="font-weight: 700; color: var(--color-text-main); font-size: 0.95rem;">⚡ UPI (Unified Payments Interface)</div>
                      <div style="font-size: 0.8rem; color: var(--color-text-muted);">Instant transfer via Google Pay, PhonePe, Paytm (Simulated)</div>
                    </div>
                  </label>

                  <!-- 4. Cash on Delivery -->
                  <label class="payment-method-card" data-method="cod">
                    <input type="radio" name="paymentMethod" value="Cash on Delivery">
                    <div style="flex: 1;">
                      <div style="font-weight: 700; color: var(--color-text-main); font-size: 0.95rem;">💵 Cash on Delivery (COD)</div>
                      <div style="font-size: 0.8rem; color: var(--color-text-muted);">Pay in cash when delivery rider arrives at your doorstep</div>
                    </div>
                  </label>

                  <!-- 5. Mobile Wallet -->
                  <label class="payment-method-card" data-method="wallet">
                    <input type="radio" name="paymentMethod" value="Mobile Wallet">
                    <div style="flex: 1;">
                      <div style="font-weight: 700; color: var(--color-text-main); font-size: 0.95rem;">📱 Mobile Wallet</div>
                      <div style="font-size: 0.8rem; color: var(--color-text-muted);">Apple Pay / Google Wallet simulated balance</div>
                    </div>
                  </label>
                </div>

                <!-- Simulated Payment Interactive Input Box -->
                <div class="payment-simulated-fields" id="payment-fields-area">
                  <div id="fields-card">
                    <div class="form-group">
                      <label class="form-label">Cardholder Name (Demo)</label>
                      <input type="text" class="form-control" value="${user.name || 'Sarah Connor'}" placeholder="Name on card">
                    </div>
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 0.75rem;">
                      <div class="form-group">
                        <label class="form-label">Demo Card Number</label>
                        <input type="text" class="form-control" value="•••• •••• •••• 4242" placeholder="4242 4242 4242 4242">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Expiry</label>
                        <input type="text" class="form-control" value="12/28" placeholder="MM/YY">
                      </div>
                      <div class="form-group">
                        <label class="form-label">CVV</label>
                        <input type="password" class="form-control" value="789" maxlength="4" placeholder="•••">
                      </div>
                    </div>
                  </div>

                  <div id="fields-upi" style="display: none;">
                    <div class="form-group">
                      <label class="form-label">Simulated UPI ID / VPA</label>
                      <input type="text" class="form-control" value="sarah@okaxis" placeholder="username@bank">
                      <span class="form-helper">In this demo, UPI verification succeeds automatically.</span>
                    </div>
                  </div>

                  <div id="fields-cod" style="display: none;">
                    <div style="font-size: 0.85rem; color: var(--color-text-body); line-height: 1.5;">
                      ✅ <strong>No online transaction required.</strong> Please have exact cash ready ($${summary.total.toFixed(2)}) for the delivery partner upon arrival.
                    </div>
                  </div>

                  <div id="fields-wallet" style="display: none;">
                    <div style="font-size: 0.85rem; color: var(--color-text-body); line-height: 1.5;">
                      ✅ <strong>Mobile Wallet Linked:</strong> Simulated balance will be deducted ($${summary.total.toFixed(2)}).
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Order Summary & Placement -->
            <div>
              <div class="checkout-card" style="position: sticky; top: calc(var(--navbar-height) + 1rem);">
                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--color-text-main);">
                  Order Summary
                </h3>

                <!-- Items Preview -->
                <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem; max-height: 240px; overflow-y: auto;">
                  ${cart.items.map(item => `
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="badge badge-neutral" style="font-weight: 700;">${item.quantity}x</span>
                        <span style="color: var(--color-text-main); font-weight: 600;">${item.name}</span>
                      </div>
                      <span style="font-weight: 700; color: var(--color-text-main);">$${item.subtotal.toFixed(2)}</span>
                    </div>
                  `).join('')}
                </div>

                <!-- Promo Code Box -->
                <div style="border-top: 1px dashed var(--color-border); padding-top: 1rem; margin-bottom: 1rem;">
                  ${cart.promoCode ? `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background-color: var(--color-primary-light); border-radius: var(--radius-md);">
                      <span style="font-size: 0.85rem; font-weight: 700; color: #92400E;">🎉 Code ${cart.promoCode} (-$${summary.discount.toFixed(2)})</span>
                      <button type="button" id="checkout-remove-promo-btn" style="color: #92400E; font-size: 0.75rem; font-weight: 700;">Remove</button>
                    </div>
                  ` : `
                    <div style="display: flex; gap: 6px;">
                      <input type="text" id="checkout-promo-input" class="form-control" placeholder="Promo code (FOODIE20)" style="text-transform: uppercase; font-size: 0.85rem; padding: 6px 10px;">
                      <button type="button" class="btn btn-outline btn-sm" id="checkout-apply-promo-btn">Apply</button>
                    </div>
                  `}
                </div>

                <!-- Itemized Breakdown -->
                <div style="display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--color-border); padding-top: 1rem; margin-bottom: 1.5rem;">
                  <div class="cost-breakdown-row">
                    <span>Subtotal</span>
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
                      <span>Discount</span>
                      <span>-$${summary.discount.toFixed(2)}</span>
                    </div>
                  ` : ''}
                  <div class="cost-breakdown-row total-row">
                    <span>Grand Total</span>
                    <span style="color: var(--color-primary-hover);">$${summary.total.toFixed(2)}</span>
                  </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="btn btn-primary btn-full btn-lg" id="place-order-btn">
                  Place Order &bull; $${summary.total.toFixed(2)} &rarr;
                </button>

                <div style="font-size: 0.75rem; color: var(--color-text-muted); text-align: center; margin-top: 1rem; line-height: 1.4;">
                  By placing this order you simulate accepting FoodOrder's Terms of Delivery.
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  },

  attachEvents() {
    // 1-click instant login button for guests
    document.getElementById('checkout-instant-login-btn')?.addEventListener('click', () => {
      store.switchDemoUser('customer');
      Toast.success('Logged in!', 'Signed in as Sarah Connor (Customer).');
      if (typeof window.FoodOrderRefresh === 'function') {
        window.FoodOrderRefresh();
      } else {
        window.location.reload();
      }
    });

    const user = store.getCurrentUser();
    if (!user) return;

    // Toggle custom address form
    const toggleNewAddrBtn = document.getElementById('toggle-new-address-btn');
    const newAddrWrap = document.getElementById('new-address-form-wrap');
    const savedAddrList = document.getElementById('saved-addresses-list');

    toggleNewAddrBtn?.addEventListener('click', () => {
      if (newAddrWrap.style.display === 'none') {
        newAddrWrap.style.display = 'block';
        toggleNewAddrBtn.textContent = 'Use Saved Address';
        // Uncheck radio
        document.querySelectorAll('input[name="selectedSavedAddress"]').forEach(r => r.checked = false);
      } else {
        newAddrWrap.style.display = 'none';
        toggleNewAddrBtn.textContent = '+ Add New Address';
        const firstRadio = document.querySelector('input[name="selectedSavedAddress"]');
        if (firstRadio) firstRadio.checked = true;
      }
    });

    // Saved address cards radio highlight
    document.querySelectorAll('.saved-addr-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.saved-addr-card').forEach(c => {
          c.style.borderColor = 'var(--color-border)';
          c.style.backgroundColor = 'var(--color-bg-surface)';
        });
        card.style.borderColor = 'var(--color-primary)';
        card.style.backgroundColor = 'var(--color-primary-subtle)';
        if (newAddrWrap) newAddrWrap.style.display = 'none';
        if (toggleNewAddrBtn) toggleNewAddrBtn.textContent = '+ Add New Address';
      });
    });

    // Payment method selector switcher
    const methodCards = document.querySelectorAll('.payment-method-card');
    const fieldsCard = document.getElementById('fields-card');
    const fieldsUpi = document.getElementById('fields-upi');
    const fieldsCod = document.getElementById('fields-cod');
    const fieldsWallet = document.getElementById('fields-wallet');

    methodCards.forEach(card => {
      card.addEventListener('click', () => {
        methodCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        const method = card.getAttribute('data-method');
        if (fieldsCard) fieldsCard.style.display = (method === 'credit_card' || method === 'debit_card') ? 'block' : 'none';
        if (fieldsUpi) fieldsUpi.style.display = method === 'upi' ? 'block' : 'none';
        if (fieldsCod) fieldsCod.style.display = method === 'cod' ? 'block' : 'none';
        if (fieldsWallet) fieldsWallet.style.display = method === 'wallet' ? 'block' : 'none';
      });
    });

    // Promo code apply
    document.getElementById('checkout-apply-promo-btn')?.addEventListener('click', () => {
      const input = document.getElementById('checkout-promo-input');
      if (!input || !input.value.trim()) return;

      const res = store.applyPromoCode(input.value.trim());
      if (res.success) {
        Toast.success('Promo Applied!', res.message);
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
    document.getElementById('checkout-remove-promo-btn')?.addEventListener('click', () => {
      store.removePromoCode();
      Toast.info('Promo Removed', 'Discount cleared.');
      if (typeof window.FoodOrderRefresh === 'function') {
        window.FoodOrderRefresh();
      } else {
        window.location.reload();
      }
    });

    // Checkout Form Submission
    const checkoutForm = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn');

    checkoutForm?.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check if duplicate submission
      if (placeOrderBtn.disabled) return;

      let addressData = null;
      const selectedRadio = document.querySelector('input[name="selectedSavedAddress"]:checked');

      if (selectedRadio && newAddrWrap.style.display === 'none') {
        // Use selected saved address
        const addrId = selectedRadio.value;
        const found = user.addresses ? user.addresses.find(a => a.id === addrId) : null;
        if (found) {
          addressData = { ...found };
        }
      }

      // If new address entered or no saved addresses
      if (!addressData) {
        const recipient = document.getElementById('addr-recipient')?.value.trim();
        const phone = document.getElementById('addr-phone')?.value.trim();
        const street = document.getElementById('addr-street')?.value.trim();
        const city = document.getElementById('addr-city')?.value.trim();
        const state = document.getElementById('addr-state')?.value.trim();
        const zip = document.getElementById('addr-zip')?.value.trim();
        const instructions = document.getElementById('addr-instructions')?.value.trim();

        if (!recipient || !phone || !street || !city || !state || !zip) {
          Toast.error('Validation Error', 'Please fill in all required address fields.');
          return;
        }

        addressData = {
          recipient,
          phone,
          street,
          city,
          state,
          postalCode: zip,
          instructions
        };

        // If user opted to save address to profile
        const saveCheck = document.getElementById('save-address-to-profile-check');
        if (saveCheck && saveCheck.checked) {
          store.addAddress({
            title: 'New Address',
            ...addressData
          });
        }
      }

      // Payment method
      const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
      const paymentMethod = paymentRadio ? paymentRadio.value : 'Credit Card (Simulated)';

      // Disable button to prevent duplicate submissions
      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = `
        <span class="spinner" style="display: inline-block; width: 16px; height: 16px; border: 2px solid #FFF; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></span>
        Processing Order...
      `;

      // Simulate network processing delay for high realism
      setTimeout(() => {
        const res = store.placeOrder({
          address: addressData,
          paymentMethod: paymentMethod,
          instructions: addressData.instructions || ''
        });

        if (res.success) {
          Toast.success('Order Placed Successfully! 🎉', `Order #${res.order.id} has been sent to the kitchen.`);
          window.location.hash = `#tracking/${res.order.id}`;
        } else {
          Toast.error('Checkout Failed', res.message);
          placeOrderBtn.disabled = false;
          placeOrderBtn.textContent = 'Place Order &rarr;';
        }
      }, 900);
    });
  }
};
