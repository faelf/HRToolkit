export const storages = {
  getStorage() {
    return localStorage.getItem("storage") ?? "localstorage";
  },

  async _getFirebase() {
    const [{ db }, firestore] = await Promise.all([
      import("./firebase.js"),
      import("https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js"),
    ]);
    return { db, ...firestore };
  },

  async load(collectionName) {
    if (this.getStorage() === "localstorage") {
      const storedData = localStorage.getItem(collectionName);
      return storedData ? JSON.parse(storedData) : [];
    } else if (this.getStorage() === "firebase") {
      const { db, collection, getDocs } = await this._getFirebase();
      const col = collection(db, collectionName);
      const snapshot = await getDocs(col);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
  },

  async get(collectionName, itemId) {
    if (this.getStorage() === "localstorage") {
      const items = await this.load(collectionName);
      return items.find((item) => item.id == itemId);
    } else if (this.getStorage() === "firebase") {
      const { db, doc, getDoc } = await this._getFirebase();
      const docRef = doc(db, collectionName, itemId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    }
  },

  async add(collectionName, data) {
    if (this.getStorage() === "localstorage") {
      const items = await this.load(collectionName);
      const newItem = {
        id: String(Date.now() + Math.floor(Math.random() * 1000)),
        ...data,
      };
      items.push(newItem);
      this.save(collectionName, items);
      return newItem;
    } else if (this.getStorage() === "firebase") {
      const { db, collection, addDoc } = await this._getFirebase();
      const col = collection(db, collectionName);
      const docRef = await addDoc(col, data);
      return { id: docRef.id, ...data };
    }
  },

  async update(collectionName, itemId, updates) {
    if (this.getStorage() === "localstorage") {
      const items = await this.load(collectionName);
      const itemIndex = items.findIndex((item) => item.id == itemId);
      if (itemIndex === -1) return false;
      items[itemIndex] = { ...items[itemIndex], ...updates };
      this.save(collectionName, items);
      return true;
    } else if (this.getStorage() === "firebase") {
      const { db, doc, updateDoc } = await this._getFirebase();
      const docRef = doc(db, collectionName, itemId);
      await updateDoc(docRef, updates);
      return true;
    }
  },

  async remove(collectionName, itemId) {
    if (this.getStorage() === "localstorage") {
      const items = await this.load(collectionName);
      const filteredItems = items.filter((item) => item.id != itemId);
      this.save(collectionName, filteredItems);
      return true;
    } else if (this.getStorage() === "firebase") {
      const { db, doc, deleteDoc } = await this._getFirebase();
      const docRef = doc(db, collectionName, itemId);
      await deleteDoc(docRef);
      return true;
    }
  },

  async exists(collectionName, itemId) {
    return Boolean(await this.get(collectionName, itemId));
  },

  save(key, values) {
    localStorage.setItem(key, JSON.stringify(values));
  },
};
