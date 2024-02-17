"use server"
import * as firebase from "firebase/app";
// import "firebase/storage";
import admin, { initializeApp } from 'firebase-admin';
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.asia-southeast1.firebasedatabase.app`,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    appId: process.env.FIREBASE_APP_ID
};

const backendApp = admin.initializeApp(firebaseConfig, "nodejs");


// export const handleGoogleLogin = async () => {
//     console.log("handleGoogleLogin")
//     const provider = new GoogleAuthProvider();
//     const auth = getAuth(backendApp);
//     console.log("auth", auth)
//     await signInWithPopup(auth, provider)
//         .then((result) => {
//             // This gives you a Google Access Token. You can use it to access the Google API.
//             const credential = GoogleAuthProvider.credentialFromResult(result);
//             const token = credential?.accessToken;
//             // The signed-in user info.
//             const user = result.user;
//             // IdP data available using getAdditionalUserInfo(result)
//             // ...
//             console.log("token", token)
//             console.log("user", user)
//             return { user, token }
//         }).catch((error) => {
//             console.log("error", error)
//             // Handle Errors here.
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             // The email of the user's account used.
//             const email = error.customData.email;
//             // The AuthCredential type that was used.
//             const credential = GoogleAuthProvider.credentialFromError(error);
//             console.log("credential", credential)
//             // ...
//             return { code: errorCode, message: errorMessage }
//         });
//     return { code: 0, message: "" }
// } 