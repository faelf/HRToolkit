export const sidebar = {
  dropdownClick(event) {
    const btn = event.target.closest("[data-nav-dropdown-btn]");

    if (btn) {
      const dropdownId = btn.dataset.navDropdownBtn;
      const dropdown = document.querySelector(`[data-nav-dropdown="${dropdownId}"]`);

      if (dropdown) {
        const isOpen = dropdown.dataset.expanded === "true";

        if (isOpen) {
          btn.dataset.flipY = "false";
          dropdown.style.height = "0px";
          setTimeout(() => {
            dropdown.dataset.expanded = "false";
          }, 200);
        } else {
          btn.dataset.flipY = "true";
          dropdown.dataset.expanded = "true";
          dropdown.style.height = dropdown.scrollHeight + "px";
        }
      }

      return true;
    }

    return false;
  },
  click(event) {
    const sidebar = document.querySelector(".sidebar-nav");
    const btn = document.querySelector("#sidebar-btn");

    if (!sidebar) return false;

    // Toggle button clicked
    if (event.target.closest("#sidebar-btn")) {
      const isExpanded = sidebar.ariaExpanded === "true";

      sidebar.ariaExpanded = isExpanded ? "false" : "true";

      if (btn) {
        btn.dataset.flipX = isExpanded ? "false" : "true";
      }

      return true;
    }

    // Mobile auto-close
    if (sidebar.ariaExpanded === "true" && window.innerWidth <= 1024) {
      const clickedOutside = !event.target.closest(".sidebar-nav");
      const clickedNavLink = event.target.closest(".nav-btn");

      if (clickedOutside || clickedNavLink) {
        sidebar.ariaExpanded = "false";

        if (btn) {
          btn.dataset.flipX = "false";
        }

        return true;
      }
    }

    return false;
  },
  responsive() {
    const sidebar = document.querySelector(".sidebar-nav");
    const btn = document.querySelector("#sidebar-btn");

    if (window.innerWidth > 1024) {
      if (sidebar) sidebar.ariaExpanded = "true";
      if (btn) btn.dataset.flipX = "true";
    } else {
      if (sidebar) sidebar.ariaExpanded = "false";
      if (btn) btn.dataset.flipX = "false";
    }
  },
};
