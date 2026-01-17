/**
 * Get the current theme
 * @returns {string} "light" or "dark"
 */
export function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

/**
 * Set the theme
 * @param {string} theme - "light" or "dark"
 */
export function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateThemeIcon(theme);
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme() {
  const currentTheme = getTheme();
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
}

/**
 * Initialise theme from saved preference or system preference
 */
export function initTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }
}

/**
 * Update the theme toggle button icon
 * @param {string} theme - Current theme
 */
function updateThemeIcon(theme) {
  const toggleButton = document.querySelector("#theme-toggle");
  if (toggleButton) {
    toggleButton.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
  }
}
