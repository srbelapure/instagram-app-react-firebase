import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBaW5U7GoaSgdAGEP3G5D5cLUAW9kEPgsE",
  authDomain: "instagram-react-firebase-1e6f6.firebaseapp.com",
  databaseURL: "https://instagram-react-firebase-1e6f6-default-rtdb.firebaseio.com",
  projectId: "instagram-react-firebase-1e6f6",
  storageBucket: "instagram-react-firebase-1e6f6.appspot.com",
  messagingSenderId: "527533010654",
  appId: "1:527533010654:web:7ae9aa589ab875af855c4f",
  measurementId: "G-4RF2EYRXV2"
});
const db = firebaseApp.firestore(); // this is to access the DB
const auth = firebase.auth(); // this is for authentication(login,logout,create users stc)
const storage = firebase.storage(); // upload pictures to DB and use it

export { db, auth, storage };
