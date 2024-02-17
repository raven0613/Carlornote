"use client"
// import { handleGoogleLogin } from "@/api/firebase_admin";
import useAutosizedTextarea from "@/hooks/useAutosizedTextarea"
import { IBoardElement } from "@/type/card";
import React, { RefObject, useEffect, useRef, useState, DragEvent, use } from "react";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { firebaseConfig } from "@/api/firebase";
import * as firebase from "firebase/app";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { handleAddUser, handleGetUserByEmail } from "@/api/user";
// import login from "@/api/user";

// export const handleGoogleLogin = async () => {
//     console.log("handleGoogleLogin")
//     const provider = new GoogleAuthProvider();
//     provider.addScope('email');
//     console.log("provider", provider)

//     const auth = getAuth(app);
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



export default function Login() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<IUser | null>(null);
    const router = useRouter();
    console.log("session", session)
    console.log("status", status)

    useEffect(() => {
        if (user) return;
        async function handleUser() {
            if (status === "authenticated") {
                console.log("HEEYYYYYYYYY")
                const getUserRes = await handleGetUserByEmail(session.user?.email || "")
                const registeredUser = JSON.parse(getUserRes.data);
                console.log("registeredUser", registeredUser)
                if (registeredUser.length > 0) return;
                const addUserRes = await handleAddUser({
                    id: "",
                    name: session.user?.name || "",
                    email: session.user?.email || "",
                    password: "",
                    role: "user",
                    birthday: "",
                    accessLevel: "initial",
                    avatorUrl: session.user?.image || ""
                })
                console.log("addUserRes", addUserRes)
                setUser(addUserRes.data);
                router.push("./");
            }
        }
        handleUser();
    }, [router, session, status, user])

    return (
        <main className="w-[38rem] h-[30rem] fixed left-1/2 -translate-x-1/2 bg-gray-100 shadow-gray-400 shadow-lg top-44 rounded-xl z-50">
            <button type="button" className=" bg-stone-500/50 px-2 py-1"
                onClick={async () => {
                    await signIn("google");
                }}
            >
                Google 登入
            </button>
        </main>
    )
}