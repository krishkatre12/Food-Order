/**
 * FoodOrder - Simulated Email Notification Center (Bonus Feature 5)
 * Displays sent transactional emails with complete HTML email previews, tracking links, and receipts.
 */

import { store } from '../state/store.js';
import { Modal } from './Modal.js';

export const NotificationsModal = {
  open() {
    const notifications = store.getNotifications();
    store.markAllNotificationsRead();

    const bodyHtml = `
      <div class="notifications-center">
        <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.85rem; color: var(--color-text-muted);">
            Simulated Inbox: Transactional emails sent to your registered address.
          </span>
          <span class="badge badge-primary">${notifications.length} Emails</span>
        </div>

        ${notifications.length === 0 ? `
          <div class="empty-state" style="padding: 2rem 1rem;">
            <div class="empty-state-icon">📬</div>
            <h4 class="empty-state-title">No notifications yet</h4>
            <p class="empty-state-desc">You'll see order receipts, delivery updates, and welcome emails here.</p>
          </div>
        ` : `
          <div class="notifications-list" style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${notifications.map((n, i) => `
              <div class="notif-card" data-index="${i}" style="
                padding: 1rem;
                background-color: var(--color-bg-subtle);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                cursor: pointer;
                transition: transform 0.15s ease, border-color 0.15s ease;
              ">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                  <span style="font-weight: 700; font-size: 0.95rem; color: var(--color-text-main);">
                    ${n.title}
                  </span>
                  <span style="font-size: 0.75rem; color: var(--color-text-muted);">${n.timestamp}</span>
                </div>
                <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.5rem; line-height: 1.4;">
                  ${n.message}
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="badge badge-info" style="font-size: 10px;">FoodOrder Mailer</span>
                  <span style="font-size: 0.75rem; color: var(--color-primary-hover); font-weight: 600;">
                    Click to view full simulated email &rarr;
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    const modalEl = Modal.open({
      title: 'Simulated Email Notification Center',
      bodyContent: bodyHtml,
      size: 'md'
    });

    // Add click listeners to cards to view simulated full HTML email
    modalEl.querySelectorAll('.notif-card').forEach(card => {
      card.addEventListener('click', () => {
        const index = Number(card.getAttribute('data-index'));
        const notif = notifications[index];
        this.openEmailPreview(notif);
      });
    });
  },

  openEmailPreview(notif) {
    const user = store.getCurrentUser() || { name: 'Valued Customer', email: 'customer@example.com' };

    const emailHtml = `
      <div style="
        font-family: Arial, sans-serif;
        background-color: #F3F4F6;
        padding: 1.5rem;
        border-radius: var(--radius-xl);
        color: #1F2937;
      ">
        <!-- Email Header -->
        <div style="
          background-color: #F59E0B;
          color: #1F2937;
          padding: 1.25rem;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div style="font-weight: 800; font-size: 1.25rem; display: flex; align-items: center; gap: 8px;">
            <span>🍔</span> FoodOrder Express
          </div>
          <span style="font-size: 0.75rem; background: rgba(0,0,0,0.1); padding: 4px 8px; border-radius: 20px;">
            ${notif.timestamp}
          </span>
        </div>

        <!-- Email Body -->
        <div style="
          background-color: #FFFFFF;
          padding: 1.5rem;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          border: 1px solid #E5E7EB;
        ">
          <div style="font-size: 0.8rem; color: #6B7280; margin-bottom: 1rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.5rem;">
            <strong>To:</strong> ${user.name} &lt;${user.email}&gt;<br>
            <strong>From:</strong> FoodOrder Notifications &lt;no-reply@foodorder.express&gt;<br>
            <strong>Subject:</strong> ${notif.title}
          </div>

          <h3 style="color: #1F2937; font-size: 1.15rem; margin-bottom: 0.75rem;">${notif.title}</h3>
          <p style="font-size: 0.95rem; line-height: 1.6; color: #374151; margin-bottom: 1.25rem;">
            ${notif.message}
          </p>

          ${notif.orderId ? `
            <div style="
              background-color: #FEF3C7;
              padding: 1rem;
              border-radius: 8px;
              border-left: 4px solid #F59E0B;
              margin-bottom: 1.25rem;
            ">
              <strong style="color: #92400E; display: block; margin-bottom: 4px;">Live Order Ref: #${notif.orderId}</strong>
              <span style="font-size: 0.85rem; color: #78350F;">
                You can track food preparation, courier dispatch, and live status in the application.
              </span>
            </div>
            <a href="#tracking/${notif.orderId}" class="btn btn-primary btn-full" onclick="document.querySelector('.modal-close').click();">
              Open Live Order Tracking &rarr;
            </a>
          ` : ''}

          <div style="margin-top: 1.5rem; border-top: 1px solid #E5E7EB; padding-top: 1rem; font-size: 0.75rem; color: #9CA3AF; text-align: center;">
            This is a frontend demonstration email simulation. No real emails or SMS are dispatched.
          </div>
        </div>
      </div>
    `;

    Modal.open({
      title: 'Email Preview (Simulated)',
      bodyContent: emailHtml,
      size: 'md'
    });
  }
};

