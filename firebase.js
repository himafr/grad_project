// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfthEV11w_jq3vjRh03hTcDom06XOFJwQ",
  authDomain: "graduation-project-fe612.firebaseapp.com",
  projectId: "graduation-project-fe612",
  storageBucket: "graduation-project-fe612.firebasestorage.app",
  messagingSenderId: "62900525007",
  appId: "1:62900525007:web:47220472b50915013924ba",
  measurementId: "G-7NQ1737XZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);