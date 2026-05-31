import OnboardingHTML from "../html/onboarding.html?raw";
import { storages } from "../utilities/storages.js";
import { table } from "../utilities/table.js";
import { form } from "../utilities/form.js";
import { CandidateScheme } from "../data/candidate.js";
import { modal } from "../utilities/modal.js";
import { pagination } from "../utilities/pagination.js";

export const OnboardingPage = {
  title: "HR Helper - Onboarding",
  html: OnboardingHTML,
  async setup() {
    form.render({
      selector: "#personal-information",
      scheme: CandidateScheme.PersonalInformation,
    });
    form.render({
      selector: "#employment-information",
      scheme: CandidateScheme.EmploymentInformation,
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
          label: "Undo",
          className: "yellow",
          svg: "undo",
        },
        close: {
          action: "close-modal",
          label: "Close",
          className: "red",
          svg: "close",
        },
      },
    });

    // Initial Load
    const candidates = await storages.load("candidates");

    let currentPage = 1;

    async function renderTable(candidatesData) {
      if (candidatesData) {
        const pagedCandidates = pagination.paginateItems({
          items: candidatesData,
          currentPage,
          itemsPerPage: pagination.default.itemsPerPage,
        });

        // To Display Full Name and Progress
        const processedCandidates = pagedCandidates.map((candidate) => {
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

        pagination.render({
          ContainerID: "#pagination",
          totalItems: candidatesData.length,
          currentPage,
          onPageChange: (newPage) => {
            currentPage = newPage;
            renderTable(candidatesData);
          },
        });
      }
    }

    renderTable(candidates);

    const newCandidateForm = document.querySelector("#new-candidate");

    newCandidateForm.addEventListener("submit", async (event) => {
      const formData = form.submit(event);
      const newCandidate = { ...formData, "onboarding-status": "Onboarding" };
      await storages.add("candidates", newCandidate);
      event.target.reset();
      const updatedCandidates = await storages.load("candidates");
      currentPage = pagination.getLastPage({ totalItems: updatedCandidates.length });
      await renderTable(updatedCandidates);
      modal.close(event);
    });
  },
};
