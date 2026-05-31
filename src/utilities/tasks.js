function createEmptyContainer({ text }) {
  const container = document.createElement("div");
  container.className = "empty-state";
  container.innerHTML = /* html */ `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/>
        <path d="M14 2v5a1 1 0 0 0 1 1h5"/>
        <path d="M9 15h6"/>
        <path d="M12 18v-6"/>
      </svg>
      <p class="text-muted h3">${text}</p>
    `;
  return container;
}

function createHtmlBadgeList({ tasks }) {
  if (tasks.length === 0) {
    return createEmptyContainer({ text: "No Tasks" });
  }

  const ul = document.createElement("ul");
  ul.classList.add("list-style-none");

  for (const item of tasks) {
    const li = document.createElement("li");
    li.setAttribute("data-href", "candidatedetails");
    li.setAttribute("data-id", item.id);

    const nameSpan = document.createElement("span");
    nameSpan.className = "fw-600";
    nameSpan.textContent = item.candidate;
    li.appendChild(nameSpan);

    const badgesDiv = document.createElement("div");
    badgesDiv.className = "badge-group";

    for (const task of item.tasks) {
      const badgeSpan = document.createElement("span");
      badgeSpan.className = "badge red";
      badgeSpan.textContent = task;
      badgesDiv.appendChild(badgeSpan);
    }

    li.appendChild(badgesDiv);
    ul.appendChild(li);
  }

  return ul;
}

function createHtmlTwoColList({ items, emptyText, secondaryKey }) {
  if (items.length === 0) {
    return createEmptyContainer({ text: emptyText });
  }

  const ul = document.createElement("ul");
  ul.classList.add("list-style-none");

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "li-2-col";
    li.setAttribute("data-href", "candidatedetails");
    li.setAttribute("data-id", item.id);

    const nameSpan = document.createElement("span");
    nameSpan.className = "fw-600";
    nameSpan.textContent = item.candidate;
    li.appendChild(nameSpan);

    const secondSpan = document.createElement("span");
    secondSpan.className = "text-muted";
    secondSpan.textContent = item[secondaryKey];
    li.appendChild(secondSpan);

    ul.appendChild(li);
  }
  return ul;
}

function getCandidateName(candidate) {
  return `${candidate["first-name"]} ${candidate["last-name"]}`;
}

export const DashboardInfo = {
  tasks: {
    get(candidate) {
      const tasks = [];
      if (!candidate["right-to-work"]) tasks.push("Right to work");
      if (!candidate["dbs-issue-date"]) tasks.push("DBS check");
      if (!candidate["oh"]) tasks.push("Occupational Health");
      if (!candidate["references"]) tasks.push("References");
      if (!candidate["learn-space"]) tasks.push("LearnSpace setup");
      if (!candidate.adp) tasks.push("ADP setup");
      if (!candidate["name-badge"]) tasks.push("Name badge");
      if (!candidate["identity-check"]) tasks.push("Identity check");

      return tasks;
    },
    getPostCheckTasks(candidate) {
      const tasks = [];
      if (!candidate["identity-check"]) tasks.push("Identity check");
      if (!candidate["learn-space"]) tasks.push("Learn Space setup");
      if (!candidate.adp) tasks.push("ADP setup");
      if (!candidate["name-badge"]) tasks.push("Name badge");

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
      return createHtmlBadgeList({ tasks: onboardingCandidates });
    },
    postCheckTasksList(candidates) {
      const postCheckCandidates = candidates
        .map((candidate) => ({
          id: candidate.id,
          candidate: getCandidateName(candidate),
          tasks: this.getPostCheckTasks(candidate),
        }))
        .filter((c) => c.tasks.length > 0);
      return createHtmlBadgeList({ tasks: postCheckCandidates });
    },
    allTasksList(candidates) {
      return createHtmlTwoColList({
        items: this.getFlat(candidates),
        emptyText: "No Tasks",
        secondaryKey: "task",
      });
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
    startersList(data) {
      return createHtmlTwoColList({
        items: this.get(data),
        emptyText: "No Starters",
        secondaryKey: "date",
      });
    },
  },
};
