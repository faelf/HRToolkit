/**
 * Router class for handling SPA navigation and page updates.
 * Manages click delegation, history navigation, and page content updates.
 * @example
 * const router = new Router({
 *    contentArea: "#main-content",
 *    pageContent: pageContent: {
 *                    "home": {
 *                        title: "Home - Welcome",
 *                        html: "home.html",
 *                        setup(): void,
 *                    };
 *    landingPage = "home",
 *    baseHtmlPath = "src/html/",
 *    linkAttribute: "href",
 *    idAttribute: "data-doc-id",
 * });
 * router.init();
 */
export class Router {
  /**
   * Creates a new Router instance.
   * @param {Object} config - The configuration object.
   * @param {string} config.contentArea - The CSS selector for the area where pages will be rendered (e.g., "#main-content").
   * @param {Object} config.pageContent - The page definitions. Each key is a route name, and the value is an object with `title`, `html`, and optional `setup` method.
   * @param {string} [config.landingPage="home"] - Initial page to load.
   * @param {string} [config.baseHtmlPath="src/html/"] - Path to external HTML files.
   * @param {string} [config.linkAttribute="href"] - The attribute used to identify nav links.
   * @param {string} [config.idAttribute="data-doc-id"] - The attribute used for document/page IDs.
   */
  constructor(config) {
    const {
      contentArea,
      pageContent,
      landingPage = "home",
      baseHtmlPath = "src/html/",
      linkAttribute = "href",
      idAttribute = "data-doc-id",
    } = config;

    this.container = document.querySelector(contentArea);
    this.contentArea = contentArea;
    this.pageContent = pageContent;
    this.landingPage = landingPage;
    this.baseHtmlPath = baseHtmlPath;
    this.linkAttribute = linkAttribute;
    this.idAttribute = idAttribute;

    // Bind event handlers to maintain correct 'this' context
    this.handleClick = this.handleClick.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
  }

  /**
   * Syncs the UI by adding the 'active' class to matching links.
   * Uses the configured linkAttribute to identify navigation elements.
   * @param {string} activePageKey
   */
  updateActiveLinks(activePageKey) {
    const selector = `[${this.linkAttribute}]`;
    const links = document.querySelectorAll(selector);

    const activeLinkElement = Array.from(links).find((l) => {
      const val = l.getAttribute(this.linkAttribute);
      return val === activePageKey || val === `#${activePageKey}`;
    });

    const activeGroup = activeLinkElement?.getAttribute("data-active-group");

    links.forEach((link) => {
      const val = link.getAttribute(this.linkAttribute);
      const isExactMatch = val === activePageKey || val === `#${activePageKey}`;
      const isGroupMatch =
        activeGroup && link.getAttribute("data-active-group") === activeGroup;

      if (isExactMatch || isGroupMatch) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  /**
   * Update the main content area with a page.
   * Supports both raw HTML strings and external .html file paths.
   * @param {string} pageKey - The key of the page to display.
   * @param {Object} [params={}] - Optional parameters (e.g., { pageId: 101 }).
   * @param {boolean} [addToHistory=true] - Whether to push to browser history.
   * @returns {Promise<void>}
   */
  async updateMainContent(pageKey, params = {}, addToHistory = true) {
    const content = this.pageContent[pageKey];
    if (!content || !this.container) return;

    let html;

    // If the html property points to a file, fetch it.
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
      // Otherwise, use the static string
      html = content.html;
    }

    // Inject the HTML into the page
    this.container.innerHTML = html;

    // Run setup logic if provided
    if (typeof content.setup === "function") {
      await content.setup(params.pageId);
    }

    // Update Browser History and URL
    let url = `#${pageKey}`;
    if (params.pageId != null) url += `?id=${params.pageId}`;

    if (addToHistory) {
      history.pushState({ pageKey, params }, content.title, url);
    }

    document.title = content.title;

    // Visual feedback for navigation
    this.updateActiveLinks(pageKey);
  }

  /**
   * Handle clicks using event delegation on elements with the configured linkAttribute.
   * @param {MouseEvent} event
   */
  handleClick(event) {
    const selector = `[${this.linkAttribute}]`;
    const link = event.target.closest(selector);
    if (!link) return;

    // Only prevent default if it's an internal hash link or matches a pageKey
    const rawLink = link.getAttribute(this.linkAttribute);
    if (rawLink && (rawLink.startsWith("#") || this.pageContent[rawLink])) {
      event.preventDefault();

      const pageKey = rawLink.replace("#", "");
      const pageId = link.getAttribute(this.idAttribute);

      document.dispatchEvent(
        new CustomEvent("navigate", {
          detail: { pageKey, pageId },
        }),
      );
    }
  }

  /**
   * Handle custom 'navigate' events dispatched from handleClick or other scripts.
   */
  handleNavigate(event) {
    this.updateMainContent(event.detail.pageKey, event.detail);
  }

  /**
   * Handle browser back/forward navigation (popstate).
   */
  handlePopState(event) {
    if (event.state) {
      this.updateMainContent(event.state.pageKey, event.state.params, false);
    } else {
      // Fallback for initial load or manual URL entry
      const hash = window.location.hash.substring(1);
      const [pageKey, query] = hash.split("?");
      const params = {};
      if (query) {
        const urlParams = new URLSearchParams(query);
        params.pageId = urlParams.get("id") ?? undefined;
      }
      this.updateMainContent(pageKey || this.landingPage, params, false);
    }
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

    const hash = window.location.hash.substring(1);
    if (hash) {
      this.handlePopState({ state: null });
    } else {
      this.updateMainContent(this.landingPage, {}, false);
    }
  }
}
