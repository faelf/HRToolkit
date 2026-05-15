export const table = {
  thead(columns) {
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    for (const column of Object.keys(columns)) {
      const th = document.createElement("th");
      th.textContent = columns[column];
      tr.appendChild(th);
    }

    // Header for the "View" link column
    const thDetails = document.createElement("th");
    thDetails.textContent = "Details";
    tr.appendChild(thDetails);

    thead.appendChild(tr);
    return thead;
  },
  tbody(data, columns) {
    const tbody = document.createElement("tbody");

    data.forEach((item) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-id", item.id);

      // Create the rest of the columns based on the head configuration
      for (const column of Object.keys(columns)) {
        const td = document.createElement("td");
        td.setAttribute("data-cell", columns[column]);
        td.innerHTML = item[column] ?? "";
        tr.appendChild(td);
      }

      // Create the view link
      const tdDetails = document.createElement("td");
      tdDetails.setAttribute("data-cell", "Details");
      const aDetails = document.createElement("a");
      aDetails.classList.add("btn-sm", "blue");
      aDetails.href = "candidatedetails";
      aDetails.setAttribute("data-active-group", "onboarding");
      aDetails.setAttribute("data-id", item.id);
      aDetails.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
      <circle cx="12" cy="12" r="3"/>
      </svg>View
      `;
      tdDetails.appendChild(aDetails);
      tr.appendChild(tdDetails);

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
