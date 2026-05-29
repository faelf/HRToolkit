export const modal = {
  click(e) {
    const openBtn = e.target.closest("[data-modal-btn]");
    if (openBtn) {
      const modalId = openBtn.dataset.modalBtn;
      const dialog = document.querySelector(`[data-modal="${modalId}"]`);

      if (dialog) {
        dialog.showModal();
        return true;
      }
    }

    const closeBtn = e.target.closest('[data-modal="close"]');
    if (closeBtn) {
      const dialog = closeBtn.closest("dialog");

      if (dialog) {
        dialog.close();
        return true;
      }
    }
    return false;
  },
};
