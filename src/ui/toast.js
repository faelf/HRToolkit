const toastExample = /* html */ `
<!-- Class toast + status class -->
<output class="toast" role="status" aria-live="polite">
  <div class="toast-header">
    <!-- SVG Injected by JS -->
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
    <span class="toast-title">
      <!-- Title Injected by JS -->
    </span>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-close>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  </div>
  <div class="toast-body">
    <!-- Message Injected by JS given -->
  </div>
</output>
`;

const toast = {
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
};
