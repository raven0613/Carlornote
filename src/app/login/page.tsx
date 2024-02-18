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
import { IState, addUser, store } from "@/store/user";
import { useSelector, useDispatch } from "react-redux";
// import login from "@/api/user";

export default function Login() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: IState) => state.user);
    console.log("session", session)
    console.log("status", status)
    console.log("user", user)

    useEffect(() => {
        if (user) return;
        async function handleUser() {
            if (status === "authenticated") {
                console.log("HEEYYYYYYYYY")
                const getUserRes = await handleGetUserByEmail(session.user?.email || "")
                const registeredUser = JSON.parse(getUserRes.data);
                console.log("registeredUser", registeredUser)

                if (registeredUser.length > 0) {
                    console.log("already registered")
                    dispatch(addUser(registeredUser[0]));
                    router.push("./");
                    return;
                }
                const addUserRes = await handleAddUser({
                    id: "",
                    name: session.user?.name || "",
                    email: session.user?.email || "",
                    password: "",
                    role: "user",
                    birthday: "",
                    accessLevel: "initial",
                    avatorUrl: session.user?.image || "",
                    createdAt: new Date().toUTCString(),
                    updatedAt: new Date().toUTCString(),
                    lastLogin: new Date().toUTCString()
                })
                console.log("addUserRes", addUserRes)
                dispatch(addUser(addUserRes.data));
                router.push("./");
            }
        }
        handleUser();
    }, [dispatch, router, session, status, user])

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