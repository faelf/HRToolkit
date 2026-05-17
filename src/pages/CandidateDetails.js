import CandidateDetailsHTML from "../html/candidatedetails.html?raw";
import { firebase } from "../utilities/firebase";

export const CandidateDetails = {
  title: "HR Toolkit - Candidate Details",
  html: CandidateDetailsHTML,
  async setup(id) {
    const candidate = await firebase.getDocument("candidates", id);

    if (!candidate) {
      console.error("Candidate not found");
      return;
    }

    const fullname = `${candidate.firstName} ${candidate.lastName}`;
    const title = document.querySelector("#candidate-full-name");
    title.innerText = fullname;

    // Find the form within the Candidate Details page
    const form = document.querySelector("#candidate-form");
    if (!form) return;

    // Populate form and update default values so the reset button restores fetched data
    Object.entries(candidate).forEach(([key, value]) => {
      // This relies on your HTML inputs having a 'name' attribute matching the database keys
      const input = form.elements[key];
      if (!input) return;

      if (input instanceof NodeList) {
        // Handles radio button groups
        input.forEach((node) => {
          const isMatch = node.value === String(value);
          node.checked = isMatch;
          node.defaultChecked = isMatch;
        });
      } else if (input.type === "checkbox" || input.type === "radio") {
        input.checked = Boolean(value);
        input.defaultChecked = Boolean(value);
      } else if (input.tagName === "SELECT") {
        input.value = value;
        Array.from(input.options).forEach((option) => {
          option.defaultSelected = option.value === String(value);
        });
      } else {
        input.value = value;
        input.defaultValue = value;
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const obj = Object.fromEntries(new FormData(event.target).entries());
      firebase.updateDocument("candidates", id, obj);
    });

    const deleteCandidateBtn = document.querySelector("#delete-candidate");
    deleteCandidateBtn.addEventListener("click", () => {
      console.log("Deleted");
    });
  },
};
