import { CandidateScheme } from "../data/candidate.js";

const getPreferredOrder = (obj) => {
  const order = [];
  for (const key in obj) {
    const value = obj[key];
    if (value !== null && typeof value === "object") {
      if (typeof value.id === "string") {
        order.push(value.id);
      } else {
        order.push(...getPreferredOrder(value));
      }
    }
  }
  return order;
};

export const csv = {
  download(data, filenamePrefix = "data") {
    if (!data || data.length === 0) {
      alert("No data to download.");
      return;
    }

    const allKeys = new Set();
    data.forEach((item) => Object.keys(item).forEach((k) => allKeys.add(k)));

    allKeys.delete("id");
    allKeys.delete("date-created");

    const preferredOrder = getPreferredOrder(CandidateScheme);
    const headers = preferredOrder.filter((k) => allKeys.has(k));
    const remaining = Array.from(allKeys).filter((k) => !preferredOrder.includes(k));
    headers.push(...remaining);

    const csvRows = [headers.join(",")];
    for (const item of data) {
      const values = headers.map((header) => {
        let val = item[header];
        if (val === null || val === undefined) val = "";
        val = String(val).replace(/"/g, '""');

        // Force Excel to treat numbers with leading zeros as text
        if (/^0\d+$/.test(val)) {
          return `="${val}"`;
        }

        if (val.includes(",") || val.includes("\n") || val.includes('"')) {
          return `"${val}"`;
        }
        return val;
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `${filenamePrefix}_${new Date().toISOString().split("T")[0]}.csv`);
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
};
