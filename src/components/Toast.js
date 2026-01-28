class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (!document.querySelector(".toast-container")) {
      this.container = document.createElement("div");
      this.container.className = "toast-container";
      document.body.appendChild(this.container);

      this.addStyles();
    } else {
      this.container = document.querySelector(".toast-container");
    }
  }

  addStyles() {
    if (document.querySelector("#toast-styles")) return;

    const styles = document.createElement("style");
    styles.id = "toast-styles";
    styles.textContent = `
      .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      }

      .toast {
        padding: 16px 24px;
        border-radius: 8px;
        background: #333;
        color: #fff;
        font-family: 'Hellix', sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        pointer-events: auto;
        transform: translateX(120%);
        opacity: 0;
        max-width: 400px;
      }

      .toast.show {
        transform: translateX(0);
        opacity: 1;
      }

      .toast-success {
        background: #1a1a1a;
        border-left: 4px solid #27ae60;
      }

      .toast-error {
        background: #1a1a1a;
        border-left: 4px solid #e74c3c;
      }

      .toast-warning {
        background: #1a1a1a;
        border-left: 4px solid #f39c12;
      }

      .toast-info {
        background: #1a1a1a;
        border-left: 4px solid #3498db;
      }

      .toast-icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      .toast-message {
        flex: 1;
      }

      .toast-close {
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        padding: 4px;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      .toast-close:hover {
        opacity: 1;
      }
    `;
    document.head.appendChild(styles);
  }

  show(message, type = "info", duration = 4000) {
    this.init();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icons = {
      success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>`,
      error: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>`,
      warning: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#f39c12" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>`,
      info: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#3498db" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>`,
    };

    toast.innerHTML = `
      ${icons[type] || icons.info}
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Fechar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    this.container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    toast.querySelector(".toast-close").addEventListener("click", () => {
      this.dismiss(toast);
    });

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast);
      }, duration);
    }

    return toast;
  }

  dismiss(toast) {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }

  success(message, duration) {
    return this.show(message, "success", duration);
  }

  error(message, duration) {
    return this.show(message, "error", duration);
  }

  warning(message, duration) {
    return this.show(message, "warning", duration);
  }

  info(message, duration) {
    return this.show(message, "info", duration);
  }
}

export const toast = new ToastManager();
