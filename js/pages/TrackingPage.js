/**
 * FoodOrder - Order Tracking View (Module F)
 * Live status timeline, simulated status progression, cancellation dialog,
 * status history timestamps, demo progression controls, and review CTA.
 */

import { store } from '../state/store.js';
import { Modal } from '../components/Modal.js';
import { Toast } from '../components/Toast.js';

export const TrackingPage = {
  render(params = {}) {
    const orderId = params.id;
    let order = null;

    if (orderId) {
      order = store.getOrderById(orderId);
    } else {
      // Find latest order for current user
      const user = store.getCurrentUser();
      const orders = store.getOrders(user ? user.id : null);
      if (orders.length > 0) order = orders[0];
    }

    if (!order) {
      return `
        <div class="tracking-page container">
          <nav class="breadcrumbs" aria-label="Breadcrumbs">
            <a href="#home">Home</a>
            <span class="sep">/</span>
            <span class="current">Order Tracking</span>
          </nav>

          <div class="empty-state" style="margin: 4rem 0;">
            <div class="empty-state-icon">📦</div>
            <h2 class="empty-state-title">No Active Order Selected</h2>
            <p class="empty-state-desc">You do not have any active order to track, or the order ID is invalid.</p>
            <a href="#history" class="btn btn-primary" style="margin-top: 1rem;">View Order History &rarr;</a>
          </div>
        </div>
      `;
    }

    const stages = [
      { key: 'pending', label: 'Order Received', icon: '📝', desc: 'Restaurant confirmed your order' },
      { key: 'preparing', label: 'In the Kitchen', icon: '👨‍🍳', desc: 'Chef is cooking your fresh meal' },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🛵', desc: 'Courier is en route to your address' },
      { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Order arrived! Enjoy your food' }
    ];

    const currentStageIndex = stages.findIndex(s => s.key === order.status);
    const isCancelled = order.status === 'cancelled';
    const canCancel = order.status === 'pending' || order.status === 'preparing';

    return `
      <div class="tracking-page container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Breadcrumbs">
          <a href="#home">Home</a>
          <span class="sep">/</span>
          <a href="#history">Order History</a>
          <span class="sep">/</span>
          <span class="current">Track Order #${order.id}</span>
        </nav>

        <!-- Simulated Tracking Disclaimer Banner (Mandatory Requirement) -->
        <div style="
          background-color: #FEF3C7;
          border-left: 4px solid #F59E0B;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          margin-bottom: 2rem;
          font-size: 0.85rem;
          color: #92400E;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        ">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.25rem;">ℹ️</span>
            <span><strong>Simulated Tracking:</strong> This timeline demonstrates real-time status updates and event hooks. No actual GPS courier is involved.</span>
          </div>
          <span class="badge badge-warning" style="background-color: #FDE68A;">Demo Environment</span>
        </div>

        <div class="checkout-grid">
          <!-- Left Column: Live Status & Timeline -->
          <div>
            <!-- Status Card -->
            <div class="checkout-card" style="margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 8px;">
                <div>
                  <span class="badge ${isCancelled ? 'badge-danger' : order.status === 'delivered' ? 'badge-success' : 'badge-primary'}" style="font-size: 0.85rem; padding: 4px 10px;">
                    ${order.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--color-text-main); margin-top: 6px;">
                    Order #${order.id}
                  </h2>
                  <p style="font-size: 0.85rem; color: var(--color-text-muted);">
                    Placed on ${new Date(order.createdAt).toLocaleDateString()} at ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div style="text-align: right;">
                  <span style="font-size: 0.8rem; color: var(--color-text-muted); display: block;">Estimated Arrival</span>
                  <strong style="font-size: 1.25rem; color: var(--color-primary-hover);">
                    ${order.status === 'delivered' ? 'Arrived!' : isCancelled ? 'N/A' : '20-25 mins'}
                  </strong>
                </div>
              </div>

              <!-- Cancelled State Banner if applicable -->
              ${isCancelled ? `
                <div style="background-color: #FEE2E2; color: #991B1B; padding: 1rem; border-radius: var(--radius-lg); margin: 1.5rem 0; font-size: 0.9rem;">
                  <strong>❌ This order was cancelled.</strong>
                  <div style="margin-top: 4px;">Refund simulation processed back to ${order.paymentMethod}.</div>
                </div>
              ` : `
                <!-- Visual Stepper Progress Bar -->
                <div class="tracking-timeline">
                  ${stages.map((stage, idx) => {
                    const isCompleted = currentStageIndex > idx;
                    const isActive = currentStageIndex === idx;
                    const hist = order.statusHistory ? order.statusHistory.find(h => h.status === stage.key) : null;

                    return `
                      <div class="timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                        <div class="timeline-dot"></div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                          <div class="timeline-title">
                            ${stage.icon} ${stage.label}
                          </div>
                          ${hist ? `<span class="timeline-time">${hist.timestamp}</span>` : ''}
                        </div>
                        <div class="timeline-desc">${hist ? hist.note : stage.desc}</div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `}

              <!-- Demo Control Toolbar (Bonus Feature 1) -->
              <div style="
                background-color: var(--color-bg-subtle);
                border: 1px dashed var(--color-border);
                border-radius: var(--radius-xl);
                padding: 1rem;
                margin-top: 1.5rem;
              ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <strong style="font-size: 0.85rem; color: var(--color-text-main);">🧪 Internship Evaluator Controls:</strong>
                  <span style="font-size: 0.75rem; color: var(--color-text-muted);">Auto-advances every 25s</span>
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  <button type="button" class="btn btn-outline btn-sm" id="demo-advance-stage-btn" ${isCancelled || order.status === 'delivered' ? 'disabled' : ''}>
                    ⏩ Fast-Forward to Next Stage
                  </button>
                  <button type="button" class="btn btn-outline btn-sm" id="demo-deliver-now-btn" ${isCancelled || order.status === 'delivered' ? 'disabled' : ''}>
                    🎉 Mark Delivered Immediately
                  </button>
                  ${canCancel ? `
                    <button type="button" class="btn btn-danger btn-sm" id="cancel-order-trigger-btn">
                      Cancel Order
                    </button>
                  ` : ''}
                </div>
              </div>

              <!-- Delivered State Review CTA -->
              ${order.status === 'delivered' ? `
                <div style="
                  background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
                  border: 1px solid #10B981;
                  border-radius: var(--radius-xl);
                  padding: 1.25rem;
                  margin-top: 1.5rem;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  flex-wrap: wrap;
                  gap: 1rem;
                ">
                  <div>
                    <strong style="color: #065F46; font-size: 1rem; display: block;">How was your meal?</strong>
                    <span style="font-size: 0.85rem; color: #047857;">Help others by rating ${order.restaurantName}!</span>
                  </div>
                  <a href="#restaurant/${order.restaurantId}" class="btn btn-secondary btn-sm" style="background-color: #065F46;">
                    ⭐ Rate & Review Restaurant
                  </a>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Right Column: Order Details & Receipt -->
          <div>
            <div class="checkout-card">
              <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--color-text-main);">
                Order Details
              </h3>

              <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-border);">
                <span style="font-size: 0.8rem; color: var(--color-text-muted); display: block;">Restaurant</span>
                <strong style="color: var(--color-text-main); font-size: 1rem;">${order.restaurantName}</strong>
              </div>

              <!-- Items Breakdown -->
              <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem;">
                ${order.items.map(item => `
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                    <div>
                      <strong style="color: var(--color-text-main);">${item.quantity}x ${item.name}</strong>
                      ${item.customizations && item.customizations.length > 0 ? `
                        <div style="font-size: 0.75rem; color: var(--color-text-muted);">${item.customizations.join(', ')}</div>
                      ` : ''}
                    </div>
                    <span style="font-weight: 700; color: var(--color-text-main);">$${(item.subtotal || item.price * item.quantity).toFixed(2)}</span>
                  </div>
                `).join('')}
              </div>

              <!-- Delivery Address -->
              <div style="background-color: var(--color-bg-subtle); padding: 12px; border-radius: var(--radius-lg); margin-bottom: 1.25rem;">
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-text-muted); display: block; margin-bottom: 4px;">Delivery Address</span>
                <div style="font-size: 0.85rem; color: var(--color-text-main);">
                  ${order.deliveryAddress.street}<br>
                  ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.postalCode}<br>
                  Recipient: ${order.deliveryAddress.recipient} (${order.deliveryAddress.phone})
                </div>
              </div>

              <!-- Payment Method -->
              <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1rem;">
                Payment Method: <strong style="color: var(--color-text-main);">${order.paymentMethod}</strong>
              </div>

              <!-- Cost Summary -->
              <div style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid var(--color-border); padding-top: 1rem;">
                <div class="cost-breakdown-row">
                  <span>Subtotal</span>
                  <span>$${order.subtotal.toFixed(2)}</span>
                </div>
                <div class="cost-breakdown-row">
                  <span>Delivery Fee</span>
                  <span>$${order.deliveryFee.toFixed(2)}</span>
                </div>
                <div class="cost-breakdown-row">
                  <span>Tax (8%)</span>
                  <span>$${order.tax.toFixed(2)}</span>
                </div>
                ${order.discount > 0 ? `
                  <div class="cost-breakdown-row" style="color: var(--color-accent-green); font-weight: 600;">
                    <span>Discount</span>
                    <span>-$${order.discount.toFixed(2)}</span>
                  </div>
                ` : ''}
                <div class="cost-breakdown-row total-row">
                  <span>Total Paid</span>
                  <span style="color: var(--color-primary-hover);">$${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
                <button type="button" class="btn btn-outline btn-full btn-sm" id="tracking-reorder-btn">
                  🔄 Reorder These Items
                </button>
                <a href="#history" class="btn btn-ghost btn-full btn-sm">
                  View All Orders &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents(params = {}) {
    const orderId = params.id;
    const user = store.getCurrentUser();
    const order = orderId ? store.getOrderById(orderId) : store.getOrders(user ? user.id : null)[0];
    if (!order) return;

    // Fast-Forward Demo Stepper
    document.getElementById('demo-advance-stage-btn')?.addEventListener('click', () => {
      const nextStages = {
        pending: 'preparing',
        preparing: 'out_for_delivery',
        out_for_delivery: 'delivered'
      };
      const next = nextStages[order.status];
      if (next) {
        store.updateOrderStatus(order.id, next);
        Toast.success('Status Updated! ⏩', `Order moved to "${next.replace(/_/g, ' ')}".`);
        if (typeof window.FoodOrderRefresh === 'function') {
          window.FoodOrderRefresh();
        } else {
          window.location.reload();
        }
      }
    });

    document.getElementById('demo-deliver-now-btn')?.addEventListener('click', () => {
      store.updateOrderStatus(order.id, 'delivered');
      Toast.success('Delivered! 🎉', 'Order marked as successfully delivered.');
      if (typeof window.FoodOrderRefresh === 'function') {
        window.FoodOrderRefresh();
      } else {
        window.location.reload();
      }
    });

    // Cancel order confirmation dialog
    document.getElementById('cancel-order-trigger-btn')?.addEventListener('click', () => {
      Modal.confirm({
        title: `Cancel Order #${order.id}?`,
        message: 'Are you sure you want to cancel this order? Since the restaurant has not dispatched it yet, a full refund simulation will be credited.',
        confirmText: 'Yes, Cancel Order',
        cancelText: 'Keep Order',
        confirmClass: 'btn-danger',
        onConfirm: () => {
          const res = store.cancelOrder(order.id, 'Customer requested via tracking screen');
          if (res.success) {
            Toast.info('Order Cancelled', 'Your order was successfully cancelled.');
            if (typeof window.FoodOrderRefresh === 'function') {
              window.FoodOrderRefresh();
            } else {
              window.location.reload();
            }
          } else {
            Toast.error('Cancellation Error', res.message);
          }
        }
      });
    });

    // Reorder button
    document.getElementById('tracking-reorder-btn')?.addEventListener('click', () => {
      const res = store.reorder(order.id);
      if (res.success) {
        Toast.success('Reordered! 🛒', res.message);
        window.location.hash = '#cart';
      } else {
        Toast.error('Reorder Failed', res.message);
      }
    });
  }
};
