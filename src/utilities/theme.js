/**
 * Get the user's saved theme preference from localStorage or default to "system"
 * @returns {string} "light", "dark", or "system"
 */
export function getSavedTheme() {
  return localStorage.getItem("theme") || "system";
}

/**
 * Resolves the actual theme to apply based on preference
 * @param {string} preference - "light", "dark", or "system"
 * @returns {string} "light" or "dark"
 */
export function userPreference(preference) {
  if (preference === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return preference;
}

/**
 * Sets the theme state across the application
 * @param {string} preference - "light", "dark", or "system"
 */
export function setTheme(preference) {
  const theme = userPreference(preference);
  
  // 1. Apply the actual active theme to the document root for CSS styling
  document.documentElement.setAttribute("data-theme", theme);
  
  // 2. Persist the absolute preference to localStorage
  localStorage.setItem("theme", preference);
  
  // 3. Keep the radio button form UI synced with this preference
  syncRadioFormUI(preference);
}

/**
 * Synchronises the state of the radio buttons inside the form matching the preference
 * @param {string} preference - "light", "dark", or "system"
 */
export function syncRadioFormUI(preference) {
  const themeForm = document.querySelector("#theme-form");
  if (!themeForm) return;

  const radioToCheck = themeForm.querySelector(`input[value="${preference}"]`);
  if (radioToCheck) {
    radioToCheck.checked = true;
  }
}

/**
 * Initialises the theme immediately on load and tracks live OS changes
 */
export function init() {
  const currentPreference = getSavedTheme();
  setTheme(currentPreference);

  // Listen for live system changes if the user is using the "system" preference
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getSavedTheme() === "system") {
      setTheme("system");
    }
  });
}

/**
 * Global click interceptor designed for the app.js central switch block
 * @param {Event} event - The native browser click event
 * @returns {boolean} True if a theme radio was handled, false otherwise
 */
export function click(event) {
  const btn = event.target.closest('#theme-form .theme-nav-btn');
  
  if (!btn) return false;

  const radio = btn.querySelector('input[type="radio"]');
  if (radio) {
    radio.checked = true;
    setTheme(radio.value);
    return true;
  }

  return false;
}