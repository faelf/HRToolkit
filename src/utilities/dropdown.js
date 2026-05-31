export const dropdown = {
  slidedownClick(event) {
    const btn = event.target.closest("[data-slidedown-btn]");
    if (!btn) return false;

    const id = btn.dataset.slidedownBtn;
    const slidedown = document.querySelector(`[data-slidedown="${id}"]`);

    if (!slidedown) return false;

    const isOpen = slidedown.dataset.expanded === "true";

    if (isOpen) {
      btn.dataset.flipY = "false";
      slidedown.dataset.expanded = "false";
      slidedown.style.height = "0px";
    } else {
      btn.dataset.flipY = "true";
      slidedown.dataset.expanded = "true";
      slidedown.style.height = slidedown.scrollHeight + "px";
    }

    return true;
  },
  dropdownClick(event) {
    const btn = event.target.closest("[data-dropdown-btn]");

    if (btn) {
      const dropdownId = btn.dataset.dropdownBtn;
      const dropdown = document.querySelector(`[data-dropdown="${dropdownId}"]`);
      event.stopPropagation();
      dropdown.classList.toggle("show");
      return;
    }

    document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
      dropdown.classList.remove("show");
    });
  },
};
