export const toast = {
  icon: {
    success: /* html */ `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  `,
    warning: /* html */ `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" x2="12" y1="8" y2="12"/>
      <line x1="12" x2="12.01" y1="16" y2="16"/>
    </svg>
  `,
    error: /* html */ `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="9" x2="15" y1="15" y2="9" />
    </svg>
  `,
    close: /* html */ `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="ms-auto" data-close>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  `,
  },
  _create({ type, title, message, duration = 5000 }) {
    // Create or find a global container for the toasts
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toastEl = document.createElement("output");
    toastEl.className = `toast ${type}`;
    toastEl.setAttribute("role", "status");
    toastEl.setAttribute("aria-live", "polite");

    const defaultTitle = type.charAt(0).toUpperCase() + type.slice(1);
    const toastTitle = title || defaultTitle;

    toastEl.innerHTML = /* html */ `
      <div class="toast-header">
        ${this.icon[type]}
        <span class="toast-title">${toastTitle}</span>
        ${this.icon.close}
      </div>
      <div class="toast-body">${message}</div>
    `;

    container.appendChild(toastEl);

    // Trigger reflow to enable CSS transitions, then set data-toast
    toastEl.offsetHeight;
    toastEl.dataset.toast = "true";

    const removeToast = () => {
      toastEl.dataset.toast = "false";
      // Wait for exit animation to finish before removing from DOM
      const transitionDuration = parseFloat(getComputedStyle(toastEl).transitionDuration) || 0;
      setTimeout(() => {
        toastEl.remove();
        if (container.childNodes.length === 0) {
          container.remove();
        }
      }, transitionDuration > 0 ? transitionDuration * 1000 : 300);
    };

    const timeoutId = setTimeout(removeToast, duration);

    const closeBtn = toastEl.querySelector("[data-close]");
    if (closeBtn) {
      closeBtn.style.cursor = "pointer";
      closeBtn.addEventListener("click", () => {
        clearTimeout(timeoutId);
        removeToast();
      });
    }
  },
  success({ title, message, duration }) {
    this._create({ type: "success", title, message, duration });
  },
  warning({ title, message, duration }) {
    this._create({ type: "warning", title, message, duration });
  },
  error({ title, message, duration }) {
    this._create({ type: "error", title, message, duration });
  },
};
