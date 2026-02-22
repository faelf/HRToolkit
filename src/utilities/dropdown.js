export function dropdown() {
  document.addEventListener("click", (e) => {
    console.log("click");
    const btn = e.target.closest("[data-dropdown-btn]");

    if (btn) {
      const dropdownId = btn.dataset.dropdownBtn;
      const dropdown = document.querySelector(
        `[data-dropdown="${dropdownId}"]`,
      );
      e.stopPropagation();
      dropdown.classList.toggle("show");
      return;
    }

    document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
      dropdown.classList.remove("show");
    });
  });
}
