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
    toggleButton.innerHTML =
      theme === "dark"
        ? `<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="nav-icon">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg></span><span>Light</span>`
        : `<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="nav-icon">
          <path d="M18 5h4" />
          <path d="M20 3v4" />
          <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
        </svg></span><span>Dark<span>`;
  }
}
