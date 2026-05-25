import CandidateDetailsHTML from "../html/candidatedetails.html?raw";
import { storages } from "../utilities/storages.js";
import { form } from "../utilities/form.js";

export const CandidateDetails = {
  title: "HR Helper - Candidate Details",
  activeGroup: "onboarding",
  html: CandidateDetailsHTML,
  async setup(id) {
    const candidateForm = document.querySelector("#candidate-form");

    async function loadcandidate(id, candidateForm) {
      const rawCandidate = await storages.get("candidates", id);

      const candidate = form.date.format.toUi(rawCandidate);

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
