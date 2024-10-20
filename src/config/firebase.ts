import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBOJx1zmx3MfYKEnDlBNyZhcZk7RWSwRRU",
  authDomain: "xox-gamers-community.firebaseapp.com",
  projectId: "xox-gamers-community",
  storageBucket: "xox-gamers-community.appspot.com",
  messagingSenderId: "143975438191",
  appId: "1:143975438191:web:91b1a8cbbf780a6be57a9a",
  measurementId: "G-0CGWBSS4DX"
};

const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const googleProvider = new GoogleAuthProvider();