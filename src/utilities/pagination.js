export const pagination = {
  default: {
    itemsPerPage: 10,
  },

  _createPageLink(options) {
    const { text, pageNumber, isDisabled, isActive, onPageChange, currentPage } = options;
    const btn = document.createElement("button");
    btn.classList.add("pagination-btn");

    if (isDisabled) btn.disabled = true;
    if (isActive) btn.classList.add("active");

    if (text === "Previous") {
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="m15 18-6-6 6-6" />
        </svg>
      `;
    } else if (text === "Next") {
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="m9 18 6-6-6-6" />
        </svg>
      `;
    } else {
      btn.textContent = text;
    }

    btn.addEventListener("click", (event) => {
      event.preventDefault();
      if (!isDisabled && pageNumber !== currentPage) {
        onPageChange(pageNumber);
      }
    });

    return btn;
  },
  getLastPage(lastPage) {
    const itemsPerPage = lastPage.itemsPerPage || this.default.itemsPerPage;
    const page = Math.ceil(lastPage.totalItems / itemsPerPage) || 1;
    return page;
  },
  paginateItems(options) {
    const { items, currentPage = 1, itemsPerPage = this.default.itemsPerPage } = options;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  },
  createPageHandler(updateState, render) {
    return (newPage) => {
      updateState(newPage);
      render();
    };
  },
  render(options) {
    const {
      ContainerID,
      totalItems,
      itemsPerPage = this.default.itemsPerPage,
      currentPage = 1,
      onPageChange,
    } = options;

    const container = document.querySelector(ContainerID);
    if (!container) {
      return;
    }

    container.innerHTML = "";

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
      return;
    }

    // Previous Button
    container.appendChild(
      this._createPageLink({
        text: "Previous",
        pageNumber: currentPage - 1,
        isDisabled: currentPage === 1,
        isActive: false,
        onPageChange,
        currentPage,
      }),
    );

    // Smart Pagination Logic
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3) end = 4;
      if (currentPage >= totalPages - 2) start = totalPages - 3;
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    pages.forEach((p) => {
      container.appendChild(
        this._createPageLink({
          text: p,
          pageNumber: p === "..." ? -1 : p,
          isDisabled: p === "...",
          isActive: p === currentPage,
          onPageChange,
          currentPage,
        }),
      );
    });

    // Next Button
    container.appendChild(
      this._createPageLink({
        text: "Next",
        pageNumber: currentPage + 1,
        isDisabled: currentPage === totalPages,
        isActive: false,
        onPageChange,
        currentPage,
      }),
    );
  },
};
