import ProbationHTML from "../html/probation.html?raw";
import { formatters } from "../utilities/formatters.js";

export const ProbationPage = {
  title: "HR Toolkit - Probation Calculator",
  html: ProbationHTML,
  setup() {
    const probationForm = document.getElementById("probation-form");

    function addMonths(origDate, months) {
      const newDate = new Date(origDate.getTime());
      const targetMonth = newDate.getMonth() + months;
      newDate.setMonth(targetMonth);

      if (newDate.getMonth() !== ((targetMonth % 12) + 12) % 12) {
        newDate.setDate(0);
      }
      return newDate;
    }

    probationForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = document.getElementById("start-date").value;
      if (!input) return;

      const [y, m, day] = input.split("-").map(Number);
      const startDate = new Date(y, m - 1, day);

      let milestonesHtml = "";
      for (let i = 1; i <= 6; i++) {
        const milestoneDate = addMonths(startDate, i);
        milestonesHtml += /* html */ `
        <tr>
          <td data-cell="Monthly Milestone">Month ${i}</td>
          <td data-cell="Date">
            ${formatters.longDate(milestoneDate)}
          </td>
        </tr>`;
      }

      const resultDiv = document.getElementById("results");

      resultDiv.innerHTML = /* html */ `
        <table class="top">
          <thead>
            <tr>
              <th>Monthly Milestone</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${milestonesHtml}
          </tbody>
        </table>
      `;
    });
  },
};
