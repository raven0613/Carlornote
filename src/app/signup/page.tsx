"use client"
// import { handleGoogleLogin } from "@/api/firebase_admin";
import useAutosizedTextarea from "@/hooks/useAutosizedTextarea"
import { IBoardElement } from "@/type/card";
import React, { RefObject, useEffect, useRef, useState, DragEvent, use, Suspense } from "react";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { firebaseConfig } from "@/api/firebase";
import * as firebase from "firebase/app";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { handleAddUser, handleGetUserByEmail } from "@/api/user";
import { IState, store } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "@/redux/reducers/user";
import { SignPanel } from "@/components/SignPanel";
// import login from "@/api/user";


export default function Signup() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: IState) => state.user);


    const path = usePathname();

    // console.log("session", session)
    // console.log("status", status)
    // console.log("user", user)

    useEffect(() => {
        if (user) return;
        async function handleUser() {
            if (status === "authenticated") {
                // console.log("HEEYYYYYYYYY")
                const getUserRes = await handleGetUserByEmail(session.user?.email || "")
                const registeredUser = JSON.parse(getUserRes.data);
                // console.log("registeredUser", registeredUser)

                if (registeredUser.length > 0) {
                    // console.log("already registered")
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
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                })
                // console.log("addUserRes", addUserRes)
                dispatch(addUser(JSON.parse(addUserRes.data)));
                router.push("./");
            }
        }
        handleUser();
    }, [dispatch, router, session, status, user])

    return (
        <main className="w-10/12 sm:w-[40rem] h-[30rem] fixed left-1/2 -translate-x-1/2 bg-gray-100 shadow-gray-400 shadow-lg top-1/2 -translate-y-1/2 rounded-xl z-50 flex gap-2 overflow-hidden">

            {/* box */}
            <div className={`hidden sm:block w-60 h-full bg-seagull-700 absolute duration-500 ease-in-out z-20
                ${path === "/login" ? "right-0" : ""}
                ${path === "/signup" ? "right-[25rem]" : ""}
            `}></div>

            {/* Login */}
            <section
                className={`h-full w-full sm:w-[25rem] absolute duration-500 ease-in-out bg-white
                    ${path === "/login" ? "left-0 z-10" : ""}
                    ${path === "/signup" ? "sm:left-[15rem] -z-10" : ""}
                `}
            >
                <SignPanel type="login" />
            </section>

            {/* Signup */}
            <section className={`h-full w-full sm:w-[25rem] border  absolute duration-500 ease-in-out bg-white
                ${path === "/login" ? "left-0 z-0" : ""}
                ${path === "/signup" ? "sm:left-[15rem] z-10" : ""}
            `}>
                <SignPanel type="signup" />
            </section>



        </main>
    )
}