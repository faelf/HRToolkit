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
        const path = btn.querySelectorAll("path")[1];
        if (path) path.setAttribute("d", isExpanded ? "M 8 9 L 11 12 L 8 15" : "M 10 15 L 7 12 L 10 9");
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
          const path = btn.querySelectorAll("path")[1];
          if (path) path.setAttribute("d", "M 8 9 L 11 12 L 8 15");
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
      if (btn) {
        const path = btn.querySelectorAll("path")[1];
        if (path) path.setAttribute("d", "M 10 15 L 7 12 L 10 9");
      }
    } else {
      if (sidebar) sidebar.ariaExpanded = "false";
      if (btn) {
        const path = btn.querySelectorAll("path")[1];
        if (path) path.setAttribute("d", "M 8 9 L 11 12 L 8 15");
      }
    }
  },
};
