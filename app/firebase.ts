import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase web configuration is public by design. Access is protected by
// Firestore rules; private API keys live only in Cloud Functions secrets.
const firebaseConfig = {
  apiKey: "AIzaSyD-5TTrl-0X8OrJW1C_3VT_4_yZ6xyBeGU",
  authDomain: "today1-72a13.firebaseapp.com",
  projectId: "today1-72a13",
  storageBucket: "today1-72a13.firebasestorage.app",
  messagingSenderId: "583423259255",
  appId: "1:583423259255:web:d4dcc6e3cd44347e730c72",
  measurementId: "G-9ZZVFB6DEM",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
