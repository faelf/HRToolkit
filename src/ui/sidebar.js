export const sidebar = {
  click(event) {
    const btn = event.target.closest("#sidebar-btn");
    const sidebarNode = document.querySelector(".sidebar-nav");

    if (btn) {
      if (sidebarNode) {
        sidebarNode.classList.toggle("sidebar-open");
        btn.classList.toggle("rotate");
      }
      return true;
    }

    if (sidebarNode && sidebarNode.classList.contains("sidebar-open") && window.innerWidth <= 1024) {
      const clickedOutside = !event.target.closest(".sidebar-nav");
      const clickedNavLink = event.target.closest(".nav-btn");

      if (clickedOutside || clickedNavLink) {
        sidebarNode.classList.remove("sidebar-open");
        const toggleBtn = document.querySelector("#sidebar-btn");
        if (toggleBtn) toggleBtn.classList.remove("rotate");
        if (clickedOutside) return true;
      }
    }

    return false;
  },
  responsive() {
    const sidebarNode = document.querySelector(".sidebar-nav");
    const toggleBtn = document.querySelector("#sidebar-btn");

    if (window.innerWidth > 1024) {
      if (sidebarNode) sidebarNode.classList.add("sidebar-open");
      if (toggleBtn) toggleBtn.classList.add("rotate");
    } else {
      if (sidebarNode) sidebarNode.classList.remove("sidebar-open");
      if (toggleBtn) toggleBtn.classList.remove("rotate");
    }
  },
};
