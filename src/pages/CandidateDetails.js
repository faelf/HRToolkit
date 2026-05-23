import CandidateDetailsHTML from "../html/candidatedetails.html?raw";
import { firebase } from "../utilities/firebase.js";
import { form } from "../utilities/form.js";

export const CandidateDetails = {
  title: "HR Helper - Candidate Details",
  activeGroup: "onboarding",
  html: CandidateDetailsHTML,
  async setup(id) {
    const candidateForm = document.querySelector("#candidate-form");

    async function loadcandidate(id, candidateForm) {
      const rawCandidate = await firebase.getDocument("candidates", id);

      const candidate = form.date.format.toUi(rawCandidate);

      const fullname = `${candidate.firstName} ${candidate.lastName}`;
      const title = document.querySelector("#candidate-full-name");
      if (title) title.innerText = fullname;

      form.populate(candidateForm, candidate);
    }

    loadcandidate(id, candidateForm);

    candidateForm.addEventListener("submit", async (event) => {
      const newCandidate = form.submit(event);

      try {
        await firebase.updateDocument("candidates", id, newCandidate);
        await loadcandidate(id, candidateForm);
      } catch (error) {
        console.error("Firebase Update Error:", error);
      }
    });

    const deleteCandidateBtn = document.querySelector("#delete-candidate");
    deleteCandidateBtn.addEventListener("click", async () => {
      const confirmed = confirm("Are you sure you want to delete ?");

      if (confirmed) {
        try {
          await firebase.deleteDocument("candidates", id);
          window.location.hash = "onboarding";
        } catch (error) {
          console.error("Firebase Delete Error:", error);
        }
      }
    });
  },
};
