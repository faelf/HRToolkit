import { storages } from "../utilities/storages.js";

export const appState = {
  candidates: [],
  async loadCandidates() {
    this.candidates = await storages.load("candidates");
    document.dispatchEvent(new CustomEvent("candidates-updated"));
  },
};
