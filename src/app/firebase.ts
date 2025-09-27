// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRL2kN6O7HrwK3X--11Ut1yJu4mIlvGpQ",
  authDomain: "on-pace-37943.firebaseapp.com",
  projectId: "on-pace-37943",
  storageBucket: "on-pace-37943.firebasestorage.app",
  messagingSenderId: "585545156973",
  appId: "1:585545156973:web:4d551ecc4fe5a39fa87264",
  measurementId: "G-D6HN2L5H7M",
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
