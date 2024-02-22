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
import { IState, store } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "@/redux/reducers/user";
// import login from "@/api/user";

interface IPanel {
    handleSetPage: (page: string) => void;
}

function LoginPanel({ handleSetPage }: IPanel) {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    return (
        <main className="w-full h-full px-5 pt-16 pb-20 grid grid-rows-5 items-center">
            <p className="text-center text-3xl text-stone-500 pb-3 font-semibold   row-span-1">LOGIN</p>

            <div className="row-span-3 flex flex-col items-center gap-2 ">
                <button type="button" className=" bg-stone-500/70 px-2 py-1 w-10 h-10 rounded-full text-white mb-5"
                    onClick={async () => {
                        await signIn("google");
                    }}
                >
                    G
                </button>
                <input ref={emailRef} className="w-52 h-10 outline-none rounded-md bg-stone-100 px-4 py-1" placeholder="Email" />
                <input type="password" ref={passwordRef} className="w-52 h-10 bg-stone-100 outline-none rounded-md  px-4 py-1 text-sm" placeholder="Password" />
            </div>

            <div className="row-span-1 flex items-center flex-col gap-2">
                <button type="button" className="h-9 bg-stone-500/70 px-8 py-1 rounded-full shadow-md text-white mt-3 text-sm"
                    onClick={async () => {
                        console.log()
                        await signIn("credentials", { username: emailRef.current?.value || "", password: passwordRef.current?.value || "" });
                    }}
                >
                    LOGIN
                </button>

                <div className="flex items-center">
                    <p className="text-center text-xs text-stone-500 px-2 py-1">JOIN US <span>&#10513;</span></p>
                    <button type="button" className="text-xs px-2 py-1 text-stone-500 bg-stone-200 rounded-full"
                        onClick={() => {
                            handleSetPage("signup")
                        }}
                    >
                        SIGNUP
                    </button>
                </div>
            </div>
        </main>
    )
}
function SigninPanel({ handleSetPage }: IPanel) {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    return (
        <main className="w-full h-full px-5 pt-16 pb-20 grid grid-rows-5 items-center">
            <p className="text-center text-3xl text-stone-500 pb-3 font-semibold row-span-1">JOIN US</p>

            <div className="row-span-3 flex flex-col items-center gap-2 ">
                <input ref={nameRef} className="w-52 h-10 outline-none rounded-md bg-stone-100 px-4 py-1" placeholder="Name" />
                <input ref={emailRef} className="w-52 h-10 outline-none rounded-md bg-stone-100 px-4 py-1" placeholder="Email" />
                <input type="password" ref={passwordRef} className="w-52 h-10 bg-stone-100 outline-none rounded-md  px-4 py-1 text-sm" placeholder="Password" />
            </div>

            <div className="row-span-1 flex items-center flex-col gap-2">
                <button type="button" className="h-9 bg-stone-500/70 px-8 py-1 rounded-full shadow-md text-white mt-3 text-sm"
                    onClick={async () => {
                        await signIn("credentials", { username: emailRef.current?.value || "", password: passwordRef.current?.value || "" });
                    }}
                >
                    SUBMIT
                </button>

                <div className="flex items-center justify-center">
                    <p className="text-center text-xs text-stone-500 px-2 py-1">HAVE ACCOUNT? <span>&#10513;</span></p>
                    <button type="button" className="text-xs px-2 py-1 text-stone-500 bg-stone-200 rounded-full"
                        onClick={() => {
                            handleSetPage("login")
                        }}
                    >
                        LOGIN
                    </button>
                </div>
            </div>
        </main>
    )
}

export default function Login() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: IState) => state.user);


    const [page, setPage] = useState("login");


    console.log("page", page)
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
                dispatch(addUser(JSON.parse(addUserRes.data)));
                router.push("./");
            }
        }
        handleUser();
    }, [dispatch, router, session, status, user])

    return (
        <main className="w-[40rem] h-[30rem] fixed left-1/2 -translate-x-1/2 bg-gray-100 shadow-gray-400 shadow-lg top-1/2 -translate-y-1/2 rounded-xl z-50 flex gap-2 overflow-hidden">
            <div className={`w-60 h-full bg-slate-500 absolute duration-500 ease-in-out z-20
                ${page === "login" ? "right-0" : ""}
                ${page === "signup" ? "right-[25rem]" : ""}
            `}></div>
            {/* Login */}
            <section
                className={`h-full w-[25rem]  absolute duration-500 ease-in-out bg-white
                    ${page === "login" ? "left-0 z-10" : ""}
                    ${page === "signup" ? "left-[15rem] -z-10" : ""}
                `}
            >
                <LoginPanel handleSetPage={(page: string) => setPage(page)} />
            </section>
            {/* Signup */}
            <section className={`h-full w-[25rem] border  absolute duration-500 ease-in-out bg-white
                ${page === "login" ? "left-0 z-0" : ""}
                ${page === "signup" ? "left-[15rem] z-10" : ""}
            `}>
                <SigninPanel handleSetPage={(page: string) => setPage(page)} />
            </section>



        </main>
    )
}