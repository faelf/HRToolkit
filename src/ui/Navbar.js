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
      <ul class="navbar-links">
        <li><button type="button" class="btn btn-nav" data-link="home">Home</button></li>
        <li><button type="button" class="btn btn-nav" data-link="maternity">Maternity</button></li>
        <li><button type="button" class="btn btn-nav" data-link="probation">Probation</button></li>
      </ul>
      <div class="navbar-actions">
        <button type="button" id="theme-toggle" class="btn btn-nav">Theme</button>
        <button type="button" id="nav-toggle" class="btn btn-nav mobile-only">☰</button>
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
    const navToggle = this.querySelector("#nav-toggle");
    const navLinks = this.querySelector(".navbar-links");

    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");

      // Update button text
      if (navLinks.classList.contains("active")) {
        navToggle.textContent = "✕";
      } else {
        navToggle.textContent = "☰";
      }
    });
  }
}

customElements.define("ui-navbar", Navbar);
