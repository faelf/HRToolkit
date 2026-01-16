class Navbar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
    <nav class="navbar">
      <div class="navbar-brand">HR Toolkit</div>
      <ul class="navbar-links">
        <li><button type="button" class="nav-link active" data-link="/">Home</button></li>
        <li><button type="button" class="nav-link" data-link="/maternity">Maternity</button></li>
        <li><button type="button" class="nav-link" data-link="/probation">Probation</button></li>
      </ul>
      <button type="button" id="theme-toggle" class="theme-toggle">🌙</button>
    </nav>
    `;
  }
}

customElements.define("ui-navbar", Navbar);
