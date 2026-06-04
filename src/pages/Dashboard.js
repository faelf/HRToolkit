import { DashboardInfo } from "../utilities/tasks.js";
import { appState } from "../core/state.js";

import DashboardHTML from "../html/dashboard.html?raw";

export const DashboardPage = {
  title: "HR Helper - Dashboard",
  html: DashboardHTML,
  updateKpis({ onboarding, postchecking, complete, all }) {
    document.querySelector("#total").textContent = onboarding.length;
    document.querySelector("#todo").textContent = DashboardInfo.tasks.getTotal(all);
    document.querySelector("#this-week").textContent = DashboardInfo.starters.getThisWeekTotal(all);
    document.querySelector("#starters-ready").textContent = complete.length;
    document.querySelector("#post-checking-total").textContent = postchecking.length;
  },

  updateLists({ onboarding, postchecking, all }) {
    const onboardingTaskList = document.querySelector("#onboarding-list-container");
    onboardingTaskList.innerHTML = "";
    onboardingTaskList.appendChild(DashboardInfo.tasks.onboardingTasksList(onboarding));
    const postCheckTaskList = document.querySelector("#post-check-list-container");
    postCheckTaskList.innerHTML = "";
    postCheckTaskList.appendChild(DashboardInfo.tasks.postCheckTasksList(postchecking));
    const startersList = document.querySelector("#starters-container");
    startersList.innerHTML = "";
    startersList.appendChild(DashboardInfo.starters.startersList(all));
  },

  async setup() {
    const candidates = appState.candidates;

    const categorised = {
      onboarding: candidates.filter((c) => c["onboarding-status"] === "Onboarding"),
      postchecking: candidates.filter((c) => c["onboarding-status"] === "Post Checks"),
      complete: candidates.filter((c) => c["onboarding-status"] === "Completed"),
      all: candidates,
    };

    this.updateKpis(categorised);
    this.updateLists(categorised);
  },
};
