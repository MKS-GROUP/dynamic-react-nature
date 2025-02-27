
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, Database, DatabaseReference } from "firebase/database";

// Your web app's Firebase configuration - you'll need to replace these with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC3eWP81QqmJ5JNQbOQAMBWg1B-TFfN3D4",
  authDomain: "scoreboard-sync.firebaseapp.com",
  databaseURL: "https://scoreboard-sync-default-rtdb.firebaseio.com",
  projectId: "scoreboard-sync",
  storageBucket: "scoreboard-sync.appspot.com",
  messagingSenderId: "841563420285",
  appId: "1:841563420285:web:4b4cdef56a78e6d8b9b4b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Get a reference to the game data
export const gameDataRef = ref(database, 'gameData');

// Function to update game data
export const updateGameData = (data: any) => {
  set(gameDataRef, data);
};

export { ref, onValue, database };
