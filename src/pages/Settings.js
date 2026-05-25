import SettingsHTML from "../html/settings.html?raw";
import { form } from "../utilities/form.js";

export const SettingsPage = {
  title: "HR Helper - Settings",
  html: SettingsHTML,
  setup() {
    const storageForm = document.querySelector("#storage-form");
    const storageInput = document.querySelector("#storage-options");
    const firebaseFields = document.querySelector("#firebase-fields");

    function toggleFirebaseFields() {
      const isFirebase = storageInput.value === "Firebase";
      if (isFirebase) {
        firebaseFields.classList.remove("d-none");
      } else {
        firebaseFields.classList.add("d-none");
      }
    }

    storageInput.addEventListener("change", toggleFirebaseFields);

    const savedStorage = localStorage.getItem("storage") ?? "Local Storage";
    const savedConfig = JSON.parse(localStorage.getItem("firebase-config") ?? "{}");

    form.populate(storageForm, {
      "storage-options": savedStorage,
      "api-key": savedConfig.apiKey ?? "",
      "auth-domain": savedConfig.authDomain ?? "",
      "project-id": savedConfig.projectId ?? "",
      "storage-bucket": savedConfig.storageBucket ?? "",
      "sender-id": savedConfig.messagingSenderId ?? "",
      "app-id": savedConfig.appId ?? "",
    });

    toggleFirebaseFields();

    storageForm.addEventListener("submit", (event) => {
      const formData = form.submit(event);
      const selectedStorage = formData["storage-options"];
      localStorage.setItem("storage", selectedStorage);

      if (selectedStorage === "Firebase") {
        const config = {
          apiKey: formData["api-key"],
          authDomain: formData["auth-domain"],
          projectId: formData["project-id"],
          storageBucket: formData["storage-bucket"],
          messagingSenderId: formData["sender-id"],
          appId: formData["app-id"],
        };
        localStorage.setItem("firebase-config", JSON.stringify(config));
      }
    });
  },
};
