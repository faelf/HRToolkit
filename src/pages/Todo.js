import ToDoHTML from "../html/todo.html?raw";
import { storages } from "../utilities/storages.js";
import { DashboardInfo } from "../utilities/tasks.js";

export const ToDoPage = {
  title: "HR Helper - To Do",
  html: ToDoHTML,
  async setup() {
    const allTasksContainer = document.getElementById("all-tasks");
    if (!allTasksContainer) return;

    const candidates = await storages.load("candidates");
    allTasksContainer.innerHTML = "";
    allTasksContainer.appendChild(DashboardInfo.tasks.allTasksList(candidates));
  },
};
