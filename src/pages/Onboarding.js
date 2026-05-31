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
    async function loadCandidates() {
      // Fetch Data from Database
      let data = await storages.load("candidates");

      data = data.map((candidate) => {
        const progressFields = ["dbs", "right-to-work", "oh", "references"];
        const completedCount = progressFields.filter((field) => candidate[field]).length;
        const percentage = Math.round((completedCount / progressFields.length) * 100);

        return {
          ...candidate,
          fullName: `${candidate["first-name"]} ${candidate["last-name"]}`,
          progress: /* html */ `<progress value="${percentage}" max="100"></progress>`,
        };
      });

      // Sort by date created (newest first)
      data.sort((a, b) => new Date(b["date-created"] || 0) - new Date(a["date-created"] || 0));

      return data;
    }

    let currentPage = 1;

    async function renderTable() {
      const candidatesData = await loadCandidates();

      if (candidatesData) {
        const processedCandidates = pagination.paginateItems({
          items: candidatesData,
          currentPage,
          itemsPerPage: pagination.default.itemsPerPage,
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
          onPageChange: pagination.createPageHandler((newPage) => (currentPage = newPage), renderTable),
        });
      }
    }

    // Initial Load
    renderTable();

    /* 
      Adding a new candidate
    */
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

    const newCandidateForm = document.querySelector("#new-candidate");

    newCandidateForm.addEventListener("submit", async (event) => {
      const formData = form.submit(event);
      const newCandidate = { ...formData, "onboarding-status": "Onboarding", "date-created": new Date().toISOString() };
      await storages.add("candidates", newCandidate);
      event.target.reset();
      const updatedCandidates = await loadCandidates();
      currentPage = pagination.getLastPage({ totalItems: updatedCandidates.length });
      await renderTable();
      modal.close(event);
    });
  },
};
