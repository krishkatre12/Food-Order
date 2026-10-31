/**
 * FoodOrder - Restaurant Dashboard & Admin Panel (Module H)
 * Role-protected portal for Restaurant Owners and Admins.
 * Real-time order metrics, interactive order status manager,
 * and full CRUD operations on menu dishes (Add, Edit, Delete, Stock Toggle).
 */

import { store } from '../state/store.js';
import { Modal } from '../components/Modal.js';
import { Toast } from '../components/Toast.js';

export const DashboardPage = {
  render() {
    const user = store.getCurrentUser();

    // Role Guard: Check if user has owner or admin privileges
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      return `
        <div class="dashboard-page container" style="padding: 4rem 1rem;">
          <div class="empty-state" style="max-width: 540px; margin: 0 auto;">
            <div class="empty-state-icon" style="background-color: #FEF3C7; color: #92400E;">🔒</div>
            <h2 class="empty-state-title">Owner & Admin Access Restricted</h2>
            <p class="empty-state-desc">
              The Restaurant Management Dashboard is restricted to Restaurant Owners and Administrators. Currently, you are viewing as <strong>${user ? user.role : 'Guest'}</strong>.
            </p>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; margin-top: 1rem;">
              <button type="button" class="btn btn-primary btn-full" id="switch-to-owner-btn">
                Switch to Chef Marco (Restaurant Owner Demo) &rarr;
              </button>
              <button type="button" class="btn btn-outline btn-full" id="switch-to-admin-btn">
                Switch to Alex Admin (System Admin Demo) &rarr;
              </button>
              <a href="#home" class="btn btn-ghost btn-full">Return to Storefront</a>
            </div>
          </div>
        </div>
      `;
    }

    const restId = user.role === 'owner' ? (user.restaurantId || 'rest-1') : null;
    const allOrders = store.getOrders();
    const orders = restId ? allOrders.filter(o => o.restaurantId === restId) : allOrders;
    const dishes = store.getFoodItems(restId);
    const categories = store.getCategories();

    // Metric Computations
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    return `
      <div class="dashboard-page container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Breadcrumbs">
          <a href="#home">Home</a>
          <span class="sep">/</span>
          <span class="current">${user.role === 'admin' ? 'System Admin Dashboard' : 'Restaurant Partner Dashboard'}</span>
        </nav>

        <!-- Header -->
        <div class="section-header">
          <div>
            <h1 class="section-title">
              <span>${user.role === 'admin' ? 'Master Admin Hub 🏢' : `${user.restaurantName || 'Restaurant'} Dashboard 👨‍🍳`}</span>
              <span class="badge badge-secondary" style="font-size: 0.8rem; text-transform: uppercase;">${user.role}</span>
            </h1>
            <p class="section-subtitle">
              Manage incoming live orders, update cooking status, and curate menu items in real time.
            </p>
          </div>

          <div style="display: flex; gap: 0.5rem;">
            <button type="button" class="btn btn-primary btn-sm" id="dashboard-add-dish-btn">
              + Add New Menu Item
            </button>
          </div>
        </div>

        <!-- Simulation Notice -->
        <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; color: #065F46; padding: 10px 16px; border-radius: var(--radius-lg); margin-bottom: 2rem; font-size: 0.85rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <span>
            💡 <strong>Local State Management Active:</strong> All dish edits, new additions, and order status changes made here immediately sync with the customer-facing views and persist in LocalStorage.
          </span>
          <span class="badge badge-success">Simulated Back-Office</span>
        </div>

        <!-- Metric Cards Grid -->
        <div class="dashboard-stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: var(--color-primary-light); color: #92400E;">📦</div>
            <div class="stat-info">
              <span class="stat-value">${totalOrders}</span>
              <span class="stat-label">Total Orders</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background-color: #FEF3C7; color: #B45309;">⏳</div>
            <div class="stat-info">
              <span class="stat-value">${pendingOrders}</span>
              <span class="stat-label">Active / In Kitchen</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background-color: #D1FAE5; color: #065F46;">✅</div>
            <div class="stat-info">
              <span class="stat-value">${completedOrders}</span>
              <span class="stat-label">Delivered Orders</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background-color: #DBEAFE; color: #1E40AF;">💵</div>
            <div class="stat-info">
              <span class="stat-value">$${totalRevenue.toFixed(2)}</span>
              <span class="stat-label">Total Revenue</span>
            </div>
          </div>
        </div>

        <!-- TAB NAVIGATION: Orders vs Menu Management -->
        <div class="tab-list" id="dashboard-main-tabs">
          <button class="tab-btn active" data-tab="orders">Incoming & Live Orders (${orders.length})</button>
          <button class="tab-btn" data-tab="menu">Menu Items Catalog (${dishes.length})</button>
        </div>

        <!-- TAB 1: ORDERS MANAGEMENT -->
        <div id="tab-orders-content">
          <div style="background-color: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-2xl); padding: 1.5rem; margin-bottom: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-text-main);">
                Live Orders Management
              </h3>
              <div class="input-with-icon" style="width: 260px;">
                <span class="input-icon">🔍</span>
                <input type="text" id="dashboard-order-search" class="form-control" placeholder="Search by Order ID or Name..." style="padding-top: 6px; padding-bottom: 6px;">
              </div>
            </div>

            <div class="data-table-wrapper">
              <table class="data-table" id="dashboard-orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items Summary</th>
                    <th>Total</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders.length === 0 ? `
                    <tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--color-text-muted);">No orders placed yet.</td></tr>
                  ` : orders.map(order => `
                    <tr data-order-id="${order.id}">
                      <td>
                        <strong>#${order.id}</strong>
                      </td>
                      <td>
                        <div style="font-weight: 600;">${order.deliveryAddress?.recipient || order.userName}</div>
                        <div style="font-size: 0.75rem; color: var(--color-text-muted);">${order.deliveryAddress?.phone || ''}</div>
                      </td>
                      <td>
                        <div style="max-width: 250px; font-size: 0.8rem; line-height: 1.4;">
                          ${order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                      </td>
                      <td>
                        <strong>$${order.total.toFixed(2)}</strong>
                      </td>
                      <td>
                        <span style="font-size: 0.8rem; color: var(--color-text-muted);">
                          ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td>
                        <select class="form-control order-status-select" data-order-id="${order.id}" style="padding: 4px 8px; font-size: 0.8rem; width: auto; font-weight: 600;">
                          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                          <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                          <option value="out_for_delivery" ${order.status === 'out_for_delivery' ? 'selected' : ''}>Out for Delivery</option>
                          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <a href="#tracking/${order.id}" class="btn btn-outline btn-sm" style="font-size: 11px; padding: 4px 8px;">
                          View Tracking
                        </a>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 2: MENU CRUD MANAGEMENT -->
        <div id="tab-menu-content" style="display: none;">
          <div style="background-color: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-2xl); padding: 1.5rem; margin-bottom: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-text-main);">
                Dish Catalog & Inventory
              </h3>
              <div class="input-with-icon" style="width: 260px;">
                <span class="input-icon">🔍</span>
                <input type="text" id="dashboard-dish-search" class="form-control" placeholder="Search dishes..." style="padding-top: 6px; padding-bottom: 6px;">
              </div>
            </div>

            <div class="data-table-wrapper">
              <table class="data-table" id="dashboard-dishes-table">
                <thead>
                  <tr>
                    <th>Dish</th>
                    <th>Category</th>
                    <th>Diet</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${dishes.map(dish => `
                    <tr data-dish-id="${dish.id}">
                      <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                          <img src="${dish.image}" alt="${dish.name}" style="width: 44px; height: 44px; border-radius: var(--radius-md); object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'">
                          <div>
                            <strong style="display: block; font-size: 0.9rem;">${dish.name}</strong>
                            <span style="font-size: 0.75rem; color: var(--color-text-muted);">${dish.cookingTime || '15 min'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="badge badge-neutral">${dish.category}</span>
                      </td>
                      <td>
                        <span class="diet-indicator ${dish.isVeg ? 'veg' : 'non-veg'}" title="${dish.isVeg ? 'Veg' : 'Non-Veg'}"></span>
                      </td>
                      <td>
                        <strong>$${Number(dish.price).toFixed(2)}</strong>
                      </td>
                      <td>
                        <button type="button" class="btn btn-sm toggle-stock-btn ${dish.available !== false ? 'btn-outline' : 'btn-danger'}" data-dish-id="${dish.id}" style="font-size: 11px; padding: 3px 8px;">
                          ${dish.available !== false ? '✅ In Stock' : '❌ Out of Stock'}
                        </button>
                      </td>
                      <td>
                        <span style="color: var(--color-primary); font-weight: 700;">★ ${dish.rating}</span>
                      </td>
                      <td>
                        <div style="display: flex; gap: 6px;">
                          <button type="button" class="btn btn-outline btn-sm edit-dish-btn" data-dish-id="${dish.id}" title="Edit Dish">
                            ✏️ Edit
                          </button>
                          <button type="button" class="btn btn-danger btn-sm delete-dish-btn" data-dish-id="${dish.id}" title="Delete Dish">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    // Quick role switchers for unauthorized gate
    document.getElementById('switch-to-owner-btn')?.addEventListener('click', () => {
      store.switchDemoUser('owner');
      Toast.success('Welcome Chef Marco!', 'Logged into Bella Italia Dashboard.');
      if (typeof window.FoodOrderRefresh === 'function') {
        window.FoodOrderRefresh();
      } else {
        window.location.reload();
      }
    });

    document.getElementById('switch-to-admin-btn')?.addEventListener('click', () => {
      store.switchDemoUser('admin');
      Toast.success('Welcome Admin!', 'Logged into Master Admin Dashboard.');
      if (typeof window.FoodOrderRefresh === 'function') {
        window.FoodOrderRefresh();
      } else {
        window.location.reload();
      }
    });

    const user = store.getCurrentUser();
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) return;

    // Tab switcher between Orders & Menu
    const mainTabs = document.querySelectorAll('#dashboard-main-tabs .tab-btn');
    const tabOrders = document.getElementById('tab-orders-content');
    const tabMenu = document.getElementById('tab-menu-content');

    mainTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        mainTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const which = tab.getAttribute('data-tab');
        if (which === 'orders') {
          tabOrders.style.display = 'block';
          tabMenu.style.display = 'none';
        } else {
          tabOrders.style.display = 'none';
          tabMenu.style.display = 'block';
        }
      });
    });

    // Order status update dropdowns
    document.querySelectorAll('.order-status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const orderId = select.getAttribute('data-order-id');
        const newStatus = select.value;
        const res = store.updateOrderStatus(orderId, newStatus);
        if (res.success) {
          Toast.success('Order Updated', `Order #${orderId} marked as ${newStatus.replace(/_/g, ' ')}.`);
        } else {
          Toast.error('Update Failed', res.message);
        }
      });
    });

    // Orders search filter
    const orderSearch = document.getElementById('dashboard-order-search');
    orderSearch?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('#dashboard-orders-table tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });

    // Dishes search filter
    const dishSearch = document.getElementById('dashboard-dish-search');
    dishSearch?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('#dashboard-dishes-table tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });

    // Toggle stock availability
    document.querySelectorAll('.toggle-stock-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dishId = btn.getAttribute('data-dish-id');
        const res = store.toggleFoodAvailability(dishId);
        if (res.success) {
          Toast.info('Inventory Updated', res.available ? 'Dish marked In Stock.' : 'Dish marked Out of Stock.');
          if (typeof window.FoodOrderRefresh === 'function') {
            window.FoodOrderRefresh();
          } else {
            window.location.reload();
          }
        }
      });
    });

    // Delete dish button with confirmation
    document.querySelectorAll('.delete-dish-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dishId = btn.getAttribute('data-dish-id');
        const dish = store.getFoodItemById(dishId);

        Modal.confirm({
          title: `Delete Dish: ${dish ? dish.name : ''}?`,
          message: 'Are you sure you want to delete this menu item? It will be removed from customer-facing menus.',
          confirmText: 'Yes, Delete',
          cancelText: 'Cancel',
          confirmClass: 'btn-danger',
          onConfirm: () => {
            store.deleteFoodItem(dishId);
            Toast.info('Dish Deleted', 'Menu item removed.');
            if (typeof window.FoodOrderRefresh === 'function') {
              window.FoodOrderRefresh();
            } else {
              window.location.reload();
            }
          }
        });
      });
    });

    // Edit dish button
    document.querySelectorAll('.edit-dish-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dishId = btn.getAttribute('data-dish-id');
        const dish = store.getFoodItemById(dishId);
        if (dish) this.openDishModal(dish);
      });
    });

    // Add new dish button
    document.getElementById('dashboard-add-dish-btn')?.addEventListener('click', () => {
      this.openDishModal(null);
    });
  },

  openDishModal(existingDish = null) {
    const isEdit = !!existingDish;
    const categories = store.getCategories();
    const user = store.getCurrentUser();
    const restId = user.role === 'owner' ? (user.restaurantId || 'rest-1') : 'rest-1';
    const rest = store.getRestaurantById(restId) || { name: 'Bella Italia Trattoria' };

    const modalBody = `
      <form id="dish-crud-form">
        <div class="form-group">
          <label class="form-label" for="crud-name">Dish Name <span class="required">*</span></label>
          <input type="text" id="crud-name" class="form-control" value="${isEdit ? existingDish.name : ''}" required placeholder="e.g. Truffle Mushroom Risotto">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="crud-category">Category <span class="required">*</span></label>
            <select id="crud-category" class="form-control" required>
              ${categories.map(c => `
                <option value="${c.name}" ${isEdit && existingDish.category === c.name ? 'selected' : ''}>${c.icon} ${c.name}</option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="crud-price">Price ($ USD) <span class="required">*</span></label>
            <input type="number" id="crud-price" class="form-control" step="0.01" min="0.5" value="${isEdit ? existingDish.price : '12.99'}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="crud-desc">Description <span class="required">*</span></label>
          <textarea id="crud-desc" class="form-control" rows="2" required placeholder="Describe ingredients, sauce, and culinary presentation...">${isEdit ? existingDish.description : ''}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label" for="crud-image">Image URL</label>
          <input type="url" id="crud-image" class="form-control" value="${isEdit ? existingDish.image : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}" placeholder="https://images.unsplash.com/...">
          <span class="form-helper">Paste an image link or leave default sample food image.</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
            <input type="checkbox" id="crud-is-veg" ${isEdit ? (existingDish.isVeg ? 'checked' : '') : 'checked'} style="accent-color: var(--color-primary);">
            <span>🌱 Vegetarian Dish</span>
          </label>

          <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
            <input type="checkbox" id="crud-is-special" ${isEdit && existingDish.isChefSpecial ? 'checked' : ''} style="accent-color: var(--color-primary);">
            <span>⭐ Chef Special Pick</span>
          </label>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem;">
          <button type="button" class="btn btn-ghost" onclick="Modal.close();">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Create Dish'}</button>
        </div>
      </form>
    `;

    const modalEl = Modal.open({
      title: isEdit ? `Edit: ${existingDish.name}` : 'Add New Menu Item',
      bodyContent: modalBody,
      size: 'md'
    });

    const form = modalEl.querySelector('#dish-crud-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = modalEl.querySelector('#crud-name').value.trim();
      const category = modalEl.querySelector('#crud-category').value;
      const price = parseFloat(modalEl.querySelector('#crud-price').value);
      const description = modalEl.querySelector('#crud-desc').value.trim();
      const image = modalEl.querySelector('#crud-image').value.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
      const isVeg = modalEl.querySelector('#crud-is-veg').checked;
      const isChefSpecial = modalEl.querySelector('#crud-is-special').checked;

      if (!name || isNaN(price) || !description) {
        Toast.error('Validation Error', 'Please complete all required fields.');
        return;
      }

      if (isEdit) {
        store.updateFoodItem(existingDish.id, {
          name,
          category,
          price,
          description,
          image,
          isVeg,
          isChefSpecial
        });
        Toast.success('Dish Updated! 🍲', `${name} updated.`);
      } else {
        store.addFoodItem({
          restaurantId: restId,
          restaurantName: rest.name,
          name,
          category,
          price,
          description,
          image,
          isVeg,
          isChefSpecial,
          cookingTime: '15-20 min',
          customizations: []
        });
        Toast.success('Dish Added! 🎉', `${name} added to menu.`);
      }

      Modal.close();
      if (typeof window.FoodOrderRefresh === 'function') {
        window.FoodOrderRefresh();
      } else {
        window.location.reload();
      }
    });
  }
};
