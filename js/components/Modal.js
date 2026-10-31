/**
 * FoodOrder - Accessible Modal Dialog Controller
 * Manages custom popups, confirmation prompts, and food customization dialogs.
 */

class ModalController {
  constructor() {
    this.activeModal = null;
    this.keydownHandler = this.handleKeyDown.bind(this);
  }

  open({ title, bodyContent, footerContent = '', size = 'md', onClose = null }) {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');

    backdrop.innerHTML = `
      <div class="modal-dialog modal-${size}">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          ${typeof bodyContent === 'string' ? bodyContent : ''}
        </div>
        ${footerContent ? `<div class="modal-footer">${footerContent}</div>` : ''}
      </div>
    `;

    if (bodyContent instanceof HTMLElement) {
      backdrop.querySelector('.modal-body').appendChild(bodyContent);
    }

    const closeBtn = backdrop.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => this.close());

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.close();
    });

    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
      backdrop.classList.add('active');
    });

    window.addEventListener('keydown', this.keydownHandler);

    this.activeModal = { backdrop, onClose };
    return backdrop;
  }

  confirm({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', confirmClass = 'btn-primary', onConfirm, onCancel }) {
    const body = `<p style="font-size: 0.95rem; color: var(--color-text-body);">${message}</p>`;
    const footer = `
      <button class="btn btn-outline" id="modal-cancel-btn">${cancelText}</button>
      <button class="btn ${confirmClass}" id="modal-confirm-btn">${confirmText}</button>
    `;

    const modalEl = this.open({
      title,
      bodyContent: body,
      footerContent: footer,
      size: 'sm'
    });

    modalEl.querySelector('#modal-cancel-btn').addEventListener('click', () => {
      this.close();
      if (onCancel) onCancel();
    });

    modalEl.querySelector('#modal-confirm-btn').addEventListener('click', () => {
      this.close();
      if (onConfirm) onConfirm();
    });
  }

  close() {
    if (this.activeModal) {
      const { backdrop, onClose } = this.activeModal;
      backdrop.classList.remove('active');
      setTimeout(() => {
        if (backdrop.parentElement) {
          backdrop.parentElement.removeChild(backdrop);
        }
      }, 250);

      document.body.style.overflow = '';
      window.removeEventListener('keydown', this.keydownHandler);

      if (onClose) onClose();
      this.activeModal = null;
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Escape') {
      this.close();
    }
  }
}

export const Modal = new ModalController();

