function emptyContainer(text) {
  const container = document.createElement("div");
  container.className = "empty-state";
  container.innerHTML = /* html */ `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/>
      <path d="M14 2v5a1 1 0 0 0 1 1h5"/>
      <path d="M9 15h6"/>
      <path d="M12 18v-6"/>
    </svg>
    <p class="text-muted h3">${text}</p>
  `;
  return container;
}

function thead(columns) {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");

  for (const column of Object.keys(columns)) {
    const th = document.createElement("th");
    th.id = column;
    th.innerHTML = columns[column];
    tr.appendChild(th);
  }

  thead.appendChild(tr);
  return thead;
}

function tbody({ data, columns }) {
  const tbody = document.createElement("tbody");

  data.forEach((item) => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-id", item.id);
    tr.setAttribute("data-href", "/candidatedetails");

    for (const column of Object.keys(columns)) {
      const td = document.createElement("td");
      td.setAttribute("data-cell", columns[column]);
      td.innerHTML = item[column] ?? "";
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  });

  return tbody;
}

export function table(config) {
  const container = document.querySelector(config.container);
  container.innerHTML = "";

  if (config.tbody.length === 0) {
    container.appendChild(emptyContainer(config.emptyText));
  }
  
  if (config.tbody.length > 0) {
    const table = document.createElement("table");
    table.appendChild(thead(config.thead));
    table.appendChild(tbody({ data: config.tbody, columns: config.thead }));
    container.appendChild(table);
  }
}

function datathead(columns) {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");

  for (const column of Object.keys(columns)) {
    const th = document.createElement("th");
    th.id = column;
    th.innerHTML = /* html */ `
    <div class="d-flex space-between align-items-center">
      <span>${columns[column]}</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="m3 16 4 4 4-4"/>
        <path d="M7 20V4"/>
        <path d="m21 8-4-4-4 4"/>
        <path d="M17 4v16"/>
      </svg>
    </div>`;
    tr.appendChild(th);
  }

  thead.appendChild(tr);

  return thead;
}

export function datatable(config) {
  const container = document.querySelector(config.container);
  container.innerHTML = "";

  if (config.tbody.length === 0) {
    container.appendChild(emptyContainer(config.emptyText));
  }

  if (config.tbody.length > 0) {
    const table = document.createElement("table");
    table.className = "table-sortable";
    table.appendChild(datathead(config.thead));
    table.appendChild(tbody({ data: config.tbody, columns: config.thead }));
    container.appendChild(table);
  }
}