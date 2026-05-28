import { storages } from "../utilities/storages.js";
import { tasks } from "../utilities/tasks.js";

import DashboardHTML from "../html/dashboard.html?raw";

export const DashboardPage = {
  title: "HR Helper - Dashboard",
  html: DashboardHTML,
  async setup() {
    const cards = {
      total: document.querySelector("#total"),
      todo: document.querySelector("#todo"),
      tasksList: document.querySelector("#task-list-container"),
      startersList: document.querySelector("#starters"),
    };

    const candidates = await storages.load("candidates");
    const onboarding = candidates.filter((c) => c.status == "Onboarding");

    cards.todo.textContent = tasks.getTotal(candidates);
    cards.total.textContent = onboarding.length;
    cards.tasksList.innerHTML = "";
    cards.tasksList.appendChild(tasks.htmlList(onboarding));
  },
};
