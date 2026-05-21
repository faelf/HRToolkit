/**
 * Main Entry Point
 * ----------------
 */

import { Router } from "../utilities/router.js";
import { pageContent } from "../pages/index.js";
import { initTheme } from "../utilities/theme.js";
import { toggleTheme } from "../utilities/theme.js";
import { handleSelectInputClick, handleSelectInputSearch } from "../utilities/form.js";

// Load all Web Components and global UI logic
import "../ui/index.js";

/**
 * Router Setup
 * ------------
 * 1. Get the container where all pages will be injected.
 * 2. Initialise the Router with the container, page data, and home as the fallback.
 * 3. Attach event listeners for clicks and history navigation.
 */
const router = new Router({
  contentArea: "#main-content",
  pageContent: pageContent,
  linkAttribute: "href",
  idAttribute: "data-id",
});
router.init();

/**
 * Initial Load Handler
 * --------------------
 * Runs once when the browser window has fully loaded.
 */
function initialLoad() {
  // Apply the user's preferred theme
  initTheme();
}

/*
  Eventlisteners
  --------------
*/
document.addEventListener("click", (e) => {
  const target = e.target;
  const nav = document.querySelector(".sidebar-nav");

  if (target.closest("#theme-toggle")) {
    toggleTheme();
    return;
  }

  if (target.closest("a.nav-btn")) {
    if (nav) nav.classList.remove("sidebar-open");
    return;
  }

  const closeButton = target.closest('[data-modal="close"]');

  if (closeButton) {
    const dialog = closeButton.closest("dialog");

    if (dialog) {
      dialog.hidePopover();
    }
    return;
  }

  handleSelectInputClick(e);
});

document.addEventListener("input", (e) => {
  handleSelectInputSearch(e);
});

// Listen for the 'load' event to trigger the startup sequence
window.addEventListener("load", initialLoad);
