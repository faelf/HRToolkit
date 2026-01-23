import { toggleTheme } from "../utilities/theme.js";

class Navbar extends HTMLElement {
  render() {
    this.innerHTML = /* html */ `
    <nav class="navbar">
      <div class="navbar-container">

        <div class="navbar-brand">HR Toolkit</div>

        <div class="navbar-links" data-dropdown-target="nav-menu">
          <button type="button" class="nav-btn" data-link="home">Home</button>
          <button type="button" class="nav-btn" data-link="maternity">Maternity</button>
          <button type="button" class="nav-btn" data-link="probation">Probation</button>
        </div>
          
        <div class="navbar-actions">
          <button type="button" class="nav-btn" id="theme-toggle">
            <!-- Set in theme.js -->
          </button>
          
          <button type="button" class="nav-btn mobile-only" id="nav-toggle" data-dropdown="nav-menu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="nav-icon">
              <path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>
            </svg>
            <span>Menu</span>
          </button>
        </div>

      </div> <!-- Navbar Container Ends -->
    </nav>
    `;
  }

  attachEventListeners() {
    // Theme toggler
    this.querySelector("#theme-toggle").addEventListener("click", toggleTheme);

    // Mobile menu toggle
    const navToggle = this.querySelector("[data-dropdown='nav-menu']");
    const navLinks = this.querySelector("[data-dropdown-target='nav-menu']");

    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }
}

customElements.define("ui-navbar", Navbar);
