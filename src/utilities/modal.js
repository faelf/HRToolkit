export const modal = {
  popover: {
    click(e) {
      const dialog = e.target.closest('[data-modal="close"]')?.closest("dialog");

      if (dialog) {
        // Dynamically handle popovers vs traditional dialog modals
        dialog.hasAttribute("popover") ? dialog.hidePopover() : dialog.close();
        return true; // Action was handled, stop further event execution
      }

      return false; // Not a modal close click
    },
  },
};
