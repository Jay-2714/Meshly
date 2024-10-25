
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA98R4ywwT4-IF360I5M340CIx9bYWBCd4",
  authDomain: "meshly-984c2.firebaseapp.com",
  projectId: "meshly-984c2",
  storageBucket: "meshly-984c2.appspot.com",
  messagingSenderId: "952593008869",
  appId: "1:952593008869:web:9b90c0b629d4e8919eec0c",
  measurementId: "G-5Y1JCRHQHY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);