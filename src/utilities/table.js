export const table = {
  _emptyContainer(text) {
    const container = document.createElement("div");
    container.className = "empty-state";
    container.innerHTML = /* html */ `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <path d="m15 9-6 6"/>
          <path d="m9 9 6 6"/>
        </svg>
        <p class="h1">${text}</p>
      `;
    return container;
  },
  thead(columns) {
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    for (const column of Object.keys(columns)) {
      const th = document.createElement("th");
      th.classList.add("th-sorting");
      th.id = column;
      th.innerHTML = /* html */ `
      <div class="sorting">
        <span>${columns[column]}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="m3 16 4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 20V4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="m21 8-4-4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17 4v16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>`;
      tr.appendChild(th);
    }

    thead.appendChild(tr);
    return thead;
  },
  tbody(data, columns) {
    const tbody = document.createElement("tbody");

    data.forEach((item) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-id", item.id);
      tr.classList.add("cursor-pointer");
      tr.setAttribute("href", "candidatedetails");

      // Create the rest of the columns based on the head configuration
      for (const column of Object.keys(columns)) {
        const td = document.createElement("td");
        td.setAttribute("data-cell", columns[column]);
        td.innerHTML = item[column] ?? "";
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    });

    return tbody;
  },
  render(config) {
    const container = document.querySelector(config.container);
    container.innerHTML = "";

    if (config.tbody.length === 0) {
      container.appendChild(this._emptyContainer(config.emptyText));
    } else {
      const table = document.createElement("table");
      table.classList.add("top");
      table.appendChild(this.thead(config.thead));
      table.appendChild(this.tbody(config.tbody, config.thead));
      container.appendChild(table);
    }
  },
};
