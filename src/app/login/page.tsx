"use client"
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { handleAddUser, handleGetUserByEmail } from "@/api/user";
import { IState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "@/redux/reducers/user";
import { SignPanel } from "@/components/SignPanel";

export default function Login() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: IState) => state.user);
    const path = usePathname();

    // console.log("path", path)
    // console.log("query", query)
    // console.log("page", page)
    // console.log("session", session)
    // console.log("status", status)
    // console.log("user", user)

    return (
        <main className="w-10/12 sm:w-[40rem] h-[30rem] fixed left-1/2 -translate-x-1/2 bg-gray-100 shadow-gray-400 shadow-lg top-1/2 -translate-y-1/2 rounded-xl z-50 flex gap-2 overflow-hidden">

            {/* box */}
            <div className={`hidden sm:block w-60 h-full bg-seagull-700 absolute duration-500 ease-in-out z-20
                ${path === "/login" ? "right-0" : ""}
                ${path === "/signup" ? "right-[25rem]" : ""}
            `}></div>

            {/* Login */}
            <section
                className={`h-full w-full sm:w-[25rem]  absolute duration-500 ease-in-out bg-white
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