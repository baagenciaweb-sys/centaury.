import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || AIzaSyDpAe1lls4RZcWXvjl2eVrbifbYcLJb4GE
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || ba-agencia-web-plantillas-bolt.firebaseapp.com
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || ba-agencia-web-plantillas-bolt
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || ba-agencia-web-plantillas-bolt.firebasestorage.app,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 721875489030,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 1:721875489030:web:911060fdff01c642b74e87
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
