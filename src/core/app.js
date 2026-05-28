/**
 * Main Entry Point
 * ----------------
 */

import { Router } from "../utilities/router.js";
import { pageContent } from "../pages/index.js";
import { theme } from "../utilities/theme.js";
import { form } from "../utilities/form.js";
import { modal } from "../utilities/modal.js";
import { storages } from "../utilities/storages.js";

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
  theme.init();
  storages.init();
}

/*
  Eventlisteners
  --------------
*/
document.addEventListener("click", (e) => {
  const target = e.target;

  switch (true) {
    case theme.click(e):
      break;

    case modal.popover.click(e):
      break;

    case form.select.click(e):
      break;
  }
});

document.addEventListener("input", (e) => {
  form.select.handleSearch(e);
  form.date.handleInput(e);
});

// Listen for the 'load' event to trigger the startup sequence
window.addEventListener("load", initialLoad);
