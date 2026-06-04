import CandidateDetailsHTML from "../html/candidatedetails.html?raw";
import { storages } from "../utilities/storages.js";
import { form } from "../utilities/form.js";
import { CandidateScheme } from "../data/candidate.js";
import { appState } from "../core/state.js";

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
      selector: "#rtw-container",
      scheme: CandidateScheme.OnboardingProgress.RightToWork,
    });
    form.render({
      selector: "#dbs-container",
      scheme: CandidateScheme.OnboardingProgress.DBS,
    });
    form.render({
      selector: "#pr-container",
      scheme: CandidateScheme.OnboardingProgress.ProfessionalRegistration,
    });
    form.render({
      selector: "#oh-container",
      scheme: CandidateScheme.OnboardingProgress.OccupationalHealth,
    });
    form.render({
      selector: "#reference-container",
      scheme: CandidateScheme.OnboardingProgress.Reference,
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
      const rawCandidate = appState.candidates.find((c) => c.id == id);
      if (!rawCandidate) return;
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
        await new Promise((resolve) => {
          document.addEventListener("candidates-updated", resolve, { once: true });
          document.dispatchEvent(new CustomEvent("refresh-candidates"));
        });
        await loadcandidate(id, candidateForm);
        alert("Candidate saved successfully!");
      } catch (error) {
        console.error("Storage Update Error:", error);
        alert("There was an error saving the candidate details.");
      }
    });

    const deleteCandidateBtn = document.querySelector("#delete-candidate");
    deleteCandidateBtn.addEventListener("click", async () => {
      const confirmed = confirm("Are you sure you want to delete ?");

      if (confirmed) {
        try {
          await storages.remove("candidates", id);
          await new Promise((resolve) => {
            document.addEventListener("candidates-updated", resolve, { once: true });
            document.dispatchEvent(new CustomEvent("refresh-candidates"));
          });
          window.location.hash = "dashboard";
        } catch (error) {
          console.error("Storage Delete Error:", error);
        }
      }
    });
  },
};
