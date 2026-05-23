import MaternityHTML from "../html/maternity.html?raw";
import { formatters } from "../utilities/formatters.js";

export const MaternityPage = {
  title: "HR Helper - Maternity Calculator",
  html: MaternityHTML,
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
     * Parses a "DD/MM/YYYY" string into a JavaScript Date object.
     * @param {string} input - The British formatted date string.
     * @returns {Date|null} The parsed Date object, or null if empty.
     */
    function parseBritishDate(input) {
      if (!input) return null;
      const [day, m, y] = input.split("/").map(Number);
      return new Date(y, m - 1, day);
    }

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
    function getPayPeriods(maternityStart, eligibility) {
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
    function calculateMat() {
      const empStart = parseBritishDate(startDateInput.value);
      const babyDue = parseBritishDate(babyDueInput.value);

      const ewcStart = getWeekStart(babyDue);
      const ewcEnd = getWeekEnd(babyDue);

      const qualifyingStart = new Date(ewcStart);
      qualifyingStart.setDate(ewcStart.getDate() - offset.qualifying * 7);
      const qualifyingEnd = getWeekEnd(qualifyingStart);

      let maternityStart;
      if (maternityStartInput.value) {
        // If the user entered a maternity start date, use that
        maternityStart = parseBritishDate(maternityStartInput.value);
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

      const payPeriods = getPayPeriods(maternityStart, {
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
     * @param {Object} res - The result object from calculateMat.
     * @returns {string} HTML string.
     */
    function generateNarrative(res) {
      let results;

      if (!res) {
        results = "There is no results.";
        return results;
      }

      // Not eligible
      if (!res.eligibility.smp) {
        results = /* html */ `
        <h3 class="mb-2">Maternity Leave Summary</h3>
        <p><strong>Employment Start Date:</strong> ${res.employmentStartDate}</p>
        <p><strong>Eligibility:</strong> Not eligible for SMP (less than 26 weeks service).</p>
        <p>52 weeks unpaid leave.</p>
        <ul><li>${res.payPeriods.unpaid.start} to ${res.payPeriods.unpaid.end}</li></ul>
        `;
        return results;
      }

      // SMP eligible
      if (res.eligibility.smp && !res.eligibility.omp) {
        results = /* html */ `
        <h3 class="mb-2">Maternity Leave Summary</h3>
        <p><strong>Eligibility:</strong> SMP.</p>
        <p><strong>Employment Start Date:</strong> ${res.employmentStartDate}</p>
        <p><strong>EWC:</strong> ${res.ewc.start} to ${res.ewc.end}</p>
        <p><strong>Maternity Leave Start Date:</strong> ${res.maternityLeaveStart}</p>
        <p><strong>Qualifying Week:</strong> ${res.qualifyingWeek.start} to ${res.qualifyingWeek.end}</p>
        <ul>
          <li><strong>Weeks 1 - 6 (90% pay):</strong> ${res.payPeriods.smpFirstSixWeeks.start} to ${res.payPeriods.smpFirstSixWeeks.end}</li>
          <li><strong>Weeks 7 - 39 (Standard SMP rate):</strong> ${res.payPeriods.smp.start} to ${res.payPeriods.smp.end}</li>
          <li><strong>Weeks 40 - 52 (Unpaid):</strong> ${res.payPeriods.unpaid.start} to ${res.payPeriods.unpaid.end}</li>
        </ul>
        `;

        return results;
      }

      // OMP eligible
      results = /* html */ `
      <h3 class="mb-2">Maternity Leave Summary</h3>
      <p><strong>Employment Start Date:</strong> ${res.employmentStartDate}</p>
      <p><strong>Maternity Leave Start Date:</strong> ${res.maternityLeaveStart}</p>
      <p><strong>EWC:</strong> ${res.ewc.start} to ${res.ewc.end}</p>
      <p><strong>Qualifying Week:</strong> ${res.qualifyingWeek.start} to ${res.qualifyingWeek.end}</p>

      <h4 class="mb-2">Leave & Pay Breakdown</h4>
      <ul>
        <li>Full Pay (${duration.fullPay} weeks): ${res.payPeriods.fullPay.start} to ${res.payPeriods.fullPay.end}</li>
        <li>Half Pay (${duration.halfPay} weeks): ${res.payPeriods.halfPay.start} to ${res.payPeriods.halfPay.end}</li>
        <li>SMP (${duration.smp} weeks): ${res.payPeriods.smp.start} to ${res.payPeriods.smp.end}</li>
        <li>Unpaid (${duration.unpaid} weeks): ${res.payPeriods.unpaid.start} to ${res.payPeriods.unpaid.end}</li>
      </ul>
      `;

      return results;
    }

    const helpers = {
      employment: document.querySelector("#start-date-input-helper"),
      babyDue: document.querySelector("#baby-due-date-input-helper"),
      mat: document.querySelector("#maternity-start-date-input-helper"),
    };
    const originalTexts = {
      employment: helpers.employment.textContent,
      babyDue: helpers.babyDue.textContent,
      mat: helpers.mat.textContent,
    };

    function validateDates() {
      let isValid = true;

      const StartDate = parseBritishDate(startDateInput.value);
      const BabyDueDate = parseBritishDate(babyDueInput.value);
      const MatStartDate = parseBritishDate(maternityStartInput.value);

      if (!StartDate || !BabyDueDate) return false;

      if (StartDate > BabyDueDate) {
        helpers.babyDue.className = "invalid-feedback";
        helpers.babyDue.textContent = "Baby cannot be due before the start date.";
        babyDueInput.classList.add("is-invalid");
        isValid = false;
      } else {
        helpers.babyDue.className = "input-helper";
        helpers.babyDue.textContent = originalTexts.babyDue;
        babyDueInput.classList.remove("is-invalid");
      }

      if (MatStartDate && BabyDueDate < MatStartDate) {
        helpers.mat.className = "invalid-feedback";
        helpers.mat.textContent = "Maternity cannot start after baby is due.";
        maternityStartInput.classList.add("is-invalid");
        isValid = false;
      } else {
        helpers.mat.className = "input-helper";
        helpers.mat.textContent = originalTexts.mat;
        maternityStartInput.classList.remove("is-invalid");
      }

      return isValid;
    }

    // Event Listener
    maternityForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateDates()) return;

      resultsContainer.innerHTML = generateNarrative(calculateMat());
    });
  },
};
