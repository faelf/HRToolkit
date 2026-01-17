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
        <li><button type="button" class="btn btn-nav" data-link="/">Home</button></li>
        <li><button type="button" class="btn btn-nav" data-link="/maternity">Maternity</button></li>
        <li><button type="button" class="btn btn-nav" data-link="/probation">Probation</button></li>
      </ul>
      <button type="button" id="theme-toggle" class="btn btn-nav"></button>
    </nav>
    `;
  }

  attachEventListeners() {
    this.querySelector("#theme-toggle").addEventListener("click", () => {
      console.log("Theme toggle clicked!");
      toggleTheme();
    });
  }
}

customElements.define("ui-navbar", Navbar);
