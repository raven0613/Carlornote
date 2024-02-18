"use server"
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { handleGetFirebaseDB } from "./firebase";
import { ICard } from "@/type/card";
import { v4 as uuidv4 } from 'uuid';
import { IResponse } from "@/type/response";

// use server 一定要傳 async function 出來
export async function handleGetCards(userId: string): Promise<IResponse> {
    try {
        const db = await handleGetFirebaseDB();
        const q = query(collection(db, "card"), where("authorId", "==", userId));
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
            console.log("No such document!");
            return { code: 404, status: "FAIL", data: null, message: "No such document!" };
        }
    } catch (error) {
        console.log("error", error)
        return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
    }
}

// use server 一定要傳 async function 出來
export async function handleGetCard(id: string): Promise<IResponse> {
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

export async function handleAddCard(data: ICard): Promise<IResponse> {
    const id = `card_${uuidv4()}`;
    const addData = { ...data, id };
    try {
        const db = await handleGetFirebaseDB();
        const cardCollection = collection(db, 'card');
        console.log("addData", addData)
        await setDoc(doc(cardCollection, id), addData);
        // await setDoc(doc(cardCollection, `${id}/boardElement`, id), addData);
    } catch (error) {
        console.log("error", error)
        return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
    } finally {
        return {
            code: 200, status: "SUCCESS", data: JSON.stringify(addData), message: "SUCCESS"
        };
    }
}

export async function handleUpdateCard(data: ICard[]): Promise<IResponse> {
    console.log("UpdateCard data", data)
    const failedFetch = [];
    try {
        const db = await handleGetFirebaseDB();
        await Promise.all(data.map(async item => {
            const cardRef = doc(db, "card", item.id);
            await updateDoc(cardRef, {
                boardElement: item.boardElement
            });
        }))
    } catch (error) {
        console.log("error", error)
        // return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
        failedFetch.push(JSON.stringify(error));
    } finally {
        return {
            code: 200, status: "SUCCESS", data: JSON.stringify(data), message: "SUCCESS", failedData: JSON.stringify(failedFetch)
        };
    }
}

export async function handleDeleteCard(id: string): Promise<IResponse> {
    console.log("DeleteCard data", id)
    try {
        const db = await handleGetFirebaseDB();
        await deleteDoc(doc(db, "card", id));
    } catch (error) {
        console.log("error", error)
        return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
    } finally {
        return {
            code: 200, status: "SUCCESS", data: id, message: "SUCCESS"
        };
    }
}