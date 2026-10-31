/**
 * FoodOrder - Toast Notification System
 * Handles elegant non-blocking alerts for actions, cart operations, errors, and confirmations.
 */

class ToastManager {
  constructor() {
    this.container = null;
  }

  ensureContainer() {
    if (!this.container) {
      let el = document.getElementById('toast-container');
      if (!el) {
        el = document.createElement('div');
        el.id = 'toast-container';
        el.setAttribute('aria-live', 'polite');
        el.setAttribute('aria-atomic', 'true');
        document.body.appendChild(el);
      }
      this.container = el;
    }
  }

  show(title, message = '', type = 'info', duration = 3500) {
    this.ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: '💡'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || '🔔'}</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 300);
    };

    closeBtn.addEventListener('click', dismiss);

    this.container.appendChild(toast);

    // Trigger animation in next frame
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }

  success(title, message) {
    this.show(title, message, 'success');
  }

  error(title, message) {
    this.show(title, message, 'error', 4500);
  }

  info(title, message) {
    this.show(title, message, 'info');
  }

  warning(title, message) {
    this.show(title, message, 'warning', 4000);
  }
}

export const Toast = new ToastManager();

