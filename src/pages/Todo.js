import ToDoHTML from "../html/todo.html?raw";
import { DashboardInfo } from "../utilities/tasks.js";
import { appState } from "../core/state.js";

export const ToDoPage = {
  title: "HR Helper - To Do",
  html: ToDoHTML,
  async setup() {
    const allTasksContainer = document.getElementById("all-tasks");
    if (!allTasksContainer) return;

    const candidates = appState.candidates;
    allTasksContainer.innerHTML = "";
    allTasksContainer.appendChild(DashboardInfo.tasks.allTasksList(candidates));
  },
};
