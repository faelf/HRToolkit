export function handleSelectInputClick(e) {
  const target = e.target;

  const option = target.closest(".option");
  if (option) {
    const dropdown = option.closest(".select-dropdown");
    const input = dropdown?.querySelector(".dropdown-input");
    const optionsPanel = dropdown?.querySelector(".select-options");

    if (input && optionsPanel) {
      input.value = option.textContent.trim();
      optionsPanel.classList.remove("open");
    }
    return true;
  }

  const activeInput = target.closest(".dropdown-input");
  if (activeInput) {
    const currentDropdown = activeInput.closest(".select-dropdown");
    const currentPanel = currentDropdown?.querySelector(".select-options");

    document.querySelectorAll(".select-options.open").forEach((panel) => {
      if (panel !== currentPanel) panel.classList.remove("open");
    });

    currentPanel?.classList.add("open");
    return true;
  }

  if (!target.closest(".select-dropdown")) {
    document.querySelectorAll(".select-options.open").forEach((panel) => {
      panel.classList.remove("open");
    });
  }

  return false;
}

export function handleSelectInputSearch(e) {
  const input = e.target.closest(".dropdown-input");
  if (!input) return;

  const dropdown = input.closest(".select-dropdown");
  const optionsPanel = dropdown?.querySelector(".select-options");
  const options = dropdown?.querySelectorAll(".option");
  const query = input.value.toLowerCase().trim();

  optionsPanel?.classList.add("open");

  options?.forEach((option) => {
    const text = option.textContent.toLowerCase();
    option.style.display = text.includes(query) ? "block" : "none";
  });
}
