import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

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
export const storage = getStorage(app);
export default app;