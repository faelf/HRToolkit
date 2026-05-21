class Navbar extends HTMLElement {
  render() {
    this.innerHTML = /* html */ `
    <nav class="sidebar-nav" aria-label="Main navigation bar">
      <a class="nav-btn" href="home">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
        <span>Home</span>
      </a>
      <a class="nav-btn" href="onboarding" data-active-group="onboarding">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M15 13a3 3 0 1 0-6 0"/>
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
          <circle cx="12" cy="8" r="2"/>
        </svg>
        <span>Onboarding</span>
      </a>
      <a class="nav-btn" href="maternity">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/>
          <path d="M15 12h.01"/>
          <path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>
          <path d="M9 12h.01"/>
        </svg>
        <span>Maternity</span>
      </a>
      <a class="nav-btn" href="probation">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M16 14v2.2l1.6 1"/><path d="M16 2v4"/>
        <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/>
        <path d="M3 10h5"/><path d="M8 2v4"/>
        <circle cx="16" cy="16" r="6"/>
        </svg>
        <span>Probation</span>
      </a>
      <a class="nav-btn" href="annualLeave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4"/>
          <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3"/>
          <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35"/>
          <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14"/>
        </svg>
        <span>Annual Leave</span>
      </a>
      <a class="nav-btn" href="salary">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M10 16V9.5a1 1 0 0 1 5 0"/>
          <path d="M8 12h4"/>
          <path d="M8 16h7"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>
        <span>Salary</span>
      </a>
      <button type="button" class="nav-btn mt-auto" id="theme-toggle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z"/>
          <path d="M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7"/>
          <path d="M 7 17h.01"/>
          <path d="m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8"/>
        </svg>
        <span>Theme</span>
      </button>
    </nav>
    `;
  }

  attachEventListeners() {
    const nav = document.querySelector(".sidebar-nav");
    document.querySelector(".sidebar-nav").addEventListener("mouseenter", () => {
      nav.classList.add("sidebar-open");
    });

    document.querySelector(".sidebar-nav").addEventListener("mouseleave", () => {
      nav.classList.remove("sidebar-open");
    });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }
}

customElements.define("ui-navbar", Navbar);
