// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPfI-FT1eW3T4rIXqdKWAjE3YXmitDNSM",
  authDomain: "pantry-tracker-2400e.firebaseapp.com",
  projectId: "pantry-tracker-2400e",
  storageBucket: "pantry-tracker-2400e.appspot.com",
  messagingSenderId: "102841661996",
  appId: "1:102841661996:web:2c2d789757a9c495992f89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
export {firestore}