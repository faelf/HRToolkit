export class Router {
  constructor(config) {
    const {
      contentArea,
      pageContent,
      landingPage = "home",
      baseHtmlPath = "src/html/",
      linkAttribute = "data-href",
      idAttribute = "data-id",
    } = config;

    this.container = document.querySelector(contentArea);
    this.contentArea = contentArea;
    this.pageContent = pageContent;
    this.landingPage = landingPage;
    this.baseHtmlPath = baseHtmlPath;
    this.linkAttribute = linkAttribute;
    this.idAttribute = idAttribute;

    // Support both the custom link attribute and standard href
    this.linkSelector = this.linkAttribute === "href" ? "[href]" : `[href], [${this.linkAttribute}]`;

    // Bind event handlers to maintain correct 'this' context
    this.handleClick = this.handleClick.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
  }
  updateAriaCurrent(activePageKey) {
    const links = document.querySelectorAll(this.linkSelector);
    const pageConfig = this.pageContent[activePageKey];
    const keyToMatch = pageConfig?.ariaCurrent || activePageKey;

    links.forEach((link) => {
      const val = link.getAttribute(this.linkAttribute) || link.getAttribute("href");
      const isMatch =
        val === keyToMatch || val === `/${keyToMatch}` || (keyToMatch === this.landingPage && val === "/");

      if (isMatch) {
        link.setAttribute("aria-current", "page");
      }

      if (!isMatch) {
        link.removeAttribute("aria-current");
      }
    });
  }
  async updateContent(pageKey, params = {}, addToHistory = true) {
    const content = this.pageContent[pageKey];
    if (!content || !this.container) return;

    let html;

    if (typeof content.html === "string" && content.html.endsWith(".html")) {
      const fullPath = this.baseHtmlPath + content.html;
      try {
        const response = await fetch(fullPath);
        if (!response.ok) throw new Error(`Could not find ${fullPath}`);
        html = await response.text();
      } catch (err) {
        console.error("Router Error:", err);
        html = `<section><p style="color:red;">Error loading page: ${err.message}</p></section>`;
      }
    } else {
      html = content.html;
    }

    this.container.innerHTML = html;

    if (typeof content.setup === "function") {
      await content.setup(params.pageId);
    }

    let url = pageKey === this.landingPage ? "/" : `/${pageKey}`;
    if (params.pageId != null) url += `/${params.pageId}`;

    if (addToHistory) {
      history.pushState({ pageKey, params }, content.title, url);
    }

    document.title = content.title;

    this.updateAriaCurrent(pageKey);
  }
  handleClick(event) {
    event.preventDefault();

    const link = event.target.closest(this.linkSelector);
    if (!link) return;

    const rawLink = link.getAttribute(this.linkAttribute) || link.getAttribute("href");
    if (!rawLink) return;

    let pageKey = rawLink.startsWith("/") ? rawLink.substring(1) : rawLink;
    if (pageKey === "") pageKey = this.landingPage;

    if (!this.pageContent[pageKey]) return;

    const pageId = link.getAttribute(this.idAttribute);

    document.dispatchEvent(
      new CustomEvent("navigate", {
        detail: { pageKey, pageId },
      }),
    );
  }
  handleNavigate(event) {
    this.updateContent(event.detail.pageKey, event.detail);
  }

  /**
   * Handle browser back/forward navigation (popstate).
   */
  handlePopState(event) {
    if (event && event.state) {
      this.updateContent(event.state.pageKey, event.state.params, false);
      return;
    }
    // Fallback for initial load or manual URL entry
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const pageKey = pathSegments[0] || this.landingPage;
    const params = {};

    if (pathSegments[1]) {
      params.pageId = pathSegments[1];
    }

    if (!params.pageId && window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      params.pageId = urlParams.get("id") ?? undefined;
    }

    this.updateContent(this.pageContent[pageKey] ? pageKey : this.landingPage, params, false);
  }

  /**
   * Initialise the router listeners.
   */
  init() {
    if (!this.container) {
      this.container = document.querySelector(this.contentArea);
    }

    document.addEventListener("click", this.handleClick);
    document.addEventListener("navigate", this.handleNavigate);
    window.addEventListener("popstate", this.handlePopState);

    this.handlePopState({ state: null });
  }
}
