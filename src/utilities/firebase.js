import { db } from "../data/firebaseConfig.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/**
 * Utility object for interacting with Firebase Firestore.
 * Provides methods for CRUD operations on collections and documents.
 * @module utils/firebase
 */
export const firebase = {
  /**
   * Retrieves all documents from a specified collection.
   * @param {string} collectionName - The name of the collection to fetch.
   * @returns {Promise<Array<Object>>} An array of document objects, each including its `id`.
   */
  async getDocuments(collectionName) {
    const col = collection(db, collectionName);
    const snapshot = await getDocs(col);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /**
   * Retrieves a single document by its ID from a specified collection.
   * @param {string} collectionName - The name of the collection.
   * @param {string} docId - The ID of the document to retrieve.
   * @returns {Promise<Object|null>} The document object including `id` if found, otherwise null.
   */
  async getDocument(collectionName, docId) {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  /**
   * Adds a new document to a specified collection.
   * @param {string} collectionName - The name of the collection.
   * @param {Object} data - The data object to store.
   * @returns {Promise<string>} The ID of the newly created document.
   */
  async addDocument(collectionName, data) {
    const col = collection(db, collectionName);
    const docRef = await addDoc(col, data);
    return docRef.id;
  },

  /**
   * Updates an existing document in a specified collection.
   * @param {string} collectionName - The name of the collection.
   * @param {string} docId - The ID of the document to update.
   * @param {Object} data - The data to update (merges with existing data).
   * @returns {Promise<void>}
   */
  async updateDocument(collectionName, docId, data) {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  },

  /**
   * Deletes a document from a specified collection.
   * @param {string} collectionName - The name of the collection.
   * @param {string} docId - The ID of the document to delete.
   * @returns {Promise<void>}
   */
  async deleteDocument(collectionName, docId) {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  },
};
