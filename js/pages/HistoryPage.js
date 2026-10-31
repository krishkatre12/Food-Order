/**
 * FoodOrder - Order History View (Module G)
 * Lists all previous and active customer orders, filter tabs by status,
 * receipt details modal, and 1-click safe reorder engine.
 */

import { store } from '../state/store.js';
import { Toast } from '../components/Toast.js';
import { Modal } from '../components/Modal.js';

export const HistoryPage = {
  render() {
    const user = store.getCurrentUser();

    if (!user) {
      return `
        <div class="history-page container">
          <nav class="breadcrumbs" aria-label="Breadcrumbs">
            <a href="#home">Home</a>
            <span class="sep">/</span>
            <span class="current">My Orders</span>
          </nav>

          <div class="empty-state" style="margin: 4rem 0;">
            <div class="empty-state-icon">🔐</div>
            <h2 class="empty-state-title">Sign In to View Your Orders</h2>
            <p class="empty-state-desc">Please log in to review your previous purchases, live tracking, and easy reorders.</p>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
              <a href="#auth" class="btn btn-primary">Sign In / Register &rarr;</a>
              <button class="btn btn-outline" id="history-demo-login">Demo Login (Sarah)</button>
            </div>
          </div>
        </div>
      `;
    }

    const orders = store.getOrders(user.role === 'admin' ? null : user.id);

    return `
      <div class="history-page container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Breadcrumbs">
          <a href="#home">Home</a>
          <span class="sep">/</span>
          <span class="current">My Orders</span>
        </nav>

        <div class="section-header">
          <div>
            <h1 class="section-title">Order History 📦</h1>
            <p class="section-subtitle">Manage previous orders, view receipts, track deliveries, and reorder favorites</p>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="tab-list" id="order-status-tabs">
          <button class="tab-btn active" data-status="all">All Orders (${orders.length})</button>
          <button class="tab-btn" data-status="active">Active & In-Progress</button>
          <button class="tab-btn" data-status="delivered">Delivered</button>
          <button class="tab-btn" data-status="cancelled">Cancelled</button>
        </div>

        <!-- Orders List Container -->
        <div id="orders-list-container" style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${orders.length === 0 ? `
            <div class="empty-state" style="margin: 3rem 0;">
              <div class="empty-state-icon">🍽️</div>
              <h3 class="empty-state-title">No Orders Yet</h3>
              <p class="empty-state-desc">You haven't placed any delicious meals yet. Start your first culinary order today!</p>
              <a href="#menu" class="btn btn-primary" style="margin-top: 1rem;">Browse Menu &rarr;</a>
            </div>
          ` : orders.map(order => this.renderOrderCard(order)).join('')}
        </div>
      </div>
    `;
  },

  renderOrderCard(order) {
    const isCancelled = order.status === 'cancelled';
    const isDelivered = order.status === 'delivered';
    const isActive = !isCancelled && !isDelivered;

    const statusBadgeClass = isDelivered ? 'badge-success' : isCancelled ? 'badge-danger' : 'badge-primary';

    return `
      <div class="card order-history-card" data-order-id="${order.id}" data-status="${order.status}" data-is-active="${isActive}" style="padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
              <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--color-text-main);">
                ${order.restaurantName}
              </h3>
              <span class="badge ${statusBadgeClass}" style="text-transform: capitalize;">
                ${order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <div style="font-size: 0.8rem; color: var(--color-text-muted);">
              Order #${order.id} &bull; Placed on ${new Date(order.createdAt).toLocaleDateString()} at ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--color-text-main);">
              $${order.total.toFixed(2)}
            </div>
            <div style="font-size: 0.8rem; color: var(--color-text-muted);">
              ${order.paymentMethod}
            </div>
          </div>
        </div>

        <!-- Items Summary -->
        <div style="margin-bottom: 1.25rem;">
          <div style="font-size: 0.85rem; color: var(--color-text-body); line-height: 1.6;">
            ${order.items.map(item => `
              <span style="display: inline-block; background-color: var(--color-bg-subtle); padding: 2px 8px; border-radius: var(--radius-md); margin: 2px 4px 2px 0;">
                <strong>${item.quantity}x</strong> ${item.name}
              </span>
            `).join('')}
          </div>
          <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 6px;">
            Delivered to: ${order.deliveryAddress.street}, ${order.deliveryAddress.city}
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 0.75rem; justify-content: flex-end; flex-wrap: wrap;">
          <button type="button" class="btn btn-outline btn-sm view-receipt-btn" data-order-id="${order.id}">
            🧾 View Receipt
          </button>

          <a href="#tracking/${order.id}" class="btn btn-outline btn-sm">
            📍 Track Status
          </a>

          <button type="button" class="btn btn-primary btn-sm reorder-btn" data-order-id="${order.id}">
            🔄 Reorder
          </button>
        </div>
      </div>
    `;
  },

  attachEvents() {
    document.getElementById('history-demo-login')?.addEventListener('click', () => {
      store.switchDemoUser('customer');
      Toast.success('Logged In', 'Welcome back Sarah!');
      if (typeof window.FoodOrderRefresh === 'function') {
        window.FoodOrderRefresh();
      } else {
        window.location.reload();
      }
    });

    // Filter tabs
    const tabs = document.querySelectorAll('#order-status-tabs .tab-btn');
    const cards = document.querySelectorAll('.order-history-card');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-status');

        cards.forEach(card => {
          const cardStatus = card.getAttribute('data-status');
          const isActive = card.getAttribute('data-is-active') === 'true';

          if (filter === 'all') {
            card.style.display = 'block';
          } else if (filter === 'active') {
            card.style.display = isActive ? 'block' : 'none';
          } else if (filter === cardStatus) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Reorder buttons (Bonus Feature 6: safe reorder with availability check)
    document.querySelectorAll('.reorder-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-order-id');
        const res = store.reorder(orderId);

        if (res.success) {
          Toast.success('Reordered! 🛒', res.message);
          window.location.hash = '#cart';
        } else {
          Toast.error('Reorder Note', res.message);
        }
      });
    });

    // View Receipt modal
    document.querySelectorAll('.view-receipt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-order-id');
        const order = store.getOrderById(orderId);
        if (!order) return;

        const receiptHtml = `
          <div style="font-family: inherit; color: var(--color-text-main);">
            <div style="text-align: center; margin-bottom: 1.5rem; border-bottom: 1px dashed var(--color-border); padding-bottom: 1rem;">
              <h3 style="font-size: 1.25rem; font-weight: 800;">${order.restaurantName}</h3>
              <p style="font-size: 0.85rem; color: var(--color-text-muted);">Official Order Receipt &bull; #${order.id}</p>
              <span class="badge ${order.status === 'delivered' ? 'badge-success' : 'badge-primary'}" style="margin-top: 6px;">
                Status: ${order.status.toUpperCase()}
              </span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.5rem;">
              ${order.items.map(i => `
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                  <span>${i.quantity}x ${i.name}</span>
                  <strong>$${(i.subtotal || i.price * i.quantity).toFixed(2)}</strong>
                </div>
              `).join('')}
            </div>

            <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem; margin-bottom: 1.5rem;">
              <div class="cost-breakdown-row"><span>Subtotal:</span><span>$${order.subtotal.toFixed(2)}</span></div>
              <div class="cost-breakdown-row"><span>Delivery:</span><span>$${order.deliveryFee.toFixed(2)}</span></div>
              <div class="cost-breakdown-row"><span>Tax (8%):</span><span>$${order.tax.toFixed(2)}</span></div>
              ${order.discount > 0 ? `<div class="cost-breakdown-row" style="color: var(--color-accent-green);"><span>Discount:</span><span>-$${order.discount.toFixed(2)}</span></div>` : ''}
              <div class="cost-breakdown-row total-row"><span>Total Paid:</span><span>$${order.total.toFixed(2)}</span></div>
            </div>

            <div style="font-size: 0.8rem; color: var(--color-text-muted); background-color: var(--color-bg-subtle); padding: 10px; border-radius: var(--radius-md);">
              <div><strong>Payment:</strong> ${order.paymentMethod}</div>
              <div><strong>Address:</strong> ${order.deliveryAddress.street}, ${order.deliveryAddress.city}</div>
              <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</div>
            </div>
          </div>
        `;

        Modal.open({
          title: `Receipt #${order.id}`,
          bodyContent: receiptHtml,
          footerContent: `<button class="btn btn-primary btn-sm" onclick="Modal.close(); window.print();">🖨️ Print Receipt</button>`
        });
      });
    });
  }
};
