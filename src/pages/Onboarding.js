import OnboardingHTML from "../html/onboarding.html?raw";
import { storages } from "../utilities/storages.js";
import { table } from "../utilities/table.js";
import { form } from "../utilities/form.js";
import { CandidateScheme } from "../data/candidate.js";
import { modal } from "../utilities/modal.js";
import { pagination } from "../utilities/pagination.js";
import { csv } from "../utilities/csv.js";
import { appState } from "../core/state.js";
import { toast } from "../ui/toast.js";

export const OnboardingPage = {
  title: "HR Helper - Onboarding",
  html: OnboardingHTML,
  async setup() {
    async function loadCandidates() {
      // Fetch Data from Global State
      let data = appState.candidates;

      data = data.map((candidate) => {
        const progressFields = [
          "right-to-work",
          "dbs-issue-date",
          "oh-issue-date",
          "reference-received",
          "professional-registration",
        ];
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
    let searchQuery = "";

    async function renderTable() {
      let candidatesData = await loadCandidates();

      if (searchQuery) {
        candidatesData = candidatesData.filter((candidate) =>
          candidate.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

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
          emptyText: "No Candidates Found",
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

    // Search functionality
    const searchInput = document.querySelector("#search-candidate");
    searchInput.addEventListener("input", (event) => {
      searchQuery = event.target.value.trim();
      currentPage = 1; // Reset to first page on new search
      renderTable();
    });

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
      try {
        await storages.add("candidates", newCandidate);
        event.target.reset();
        await new Promise((resolve) => {
          document.addEventListener("candidates-updated", resolve, { once: true });
          document.dispatchEvent(new CustomEvent("refresh-candidates"));
        });
        currentPage = 1;
        await renderTable();
        modal.close(event);
        toast.success({ message: "Candidate added successfully!" });
      } catch (error) {
        console.error("Error adding candidate:", error);
        toast.error({ message: "There was an error adding the candidate." });
      }
    });

    const downloadBtn = document.querySelector("#download-btn");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", async () => {
        csv.download(appState.candidates, "candidates");
      });
    }
  },
};
