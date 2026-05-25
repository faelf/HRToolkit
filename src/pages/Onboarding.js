import OnboardingHTML from "../html/onboarding.html?raw";
import { storages } from "../utilities/storages.js";
import { table } from "../utilities/table.js";
import { form } from "../utilities/form.js";

export const OnboardingPage = {
  title: "HR Helper - Onboarding",
  html: OnboardingHTML,
  async setup() {
    async function renderTable() {
      const candidates = await storages.load("candidates");

      if (candidates) {
        // To Display Full Name and Progress
        const processedCandidates = candidates.map((candidate) => {
          // Fields that count towards the progress
          const progressFields = ["dbs", "right-to-work", "oh", "references"];
          const completedCount = progressFields.filter((field) => candidate[field]).length;
          const percentage = Math.round((completedCount / progressFields.length) * 100);

          return {
            ...candidate,
            fullName: `${candidate["first-name"]} ${candidate["last-name"]}`,
            progress: /* html */ `<progress value="${percentage}" max="100"></progress>`,
          };
        });

        const candidatesTable = {
          container: "#candidates-container",
          thead: {
            fullName: "Full Name",
            "job-title": "Job Title",
            department: "Department",
            "hiring-manager": "Hiring Manager",
            progress: "Progress",
          },
          tbody: processedCandidates,
          emptyText: "No Candidates",
        };

        table.render(candidatesTable);
      }
    }

    renderTable();

    const newCandidateForm = document.querySelector("#new-candidate");

    newCandidateForm.addEventListener("submit", async (event) => {
      const defaultCandidate = {
        "first-name": "",
        "last-name": "",
        "job-title": "",
        department: "",
        "hiring-manager": "",
        "right-to-work": "",
        "expiry-date": "",
        dbs: "",
        "dbs-number": "",
        "dbs-level": "",
        oh: "",
        references: "",
        "start-date": "",
        adp: false,
        "learn-space": false,
        "name-badge": false,
      };

      const formData = form.submit(event);
      const newCandidate = { ...defaultCandidate, ...formData, status: "Onboarding" };

      await storages.add("candidates", newCandidate);

      event.target.reset();

      const dialog = event.target.closest("dialog");
      if (dialog) {
        dialog.hasAttribute("popover") ? dialog.hidePopover() : dialog.close();
      }

      await renderTable();
    });
  },
};
