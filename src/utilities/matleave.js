import * as formatters from "./formatters.js";

const smp = {
  // Periods in weeks
  require: 26,
  periodone: 6,
  periodtwo: 6,
  periodthree: 27,
  periodfour: 12,
  total: 52,
};

const osp = {
  // Periods in weeks
  require: 26,
  periodone: 6,
  periodtwo: 6,
  periodthree: 27,
  periodfour: 12,
  total: 52,
};

export const duration = {
  fullPay: 6,
  halfPay: 6,
  smp: 27,
  unpaid: 13,
  total: 52,
};

export const serviceRequirements = { smpWeeks: 26, ompWeeks: 26 };

export const offset = { qualifying: 15, earliestStart: 11 };

export function parseBritishDate(input) {
  if (!input) return null;
  const [day, m, y] = input.split("/").map(Number);
  return new Date(y, m - 1, day);
}

export function getSunday(date) {
  const sunday = new Date(date);
  sunday.setHours(0, 0, 0, 0);
  sunday.setDate(sunday.getDate() - sunday.getDay());
  return sunday;
}

export function getSaturday(date) {
  const saturday = new Date(date);
  saturday.setHours(0, 0, 0, 0);
  saturday.setDate(date.getDate() - date.getDay() + 6);
  return saturday;
}

export function addWeeksInclusive(startDate, weeks) {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + weeks * 7 - 1);
  return { start, end };
}

export function formatRange(range) {
  if (!range) return null;

  return {
    start: formatters.longDate(range.start),
    end: formatters.longDate(range.end),
  };
}

export function checkEligibility({
  startDate,
  qualifyingEnd,
  requiredService,
}) {
  const weeksWorked = Math.floor(
    (qualifyingEnd - startDate) / (7 * 24 * 60 * 60 * 1000),
  );
  return weeksWorked >= requiredService;
}

export function hasSmpEligibility(employmentStart, qualifyingEnd) {
  const weeksWorked = Math.floor(
    (qualifyingEnd - employmentStart) / (7 * 24 * 60 * 60 * 1000),
  );
  return weeksWorked >= serviceRequirements.smpWeeks;
}

export function hasOmpEligibility(employmentStart, qualifyingEnd) {
  const weeksWorked = Math.floor(
    (qualifyingEnd - employmentStart) / (7 * 24 * 60 * 60 * 1000),
  );
  return weeksWorked >= serviceRequirements.ompWeeks;
}

export function getPayPeriods(maternityStart, eligibility) {
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
      new Date(smpFirstSixWeeks.end).setDate(
        smpFirstSixWeeks.end.getDate() + 1,
      ),
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

export function calculateMat(
  empStartDateStr,
  babyDueDateStr,
  maternityStartDateStr,
) {
  const empStart = parseBritishDate(empStartDateStr);
  const babyDue = parseBritishDate(babyDueDateStr);

  const ewcStart = getSunday(babyDue);
  const ewcEnd = getSaturday(babyDue);

  const qualifyingStart = new Date(ewcStart);
  qualifyingStart.setDate(ewcStart.getDate() - offset.qualifying * 7);
  const qualifyingEnd = getSaturday(qualifyingStart);

  let maternityStart;
  if (maternityStartDateStr) {
    maternityStart = parseBritishDate(maternityStartDateStr);
  } else {
    maternityStart = new Date(ewcStart);
    maternityStart.setDate(ewcStart.getDate() - offset.earliestStart * 7);
  }

  const smpEligible = hasSmpEligibility(empStart, qualifyingEnd);
  let ompEligible;

  if (smpEligible) {
    ompEligible = hasOmpEligibility(empStart, maternityStart);
  } else {
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

export function generateNarrative(res) {
  let results;

  if (!res) {
    results = "There is no results.";
    return results;
  }

  // Not eligible
  if (!res.eligibility.smp) {
    results = /* html */ `
    <h3 class="mb-2">Maternity Leave Summary</h3>
    <ul>
      <li><strong>Employment Start Date:</strong> ${res.employmentStartDate}</li>
      <li><strong>Eligibility:</strong> Not eligible for SMP (less than 26 weeks service).</li>
    </ul>

    <h3 class="mb-2">Leave & Pay Breakdown</h3>
    <ul>
      <li>52 weeks unpaid leave.</li>
      <li>${res.payPeriods.unpaid.start} to ${res.payPeriods.unpaid.end}</li>
    </ul>
    `;
    return results;
  }

  // SMP eligible
  if (res.eligibility.smp && !res.eligibility.omp) {
    results = /* html */ `
    <h3 class="mb-2">Maternity Leave Summary</h3>
    <ul>
      <li><strong>Eligibility:</strong> SMP.</li>
      <li><strong>Employment Start Date:</strong> ${res.employmentStartDate}</li>
      <li><strong>EWC:</strong> ${res.ewc.start} to ${res.ewc.end}</li>
      <li><strong>Maternity Leave Start Date:</strong> ${res.maternityLeaveStart}</li>
      <li><strong>Qualifying Week:</strong> ${res.qualifyingWeek.start} to ${res.qualifyingWeek.end}</li>
    </ul>
    <h3 class="mb-2">Leave & Pay Breakdown</h3>
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
  <ul>
    <li><strong>Employment Start Date:</strong> ${res.employmentStartDate}</li>
    <li><strong>Maternity Leave Start Date:</strong> ${res.maternityLeaveStart}</li>
    <li><strong>EWC:</strong> ${res.ewc.start} to ${res.ewc.end}</li>
    <li><strong>Qualifying Week:</strong> ${res.qualifyingWeek.start} to ${res.qualifyingWeek.end}</li>
  </ul>

  <h3 class="mb-2">Leave & Pay Breakdown</h3>
  <ul>
    <li>Full Pay (${duration.fullPay} weeks): ${res.payPeriods.fullPay.start} to ${res.payPeriods.fullPay.end}</li>
    <li>Half Pay (${duration.halfPay} weeks): ${res.payPeriods.halfPay.start} to ${res.payPeriods.halfPay.end}</li>
    <li>SMP (${duration.smp} weeks): ${res.payPeriods.smp.start} to ${res.payPeriods.smp.end}</li>
    <li>Unpaid (${duration.unpaid} weeks): ${res.payPeriods.unpaid.start} to ${res.payPeriods.unpaid.end}</li>
  </ul>
  `;

  return results;
}

export function validateDates(elements, originalTexts) {
  let isValid = true;

  const StartDate = parseBritishDate(elements.startDateInput?.value);
  const BabyDueDate = parseBritishDate(elements.babyDueInput?.value);
  const MatStartDate = parseBritishDate(elements.maternityStartInput?.value);

  if (!StartDate || !BabyDueDate) return false;

  if (StartDate > BabyDueDate) {
    elements.helpers.babyDue.className = "invalid-feedback";
    elements.helpers.babyDue.textContent =
      "Baby cannot be due before the start date.";
    elements.babyDueInput?.classList.add("is-invalid");
    isValid = false;
  } else {
    elements.helpers.babyDue.className = "input-helper";
    elements.helpers.babyDue.textContent = originalTexts.babyDue;
    elements.babyDueInput?.classList.remove("is-invalid");
  }

  if (MatStartDate) {
    const ewcStart = getSunday(BabyDueDate);
    const earliestStart = new Date(ewcStart);
    earliestStart.setDate(ewcStart.getDate() - offset.earliestStart * 7);

    if (MatStartDate > BabyDueDate) {
      elements.helpers.mat.className = "invalid-feedback";
      elements.helpers.mat.textContent =
        "Maternity cannot start after baby is due.";
      elements.maternityStartInput?.classList.add("is-invalid");
      isValid = false;
    } else if (MatStartDate < earliestStart) {
      elements.helpers.mat.className = "invalid-feedback";
      elements.helpers.mat.textContent = `Maternity cannot start more than ${offset.earliestStart} weeks before the baby is due.`;
      elements.maternityStartInput?.classList.add("is-invalid");
      isValid = false;
    } else if (MatStartDate < StartDate) {
      elements.helpers.mat.className = "invalid-feedback";
      elements.helpers.mat.textContent =
        "Maternity cannot start before the start date.";
      elements.maternityStartInput?.classList.add("is-invalid");
      isValid = false;
    } else {
      elements.helpers.mat.className = "input-helper";
      elements.helpers.mat.textContent = originalTexts.mat;
      elements.maternityStartInput?.classList.remove("is-invalid");
    }
  } else {
    elements.helpers.mat.className = "input-helper";
    elements.helpers.mat.textContent = originalTexts.mat;
    elements.maternityStartInput?.classList.remove("is-invalid");
  }

  return isValid;
}
