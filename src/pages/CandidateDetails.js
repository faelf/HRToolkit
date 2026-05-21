import CandidateDetailsHTML from "../html/candidatedetails.html?raw";
import { firebase } from "../utilities/firebase";

export const CandidateDetails = {
  title: "HR Toolkit - Candidate Details",
  activeGroup: "onboarding",
  html: CandidateDetailsHTML,
  async setup(id) {
    const form = document.querySelector("#candidate-form");

    async function loadcandidate(id, form) {
      const candidate = await firebase.getDocument("candidates", id);

      const fullname = `${candidate.firstName} ${candidate.lastName}`;
      const title = document.querySelector("#candidate-full-name");
      title.innerText = fullname;

      // Populate form and update default values so the reset button restores fetched data
      Object.entries(candidate).forEach(([key, value]) => {
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
    }

    loadcandidate(id, form);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const newCandidate = Object.fromEntries(new FormData(event.target).entries());

      const checkboxes = event.target.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        if (checkbox.name && checkbox.name.trim() !== "") {
          newCandidate[checkbox.name] = checkbox.checked;
        }
      });

      try {
        await firebase.updateDocument("candidates", id, newCandidate);
        await loadcandidate(id, form);
      } catch (error) {
        console.error("Firebase Update Error:", error);
      }
    });

    const deleteCandidateBtn = document.querySelector("#delete-candidate");
    deleteCandidateBtn.addEventListener("click", () => {
      console.log("Deleted");
    });
  },
};
