import MaternityHTML from "../html/maternity.html?raw";
import { calculateMat, generateNarrative, validateDates } from "../utilities/matleave.js";

export const MaternityPage = {
  title: "HR Helper - Maternity Calculator",
  html: MaternityHTML,
  setup() {
    const elements = {
      form: document.getElementById("maternity-form"),
      startDateInput: document.querySelector('[name="start-date"]'),
      babyDueInput: document.querySelector('[name="baby-due-date"]'),
      maternityStartInput: document.querySelector('[name="maternity-start-date"]'),
      resultsContainer: document.getElementById("results"),
      helpers: {
        employment: document.getElementById("start-date-input-helper"),
        babyDue: document.getElementById("baby-due-date-input-helper"),
        mat: document.getElementById("maternity-start-date-input-helper"),
      },
    };

    const originalTexts = {
      employment: elements.helpers.employment.textContent,
      babyDue: elements.helpers.babyDue.textContent,
      mat: elements.helpers.mat.textContent,
    };

    // Event Listener
    elements.form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateDates(elements, originalTexts)) return;

      elements.resultsContainer.innerHTML = generateNarrative(
        calculateMat(elements.startDateInput?.value, elements.babyDueInput?.value, elements.maternityStartInput?.value),
      );
    });
  },
};
