/**
 * Main Entry Point
 * ----------------
 */

import { Router } from "../utilities/router.js";
import { pageContent } from "../pages/index.js";
import * as theme from "../utilities/theme.js";
import * as form from "../utilities/form.js";
import * as modal from "../utilities/modal.js";
import { storages } from "../utilities/storages.js";
import * as sidebar from "../ui/sidebar.js";
import * as dropdown from "../utilities/dropdown.js";
import { appState } from "./state.js";

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
  linkAttribute: "data-href",
  idAttribute: "data-id",
  landingPage: "dashboard",
});

/**
 * Initial Load Handler
 * --------------------
 * Runs once when the browser window has fully loaded.
 */
async function initialLoad() {
  // Apply the user's preferred theme
  theme.init();
  storages.init();
  sidebar.responsive();
  await appState.loadCandidates();
  router.init();
}

document.addEventListener("refresh-candidates", async () => {
  await appState.loadCandidates();
});

/*
  Eventlisteners
  --------------
*/
document.addEventListener("click", (e) => {
  const target = e.target;

  switch (true) {
    case dropdown.dropdownClick(e):
      break;

    case dropdown.slidedownClick(e):
      break;

    case sidebar.mobileClick(e):
      break;

    case sidebar.dropdownClick(e):
      break;

    case sidebar.click(e):
      break;

    case theme.click(e):
      break;

    case modal.click(e):
      break;

    case form.inputs["select-dropdown"].click(e):
      break;
  }
});

document.addEventListener("input", (e) => {
  form.inputs["select-dropdown"].handleSearch(e);
  form.inputs["date-input"].handleInput(e);
});

// Listen for the 'load' event to trigger the startup sequence
window.addEventListener("load", initialLoad);
window.addEventListener("resize", () => {
  sidebar.responsive();
});
