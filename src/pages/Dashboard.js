import { storages } from "../utilities/storages.js";
import { DashboardInfo } from "../utilities/tasks.js";

import DashboardHTML from "../html/dashboard.html?raw";

export const DashboardPage = {
  title: "HR Helper - Dashboard",
  html: DashboardHTML,
  async setup() {
    const cards = {
      // KPI Cards
      total: document.querySelector("#total"),
      todo: document.querySelector("#todo"),
      thisWeek: document.querySelector("#this-week"),
      startersReady: document.querySelector("#starters-ready"),
      // Action Cards
      tasksList: document.querySelector("#task-list-container"),
      startersList: document.querySelector("#starters-container"),
    };

    const candidates = await storages.load("candidates");
    const onboarding = candidates.filter((c) => c.status === "Onboarding");
    const ready = candidates.filter((c) => c.status === "Ready");

    // KPI Cards
    cards.todo.textContent = DashboardInfo.tasks.getTotal(candidates);
    cards.total.textContent = onboarding.length;
    cards.thisWeek.textContent = DashboardInfo.starters.getThisWeekTotal(candidates);
    cards.startersReady.textContent = DashboardInfo.starters.startersReady(candidates);

    // Action Cards
    cards.tasksList.innerHTML = "";
    cards.tasksList.appendChild(DashboardInfo.tasks.htmlList(onboarding));
    cards.startersList.innerHTML = "";
    cards.startersList.appendChild(DashboardInfo.starters.htmlList(candidates));
  },
};
