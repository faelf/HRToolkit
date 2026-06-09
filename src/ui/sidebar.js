export function dropdownClick(event) {
  const btn = event.target.closest("[data-nav-dropdown-btn]");
  if (!btn) return false;

  const dropdownId = btn.dataset.navDropdownBtn;
  const dropdown = document.querySelector(`[data-nav-dropdown="${dropdownId}"]`);

  if (!dropdown) return false;

  const isOpen = dropdown.dataset.expanded === "true";

  if (isOpen) {
    btn.dataset.flipY = "false";
    dropdown.style.height = "0px";
    dropdown.inert = true;
    dropdown.dataset.expanded = "false";
  }

  if (!isOpen) {
    btn.dataset.flipY = "true";
    dropdown.dataset.expanded = "true";
    dropdown.style.height = dropdown.scrollHeight + "px";
    dropdown.inert = false;
  }

  return true;
}

export function mobileClick(event) {
  const sidebar = document.querySelector(".sidebar-nav");
  if (!sidebar) return false;

  const isMobile = window.innerWidth <= 1024;
  if (!isMobile) return false;

  const isExpanded = sidebar.ariaExpanded === "true";
  const clickedOutside = !event.target.closest(".sidebar-nav");
  const clickedNavLink = event.target.closest("a");
  const autoClose = isExpanded && isMobile && (clickedOutside || clickedNavLink);

  if (autoClose) {
    const globalBtn = document.querySelector("#sidebar-btn");
    const path = globalBtn?.querySelectorAll("path")[1];
    sidebar.ariaExpanded = "false";
    path?.setAttribute("d", "M 8 9 L 11 12 L 8 15");
    return true;
  }

  return false;
}

export function click(event) {
  const btn = event.target.closest("#sidebar-btn");
  if (!btn) return false;

  const sidebar = document.querySelector(".sidebar-nav");
  if (!sidebar) return false;

  const isExpanded = sidebar.ariaExpanded === "true";

  if (isExpanded) {
    const path = btn.querySelectorAll("path")[1];
    sidebar.ariaExpanded = "false";
    path?.setAttribute("d", "M 8 9 L 11 12 L 8 15");
    return true;
  }

  if (!isExpanded) {
    const path = btn.querySelectorAll("path")[1];
    sidebar.ariaExpanded = "true";
    path?.setAttribute("d", "M 10 15 L 7 12 L 10 9");
    return true;
  }

  return false;
}

export function responsive() {
  const sidebar = document.querySelector(".sidebar-nav");
  const btn = document.querySelector("#sidebar-btn");
  const path = btn?.querySelectorAll("path")[1];
  const isDesktop = window.innerWidth > 1024;

  if (isDesktop && sidebar) {
    sidebar.ariaExpanded = "true";
    path?.setAttribute("d", "M 10 15 L 7 12 L 10 9");
  }

  if (!isDesktop && sidebar) {
    sidebar.ariaExpanded = "false";
    path?.setAttribute("d", "M 8 9 L 11 12 L 8 15");
  }
}
