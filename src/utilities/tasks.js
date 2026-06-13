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

export function createHtmlBadgeList({ tasks }) {
  if (tasks.length === 0) {
    return createEmptyContainer({ text: "No Tasks" });
  }

  const ul = document.createElement("ul");
  ul.className = "list-group m-2";

  for (const item of tasks) {
    const li = document.createElement("li");
    li.className = "d-flex-column g-2";
    li.setAttribute("data-href", "candidatedetails");
    li.setAttribute("data-id", item.id);

    const infoDiv = document.createElement("div");
    infoDiv.className = "d-flex space-between";

    const nameSpan = document.createElement("span");
    nameSpan.className = "fw-600";
    nameSpan.textContent = item.candidate;
    infoDiv.appendChild(nameSpan);

    if (item.jobTitle) {
      const jobSpan = document.createElement("span");
      jobSpan.className = "text-muted";
      jobSpan.textContent = item.jobTitle;
      infoDiv.appendChild(jobSpan);
    }

    li.appendChild(infoDiv);

    const badgesDiv = document.createElement("div");
    badgesDiv.className = "d-flex-200 g-2";

    if (item.tasks.length === 0) {
      const badgeSpan = document.createElement("span");
      badgeSpan.className = "badge green-subtle";
      badgeSpan.textContent = "Complete";
      badgesDiv.appendChild(badgeSpan);
    }
    
    if (item.tasks.length > 0){
      for (const task of item.tasks) {
        const badgeSpan = document.createElement("span");
        badgeSpan.className = "badge blue-subtle";
        badgeSpan.textContent = task;
        badgesDiv.appendChild(badgeSpan);
      }
    }

    li.appendChild(badgesDiv);
    ul.appendChild(li);
  }

  return ul;
}

export function createHtmlTwoColList({ items, emptyText, secondaryKey }) {
  if (items.length === 0) {
    return createEmptyContainer({ text: emptyText });
  }

  const ul = document.createElement("ul");
  ul.className = "list-group";

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "d-flex space-between align-items-center";
    li.setAttribute("data-href", "candidatedetails");
    li.setAttribute("data-id", item.id);

    const infoDiv = document.createElement("div");
    infoDiv.className = "d-flex-column";

    const nameSpan = document.createElement("span");
    nameSpan.className = "fw-600";
    nameSpan.textContent = item.candidate;
    infoDiv.appendChild(nameSpan);

    if (item.jobTitle) {
      const jobSpan = document.createElement("small");
      jobSpan.className = "text-muted fs-sm";
      jobSpan.textContent = item.jobTitle;
      infoDiv.appendChild(jobSpan);
    }

    li.appendChild(infoDiv);

    const secondSpan = document.createElement("div");
    secondSpan.className = "text-muted";
    secondSpan.textContent = item[secondaryKey];
    li.appendChild(secondSpan);

    ul.appendChild(li);
  }
  return ul;
}

function gridCardList({ items, emptyText, secondaryKey }) {
  if (items.length === 0) {
    return createEmptyContainer({ text: emptyText });
  }

  const ul = document.createElement("ul");
  ul.classList.add("list-card-group");

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "d-flex-column g-2";
    li.setAttribute("data-href", "candidatedetails");
    li.setAttribute("data-id", item.id);

    const infoDiv = document.createElement("div");
    infoDiv.className = "d-flex-column";

    const nameSpan = document.createElement("span");
    nameSpan.className = "fw-600";
    nameSpan.textContent = item.candidate;
    infoDiv.appendChild(nameSpan);

    if (item.jobTitle) {
      const jobSpan = document.createElement("small");
      jobSpan.className = "text-muted";
      jobSpan.textContent = item.jobTitle;
      infoDiv.appendChild(jobSpan);
    }

    li.appendChild(infoDiv);

    const secondSpan = document.createElement("span");
    secondSpan.className = "badge blue-subtle";
    secondSpan.textContent = item[secondaryKey];
    li.appendChild(secondSpan);

    ul.appendChild(li);
  }
  return ul;
}

function getCandidateName(candidate) {
  return `${candidate["first-name"]} ${candidate["last-name"]}`;
}

const chekcs = {
  onboarding: [
    { key: "right-to-work", label: "Right to Work" },
    { key: "dbs-issue-date", label: "DBS check" },
    { key: "professional-registration", label: "Professional Registration" },
    { key: "oh-issue-date", label: "Occupational Health" },
    { key: "reference-sent", label: "Send References" },
    { key: "reference-received", label: "References Received" },
  ],
  postchecking: [
    { key: "identity-check", label: "Identity check" },
    { key: "learn-space", label: "Learn Space setup" },
    { key: "adp", label: "ADP setup" },
    { key: "name-badge", label: "Name badge" },
  ],
};

function getMissingTasks(candidate, stage) {
  const checks = stage === "all" ? [...chekcs.onboarding, ...chekcs.postchecking] : chekcs[stage];

  return checks.filter((check) => !candidate[check.key]).map((check) => check.label);
}

const tasks = {
  getFlat(candidates) {
    return candidates
      .flatMap((candidate) =>
        getMissingTasks(candidate, "all").map((task) => ({
          id: candidate.id,
          candidate: getCandidateName(candidate),
          jobTitle: candidate["job-title"],
          task,
        })),
      )
      .sort((a, b) => a.candidate.localeCompare(b.candidate));
  },
  getTotal(data) {
    return this.getFlat(data).length;
  },
  onboardingTasksList(onboarding) {
    const onboardingCandidates = onboarding
      .map((candidate) => ({
        id: candidate.id,
        candidate: getCandidateName(candidate),
        jobTitle: candidate["job-title"],
        tasks: getMissingTasks(candidate, "onboarding"),
      }))
      .sort((a, b) => a.candidate.localeCompare(b.candidate));
    return createHtmlBadgeList({ tasks: onboardingCandidates });
  },
  postCheckTasksList(candidates) {
    const postCheckCandidates = candidates
      .map((candidate) => ({
        id: candidate.id,
        candidate: getCandidateName(candidate),
        jobTitle: candidate["job-title"],
        tasks: getMissingTasks(candidate, "postchecking"),
      }))
      .sort((a, b) => a.candidate.localeCompare(b.candidate));
    return createHtmlBadgeList({ tasks: postCheckCandidates });
  },
  allTasksList(candidates) {
    return gridCardList({
      items: this.getFlat(candidates),
      emptyText: "No Tasks",
      secondaryKey: "task",
    });
  },
};

const starters = {
  get(candidates) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      candidates
        .filter((c) => c["start-date"])
        .map((c) => {
          // Convert the stored YYYY-MM-DD date back to British format
          const [year, month, day] = c["start-date"].split("-");
          return {
            id: c.id,
            candidate: getCandidateName(c),
            jobTitle: c["job-title"],
            date: `${day}/${month}/${year}`,
            rawDate: new Date(Number(year), Number(month) - 1, Number(day)),
          };
        })
        .filter((c) => c.rawDate >= today)
        // Sort to show the closest upcoming starters first
        .sort((a, b) => a.rawDate - b.rawDate)
    );
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
  startersList(data) {
    return createHtmlTwoColList({
      items: this.get(data),
      emptyText: "No Starters",
      secondaryKey: "date",
    });
  },
};

export const DashboardInfo = { tasks, starters };
