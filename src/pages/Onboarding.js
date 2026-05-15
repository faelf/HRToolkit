import OnboardingHTML from "../html/onboarding.html?raw";
import { firebase } from "../utilities/firebase.js";
import { table } from "../utilities/table.js";

export const OnboardingPage = {
  title: "HR Toolkit - Onboarding",
  html: OnboardingHTML,
  async setup() {
    const candidates = await firebase.getDocuments("candidates");

    if (candidates) {
      // To Display Full Name and Progress
      const processedCandidates = candidates.map((candidate) => {
        // Fields that count towards the progress
        const progressFields = ["dbs", "rightToWork", "oh", "references"];
        const completedCount = progressFields.filter((field) => candidate[field]).length;
        const percentage = Math.round((completedCount / progressFields.length) * 100);

        return {
          ...candidate,
          fullName: `${candidate.firstName} ${candidate.lastName}`,
          progress: /* html */ `
          <div class="progress-container">
            <progress value="${percentage}" max="100"></progress>
          </div>`,
        };
      });

      const candidatesTable = {
        container: "#candidates-container",
        thead: {
          fullName: "Full Name",
          jobTitle: "Job Title",
          department: "Department",
          hiringManager: "Hiring Manager",
          progress: "Progress",
        },
        tbody: processedCandidates,
      };

      table.render(candidatesTable);
    }

    // Add Candidate
    const newCandidateForm = document.querySelector("#new-candidate");

    newCandidateForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const obj = Object.fromEntries(new FormData(event.target).entries());
      console.log(obj);
      firebase.addDocument("candidates", obj);
    });
  },
};
