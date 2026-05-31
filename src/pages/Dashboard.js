import { storages } from "../utilities/storages.js";
import { DashboardInfo } from "../utilities/tasks.js";

import DashboardHTML from "../html/dashboard.html?raw";

export const DashboardPage = {
  title: "HR Helper - Dashboard",
  html: DashboardHTML,
  async setup() {
    const cards = {
      total: document.querySelector("#total"),
      todo: document.querySelector("#todo"),
      thisWeek: document.querySelector("#this-week"),
      startersReady: document.querySelector("#starters-ready"),
      onboardingTaskList: document.querySelector("#onboarding-list-container"),
      postCheckTaskList: document.querySelector("#post-check-list-container"),
      startersList: document.querySelector("#starters-container"),
    };

    const candidates = await storages.load("candidates");
    const onboarding = candidates.filter((c) => c["onboarding-status"] === "Onboarding");
    const complete = candidates.filter((c) => c["onboarding-status"] === "Completed");
    const ready = candidates.filter((c) => c["onboarding-status"] === "Ready");

    cards.todo.textContent = DashboardInfo.tasks.getTotal(candidates);
    cards.total.textContent = onboarding.length;
    cards.thisWeek.textContent = DashboardInfo.starters.getThisWeekTotal(candidates);
    cards.startersReady.textContent = DashboardInfo.starters.startersReady(candidates);
    cards.onboardingTaskList.innerHTML = "";
    cards.onboardingTaskList.appendChild(DashboardInfo.tasks.onboardingTasksList(onboarding));
    cards.postCheckTaskList.innerHTML = "";
    cards.postCheckTaskList.appendChild(DashboardInfo.tasks.postCheckTasksList(complete));
    cards.startersList.innerHTML = "";
    cards.startersList.appendChild(DashboardInfo.starters.htmlList(candidates));
  },
};
