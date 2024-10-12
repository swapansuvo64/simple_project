// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Add this to use Firebase Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-ylNKfq-KSsoR_z_r6TpcgyQHEaOljpg",
  authDomain: "mojo-web-technology-assessment.firebaseapp.com",
  projectId: "mojo-web-technology-assessment",
  storageBucket: "mojo-web-technology-assessment.appspot.com",
  messagingSenderId: "436675383589",
  appId: "1:436675383589:web:adb88e021a134880e8cacc",
  measurementId: "G-NGCMGFHHTV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (optional, can be skipped if not needed)
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Now, you can use `auth` for Firebase Authentication
