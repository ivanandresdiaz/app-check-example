import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions";
// Initialize Firebase
// import {
//   initializeAppCheck,
//   ReCaptchaEnterpriseProvider,
// } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyD4MvLQJ7lWLLGf4jOGXbsHbJIjZJ22SH8",
  authDomain: "tutorial-image-4ab83.firebaseapp.com",
  projectId: "tutorial-image-4ab83",
  storageBucket: "tutorial-image-4ab83.appspot.com",
  messagingSenderId: "140021978841",
  appId: "1:140021978841:web:3ff61a2d2d92ac253490c8",
};

// Detect if it is dev mode
// declare global {
//   interface Window {
//     FIREBASE_APPCHECK_DEBUG_TOKEN: boolean;
//   }
// }

// if (typeof window !== "undefined" && window.location.hostname === "localhost") {
//   window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
// }

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let AppCheckInstance = null;

if (typeof window !== "undefined" && !AppCheckInstance) {
  import("firebase/app-check").then(async (firebaseAppCheck) => {
    const captachp = process.env
      .NEXT_PUBLIC_RECAPTCHA_SITE_KEY_APP_CHECK as string;
    AppCheckInstance = firebaseAppCheck.initializeAppCheck(app, {
      provider: new firebaseAppCheck.ReCaptchaV3Provider(captachp),
      isTokenAutoRefreshEnabled: true,
    });
    console.log("AppCheckInstance", AppCheckInstance);
  });
}
const db = getFirestore();
const storage = getStorage();
const auth = getAuth();
const realtimeDb = getDatabase();
const functions = getFunctions(app);

export { db, storage, auth, AppCheckInstance, app, realtimeDb, functions };
