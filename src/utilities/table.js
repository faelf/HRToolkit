export const table = {
  thead(columns) {
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    for (const column of Object.keys(columns)) {
      const th = document.createElement("th");
      th.textContent = columns[column];
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
      container.innerHTML = "No Candidates";
    } else {
      const table = document.createElement("table");
      table.classList.add("top");
      table.appendChild(this.thead(config.thead));
      table.appendChild(this.tbody(config.tbody, config.thead));
      container.appendChild(table);
    }
  },
};
