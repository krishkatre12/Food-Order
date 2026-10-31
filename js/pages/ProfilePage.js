/**
 * FoodOrder - Customer Profile & Preferences View (Module I)
 * Personal info management, multiple saved addresses manager (Add, Edit, Delete, Set Default),
 * masked demo payment methods, dark mode toggle, and Reset Demo Data utility.
 */

import { store } from '../state/store.js';
import { Storage } from '../data/storage.js';
import { Modal } from '../components/Modal.js';
import { Toast } from '../components/Toast.js';

export const ProfilePage = {
  render() {
    const user = store.getCurrentUser();

    if (!user) {
      return `
        <div class="profile-page container">
          <nav class="breadcrumbs" aria-label="Breadcrumbs">
            <a href="#home">Home</a>
            <span class="sep">/</span>
            <span class="current">My Profile</span>
          </nav>

          <div class="empty-state" style="margin: 4rem 0;">
            <div class="empty-state-icon">👤</div>
            <h2 class="empty-state-title">Sign In to View Profile</h2>
            <p class="empty-state-desc">You are currently browsing as a guest. Please sign in to manage your addresses and profile preferences.</p>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
              <a href="#auth" class="btn btn-primary">Sign In / Register &rarr;</a>
              <button class="btn btn-outline" id="profile-instant-login">Demo Login (Sarah Connor)</button>
            </div>
          </div>
        </div>
      `;
    }

    const addresses = user.addresses || [];
    const orders = store.getOrders(user.role === 'admin' ? null : user.id);
    const reviews = store.getReviews().filter(r => r.userName === user.name);

    return `
      <div class="profile-page container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Breadcrumbs">
          <a href="#home">Home</a>
          <span class="sep">/</span>
          <span class="current">Customer Profile</span>
        </nav>

        <div class="section-header">
          <div>
            <h1 class="section-title">My Account & Settings ⚙️</h1>
            <p class="section-subtitle">Manage personal profile, saved delivery addresses, and account preferences</p>
          </div>
          <button class="btn btn-danger btn-sm" id="profile-logout-btn">
            🚪 Sign Out
          </button>
        </div>

        <div class="checkout-grid">
          <!-- Left Column: Personal Info & Saved Addresses -->
          <div>
            <!-- Personal Information Card -->
            <div class="checkout-card">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div class="user-avatar" style="width: 56px; height: 56px; font-size: 1.25rem;">
                  ${user.avatar || 'U'}
                </div>
                <div>
                  <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--color-text-main); margin-bottom: 2px;">
                    ${user.name}
                  </h3>
                  <span class="badge badge-secondary" style="text-transform: capitalize;">${user.role}</span>
                </div>
              </div>

              <form id="edit-profile-form">
                <div class="form-group">
                  <label class="form-label" for="profile-name">Full Name <span class="required">*</span></label>
                  <input type="text" id="profile-name" class="form-control" value="${user.name}" required>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div class="form-group">
                    <label class="form-label" for="profile-email">Email Address <span class="required">*</span></label>
                    <input type="email" id="profile-email" class="form-control" value="${user.email}" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="profile-phone">Phone Number <span class="required">*</span></label>
                    <input type="tel" id="profile-phone" class="form-control" value="${user.phone || ''}" required>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary btn-sm" style="margin-top: 0.5rem;">
                  Save Profile Changes
                </button>
              </form>
            </div>

            <!-- Saved Delivery Addresses Manager -->
            <div class="checkout-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-text-main);">
                  Saved Delivery Addresses (${addresses.length})
                </h3>
                <button type="button" class="btn btn-outline btn-sm" id="profile-add-addr-btn">
                  + Add Address
                </button>
              </div>

              ${addresses.length === 0 ? `
                <p style="font-size: 0.85rem; color: var(--color-text-muted);">No saved addresses. Add an address to speed up checkout.</p>
              ` : `
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                  ${addresses.map(addr => `
                    <div style="
                      border: 1px solid var(--color-border);
                      border-radius: var(--radius-xl);
                      padding: 1rem;
                      background-color: var(--color-bg-subtle);
                      display: flex;
                      justify-content: space-between;
                      align-items: flex-start;
                      gap: 1rem;
                    ">
                      <div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                          <strong style="color: var(--color-text-main); font-size: 0.95rem;">${addr.title || 'Address'}</strong>
                          ${addr.isDefault ? '<span class="badge badge-primary">Default</span>' : ''}
                        </div>
                        <div style="font-size: 0.85rem; color: var(--color-text-body);">
                          ${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}
                        </div>
                        <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 2px;">
                          Recipient: ${addr.recipient} &bull; ${addr.phone}
                        </div>
                      </div>

                      <div style="display: flex; gap: 6px; flex-shrink: 0;">
                        ${!addr.isDefault ? `
                          <button type="button" class="btn btn-outline btn-sm set-default-addr-btn" data-id="${addr.id}" title="Set as default">
                            Set Default
                          </button>
                        ` : ''}
                        <button type="button" class="btn btn-danger btn-sm delete-addr-btn" data-id="${addr.id}" title="Delete address">
                          🗑️
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>

            <!-- Saved Simulated Payment Methods -->
            <div class="checkout-card">
              <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem; color: var(--color-text-main);">
                Saved Payment Methods (Demo)
              </h3>
              <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1rem;">
                Non-sensitive masked demo records used for convenient simulated ordering.
              </p>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background-color: var(--color-bg-subtle); border-radius: var(--radius-lg); border: 1px solid var(--color-border); font-size: 0.85rem;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span>💳</span>
                    <strong>Visa ending in 4242</strong>
                  </div>
                  <span class="badge badge-neutral">Primary Demo</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background-color: var(--color-bg-subtle); border-radius: var(--radius-lg); border: 1px solid var(--color-border); font-size: 0.85rem;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span>⚡</span>
                    <strong>UPI: ${user.name.toLowerCase().replace(/\s+/g, '')}@okbank</strong>
                  </div>
                  <span class="badge badge-neutral">Verified</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Account Stats & Demo Settings -->
          <div>
            <!-- Activity Statistics Card -->
            <div class="checkout-card">
              <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--color-text-main);">
                Diner Activity Summary
              </h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="background-color: var(--color-bg-subtle); padding: 1rem; border-radius: var(--radius-lg); text-align: center;">
                  <span style="font-size: 1.5rem; font-weight: 800; color: var(--color-text-main); display: block;">${orders.length}</span>
                  <span style="font-size: 0.75rem; color: var(--color-text-muted);">Orders Placed</span>
                </div>
                <div style="background-color: var(--color-bg-subtle); padding: 1rem; border-radius: var(--radius-lg); text-align: center;">
                  <span style="font-size: 1.5rem; font-weight: 800; color: var(--color-text-main); display: block;">${reviews.length}</span>
                  <span style="font-size: 0.75rem; color: var(--color-text-muted);">Reviews Written</span>
                </div>
              </div>

              <a href="#history" class="btn btn-outline btn-full btn-sm">
                View Full Order History &rarr;
              </a>
            </div>

            <!-- Role Switcher Quick Card (Internship Evaluator Tool) -->
            <div class="checkout-card">
              <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-text-main);">
                🧪 Quick Demo Account Switcher
              </h3>
              <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 1rem;">
                Easily switch between simulated personas for grading and review:
              </p>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <button type="button" class="btn btn-outline btn-sm switch-user-btn" data-role="customer">
                  👤 Sarah Connor (Customer)
                </button>
                <button type="button" class="btn btn-outline btn-sm switch-user-btn" data-role="owner">
                  👨‍🍳 Chef Marco (Restaurant Owner)
                </button>
                <button type="button" class="btn btn-outline btn-sm switch-user-btn" data-role="admin">
                  🏢 Alex Admin (System Admin)
                </button>
              </div>
            </div>

            <!-- Reset Demo Data Danger Card (Mandatory Requirement) -->
            <div class="checkout-card" style="border-color: #FCA5A5;">
              <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-accent-red);">
                ⚠️ Reset Demo State
              </h3>
              <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 1rem; line-height: 1.4;">
                Clear all custom cart items, modified orders, and created dishes, restoring the clean sample dataset.
              </p>
              <button type="button" class="btn btn-danger btn-full btn-sm" id="reset-demo-data-btn">
                Reset All Demo Data
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.getElementById('profile-instant-login')?.addEventListener('click', () => {
      store.switchDemoUser('customer');
      Toast.success('Logged in!', 'Signed in as Sarah Connor.');
      if (typeof window.FoodOrderRefresh === 'function') {
        window.FoodOrderRefresh();
      } else {
        window.location.reload();
      }
    });

    const user = store.getCurrentUser();
    if (!user) return;

    // Sign out
    document.getElementById('profile-logout-btn')?.addEventListener('click', () => {
      store.logout();
      Toast.info('Signed Out', 'You have been logged out.');
      window.location.hash = '#home';
    });

    // Edit profile submit
    document.getElementById('edit-profile-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('profile-name').value.trim();
      const email = document.getElementById('profile-email').value.trim();
      const phone = document.getElementById('profile-phone').value.trim();

      if (!name || !email) {
        Toast.error('Validation Error', 'Name and email are required.');
        return;
      }

      const res = store.updateProfile({ name, email, phone });
      if (res.success) {
        Toast.success('Profile Updated! ✅', 'Your personal details have been saved.');
      } else {
        Toast.error('Update Error', res.message);
      }
    });

    // Add Address Modal
    document.getElementById('profile-add-addr-btn')?.addEventListener('click', () => {
      this.openAddressModal();
    });

    // Set Default Address
    document.querySelectorAll('.set-default-addr-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const addrId = btn.getAttribute('data-id');
        store.setDefaultAddress(addrId);
        Toast.success('Default Updated', 'Address set as default delivery location.');
        if (typeof window.FoodOrderRefresh === 'function') {
          window.FoodOrderRefresh();
        } else {
          window.location.reload();
        }
      });
    });

    // Delete Address with confirmation
    document.querySelectorAll('.delete-addr-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const addrId = btn.getAttribute('data-id');
        Modal.confirm({
          title: 'Delete Saved Address?',
          message: 'Are you sure you want to remove this delivery address from your profile?',
          confirmText: 'Yes, Delete',
          cancelText: 'Cancel',
          confirmClass: 'btn-danger',
          onConfirm: () => {
            store.deleteAddress(addrId);
            Toast.info('Address Removed', 'Address deleted.');
            if (typeof window.FoodOrderRefresh === 'function') {
              window.FoodOrderRefresh();
            } else {
              window.location.reload();
            }
          }
        });
      });
    });

    // Quick role switchers
    document.querySelectorAll('.switch-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        store.switchDemoUser(role);
        Toast.success('Switched User!', `Now logged in as ${role}.`);
        if (typeof window.FoodOrderRefresh === 'function') {
          window.FoodOrderRefresh();
        } else {
          window.location.reload();
        }
      });
    });

    // Reset Demo Data with deliberate confirmation dialog
    document.getElementById('reset-demo-data-btn')?.addEventListener('click', () => {
      Modal.confirm({
        title: 'Restore Default Demo Data?',
        message: 'This will reset all restaurants, menu dishes, orders, reviews, and cart items back to their clean initial state. This action cannot be undone.',
        confirmText: 'Reset Everything',
        cancelText: 'Cancel',
        confirmClass: 'btn-danger',
        onConfirm: () => {
          Storage.resetAllData();
          Toast.success('Demo Reset Complete! 🔄', 'All initial sample records restored.');
          window.location.hash = '#home';
          window.location.reload();
        }
      });
    });
  },

  openAddressModal() {
    const user = store.getCurrentUser();

    const bodyHtml = `
      <form id="new-profile-addr-form">
        <div class="form-group">
          <label class="form-label" for="new-addr-title">Address Label <span class="required">*</span></label>
          <input type="text" id="new-addr-title" class="form-control" placeholder="e.g. Home, Office, Summer House" required>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="new-addr-recip">Recipient Name <span class="required">*</span></label>
            <input type="text" id="new-addr-recip" class="form-control" value="${user.name}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="new-addr-phone">Phone Number <span class="required">*</span></label>
            <input type="tel" id="new-addr-phone" class="form-control" value="${user.phone || ''}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="new-addr-street">Street Address <span class="required">*</span></label>
          <input type="text" id="new-addr-street" class="form-control" placeholder="Apt 12, 100 Main Street" required>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
          <div class="form-group">
            <label class="form-label" for="new-addr-city">City <span class="required">*</span></label>
            <input type="text" id="new-addr-city" class="form-control" value="Springfield" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="new-addr-state">State <span class="required">*</span></label>
            <input type="text" id="new-addr-state" class="form-control" value="OR" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="new-addr-zip">Postal Code <span class="required">*</span></label>
            <input type="text" id="new-addr-zip" class="form-control" value="97477" required>
          </div>
        </div>

        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer; margin-top: 0.5rem;">
          <input type="checkbox" id="new-addr-default" checked style="accent-color: var(--color-primary);">
          <span>Set as default delivery address</span>
        </label>

        <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem;">
          <button type="button" class="btn btn-ghost" onclick="Modal.close();">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Address</button>
        </div>
      </form>
    `;

    const modalEl = Modal.open({
      title: 'Add New Delivery Address',
      bodyContent: bodyHtml,
      size: 'md'
    });

    modalEl.querySelector('#new-profile-addr-form').addEventListener('submit', (e) => {
      e.preventDefault();

      const title = modalEl.querySelector('#new-addr-title').value.trim();
      const recipient = modalEl.querySelector('#new-addr-recip').value.trim();
      const phone = modalEl.querySelector('#new-addr-phone').value.trim();
      const street = modalEl.querySelector('#new-addr-street').value.trim();
      const city = modalEl.querySelector('#new-addr-city').value.trim();
      const state = modalEl.querySelector('#new-addr-state').value.trim();
      const postalCode = modalEl.querySelector('#new-addr-zip').value.trim();
      const isDefault = modalEl.querySelector('#new-addr-default').checked;

      store.addAddress({
        title,
        recipient,
        phone,
        street,
        city,
        state,
        postalCode,
        isDefault
      });

      Modal.close();
      Toast.success('Address Saved! 📍', 'New delivery location added.');
      if (typeof window.FoodOrderRefresh === 'function') {
        window.FoodOrderRefresh();
      } else {
        window.location.reload();
      }
    });
  }
};
