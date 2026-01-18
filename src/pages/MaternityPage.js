import { formatters } from "../utilities/formatters.js";

export const MaternityPage = {
  title: "HR Toolkit - Maternity Calculator",
  html: /* html */ `
  <section class="cal-containers">
    <div id="maternity-calculator" class="card">
      <div class="card-header">
        <h2>Calculator</h2>
      </div>
      <div class="card-body">
        <form id="maternity-form">
          <div class="mb-3">
            <label for="start-date-input" class="form-label">Employment Start Date</label>
            <input type="date" id="start-date-input">
            <div id="start-date-input-helper" class="input-helper">
              The date the employee started employment.
            </div>
          </div>
          <div class="mb-3">
            <label for="baby-due-date-input" class="form-label">Baby Due Date</label>
            <input type="date" id="baby-due-date-input">
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
          <div class="mb-2">
            <button type="button" class="btn btn-success" id="m-calculate">Calculate</button>
            <button type="reset" class="btn btn-warning">Reset</button>
          </div>
        </form>
      </div>
    </div> <!-- Maternity Calculator Card Ends -->

    <div id="maternity-content">
      <div id="maternity-results" class="card mb-2">
        <div class="card-header">
          <h2>Results</h2>
        </div>
        <div id="results" class="card-body">
          <p>Your results will show here.</p>
        </div>
      </div>

      <div id="maternity-guide" class="card mb-2">
        <div class="card-header">
          <h2>Maternity Calculation Guide</h2>
        </div>
        <div class="card-body">
          <p>This guide explains how the Maternity Calculator works and what each date means:</p>
          <ul>
            <li><strong>Maternity Start Date:</strong> If you leave this field blank, the calculator will automatically use the <strong>earliest start date</strong>, which is 11 weeks before the Expected Week of Childbirth (EWC). You can override this by selecting a preferred start date.</li>

            <li>
              <strong>Eligibility:</strong>
              The system checks if the employee has at least <strong>26 weeks of continuous service</strong> by the <strong>Qualifying Week</strong>. There are two possible outcomes:
              <ul>
                <li>
                  <strong>Eligible:</strong> The calculator displays a full schedule of maternity pay, including:
                  <ul>
                    <li><strong>Full Pay:</strong> 6 weeks at 100% (company-enhanced)</li>
                    <li><strong>Half Pay:</strong> 6 weeks at 50% (or SMP if higher)</li>
                    <li><strong>Statutory Maternity Pay (SMP):</strong> 27 weeks</li>
                    <li><strong>Unpaid Leave:</strong> Remaining weeks to complete 52-week entitlement</li>
                  </ul>
                </li>
                <li>
                  <strong>Not Eligible:</strong> The employee is entitled to the <strong>52-week leave</strong> but all leave is unpaid.
                </li>
              </ul>
            </li>

            <li>
              <strong>Expected Week of Childbirth (EWC):</strong>
              The calculator determines the week of the baby&apos;s expected birth, starting from Sunday to Saturday. This is used to calculate qualifying week and earliest maternity start date.
            </li>

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

          <p><strong>Important Note:</strong> This tool calculates eligibility and leave dates based on service length and dates only. It does <strong>not</strong> check salary. To qualify for statutory maternity pay (SMP), the employee must earn at least the minimum qualifying amount, as defined on the GOV.UK page.</p>
          <p><strong>Always verify eligibility with official guidance and your internal HR policies.</strong></p>
        </div>
      </div> <!-- Maternity Guide Ends -->
      <div id="maternity-references" class="card mb-2">
        <div class="card-header">
          <h2>References</h2>
        </div>
        <div class="card-body">
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
    const employmentStartInput = document.getElementById("start-date-input");
    const babyDueInput = document.getElementById("baby-due-date-input");
    const maternityStartInput = document.getElementById(
      "maternity-start-date-input",
    );
    const mCalculate = document.getElementById("m-calculate");
    const resultsContainer = document.getElementById("results");

    // Policy Constants
    const duration = {
      fullPayWeeks: 6,
      halfPayWeeks: 6,
      smpWeeks: 27,
      unpaidWeeks: 13,
      totalWeeks: 52,
    };

    const offset = {
      qualifying: 15,
      earliestStart: 11,
    };

    // Date Helpers
    const getWeekSunday = (date) => {
      const result = new Date(date);
      result.setHours(0, 0, 0, 0);
      result.setDate(result.getDate() - result.getDay());
      return result;
    };

    const getWeekSaturday = (date) => {
      const sunday = getWeekSunday(date);
      const saturday = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6);
      return saturday;
    };

    const addWeeksInclusive = (startDate, weeks) => {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + weeks * 7 - 1);
      return { start, end };
    };

    const hasRequiredService = (employmentStart, qualifyingWeekEnd) => {
      const msPerWeek = 7 * 24 * 60 * 60 * 1000;
      const weeksWorked = Math.floor(
        (qualifyingWeekEnd - employmentStart) / msPerWeek,
      );
      return weeksWorked >= 26;
    };

    // Pay Period Generator
    const getMaternityPayPeriods = (startDate, eligible) => {
      const start = new Date(startDate);

      // Scenario: Not Eligible
      if (!eligible) {
        return {
          fullPay: null,
          halfPay: null,
          smp: null,
          unpaid: addWeeksInclusive(start, duration.totalWeeks),
        };
      }

      // Scenario: Eligible (Contiguous 6/6/27/13 split)
      const fullPay = addWeeksInclusive(start, duration.fullPayWeeks);

      const halfPayStart = new Date(fullPay.end);
      halfPayStart.setDate(halfPayStart.getDate() + 1);
      const halfPay = addWeeksInclusive(halfPayStart, duration.halfPayWeeks);

      const smpStart = new Date(halfPay.end);
      smpStart.setDate(smpStart.getDate() + 1);
      const smp = addWeeksInclusive(smpStart, duration.smpWeeks);

      const unpaidStart = new Date(smp.end);
      unpaidStart.setDate(unpaidStart.getDate() + 1);
      const unpaid = addWeeksInclusive(unpaidStart, duration.unpaidWeeks);

      return { fullPay, halfPay, smp, unpaid };
    };

    // Main Calculation
    const calculateMaternityDetails = () => {
      const empStartDate = new Date(employmentStartInput.value);
      const babyDueDate = new Date(babyDueInput.value);

      // 1. Expected Week of Childbirth (EWC)
      const ewcStart = getWeekSunday(babyDueDate);
      const ewcEnd = getWeekSaturday(babyDueDate);

      // 2. Qualifying Week (15 weeks before EWC)
      const qualifyingStart = new Date(ewcStart);
      qualifyingStart.setDate(ewcStart.getDate() - offset.qualifying * 7);
      const qualifyingEnd = getWeekSaturday(qualifyingStart);

      // 3. Eligibility Check
      const eligible = hasRequiredService(empStartDate, qualifyingEnd);

      // 4. Maternity Start Date Logic
      // If user provided a date, use it. Otherwise, default to earliest (11 weeks before EWC).
      let maternityLeaveStart;
      if (maternityStartInput.value) {
        maternityLeaveStart = new Date(maternityStartInput.value);
      } else {
        maternityLeaveStart = new Date(ewcStart);
        maternityLeaveStart.setDate(
          ewcStart.getDate() - offset.earliestStart * 7,
        );
      }

      // 5. Generate Periods
      const payPeriods = getMaternityPayPeriods(maternityLeaveStart, eligible);

      const formatRange = (range) =>
        range
          ? {
              start: formatters.longDate(range.start),
              end: formatters.longDate(range.end),
            }
          : null;

      return {
        employmentStartDate: formatters.longDate(empStartDate),
        eligibility: eligible,
        maternityLeaveStart: formatters.longDate(maternityLeaveStart),
        ewc: formatRange({ start: ewcStart, end: ewcEnd }),
        qualifyingWeek: formatRange({
          start: qualifyingStart,
          end: qualifyingEnd,
        }),
        payPeriods: {
          fullPay: formatRange(payPeriods.fullPay),
          halfPay: formatRange(payPeriods.halfPay),
          smp: formatRange(payPeriods.smp),
          unpaid: formatRange(payPeriods.unpaid),
        },
      };
    };

    const generateNarrative = (res) => {
      if (!res) return "";

      // If employee is not eligible for pay
      if (!res.eligibility) {
        return /* html */ `
        <div class="maternity-guide">
          <h2>Maternity Leave Summary</h2>
          <p><strong>Employment Start Date:</strong> ${res.employmentStartDate}</p>
          <p><strong>Eligibility:</strong> Not eligible for pay because the employee has not completed 26 weeks of continuous service by the end of the Qualifying Week (${res.qualifyingWeek.start} to ${res.qualifyingWeek.end}).</p>
          <p>You are entitled to 52 weeks of maternity leave as unpaid leave:</p>
          <ul>
            <li><strong>Unpaid Leave:</strong> ${res.payPeriods.unpaid.start} to ${res.payPeriods.unpaid.end}</li>
          </ul>
          <p><em>Note: All calculations assume standard dates. Actual leave may change if the baby arrives early or there are pregnancy-related complications.</em></p>
        </div>
        `;
      }

      // If eligible for pay
      return /* html */ `
      <div id="maternity-results">
        <h3>Maternity Leave Summary</h3>
        <p><strong>Employment Start Date:</strong> ${res.employmentStartDate}</p>
        <p><strong>Maternity Leave Start Date:</strong> ${res.maternityLeaveStart}</p>
        <p><strong>Expected Week of Childbirth (EWC):</strong> ${res.ewc.start} to ${res.ewc.end}</p>
        <p><strong>Qualifying Week:</strong> ${res.qualifyingWeek.start} to ${res.qualifyingWeek.end}</p>

        <h4>Leave & Pay Breakdown (52 Weeks)</h4>
        <ul>
          <li><strong>Full Pay (${duration.fullPayWeeks} weeks):</strong> ${res.payPeriods.fullPay.start} to ${res.payPeriods.fullPay.end}</li>
          <li><strong>Half Pay (${duration.halfPayWeeks} weeks):</strong> ${res.payPeriods.halfPay.start} to ${res.payPeriods.halfPay.end}</li>
          <li><strong>Statutory Maternity Pay (${duration.smpWeeks} weeks):</strong> ${res.payPeriods.smp.start} to ${res.payPeriods.smp.end}</li>
          <li><strong>Unpaid Leave (${duration.unpaidWeeks} weeks):</strong> ${res.payPeriods.unpaid.start} to ${res.payPeriods.unpaid.end}</li>
        </ul>

        <p><strong>Final Day of Maternity Leave:</strong> ${res.payPeriods.unpaid.end}</p>

        <h4>Important Notes</h4>
        <ul>
          <li>If the <strong>Maternity Leave Start Date</strong> is left blank, the calculator uses the <strong>earliest legal start date</strong> (11 weeks before EWC).</li>
          <li>Eligibility for pay requires at least 26 weeks of continuous service by the end of the Qualifying Week.</li>
          <li>All dates assume standard progression. Early delivery or illness may affect actual leave dates.</li>
        </ul>
      </div>
      `;
    };

    // Validation
    const employmentHelper = document.querySelector(
      "#start-date-input-helper",
    );
    const babyDueHelper = document.querySelector(
      "#baby-due-date-input-helper",
    );
    const maternityHelper = document.querySelector(
      "#maternity-start-date-input-helper",
    );

    // Store original text
    const originalTexts = {
      employment: employmentHelper.textContent,
      babyDue: babyDueHelper.textContent,
      maternity: maternityHelper.textContent,
    };

    // Event listener
    mCalculate.addEventListener("click", () => {
      let hasErrors = false;

      // Validate Employment Start Date
      if (!employmentStartInput.value) {
        employmentHelper.className = "invalid-feedback";
        employmentHelper.textContent = "Employment start date is required.";
        hasErrors = true;
      } else if (isNaN(new Date(employmentStartInput.value).getTime())) {
        employmentHelper.className = "invalid-feedback";
        employmentHelper.textContent = "Please enter a valid date.";
        hasErrors = true;
      } else {
        employmentHelper.className = "input-helper start-date-input-helper";
        employmentHelper.textContent = originalTexts.employment;
      }

      // Validate Baby Due Date
      if (!babyDueInput.value) {
        babyDueHelper.className = "invalid-feedback";
        babyDueHelper.textContent = "Baby due date is required.";
        hasErrors = true;
      } else if (isNaN(new Date(babyDueInput.value).getTime())) {
        babyDueHelper.className = "invalid-feedback";
        babyDueHelper.textContent = "Please enter a valid date.";
        hasErrors = true;
      } else {
        babyDueHelper.className = "input-helper baby-due-date-input-helper";
        babyDueHelper.textContent = originalTexts.babyDue;
      }

      // Validate Maternity Start (optional)
      if (
        maternityStartInput.value &&
        isNaN(new Date(maternityStartInput.value).getTime())
      ) {
        maternityHelper.className = "invalid-feedback";
        maternityHelper.textContent = "Please enter a valid date.";
        hasErrors = true;
      } else if (maternityStartInput.value || !hasErrors) {
        maternityHelper.className =
          "input-helper maternity-start-date-input-helper";
        maternityHelper.textContent = originalTexts.maternity;
      }

      if (hasErrors) return;

      const result = calculateMaternityDetails();
      resultsContainer.innerHTML = generateNarrative(result);
    });
  },
};
