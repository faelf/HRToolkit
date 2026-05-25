import SettingsHTML from "../html/settings.html?raw";

export const SettingsPage = {
  title: "HR Helper - Settings",
  html: SettingsHTML,
  setup() {
    // --- Set Storage
    const storageForm = document.querySelector("#storage-form");
    const storageSelect = document.querySelector("#storage-options");
    const firebaseFields = document.querySelectorAll(".mb-3:not(:first-child):not(:last-child)");
    // easier to just wrap them, see below

    // On load — populate fields with saved values
    storageSelect.value = localStorage.getItem("storage") ?? "localstorage";

    const savedConfig = JSON.parse(localStorage.getItem("firebaseConfig") ?? "{}");
    document.querySelector("#api-key").value = savedConfig.apiKey ?? "";
    document.querySelector("#auth-domain").value = savedConfig.authDomain ?? "";
    document.querySelector("#project-id").value = savedConfig.projectId ?? "";
    document.querySelector("#storage-bucket").value = savedConfig.storageBucket ?? "";
    document.querySelector("#sender-id").value = savedConfig.messagingSenderId ?? "";
    document.querySelector("#app-id").value = savedConfig.appId ?? "";

    // Show/hide firebase fields based on select
    function toggleFirebaseFields() {
      const isFirebase = storageSelect.value === "firebase";
      document.querySelector("#firebase-fields").style.display = isFirebase ? "block" : "none";
    }

    storageSelect.addEventListener("change", toggleFirebaseFields);
    toggleFirebaseFields(); // run on load

    // Save
    storageForm.addEventListener("submit", (event) => {
      event.preventDefault();
      localStorage.setItem("storage", storageSelect.value);

      if (storageSelect.value === "firebase") {
        const config = {
          apiKey: document.querySelector("#api-key").value,
          authDomain: document.querySelector("#auth-domain").value,
          projectId: document.querySelector("#project-id").value,
          storageBucket: document.querySelector("#storage-bucket").value,
          messagingSenderId: document.querySelector("#sender-id").value,
          appId: document.querySelector("#app-id").value,
        };
        localStorage.setItem("firebaseConfig", JSON.stringify(config));
      }
    });
  },
};
