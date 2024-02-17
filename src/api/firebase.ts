"use server"
import * as firebase from "firebase/app";
// import "firebase/storage";
import { getFirestore } from "firebase/firestore";

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

const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);

export const handleGetFirebaseDB = async () => {
    return db;
}
// export default app;