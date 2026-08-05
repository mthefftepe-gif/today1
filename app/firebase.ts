import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const required = ['VITE_FIREBASE_API_KEY','VITE_FIREBASE_AUTH_DOMAIN','VITE_FIREBASE_PROJECT_ID','VITE_FIREBASE_APP_ID'] as const;
const config={apiKey:import.meta.env.VITE_FIREBASE_API_KEY??'AIzaSyD-5TTrl-0X8OrJW1C_3VT_4_yZ6xyBeGU',authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN??'today1-72a13.firebaseapp.com',projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID??'today1-72a13',storageBucket:import.meta.env.VITE_FIREBASE_STORAGE_BUCKET??'today1-72a13.firebasestorage.app',messagingSenderId:import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID??'583423259255',appId:import.meta.env.VITE_FIREBASE_APP_ID??'1:583423259255:web:d4dcc6e3cd44347e730c72'};
const app = getApps()[0] ?? initializeApp(config);
export const db = getFirestore(app);
