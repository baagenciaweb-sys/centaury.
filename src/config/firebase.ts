import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDpAe1lls4RZcWXvjl2eVrbifbYcLJb4GE",
  authDomain: "ba-agencia-web-plantillas-bolt.firebaseapp.com",
  projectId: "ba-agencia-web-plantillas-bolt",
  storageBucket: "ba-agencia-web-plantillas-bolt.firebasestorage.app",
  messagingSenderId: "721875489030",
  appId: "1:721875489030:web:911060fdff01c642b74e87"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
