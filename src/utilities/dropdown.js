export function dropdown() {
  const dropdownBtns = document.querySelectorAll("[data-dropdown-btn]");

  dropdownBtns.forEach((btn) => {
    const dropdownId = btn.dataset.dropdownBtn;
    const dropdown = document.querySelector(`[data-dropdown="${dropdownId}"]`);

    btn.addEventListener("click", () => {
      dropdown.classList.toggle("show");
    });

    // Close dropdown if clicked outside
    document.addEventListener("click", (e) => {
      if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });
  });
}
