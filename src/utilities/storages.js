export const storages = {
  Key: "hrhelper-storage",
  Value: {
    Default: "Local Storage",
    LocalStorage: "Local Storage",
    Firestore: "Firestore",
  },
  Firebase: {
    app: "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js",
    Database: "Firestore",
    Firestore: {
      ConfigKey: "hrhelper-firebase",
      url: "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js",
    },
  },
  init() {
    if (!localStorage.getItem(this.Key)) {
      localStorage.setItem(this.Key, this.Value.Default);
    }
  },

  getStorage() {
    return localStorage.getItem(this.Key) ?? this.Value.Default;
  },

  async _getFirestore() {
    const [firebaseApp, firestore] = await Promise.all([
      import(this.Firebase.app),
      import(this.Firebase.Firestore.url),
    ]);

    const config = JSON.parse(localStorage.getItem(this.Firebase.Firestore.ConfigKey));
    const app = firebaseApp.initializeApp(config);
    const db = firestore.getFirestore(app);

    return { db, ...firestore };
  },

  async load(collectionName) {
    if (this.getStorage() === this.Value.LocalStorage) {
      try {
        const storedData = localStorage.getItem(collectionName);
        return storedData ? JSON.parse(storedData) : [];
      } catch (error) {
        console.error("Local Storage parse error:", error);
        return [];
      }
    }

    if (this.getStorage() === this.Value.Firestore) {
      const { db, collection, getDocs } = await this._getFirestore();
      const col = collection(db, collectionName);
      const snapshot = await getDocs(col);

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    }

    return [];
  },

  async get(collectionName, itemId) {
    if (this.getStorage() === this.Value.LocalStorage) {
      const items = await this.load(collectionName);
      return items.find((item) => item.id == itemId);
    }

    if (this.getStorage() === this.Value.Firestore) {
      const { db, doc, getDoc } = await this._getFirestore();
      const docRef = doc(db, collectionName, itemId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    }
  },

  async add(collectionName, data) {
    if (this.getStorage() === this.Value.LocalStorage) {
      const items = await this.load(collectionName);
      const newItem = {
        id: String(Date.now() + Math.floor(Math.random() * 1000)),
        ...data,
      };
      items.push(newItem);
      this.save(collectionName, items);
      return newItem;
    }

    if (this.getStorage() === this.Value.Firestore) {
      const { db, collection, addDoc } = await this._getFirestore();
      const col = collection(db, collectionName);
      const { id, ...dataToSave } = data;
      const docRef = await addDoc(col, dataToSave);
      return { id: docRef.id, ...dataToSave };
    }
  },

  async update(collectionName, itemId, updates) {
    if (this.getStorage() === this.Value.LocalStorage) {
      const items = await this.load(collectionName);
      const itemIndex = items.findIndex((item) => item.id == itemId);
      if (itemIndex === -1) return false;
      items[itemIndex] = { ...items[itemIndex], ...updates };
      this.save(collectionName, items);
      return true;
    }

    if (this.getStorage() === this.Value.Firestore) {
      const { db, doc, updateDoc } = await this._getFirestore();
      const docRef = doc(db, collectionName, itemId);
      await updateDoc(docRef, updates);
      return true;
    }
  },

  async remove(collectionName, itemId) {
    if (this.getStorage() === this.Value.LocalStorage) {
      const items = await this.load(collectionName);
      const filteredItems = items.filter((item) => item.id != itemId);
      this.save(collectionName, filteredItems);
      return true;
    }

    if (this.getStorage() === this.Value.Firestore) {
      const { db, doc, deleteDoc } = await this._getFirestore();
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
