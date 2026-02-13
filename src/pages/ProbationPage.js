import { formatters } from "../utilities/formatters.js";

export const ProbationPage = {
  title: "HR Toolkit - Probation Calculator",
  html: /* html */ `
  <section class="cal-containers">
    <div id="probation-calculator">
      <div class="section-header">
        <h2>Calculator</h2>
      </div>
      <div class="section-body">
        <form id="probation-form">
          <div class="mb-3">
            <label for="start-date" class="form-label">Employment Start Date</label>
            <input id="start-date" type="date" required>
            <div class="input-helper">The date the employee started employment.</div>
          </div>
          <div class="form-btns mb-2">
            <button type="submit" class="btn green">Calculate</button>
            <button type="reset" class="btn yellow">Reset</button>
          </div>
        </form>
      </div>
    </div> <!-- Probation Calculator Ends -->

    <div id="probation-content">
      <div id="probation-results" class="mb-2">
        <div class="section-header">
          <h2>Results</h2>
        </div>
        <div class="section-body" id="results">
          <p>Your results will show here.</p>
        </div>
      </div>

      <div id="probation-guide">
        <div class="section-header">
          <h2>Probation Calculation Guide</h2>
        </div>
        <div class="section-body">
          <strong>6 Months</strong>
          <p>The calculator will display 6 months from the start dates, (e.g., Month 1, Month 2 ...)</p>

          <strong>End of Month Logic</strong>
          <p>If a start date is the 31st and the 6th month only has 30 days, the calculator snaps to the last day of that month.</p>

          <strong>Leap Years</strong>
          <p>February dates are automatically adjusted for leap years (e.g., Feb 28th vs Feb 29th).</p>
        </div>
      </div> <!-- Probation Guide Ends -->
    </div> <!-- Probation Content Ends -->
  </section>
  `,

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
        <table>
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
