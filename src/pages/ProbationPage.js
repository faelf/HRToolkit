import { formatters } from "../utilities/formatters.js";

export const ProbationPage = {
  title: "HR Toolkit - Probation Calculator",
  html: /* html */ `
  <section class="cal-containers">
    <div id="probation-calculator" class="card">
      <div class="card-header">
        <h2>Calculator</h2>
      </div>
      <div class="card-body">
        <form id="calcForm">
          <div class="mb-3">
            <label for="startDate" class="form-label">Start date</label>
            <input id="startDate" type="date" class="form-control" required>
            <div class="input-helper">The date the employee started employment.</div>
          </div>
          <div class="mb-2">
          <button id="calcBtn" type="submit" class="btn btn-success">Calculate</button>
          <button id="resetBtn" type="reset" class="btn btn-warning">Reset</button>
          </div>
        </form>
      </div>
    </div> <!-- Probation Calculator Ends -->

    <div id="probation-content">
      <div id="probation-results" class="card mb-2">
        <div class="card-header">
          <h2>Results</h2>
        </div>
        <div id="results">
          <div class="card-body">
            <p>Your results will show here.</p>
          </div>
        </div>
      </div>

      <div id="probation-guide" class="card">
        <div class="card-header">
          <h2>Probation Month Calculation Guide</h2>
        </div>
        <div class="card-body">
          <strong>6 Month</strong>
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
    const probationForm = document.getElementById("calcForm");

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
      const input = document.getElementById("startDate").value;
      if (!input) return;

      const [y, m, day] = input.split("-").map(Number);
      const startDate = new Date(y, m - 1, day);

      let milestonesHtml = "";
      for (let i = 1; i <= 6; i++) {
        const milestoneDate = addMonths(startDate, i);
        milestonesHtml += /* html */ `
        <tr>
          <td>Month ${i}</td>
          <td>${formatters.longDate(milestoneDate)}</td>
        </tr>`;
      }

      const resultDiv = document.getElementById("results");

      resultDiv.innerHTML = /* html */ `
        <table class="table-rounded-bottom">
          <thead>
            <tr><th colspan="2">Monthly Milestones</th></tr>
          </thead>
          <tbody>
          <tr>
            <td>Employment Commenced:</td>
            <td>${formatters.longDate(startDate)}</td>
          </tr>
            ${milestonesHtml}
          </tbody>
        </table>
      `;
    });
  },
};
