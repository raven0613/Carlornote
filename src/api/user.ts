"use server"
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { handleGetFirebaseDB } from "./firebase";
import { ICard } from "@/type/card";
import { v4 as uuidv4 } from 'uuid';
import { IResponse } from "@/type/response";
import { IUser } from "@/type/user";

// use server 一定要傳 async function 出來
export async function handleGetUsers(): Promise<IResponse> {
    try {
        const db = await handleGetFirebaseDB();
        const q = query(collection(db, "user"));
        const cardSnap = await getDocs(q);

        if (cardSnap) {
            const data: ICard[] = [];
            cardSnap.forEach((doc) => {
                data.push(doc.data() as ICard);
            });
            // console.log("Document data:", data);
            return { code: 200, status: "SUCCESS", data: JSON.stringify(data), message: "SUCCESS" };
        } else {
            // docSnap.data() will be undefined in this case
            // console.log("No such document!");
            return { code: 404, status: "FAIL", data: null, message: "No such document!" };
        }
    } catch (error) {
        // console.log("error", error)
        return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
    }
}

export async function handleGetUserById(id: string): Promise<IResponse> {
    try {
        const db = await handleGetFirebaseDB();
        const docRef = doc(db, "user", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // console.log("Document data:", docSnap.data());
            return { code: 200, status: "SUCCESS", data: JSON.stringify(data), message: "SUCCESS" };
        } else {
            // docSnap.data() will be undefined in this case
            // console.log("No such document!");
            return { code: 404, status: "FAIL", data: null, message: "No such document!" };
        }
    } catch (error) {
        // console.log("error", error)
        return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
    }
}

export async function handleGetUserByEmail(email: string): Promise<IResponse> {
    console.log("email", email)
    try {
        const db = await handleGetFirebaseDB();
        const q = query(collection(db, "user"), where("email", "==", email));
        const docSnap = await getDocs(q);

        if (docSnap) {
            const data: IUser[] = [];
            docSnap.forEach((doc) => {
                data.push(doc.data() as IUser);
            });
            console.log(data)
            return { code: 200, status: "SUCCESS", data: JSON.stringify(data), message: "SUCCESS" };
        }
        else {
            // docSnap.data() will be undefined in this case
            // console.log("No such document!");
            return { code: 404, status: "FAIL", data: null, message: "No such document!" };
        }
    } catch (error) {
        // console.log("error", error)
        return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
    }
}

export async function handleAddUser(data: IUser): Promise<IResponse> {
    // console.log("handleAddUser")
    const id = `user_${uuidv4()}`;
    const addData = { ...data, id };
    try {
        const db = await handleGetFirebaseDB();
        const userCollection = collection(db, 'user');
        // console.log("addData", addData)
        await setDoc(doc(userCollection, id), addData);
    } catch (error) {
        // console.log("error", error)
        return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
    } finally {
        return {
            code: 200, status: "SUCCESS", data: JSON.stringify(data), message: "SUCCESS"
        };
    }
}

export async function handleUpdateUser(data: IUser[]): Promise<IResponse> {
    // console.log("UpdateUser data", data)
    const failedFetch = [];
    try {
        const db = await handleGetFirebaseDB();
        await Promise.all(data.map(async item => {
            const userRef = doc(db, "user", item.id);
            await updateDoc(userRef, {
                updatedAt: new Date().toUTCString(),
            });
        }))
    } catch (error) {
        // console.log("error", error)
        // return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
        failedFetch.push(JSON.stringify(error));
    } finally {
        return {
            code: 200, status: "SUCCESS", data: JSON.stringify(data), message: "SUCCESS", failedData: JSON.stringify(failedFetch)
        };
    }
}