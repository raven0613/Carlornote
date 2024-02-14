"use server"
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { handleGetFirebaseDB } from "./firebase";
import { ICard } from "@/type/card";
import { v4 as uuidv4 } from 'uuid';

// use server 一定要傳 async function 出來
export async function handleGetCard(id: string) {
    try {
        const db = await handleGetFirebaseDB();
        const docRef = doc(db, "card", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // console.log("Document data:", docSnap.data());
            return { code: 200, status: "SUCCESS", data: JSON.stringify(data), message: "SUCCESS" };
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            return { code: 404, status: "FAIL", data: null, message: "No such document!" };
        }
    } catch (error) {
        console.log("error", error)
        return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
    }
}

export async function handleAddCard(data: ICard) {
    const id = uuidv4();
    try {
        const db = await handleGetFirebaseDB();
        const cardCollection = collection(db, 'card');
        await setDoc(doc(cardCollection, "test2"), data);
    } catch (error) {
        console.log("error", error)
        return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
    } finally {
        return {
            code: 200, status: "SUCCESS", data: JSON.stringify(data), message: "SUCCESS"
        };
    }
}