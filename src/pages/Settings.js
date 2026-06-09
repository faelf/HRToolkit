import SettingsHTML from "../html/settings.html?raw";
import * as form from "../utilities/form.js";
import { storages } from "../utilities/storages.js";

export const SettingsPage = {
  title: "HR Helper - Settings",
  html: SettingsHTML,
  setup() {
    const storageForm = document.querySelector("#storage-form");
    const storageInput = document.querySelector("#storage-options");
    const firebaseFields = document.querySelector("#firestore-keys");

    function toggleFirebaseFields() {
      const isFirebase = storageInput.value === storages.Value.Firestore;
      if (isFirebase) {
        firebaseFields.classList.remove("d-none");
      } else {
        firebaseFields.classList.add("d-none");
      }
    }

    storageInput.addEventListener("change", toggleFirebaseFields);

    const savedStorage = storages.getStorage();
    const savedConfig = JSON.parse(localStorage.getItem(storages.Firebase.Firestore.ConfigKey) ?? "{}");

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

    storageForm.addEventListener("submit", async (event) => {
      const formData = form.submit(event);
      const selectedStorage = formData["storage-options"];
      localStorage.setItem(storages.Key, selectedStorage);

      if (selectedStorage === storages.Value.Firestore) {
        const config = {
          apiKey: formData["api-key"],
          authDomain: formData["auth-domain"],
          projectId: formData["project-id"],
          storageBucket: formData["storage-bucket"],
          messagingSenderId: formData["sender-id"],
          appId: formData["app-id"],
        };
        localStorage.setItem(storages.Firebase.Firestore.ConfigKey, JSON.stringify(config));
      }

      // Trigger global state refresh to load data from the newly selected storage
      await new Promise((resolve) => {
        document.addEventListener("candidates-updated", resolve, { once: true });
        document.dispatchEvent(new CustomEvent("refresh-candidates"));
      });
      
      alert("Storage settings updated and data refreshed!");
    });
  },
};
