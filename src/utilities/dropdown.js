export function slidedownClick(event) {
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
  }

  if (!isOpen) {
    btn.dataset.flipY = "true";
    slidedown.dataset.expanded = "true";
    slidedown.style.height = slidedown.scrollHeight + "px";
  }

  return true;
}

export function dropdownClick(event) {
  const btn = event.target.closest("[data-dropdown-btn]");
  if (!btn) return false;

  const dropdownId = btn.dataset.dropdownBtn;
  const dropdown = document.querySelector(`[data-dropdown="${dropdownId}"]`);
  const isOpen = dropdown.dataset.expanded === "true";

  if (isOpen) {
    dropdown.dataset.expanded = "false";
    dropdown.style.height = "0px";
  }

  if (!isOpen) {
    dropdown.dataset.expanded = "true";
    dropdown.style.height = dropdown.scrollHeight + "px";
  }
  return true;
}
