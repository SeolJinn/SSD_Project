// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyADetJDNBgyvebWboWtT-AkW-xADJ8bIpk",
    authDomain: "ssd-project-4c532.firebaseapp.com",
    projectId: "ssd-project-4c532",
    storageBucket: "ssd-project-4c532.appspot.com",
    messagingSenderId: "938600509684",
    appId: "1:938600509684:web:e9f90eb135da7be568aea1"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
