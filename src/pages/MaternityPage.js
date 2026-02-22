import { formatters } from "../utilities/formatters.js";

export const MaternityPage = {
  title: "HR Toolkit - Maternity Calculator",
  html: /* html */ `
  <section class="cal-containers">
    <div id="maternity-calculator" class="">
      <div class="section-header">
        <h2>Calculator</h2>
      </div>
      <div class="section-body">
        <form id="maternity-form">

          <div class="mb-3">
            <label for="leave-type-input" class="form-label">Select leave type</label>
            <select id="leave-type-input" name="leaveType" aria-describedby="leave-type-helper" disabled>
              <option value="" disabled selected>Select an option</option>
              <option value="smp">Statutory Maternity Pay</option>
              <option value="omp">Occupational Maternity Pay</option>
            </select>
            <div id="leave-type-helper" class="input-helper">
              Select the type of leave you want to calculate.
            </div>
          </div>

          <div class="mb-3">
            <label for="start-date-input" class="form-label">Employment Start Date</label>
            <input type="date" id="start-date-input" required>
            <div id="start-date-input-helper" class="input-helper">
              The date the employee started employment.
            </div>
          </div>

          <div class="mb-3">
            <label for="baby-due-date-input" class="form-label">Baby Due Date</label>
            <input type="date" id="baby-due-date-input" required>
            <div id="baby-due-date-input-helper" class="input-helper">
              The expected due date of the baby, as shown on the MATB1 certificate.
            </div>
          </div>

          <div class="mb-3">
            <label for="maternity-start-date-input" class="form-label">Maternity Start Date</label>
            <input type="date" id="maternity-start-date-input">
            <div id="maternity-start-date-input-helper" class="input-helper">
              The date the employee wants to start the maternity leave.
            </div>
          </div>

          <div class="form-btns mb-2">
            <button type="submit" class="btn green">Calculate</button>
            <button type="reset" class="btn yellow">Reset</button>
          </div>

        </form>
      </div>
    </div> <!-- Maternity Calculator Card Ends -->

    <div id="maternity-content">
      <div id="maternity-results" class="mb-2">
        <div class="section-header">
          <h2>Results</h2>
        </div>
        <div id="results" class="section-body">
          <p>Your results will show here.</p>
        </div>
      </div>

      <div id="maternity-guide" class="mb-2">
        <div class="section-header">
          <h2>Maternity Calculation Guide</h2>
        </div>
        <div class="section-body">
          <p>This guide explains how the Maternity Calculator works and what each date means:</p>
          <ul>
            <li><strong>Maternity Start Date:</strong> If you leave this field blank, the calculator will automatically use the <strong>earliest start date</strong>, which is 11 weeks before the Expected Week of Childbirth (EWC). You can override this by selecting a preferred start date.</li>

            <li><strong>Eligibility:</strong> The system checks if the employee has at least <strong>26 weeks of continuous service</strong> by the <strong>Qualifying Week</strong>. There are two possible outcomes:</li>

            <ul>
              <li><strong>Eligible:</strong> The calculator displays a full schedule of maternity pay, including:</li>
              <ul>
                <li><strong>Full Pay:</strong> 6 weeks at 100% (company-enhanced)</li>
                <li><strong>Half Pay:</strong> 6 weeks at 50% (or SMP if higher)</li>
                <li><strong>Statutory Maternity Pay (SMP):</strong> 27 weeks</li>
                <li><strong>Unpaid Leave:</strong> Remaining weeks to complete 52-week entitlement</li>
              </ul>
              <li><strong>Not Eligible:</strong> The employee is entitled to the <strong>52-week leave</strong> but all leave is unpaid.</li>
            </ul>
            
            <li><strong>Expected Week of Childbirth (EWC):</strong> The calculator determines the week of the baby&apos;s expected birth, starting from Sunday to Saturday. This is used to calculate qualifying week and earliest maternity start date.</li>

            <li>
              <strong>Qualifying Week:</strong>
              The week, 15 weeks before the EWC, that determines if the employee meets the service requirement for paid maternity leave.
            </li>
          </ul>

          <p>Once the calculation is complete, the output will display:</p>

          <ul>
            <li><strong>Employment Start Date</strong></li>
            <li><strong>Maternity Leave Start Date</strong></li>
            <li><strong>EWC Start and End</strong></li>
            <li><strong>Qualifying Week Start and End</strong></li>
            <li><strong>Pay Periods</strong> with start and end dates for Full Pay, Half Pay, SMP, and Unpaid Leave</li>
          </ul>

          <div class="info-box red">
            <div class="info-box-header">Important Note:</div>
            <div class="info-box-body">
              <p>This tool calculates eligibility and leave dates based on service length and dates only. It does <strong>not</strong> check salary. To qualify for statutory maternity pay (SMP), the employee must earn at least the minimum qualifying amount, as defined on the GOV.UK page.</p>
            <p><strong>Always verify eligibility with official guidance and your internal HR policies.</strong></p>
            </div>
          </div>
          
        </div>
      </div> <!-- Maternity Guide Ends -->
      <div id="maternity-references" class="mb-2">
        <div class="section-header">
          <h2>References</h2>
        </div>
        <div class="section-body">
          <p>The calculations and logic in this tool were based on the following sources:</p>
          <ul>
            <li><strong>GOV.UK:</strong><a href="https://www.gov.uk/government/publications/maternity-benefits-technical-guidance/maternity-benefits-technical-guidance" target="_blank" rel="noopener noreferrer"> Maternity pay and leave guidance</a></li>
            <li><strong>Private Company Policy:</strong> Internal maternity leave policy for HR purposes.</li>
          </ul>
        </div>
      </div> <!-- Maternity References Ends -->
    </div> <!-- Maternity Content Ends -->
  </section>
  `,

  setup() {
    formatters.setMinMaxDates();
    // DOM Elements
    const maternityForm = document.getElementById("maternity-form");
    const startDateInput = document.getElementById("start-date-input");
    const babyDueInput = document.getElementById("baby-due-date-input");
    const maternityStartInput = document.getElementById("maternity-start-date-input");
    const resultsContainer = document.getElementById("results");

    // Policy Constants
    const duration = {
      fullPay: 6,
      halfPay: 6,
      smp: 27,
      unpaid: 13,
      total: 52,
    };

    // Weeks required for pay eligibility, this can be updated
    const serviceRequirements = { smpWeeks: 26, ompWeeks: 26 };

    const offset = { qualifying: 15, earliestStart: 11 };

    /**
     * Returns the Sunday of the week for a given date.
     * @param {Date} date - The input date.
     * @returns {Date} The Sunday of that week.
     */
    function getWeekStart(date) {
      const sunday = new Date(date);
      sunday.setHours(0, 0, 0, 0);
      sunday.setDate(sunday.getDate() - sunday.getDay());
      return sunday;
    }

    /**
     * Returns the Saturday of the week for a given date.
     * @param {Date} date - The input date.
     * @returns {Date} The Saturday date.
     */
    function getWeekEnd(date) {
      const saturday = new Date(date);
      saturday.setHours(0, 0, 0, 0);
      saturday.setDate(date.getDate() - date.getDay() + 6);
      return saturday;
    }

    /**
     * Adds a number of weeks to a date and returns the start and end date of that period.
     * @param {Date} startDate - The start date.
     * @param {number} weeks - Number of weeks to add.
     * @returns {{start: Date, end: Date}} Object containing start and end dates.
     */
    function addWeeksInclusive(startDate, weeks) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + weeks * 7 - 1);
      return { start, end };
    }

    /**
     * Formats a date range object into strings.
     * @param {{start: Date, end: Date}|null} range - The date range object.
     * @returns {{start: string, end: string}|null} Formatted date strings or null.
     */
    function formatRange(range) {
      if (!range) return null;

      return {
        start: formatters.longDate(range.start),
        end: formatters.longDate(range.end),
      };
    }

    /**
     * Checks if the employee is eligible for SMP.
     * @param {Date} employmentStart - Employment start date.
     * @param {Date} qualifyingEnd - End of the qualifying week.
     * @returns {boolean} True if eligible.
     */
    function hasSmpEligibility(employmentStart, qualifyingEnd) {
      const weeksWorked = Math.floor((qualifyingEnd - employmentStart) / (7 * 24 * 60 * 60 * 1000));
      return weeksWorked >= serviceRequirements.smpWeeks;
    }

    /**
     * Checks if the employee is eligible for OMP.
     * @param {Date} employmentStart - Employment start date.
     * @param {Date} qualifyingEnd - End of the qualifying week.
     * @returns {boolean} True if eligible.
     */
    function hasOmpEligibility(employmentStart, qualifyingEnd) {
      const weeksWorked = Math.floor((qualifyingEnd - employmentStart) / (7 * 24 * 60 * 60 * 1000));
      return weeksWorked >= serviceRequirements.ompWeeks;
    }

    /**
     * Calculates the start and end dates for different pay periods.
     * @param {Date} maternityStart - The start date of maternity leave.
     * @param {{smp: boolean, omp: boolean}} eligibility - Eligibility status.
     * @returns {Object} Object containing pay period ranges.
     */
    function getMaternityPayPeriods(maternityStart, eligibility) {
      const start = new Date(maternityStart);

      let fullPay = null;
      let halfPay = null;
      let smpFirstSixWeeks = null;
      let smp = null;
      let unpaid = null;

      if (!eligibility.smp) {
        unpaid = addWeeksInclusive(start, duration.total);
      }

      if (eligibility.smp && !eligibility.omp) {
        // Eligible for SMP only
        smpFirstSixWeeks = addWeeksInclusive(start, 6); // weeks 1-6 at 90%
        smp = addWeeksInclusive(
          new Date(smpFirstSixWeeks.end).setDate(smpFirstSixWeeks.end.getDate() + 1),
          33, // remaining SMP weeks
        );
        const unpaidStart = new Date(smp.end);
        unpaidStart.setDate(unpaidStart.getDate() + 1);
        unpaid = addWeeksInclusive(unpaidStart, duration.unpaid);
      }

      if (eligibility.omp) {
        fullPay = addWeeksInclusive(start, duration.fullPay);

        const halfPayStart = new Date(fullPay.end);
        halfPayStart.setDate(halfPayStart.getDate() + 1);
        halfPay = addWeeksInclusive(halfPayStart, duration.halfPay);

        const smpStart = new Date(halfPay.end);
        smpStart.setDate(smpStart.getDate() + 1);
        smp = addWeeksInclusive(smpStart, duration.smp);

        const unpaidStart = new Date(smp.end);
        unpaidStart.setDate(unpaidStart.getDate() + 1);
        unpaid = addWeeksInclusive(unpaidStart, duration.unpaid);
      }

      return { fullPay, halfPay, smpFirstSixWeeks, smp, unpaid };
    }

    /**
     * Main calculation function to determine dates and eligibility.
     * @returns {Object} The calculation results.
     */
    function calculateMaternityDetails() {
      const empStart = new Date(startDateInput.value);
      const babyDue = new Date(babyDueInput.value);

      const ewcStart = getWeekStart(babyDue);
      const ewcEnd = getWeekEnd(babyDue);

      const qualifyingStart = new Date(ewcStart);
      qualifyingStart.setDate(ewcStart.getDate() - offset.qualifying * 7);
      const qualifyingEnd = getWeekEnd(qualifyingStart);

      let maternityStart;
      if (maternityStartInput.value) {
        // If the user entered a maternity start date, use that
        maternityStart = new Date(maternityStartInput.value);
      } else {
        // Otherwise, use the earliest legal start date (11 weeks before EWC)
        maternityStart = new Date(ewcStart);
        maternityStart.setDate(ewcStart.getDate() - offset.earliestStart * 7);
      }

      // Check eligibility
      const smpEligible = hasSmpEligibility(empStart, qualifyingEnd);
      let ompEligible;

      if (smpEligible) {
        // Only check OMP eligibility if the employee is eligible for SMP
        ompEligible = hasOmpEligibility(empStart, maternityStart);
      } else {
        // If not eligible for SMP, then not eligible for OMP either
        ompEligible = false;
      }

      const payPeriods = getMaternityPayPeriods(maternityStart, {
        smp: smpEligible,
        omp: ompEligible,
      });

      return {
        employmentStartDate: formatters.longDate(empStart),
        eligibility: { smp: smpEligible, omp: ompEligible },
        maternityLeaveStart: formatters.longDate(maternityStart),
        ewc: formatRange({ start: ewcStart, end: ewcEnd }),
        qualifyingWeek: formatRange({
          start: qualifyingStart,
          end: qualifyingEnd,
        }),
        payPeriods: {
          fullPay: formatRange(payPeriods.fullPay),
          halfPay: formatRange(payPeriods.halfPay),
          smpFirstSixWeeks: formatRange(payPeriods.smpFirstSixWeeks),
          smp: formatRange(payPeriods.smp),
          unpaid: formatRange(payPeriods.unpaid),
        },
      };
    }

    /**
     * Generates the HTML narrative based on calculation results.
     * @param {Object} res - The result object from calculateMaternityDetails.
     * @returns {string} HTML string.
     */
    function generateNarrative(res) {
      if (!res) return "";

      if (!res.eligibility.smp) {
        return /* html */ `
        <h3>Maternity Leave Summary</h3>
        <p><strong>Employment Start Date:</strong> ${res.employmentStartDate}</p>
        <p><strong>Eligibility:</strong> Not eligible for SMP (less than 26 weeks service).</p>
        <p>52 weeks unpaid leave.</p>
        <ul><li>${res.payPeriods.unpaid.start} to ${res.payPeriods.unpaid.end}</li></ul>
        `;
      }

      if (res.eligibility.smp && !res.eligibility.omp) {
        return /* html */ `
        <h3>Maternity Leave Summary</h3>
        <p><strong>Employment Start Date:</strong> ${res.employmentStartDate}</p>
        <p><strong>Eligibility:</strong> SMP.</p>
        <ul>
          <li><strong>Weeks 1 - 6 (90% pay):</strong> ${res.payPeriods.smpFirstSixWeeks.start} to ${res.payPeriods.smpFirstSixWeeks.end}</li>
          <li><strong>Weeks 7 - 39 (Standard SMP rate):</strong> ${res.payPeriods.smp.start} to ${res.payPeriods.smp.end}</li>
          <li><strong>Weeks 40 - 52 (Unpaid):</strong> ${res.payPeriods.unpaid.start} to ${res.payPeriods.unpaid.end}</li>
        </ul>
        `;
      }

      return /* html */ `
      <h3>Maternity Leave Summary</h3>
      <p><strong>Employment Start Date:</strong> ${res.employmentStartDate}</p>
      <p><strong>Maternity Leave Start Date:</strong> ${res.maternityLeaveStart}</p>
      <p><strong>EWC:</strong> ${res.ewc.start} to ${res.ewc.end}</p>
      <p><strong>Qualifying Week:</strong> ${res.qualifyingWeek.start} to ${res.qualifyingWeek.end}</p>

      <h4>Leave & Pay Breakdown</h4>
      <ul>
        <li>Full Pay (${duration.fullPay} weeks): ${res.payPeriods.fullPay.start} to ${res.payPeriods.fullPay.end}</li>
        <li>Half Pay (${duration.halfPay} weeks): ${res.payPeriods.halfPay.start} to ${res.payPeriods.halfPay.end}</li>
        <li>SMP (${duration.smp} weeks): ${res.payPeriods.smp.start} to ${res.payPeriods.smp.end}</li>
        <li>Unpaid (${duration.unpaid} weeks): ${res.payPeriods.unpaid.start} to ${res.payPeriods.unpaid.end}</li>
      </ul>
      `;
    }

    const helpers = {
      employment: document.querySelector("#start-date-input-helper"),
      babyDue: document.querySelector("#baby-due-date-input-helper"),
      maternity: document.querySelector("#maternity-start-date-input-helper"),
    };
    const originalTexts = {
      employment: helpers.employment.textContent,
      babydue: helpers.babyDue.textContent,
      maternity: helpers.maternity.textContent,
    };

    // Event Listener
    maternityForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let hasErrors = false;

      /**
       * Validates a date input field.
       * @param {HTMLInputElement} input - The input element.
       * @param {HTMLElement} helper - The helper text element.
       * @param {string} name - The name of the field for error messages.
       * @param {boolean} [required=true] - Whether the field is required.
       * @returns {boolean} True if valid, false otherwise.
       */
      function checkDate(input, helper, name, required = true) {
        const value = input.value;
        if (required && !value) {
          helper.className = "invalid-feedback";
          helper.textContent = `${name} is required`;
          return false;
        }
        if (value && isNaN(new Date(value).getTime())) {
          helper.className = "invalid-feedback";
          helper.textContent = "Invalid date";
          return false;
        }
        helper.className = "input-helper";
        helper.textContent = originalTexts[name.toLowerCase()];
        return true;
      }

      hasErrors |= !checkDate(startDateInput, helpers.employment, "Employment");
      hasErrors |= !checkDate(babyDueInput, helpers.babyDue, "BabyDue");
      hasErrors |= !checkDate(maternityStartInput, helpers.maternity, "Maternity", false);

      if (hasErrors) return;

      resultsContainer.innerHTML = generateNarrative(calculateMaternityDetails());
    });
  },
};
