export const tasks = {
  get(candidate) {
    const tasks = [];
    if (!candidate.references) {
      tasks.push("References");
    }

    if (!candidate.rightToWork) {
      tasks.push("Right to Work");
    }

    if (!candidate.dbs) {
      tasks.push("DBS check");
    }

    if (!candidate.oh) {
      tasks.push("Occupational Health");
    }

    if (candidate.learnSpace === false) {
      tasks.push("Learn Space setup");
    }

    if (candidate.adp === false) {
      tasks.push("ADP setup");
    }

    if (candidate.nameBadge === false) {
      tasks.push("Name badge");
    }

    if (tasks.length === 0) {
      tasks.push("Complete");
    }

    return tasks;
  },
  getFlat(candidates) {
    return candidates.flatMap((candidate) =>
      this.get(candidate).map((task) => ({
        id: candidate.id,
        candidate: candidate.firstName + " " + candidate.lastName,
        task,
      })),
    );
  },
  getTotal(data) {
    const total = this.getFlat(data).length;
    return total;
  },
  getGrouped(onboarding) {
    return onboarding.map((candidate) => ({
      id: candidate.id,
      candidate: candidate.firstName + " " + candidate.lastName,
      tasks: this.get(candidate),
    }));
  },
  htmlList(data) {
    const tasks = this.getGrouped(data);

    if (tasks.length === 0) {
      const emptyTasks = document.createElement("div");
      emptyTasks.className = "empty-tasks";
      emptyTasks.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M12 11h4" />
          <path d="M12 16h4" />
          <path d="M8 11h.01" />
          <path d="M8 16h.01" />
        </svg>
        <span class="empty-text">No tasks</span>
      `;
      return emptyTasks;
    }

    const ul = document.createElement("ul");
    ul.classList.add("task-list");

    for (const item of tasks) {
      const li = document.createElement("li");
      li.className = "task-group";
      li.setAttribute("href", "candidatedetails");
      li.setAttribute("data-id", item.id);

      const nameSpan = document.createElement("span");
      nameSpan.className = "candidate-name";
      nameSpan.textContent = item.candidate;
      li.appendChild(nameSpan);

      const badgesDiv = document.createElement("div");
      badgesDiv.className = "task-badges";

      for (const task of item.tasks) {
        let badgeClass = "pending";
        if (task === "Complete") {
          badgeClass = "complete";
        }

        const badgeSpan = document.createElement("span");
        badgeSpan.className = `task-badge ${badgeClass}`;
        badgeSpan.textContent = task;
        badgesDiv.appendChild(badgeSpan);
      }

      li.appendChild(badgesDiv);
      ul.appendChild(li);
    }

    return ul;
  },
};

export const starters = {
  htmlList(data) {
    const starters = data;

    if (starters.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-starters";
      empty.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M12 11h4" />
          <path d="M12 16h4" />
          <path d="M8 11h.01" />
          <path d="M8 16h.01" />
        </svg>
        <span class="empty-text">No starters</span>
      `;
      return empty;
    }

    const ul = document.createElement("ul");
    ul.classList.add("starters-list");

    for (const item of starters) {
      const li = document.createElement("li");
      li.className = "candidate-list";
      li.setAttribute("href", "candidatedetails");
      li.setAttribute("data-id", item.id);

      const name = document.createElement("span");
      name.className = "candidate-name";
      name.textContent = item.candidate;
      li.appendChild(name);

      const date = document.createElement("span");
      date.className.add("candidate-date");
      li.appendChild(date);

      ul.appendChild(li);
    }

    return ul;
  },
};
