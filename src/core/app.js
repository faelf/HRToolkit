/**
 * Main Entry Point
 * ----------------
 */

import { Router } from "../utilities/router.js";
import { pageContent } from "../pages/index.js";
import { initTheme } from "../utilities/theme.js";

// Load all Web Components and global UI logic
import "../ui/index.js";

// Import UI utilities
import { dropdown } from "../utilities/dropdown.js";

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
  dropdown();
  // Apply the user's preferred theme
  initTheme();
}

// Listen for the 'load' event to trigger the startup sequence
window.addEventListener("load", initialLoad);
