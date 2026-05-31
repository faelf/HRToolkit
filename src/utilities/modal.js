export const modal = {
  click(event) {
    const openBtn = event.target.closest("[data-modal-btn]");
    if (openBtn) {
      const modalId = openBtn.dataset.modalBtn;
      const dialog = document.querySelector(`[data-modal="${modalId}"]`);

      if (dialog) {
        dialog.showModal();
        return true;
      }
    }

    const closeBtn = event.target.closest('[data-modal="close"]');
    if (closeBtn) {
      const dialog = closeBtn.closest("dialog");

      if (dialog) {
        dialog.close();
        return true;
      }
    }
    return false;
  },
  close(event) {
    const dialog = event.target.closest("dialog");
    if (dialog) {
      dialog.hasAttribute("popover") ? dialog.hidePopover() : dialog.close();
    }
  },
};
