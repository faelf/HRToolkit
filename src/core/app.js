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
import { sidebar } from "../ui/sidebar.js";

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
  landingPage: "dashboard",
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
  sidebar.responsive();
}

/*
  Eventlisteners
  --------------
*/
document.addEventListener("click", (e) => {
  const target = e.target;

  switch (true) {
    case sidebar.click(e):
      break;

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
window.addEventListener("resize", () => {
  sidebar.responsive();
});
