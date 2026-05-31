import CandidateDetailsHTML from "../html/candidatedetails.html?raw";
import { storages } from "../utilities/storages.js";
import { form } from "../utilities/form.js";
import { CandidateScheme } from "../data/candidate.js";

export const CandidateDetails = {
  title: "HR Helper - Candidate Details",
  ariaCurrent: "onboarding",
  html: CandidateDetailsHTML,
  async setup(id) {
    const candidateForm = document.querySelector("#candidate-form");

    form.render({
      selector: "#personal-information",
      scheme: CandidateScheme.PersonalInformation,
    });
    form.render({
      selector: "#employment-information",
      scheme: CandidateScheme.EmploymentInformation,
    });
    form.render({
      selector: "#onboarding-progress",
      scheme: CandidateScheme.OnboardingProgress,
    });
    form.render({
      selector: "#post-checks",
      scheme: CandidateScheme.PostChecks,
    });
    form.buttons.render({
      container: "#form-buttons",
      buttons: {
        submit: {
          type: "submit",
          label: "Save",
          className: "green",
          svg: "floppy",
        },
        reset: {
          type: "reset",
          label: "Undo Changes",
          className: "yellow",
          svg: "undo",
        },
        delete: {
          type: "button",
          label: "Delete",
          className: "red",
          id: "delete-candidate",
          svg: "trash",
        },
      },
    });

    async function loadcandidate(id, candidateForm) {
      const rawCandidate = await storages.get("candidates", id);
      const candidate = form.inputs["date-input"].format.toUi(rawCandidate);
      const fullname = `${candidate["first-name"]} ${candidate["last-name"]}`;
      const title = document.querySelector("#candidate-full-name");
      if (title) title.innerText = fullname;
      form.populate(candidateForm, candidate);
    }

    loadcandidate(id, candidateForm);

    candidateForm.addEventListener("submit", async (event) => {
      const newCandidate = form.submit(event);

      try {
        await storages.update("candidates", id, newCandidate);
        await loadcandidate(id, candidateForm);
      } catch (error) {
        console.error("Storage Update Error:", error);
      }
    });

    const deleteCandidateBtn = document.querySelector("#delete-candidate");
    deleteCandidateBtn.addEventListener("click", async () => {
      const confirmed = confirm("Are you sure you want to delete ?");

      if (confirmed) {
        try {
          await storages.remove("candidates", id);
          window.location.hash = "onboarding";
        } catch (error) {
          console.error("Storage Delete Error:", error);
        }
      }
    });
  },
};
