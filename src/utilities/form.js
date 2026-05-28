export const form = {
  inputs: {
    text: {
      render({ input = "text", id, label, helper } = {}) {
        const container = document.createElement("div");
        container.classList.add("input-item");

        // Label
        const labelEl = document.createElement("label");
        labelEl.classList.add("form-label");
        labelEl.setAttribute("for", id);
        labelEl.textContent = label;

        // Input
        const inputEl = document.createElement("input");
        inputEl.type = input;
        inputEl.id = id;
        inputEl.name = id;

        // Append required elements
        container.appendChild(labelEl);
        container.appendChild(inputEl);

        // Optional helper
        if (helper) {
          const helperEl = document.createElement("div");
          helperEl.classList.add("input-helper");
          helperEl.textContent = helper;

          container.appendChild(helperEl);
        }

        return container;
      },
    },
    "select-dropdown": {
      render({ id, label, options = [], helper } = {}) {
        const container = document.createElement("div");
        container.classList.add("select-dropdown");

        // Label
        const labelEl = document.createElement("label");
        labelEl.classList.add("form-label");
        labelEl.setAttribute("for", id);
        labelEl.textContent = label;

        // Input
        const inputEl = document.createElement("input");
        inputEl.type = "text";
        inputEl.id = id;
        inputEl.name = id;
        inputEl.classList.add("select-input");
        inputEl.autocomplete = "off";

        // Options
        const optionsEl = document.createElement("div");
        optionsEl.classList.add("select-options");

        options.forEach((option) => {
          const optionEl = document.createElement("div");
          optionEl.classList.add("option");
          optionEl.textContent = option;

          optionsEl.appendChild(optionEl);
        });

        // Append required elements
        container.appendChild(labelEl);
        container.appendChild(inputEl);
        container.appendChild(optionsEl);

        // Optional helper
        if (helper) {
          const helperEl = document.createElement("div");
          helperEl.classList.add("input-helper");
          helperEl.textContent = helper;

          container.appendChild(helperEl);
        }

        return container;
      },
    },
    "date-input": {
      render({ id, label, helper, placeholder = "DD/MM/YYYY" } = {}) {
        const container = document.createElement("div");
        container.classList.add("input-item");

        // Label
        const labelEl = document.createElement("label");
        labelEl.classList.add("form-label");
        labelEl.setAttribute("for", id);
        labelEl.textContent = label;

        // Input
        const inputEl = document.createElement("input");
        inputEl.type = "text";
        inputEl.id = id;
        inputEl.name = id;
        inputEl.classList.add("date-input");
        inputEl.placeholder = placeholder;
        inputEl.inputMode = "numeric";
        inputEl.maxLength = 10;
        inputEl.autocomplete = "off";

        // Append required elements
        container.appendChild(labelEl);
        container.appendChild(inputEl);

        // Optional helper
        if (helper) {
          const helperEl = document.createElement("div");
          helperEl.classList.add("input-helper");
          helperEl.textContent = helper;

          container.appendChild(helperEl);
        }

        return container;
      },
    },
    "checkbox-item": {
      render({ id, label, checked = false } = {}) {
        const container = document.createElement("div");
        container.classList.add("checkbox-item");

        // Input
        const inputEl = document.createElement("input");
        inputEl.type = "checkbox";
        inputEl.id = id;
        inputEl.name = id;
        inputEl.checked = checked;

        // Label
        const labelEl = document.createElement("label");
        labelEl.classList.add("form-label");
        labelEl.setAttribute("for", id);
        labelEl.textContent = label;

        // Append in correct order
        container.appendChild(inputEl);
        container.appendChild(labelEl);

        return container;
      },
    },
  },
  buttons: {
    submit: {
      type: "submit",
      className: "green",
      label: "Save",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
              <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
              <path d="M7 3v4a1 1 0 0 0 1 1h7" />
            </svg>`,
    },
    reset: {
      type: "reset",
      className: "yellow",
      label: "Reset",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>`,
    },
    delete: {
      type: "button",
      className: "red",
      id: "delete-candidate",
      label: "Delete",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>`,
    },
    render({ containerId, deleteBtnId } = {}) {
      const container = document.querySelector(containerId);

      if (!container) {
        console.error(`Buttons container not found: ${containerId}`);
        return;
      }

      container.classList.add("form-buttons");

      const buttonList = ["submit", "reset", "delete"];
      buttonList.forEach((key) => {
        const config = this[key];

        if (!config) {
          console.warn(`Unknown button: ${key}`);
          return;
        }

        const btn = document.createElement("button");

        btn.type = config.type || "button";
        btn.className = `btn ${config.className || ""}`.trim();

        if (key === "delete" && deleteBtnId) {
          btn.id = deleteBtnId;
        } else if (config.id) {
          btn.id = config.id;
        }

        if (config.svg) {
          const wrapper = document.createElement("span");
          wrapper.innerHTML = config.svg;
          btn.appendChild(wrapper.firstElementChild);
        }

        btn.appendChild(document.createTextNode(config.label));

        container.appendChild(btn);
      });
    },
  },
  select: {
    click(e) {
      const target = e.target;

      const option = target.closest(".option");
      if (option) {
        const dropdown = option.closest(".select-dropdown");
        const input = dropdown?.querySelector(".select-input");
        const optionsPanel = dropdown?.querySelector(".select-options");

        if (input && optionsPanel) {
          input.value = option.textContent.trim();
          optionsPanel.classList.remove("open");
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
        return true;
      }

      const activeInput = target.closest(".select-input");
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
    },
    handleSearch(e) {
      const input = e.target.closest(".select-input");
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
    },
  },
  date: {
    /**
     * Formats user text to DD/MM/YYYY instantly as they type and syncs YYYY-MM-DD
     * @param {Event} e - Global input event object
     */
    handleInput(e) {
      const input = e.target.closest(".date-input");
      if (!input) return;

      const container = input.closest(".form-field");
      const hiddenInput = container?.querySelector(".date-hidden");

      let value = input.value;

      // 1. Let the user delete slashes naturally without code re-adding them
      if (e.inputType === "deleteContentBackward") {
        // If they deleted a number right next to a slash, clean up the trailing slash
        if (value.endsWith("/")) {
          input.value = value.slice(0, -1);
        }

        // Clear the hidden field since the date is now incomplete
        if (hiddenInput) hiddenInput.value = "";
        return;
      }

      // 2. Strip non-digits and limit to 8 numbers
      let digits = value.replace(/\D/g, "");
      if (digits.length > 8) digits = digits.substring(0, 8);

      // 3. Slash Injection
      let formattedValue = "";
      if (digits.length > 0) {
        // Handle Days block
        formattedValue += digits.substring(0, 2);

        // If exactly 2 digits typed, pop the slash in immediately
        if (digits.length === 2) {
          formattedValue += "/";
        } else if (digits.length > 2) {
          // Handle Months block
          formattedValue += "/" + digits.substring(2, 4);

          // If exactly 4 digits typed, pop the second slash in immediately
          if (digits.length === 4) {
            formattedValue += "/";
          } else if (digits.length > 4) {
            // Handle Years block
            formattedValue += "/" + digits.substring(4, 8);
          }
        }
      }

      // 4. Update the display field
      input.value = formattedValue;

      // 5. Sync to hidden field in YYYY-MM-DD format when complete
      if (digits.length === 8 && hiddenInput) {
        const day = digits.substring(0, 2);
        const month = digits.substring(2, 4);
        const year = digits.substring(4, 8);
        hiddenInput.value = `${year}-${month}-${day}`;
      } else if (hiddenInput) {
        hiddenInput.value = "";
      }
    },
    format: {
      /**
       * Sweeps FormData and converts all British display dates into database-ready ISO strings
       * @param {FormData} formData - Raw data from the form
       * @returns {Object} Plain object fully prepared for Firestore
       */
      toDb(formData) {
        const cleanData = {};
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

        for (const [key, value] of formData.entries()) {
          if (typeof value === "string" && dateRegex.test(value)) {
            const [day, month, year] = value.split("/");
            cleanData[key] = `${year}-${month}-${day}`;
          } else {
            cleanData[key] = value;
          }
        }
        return cleanData;
      },

      /**
       * Sweeps a raw Firebase data object and converts ISO dates back to British display strings
       * @param {Object} dbData - The raw document data returned from Firestore
       * @returns {Object} Object with formatted date strings ready for input values
       */
      toUi(dbData) {
        const cleanData = { ...dbData };
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

        for (const key in cleanData) {
          const value = cleanData[key];
          if (typeof value === "string" && isoDateRegex.test(value)) {
            const [year, month, day] = value.split("-");
            cleanData[key] = `${day}/${month}/${year}`;
          }
        }
        return cleanData;
      },
    },
  },
  /**
   * Extracts form data, formats British dates to ISO, maps checkboxes to booleans,
   * and returns a clean object ready for Firebase.
   * @param {SubmitEvent} event - The native form submission event
   * @returns {Object} Pristine payload object for database injection
   */
  submit(event) {
    event.preventDefault();

    const formElement = event.target;

    // 1. Process all text, select, and date inputs through the date sanitiser
    const processedData = form.date.format.toDb(new FormData(formElement));

    // 2. Automatically sweep and append checkbox states as true/false
    const checkboxes = formElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      if (checkbox.name && checkbox.name.trim() !== "") {
        processedData[checkbox.name] = checkbox.checked;
      }
    });

    return processedData;
  },
  /**
   * Loops through an object dataset and maps values directly to corresponding HTML form inputs,
   * handling Radio Groups, Checkboxes, Select drop-downs, and Text values cleanly.
   * @param {HTMLFormElement} formElement - The target HTML form container
   * @param {Object} data - The localized data object (already formatted via form.date.format.toUi)
   */
  populate(formElement, data) {
    if (!formElement || !data) return;

    Object.entries(data).forEach(([key, value]) => {
      const input = formElement.elements[key];
      if (!input) return;

      // A. Handle Radio Button Groups (NodeLists)
      if (input instanceof NodeList) {
        input.forEach((node) => {
          const isMatch = node.value === String(value);
          node.checked = isMatch;
          node.defaultChecked = isMatch;
        });
      }
      // B. Handle Standalone Checkboxes or Radios
      else if (input.type === "checkbox" || input.type === "radio") {
        input.checked = Boolean(value);
        input.defaultChecked = Boolean(value);
      }
      // C. Handle Select Dropdowns
      else if (input.tagName === "SELECT") {
        input.value = value;
        Array.from(input.options).forEach((option) => {
          option.defaultSelected = option.value === String(value);
        });
      }
      // D. Handle Standard Text / Hidden Inputs (including your British date layout strings)
      else {
        input.value = value;
        input.defaultValue = value;
      }
    });
  },
  render({ selector, scheme }) {
    const form = document.querySelector(selector);

    if (!form) {
      console.error(`Form container not found: ${selector}`);
      return;
    }

    Object.values(scheme).forEach((field) => {
      const renderer = this.inputs[field.input];

      if (!renderer) {
        console.warn(`No renderer found for input type: ${field.input}`);
        return;
      }

      const element = renderer.render(field);

      const buttonsContainer = form.querySelector("#form-buttons");
      if (buttonsContainer) {
        form.insertBefore(element, buttonsContainer);
      } else {
        form.appendChild(element);
      }
    });
  },
};
