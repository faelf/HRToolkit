export const storages = {
  init() {
    const current = localStorage.getItem("storage");
    if (current !== "Local Storage" && current !== "Firebase") {
      localStorage.setItem("storage", "Local Storage");
    }
  },

  getStorage() {
    return localStorage.getItem("storage") ?? "Local Storage";
  },

  async _getFirebase() {
    const [{ db }, firestore] = await Promise.all([
      import("./firebase.js"),
      import("https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js"),
    ]);
    return { db, ...firestore };
  },

  async load(collectionName) {
    if (this.getStorage() === "Firebase") {
      const { db, collection, getDocs } = await this._getFirebase();
      const col = collection(db, collectionName);
      const snapshot = await getDocs(col);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
    // Fallback to Local Storage
    const storedData = localStorage.getItem(collectionName);
    return storedData ? JSON.parse(storedData) : [];
  },

  async get(collectionName, itemId) {
    if (this.getStorage() === "Firebase") {
      const { db, doc, getDoc } = await this._getFirebase();
      const docRef = doc(db, collectionName, itemId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    }
    // Fallback to Local Storage
    const items = await this.load(collectionName);
    return items.find((item) => item.id == itemId);
  },

  async add(collectionName, data) {
    if (this.getStorage() === "Firebase") {
      const { db, collection, addDoc } = await this._getFirebase();
      const col = collection(db, collectionName);
      const docRef = await addDoc(col, data);
      return { id: docRef.id, ...data };
    }
    // Fallback to Local Storage
    const items = await this.load(collectionName);
    const newItem = {
      id: String(Date.now() + Math.floor(Math.random() * 1000)),
      ...data,
    };
    items.push(newItem);
    this.save(collectionName, items);
    return newItem;
  },

  async update(collectionName, itemId, updates) {
    if (this.getStorage() === "Firebase") {
      const { db, doc, updateDoc } = await this._getFirebase();
      const docRef = doc(db, collectionName, itemId);
      await updateDoc(docRef, updates);
      return true;
    }
    // Fallback to Local Storage
    const items = await this.load(collectionName);
    const itemIndex = items.findIndex((item) => item.id == itemId);
    if (itemIndex === -1) return false;
    items[itemIndex] = { ...items[itemIndex], ...updates };
    this.save(collectionName, items);
    return true;
  },

  async remove(collectionName, itemId) {
    if (this.getStorage() === "Firebase") {
      const { db, doc, deleteDoc } = await this._getFirebase();
      const docRef = doc(db, collectionName, itemId);
      await deleteDoc(docRef);
      return true;
    }
    // Fallback to Local Storage
    const items = await this.load(collectionName);
    const filteredItems = items.filter((item) => item.id != itemId);
    this.save(collectionName, filteredItems);
    return true;
  },

  async exists(collectionName, itemId) {
    return Boolean(await this.get(collectionName, itemId));
  },

  save(key, values) {
    localStorage.setItem(key, JSON.stringify(values));
  },
};
