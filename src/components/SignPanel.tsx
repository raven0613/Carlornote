"use client"
import { signIn } from "next-auth/react";
import { Children, ReactNode, useRef, useState } from "react";
import GoogleIcon from "./svg/Google";

export function checkEmail(email: string) {
    const checker = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/.test(email);
    return checker;
}

interface IPanel {
    isLoading: boolean;
    title: string;
    disabled: boolean;
    children: ReactNode;
    handleSubmit: () => void;
    submitBtnText: string;
    directToDescription: string;
    handleDirectTo: () => void;
    directToText: string;
}

export function Panel({ isLoading, title, disabled, children, handleSubmit, submitBtnText, directToDescription, handleDirectTo, directToText }: IPanel) {
    return (
        <main className="w-full h-full px-5 pt-16 pb-20 grid grid-rows-5 items-center relative">
            {isLoading && <div className="w-full h-full bg-white/50 absolute"></div>}
            <p className="text-center text-3xl text-seagull-600 pb-3 font-semibold   row-span-1">{title}</p>

            <div className="row-span-3 flex flex-col items-center gap-2 ">
                {children}
            </div>

            <div className="row-span-1 flex items-center flex-col gap-2">
                <button type="button"
                    className={`h-9 px-8 py-1 rounded-full  text-white mt-3 text-sm
                        ${disabled ? "bg-seagull-300/70 cursor-default" : "bg-seagull-500/70 cursor-pointer shadow-md hover:bg-seagull-600 duration-150"}
                    `}
                    onClick={async () => {
                        handleSubmit()
                    }}
                >
                    {submitBtnText}
                </button>

                <div className="flex items-center">
                    <p className="text-center text-xs text-seagull-500 px-2 py-1">{directToDescription} <span>&#10513;</span></p>
                    <button type="button" className="text-xs px-2 py-1 text-seagull-300 bg-seagull-100 hover:bg-seagull-300 hover:text-seagull-100 duration-150 rounded-full"
                        onClick={() => {
                            handleDirectTo();
                        }}
                    >
                        {directToText}
                    </button>
                </div>
            </div>
        </main>
    )
}

export function SignPanel({ type }: { type: "login" | "signup" }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailWrong, setIsEmailWrong] = useState(false);
    const [isPasswordWrong, setIsPasswordWrong] = useState(false);
    const [isNameWrong, setIsNameWrong] = useState(false);

    if (type === "login") return (
        <Panel
            isLoading={isLoading}
            title={"WELCOME BACK"}
            disabled={!email || !password}
            handleSubmit={async () => {
                if (!email || !password) return;
                setIsLoading(true);
                await signIn("credentials", { email, password });
                setIsLoading(false);
            }}
            submitBtnText={"SIGNUP"}
            directToDescription={"JOIN US"}
            handleDirectTo={() => {
                window && window.history.pushState(null, 'signup', '/signup');
            }}
            directToText={"SIGNUP"}
        >
            <>
                <button type="button" className=" bg-white shadow-md shadow-black/30 px-2 py-1 w-10 h-10 rounded-full text-white mb-5 hover:scale-110 duration-150"
                    onClick={async () => {
                        setIsLoading(true);
                        await signIn("google", { callbackUrl: "/" });
                        setIsLoading(false);
                    }}
                >
                    <GoogleIcon />
                </button>
                <input value={email} className={`w-60 h-10 outline-none rounded-md 
                ${isEmailWrong ? "bg-red-100 placeholder:text-red-300" : "bg-gray-100"} px-4 py-1`} placeholder="Email"
                    onChange={(e) => {
                        const emailVal = e.target.value.trim();
                        setEmail(emailVal);
                        if (emailVal === "") return setIsEmailWrong(false);
                        const checker = checkEmail(emailVal);
                        if (checker) setIsEmailWrong(false);
                        else setIsEmailWrong(true);
                    }} />
                <input type="password" value={password} className={`w-60 h-10 ${isPasswordWrong ? "bg-red-100 placeholder:text-red-300" : "bg-gray-100"} outline-none rounded-md  px-4 py-1 text-sm`} placeholder="Password"
                    onChange={(e) => {
                        const passwordVal = e.target.value.trim();
                        setPassword(passwordVal);
                        if (passwordVal === "") return setIsNameWrong(false);
                        if (passwordVal.split(" ").length >= 2 || passwordVal.includes("<script>")) setIsNameWrong(true);
                        else setIsNameWrong(false);
                    }} />
            </>
        </Panel>
    )
    if (type === "signup") return (
        <Panel
            isLoading={isLoading}
            title={"JOIN US"}
            disabled={!email || !password || !name}
            handleSubmit={async () => {
                if (!name || !email || !password) return;
                setIsLoading(true);
                await signIn("credentials", { name, email, password });
                setIsLoading(false);
            }}
            submitBtnText={"SUBMIT"}
            directToDescription={"HAVE ACCOUNT?"}
            handleDirectTo={() => {
                window && window.history.pushState(null, 'login', '/login');
            }}
            directToText={"LOGIN"}
        >
            <>
                <input value={name} className={`w-60 h-10 outline-none rounded-md ${isNameWrong ? "bg-red-100 placeholder:text-red-300" : "bg-gray-100"} px-4 py-1`} placeholder="Name"
                    onChange={(e) => {
                        const nameVal = e.target.value.trim();
                        setName(nameVal);
                        if (nameVal === "") return setIsNameWrong(false);
                        if (nameVal.split(" ").length >= 2 || nameVal.includes("<script>")) setIsNameWrong(true);
                        else setIsNameWrong(false);
                    }}
                />
                <input value={email} className={`w-60 h-10 outline-none rounded-md ${isEmailWrong ? "bg-red-100 placeholder:text-red-300" : "bg-gray-100"} px-4 py-1`} placeholder="Email"
                    onChange={(e) => {
                        const emailVal = e.target.value.trim();
                        setEmail(emailVal);
                        if (emailVal === "") return setIsEmailWrong(false);
                        const checker = checkEmail(emailVal);
                        if (checker) setIsEmailWrong(false);
                        else setIsEmailWrong(true);
                    }}
                />
                <input type="password" value={password} className={`w-60 h-10 ${isPasswordWrong ? "bg-red-100 placeholder:text-red-300" : "bg-gray-100 "} outline-none rounded-md  px-4 py-1 text-sm`} placeholder="Password"
                    onChange={(e) => {
                        const passwordVal = e.target.value.trim();
                        setPassword(passwordVal);
                        if (passwordVal === "") return setIsNameWrong(false);
                        if (passwordVal.split(" ").length >= 2 || passwordVal.includes("<script>")) setIsNameWrong(true);
                        else setIsNameWrong(false);
                    }}
                />
            </>
        </Panel>
    )
    return <></>
}