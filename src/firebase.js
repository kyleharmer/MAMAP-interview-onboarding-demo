import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Public web config — this is expected to be visible client-side; Firebase
// secures data through Realtime Database rules, not by hiding this object.
// See README section 8 for a note on tightening the open "test mode" rules
// before this is used for anything beyond a demo.
const firebaseConfig = {
  apiKey: "AIzaSyCusjiv9ZY6BR8XA9Ml5Xkt0rSxxVW-9dU",
  authDomain: "mamap-demo.firebaseapp.com",
  databaseURL: "https://mamap-demo-default-rtdb.firebaseio.com",
  projectId: "mamap-demo",
  storageBucket: "mamap-demo.firebasestorage.app",
  messagingSenderId: "706327396604",
  appId: "1:706327396604:web:c4af9eaaf775e48cb81779",
  measurementId: "G-T4RJF6HKH3",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
