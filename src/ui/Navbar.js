import { toggleTheme } from "../utilities/theme.js";

class Navbar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.innerHTML = /* html */ `
    <nav class="navbar">
      <div class="navbar-brand">HR Toolkit</div>
      <ul class="navbar-links" data-dropdown-target="nav-menu">
        <li><button type="button" class="btn btn-nav" data-link="home">Home</button></li>
        <li><button type="button" class="btn btn-nav" data-link="maternity">Maternity</button></li>
        <li><button type="button" class="btn btn-nav" data-link="probation">Probation</button></li>
      </ul>
      <div class="navbar-actions">
        <button type="button" id="theme-toggle" class="btn btn-nav">Theme</button>
        <button type="button" id="nav-toggle" class="btn btn-nav mobile-only" data-dropdown="nav-menu">☰</button>
      </div>
    </nav>
    `;
  }

  attachEventListeners() {
    // Theme toggler
    this.querySelector("#theme-toggle").addEventListener("click", () => {
      toggleTheme();
    });

    // Mobile menu toggle
    const navToggle = this.querySelector("[data-dropdown='nav-menu']");
    const navLinks = this.querySelector("[data-dropdown-target='nav-menu']");

    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");

      // Update button text
      if (navLinks.classList.contains("show")) {
        navToggle.textContent = "✕";
      } else {
        navToggle.textContent = "☰";
      }
    });
  }
}

customElements.define("ui-navbar", Navbar);
