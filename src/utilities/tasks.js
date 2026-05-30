const createEmptyContainer = (text) => {
  const container = document.createElement("div");
  container.className = "empty-state";
  container.innerHTML = /* html */ `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <path d="m15 9-6 6"/>
        <path d="m9 9 6 6"/>
      </svg>
      <p class="text-muted h1">${text}</p>
    `;
  return container;
};

const createHtmlBadgeList = (tasks) => {
  if (tasks.length === 0) {
    return createEmptyContainer("No Tasks");
  }

  const ul = document.createElement("ul");
  ul.classList.add("task-list");

  for (const item of tasks) {
    const li = document.createElement("li");
    li.className = "task-group";
    li.setAttribute("data-href", "candidatedetails");
    li.setAttribute("data-id", item.id);

    const nameSpan = document.createElement("span");
    nameSpan.className = "candidate-name";
    nameSpan.textContent = item.candidate;
    li.appendChild(nameSpan);

    const badgesDiv = document.createElement("div");
    badgesDiv.className = "task-badges";

    for (const task of item.tasks) {
      const badgeSpan = document.createElement("span");
      badgeSpan.className = "task-badge pending";
      badgeSpan.textContent = task;
      badgesDiv.appendChild(badgeSpan);
    }

    li.appendChild(badgesDiv);
    ul.appendChild(li);
  }

  return ul;
};

const getCandidateName = (candidate) => `${candidate["first-name"]} ${candidate["last-name"]}`;

export const DashboardInfo = {
  tasks: {
    get(candidate) {
      const tasks = [];
      if (!candidate["right-to-work"]) tasks.push("Right to Work");
      if (!candidate["dbs-issue-date"]) tasks.push("DBS check");
      if (!candidate["oh"]) tasks.push("Occupational Health");
      if (!candidate["references"]) tasks.push("References");
      if (candidate["learn-space"] === false) tasks.push("Learn Space setup");
      if (candidate.adp === false) tasks.push("ADP setup");
      if (candidate["name-badge"] === false) tasks.push("Name badge");

      return tasks;
    },
    getPostCheckTasks(candidate) {
      const tasks = [];
      if (candidate["learn-space"] === false) tasks.push("Learn Space setup");
      if (candidate.adp === false) tasks.push("ADP setup");
      if (candidate["name-badge"] === false) tasks.push("Name badge");

      return tasks;
    },
    getOnboardingTasks(candidate) {
      const tasks = [];
      if (!candidate["right-to-work"]) tasks.push("Right to Work");
      if (!candidate["dbs-issue-date"]) tasks.push("DBS check");
      if (!candidate["oh"]) tasks.push("Occupational Health");
      if (!candidate["references"]) tasks.push("References");

      return tasks;
    },
    getFlat(candidates) {
      return candidates.flatMap((candidate) =>
        this.get(candidate).map((task) => ({
          id: candidate.id,
          candidate: getCandidateName(candidate),
          task,
        })),
      );
    },
    getTotal(data) {
      return this.getFlat(data).length;
    },
    getGrouped(onboarding) {
      return onboarding
        .map((candidate) => ({
          id: candidate.id,
          candidate: getCandidateName(candidate),
          tasks: this.get(candidate),
        }))
        .filter((c) => c.tasks.length > 0);
    },
    onboardingTasksList(onboarding) {
      const onboardingCandidates = onboarding
        .map((candidate) => ({
          id: candidate.id,
          candidate: getCandidateName(candidate),
          tasks: this.getOnboardingTasks(candidate),
        }))
        .filter((c) => c.tasks.length > 0);
      return createHtmlBadgeList(onboardingCandidates);
    },
    postCheckTasksList(candidates) {
      const postCheckCandidates = candidates
        .map((candidate) => ({
          id: candidate.id,
          candidate: getCandidateName(candidate),
          tasks: this.getPostCheckTasks(candidate),
        }))
        .filter((c) => c.tasks.length > 0);
      return createHtmlBadgeList(postCheckCandidates);
    },
  },
  starters: {
    get(candidates) {
      return (
        candidates
          .filter((c) => c["start-date"])
          .map((c) => {
            // Convert the stored YYYY-MM-DD date back to British format
            const [year, month, day] = c["start-date"].split("-");
            return {
              id: c.id,
              candidate: getCandidateName(c),
              date: `${day}/${month}/${year}`,
              rawDate: new Date(Number(year), Number(month) - 1, Number(day)),
            };
          })
          // Sort to show the closest upcoming starters first
          .sort((a, b) => a.rawDate - b.rawDate)
      );
    },
    getTotal(data) {
      return this.get(data).length;
    },
    getThisWeekTotal(data) {
      const now = new Date();
      const currentDay = now.getDay() || 7; // Convert Sunday (0) to 7

      // Find Monday
      const monday = new Date(now);
      monday.setDate(now.getDate() - currentDay + 1);
      monday.setHours(0, 0, 0, 0);

      // Find Sunday
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      return this.get(data).filter((s) => s.rawDate >= monday && s.rawDate <= sunday).length;
    },
    startersReady(data) {
      return data.filter((c) => c.status === "Ready" || c["onboarding-status"] === "Ready").length;
    },
    htmlList(data) {
      const starters = this.get(data);

      if (starters.length === 0) {
        return createEmptyContainer("No Starters");
      }

      const ul = document.createElement("ul");
      ul.classList.add("starters-list");

      for (const item of starters) {
        const li = document.createElement("li");
        li.className = "candidate-list";
        li.setAttribute("data-href", "candidatedetails");
        li.setAttribute("data-id", item.id);

        const name = document.createElement("span");
        name.className = "candidate-name";
        name.textContent = item.candidate;
        li.appendChild(name);

        const date = document.createElement("span");
        date.classList.add("text-muted");
        date.textContent = item.date;
        li.appendChild(date);

        ul.appendChild(li);
      }

      return ul;
    },
  },
};
