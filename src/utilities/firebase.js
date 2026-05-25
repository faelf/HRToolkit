import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const config = JSON.parse(localStorage.getItem("firebase-config"));
const app = initializeApp(config);
export const db = getFirestore(app);
