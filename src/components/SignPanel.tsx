"use client"
import { signIn } from "next-auth/react";
import { Children, ReactNode, useRef, useState } from "react";

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
            <p className="text-center text-3xl text-stone-500 pb-3 font-semibold   row-span-1">{title}</p>

            <div className="row-span-3 flex flex-col items-center gap-2 ">
                {children}
            </div>

            <div className="row-span-1 flex items-center flex-col gap-2">
                <button type="button"
                    className={`h-9 px-8 py-1 rounded-full  text-white mt-3 text-sm
                        ${disabled ? "bg-stone-300/70 cursor-default" : "bg-stone-500/70 cursor-pointer shadow-md"}
                    `}
                    onClick={async () => {
                        handleSubmit()
                    }}
                >
                    {submitBtnText}
                </button>

                <div className="flex items-center">
                    <p className="text-center text-xs text-stone-500 px-2 py-1">{directToDescription} <span>&#10513;</span></p>
                    <button type="button" className="text-xs px-2 py-1 text-stone-500 bg-stone-200 rounded-full"
                        onClick={() => {
                            handleDirectTo()
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
                <button type="button" className=" bg-stone-500/70 px-2 py-1 w-10 h-10 rounded-full text-white mb-5"
                    onClick={async () => {
                        setIsLoading(true);
                        await signIn("google");
                        setIsLoading(false);
                    }}
                >
                    G
                </button>
                <input value={email} className="w-52 h-10 outline-none rounded-md bg-stone-100 px-4 py-1" placeholder="Email" onChange={(e) => {
                    setEmail(e.target.value);
                }} />
                <input type="password" value={password} className="w-52 h-10 bg-stone-100 outline-none rounded-md  px-4 py-1 text-sm" placeholder="Password" onChange={(e) => {
                    setPassword(e.target.value);
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
                <input value={name} className="w-52 h-10 outline-none rounded-md bg-stone-100 px-4 py-1" placeholder="Name" onChange={(e) => {
                    setName(e.target.value);
                }} />
                <input value={email} className="w-52 h-10 outline-none rounded-md bg-stone-100 px-4 py-1" placeholder="Email" onChange={(e) => {
                    setEmail(e.target.value);
                }} />
                <input type="password" value={password} className="w-52 h-10 bg-stone-100 outline-none rounded-md  px-4 py-1 text-sm" placeholder="Password" onChange={(e) => {
                    setPassword(e.target.value);
                }} />
            </>
        </Panel>
    )
}

// export function LoginPanel({ handleSetPage }: IPanel) {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [isLoading, setIsLoading] = useState(false);

//     return (
//         <main className="w-full h-full px-5 pt-16 pb-20 grid grid-rows-5 items-center relative">
//             {isLoading && <div className="w-full h-full bg-white/50 absolute"></div>}
//             <p className="text-center text-3xl text-stone-500 pb-3 font-semibold   row-span-1">LOGIN</p>

//             <div className="row-span-3 flex flex-col items-center gap-2 ">
//                 <button type="button" className=" bg-stone-500/70 px-2 py-1 w-10 h-10 rounded-full text-white mb-5"
//                     onClick={async () => {
//                         setIsLoading(true);
//                         await signIn("google");
//                         setIsLoading(false);
//                     }}
//                 >
//                     G
//                 </button>
//                 <input value={email} className="w-52 h-10 outline-none rounded-md bg-stone-100 px-4 py-1" placeholder="Email" onChange={(e) => {
//                     setEmail(e.target.value);
//                 }} />
//                 <input type="password" value={password} className="w-52 h-10 bg-stone-100 outline-none rounded-md  px-4 py-1 text-sm" placeholder="Password" onChange={(e) => {
//                     setPassword(e.target.value);
//                 }} />
//             </div>

//             <div className="row-span-1 flex items-center flex-col gap-2">
//                 <button type="button"
//                     className={`h-9 px-8 py-1 rounded-full  text-white mt-3 text-sm
//                         ${(email && password) ? "bg-stone-500/70 cursor-pointer shadow-md" : "bg-stone-300/70 cursor-default"}
//                     `}
//                     onClick={async () => {
//                         if (!email || !password) return;
//                         setIsLoading(true);
//                         await signIn("credentials", { email, password });
//                         setIsLoading(false);
//                     }}
//                 >
//                     LOGIN
//                 </button>

//                 <div className="flex items-center">
//                     <p className="text-center text-xs text-stone-500 px-2 py-1">JOIN US <span>&#10513;</span></p>
//                     <button type="button" className="text-xs px-2 py-1 text-stone-500 bg-stone-200 rounded-full"
//                         onClick={() => {
//                             handleSetPage("signup");
//                             window && window.history.pushState(null, 'signup', '/signup');
//                         }}
//                     >
//                         SIGNUP
//                     </button>
//                 </div>
//             </div>
//         </main>
//     )
// }

// export function SignupPanel({ handleSetPage }: IPanel) {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     return (
//         <main className="w-full h-full px-5 pt-16 pb-20 grid grid-rows-5 items-center">
//             {isLoading && <div className="w-full h-full bg-white/50 absolute"></div>}
//             <p className="text-center text-3xl text-stone-500 pb-3 font-semibold row-span-1">JOIN US</p>

//             <div className="row-span-3 flex flex-col items-center gap-2 ">
//                 <input value={name} className="w-52 h-10 outline-none rounded-md bg-stone-100 px-4 py-1" placeholder="Name" onChange={(e) => {
//                     setName(e.target.value);
//                 }} />
//                 <input value={email} className="w-52 h-10 outline-none rounded-md bg-stone-100 px-4 py-1" placeholder="Email" onChange={(e) => {
//                     setEmail(e.target.value);
//                 }} />
//                 <input type="password" value={password} className="w-52 h-10 bg-stone-100 outline-none rounded-md  px-4 py-1 text-sm" placeholder="Password" onChange={(e) => {
//                     setPassword(e.target.value);
//                 }} />
//             </div>

//             <div className="row-span-1 flex items-center flex-col gap-2">
//                 <button type="button" className={`h-9 px-8 py-1 rounded-full  text-white mt-3 text-sm
//                         ${(email && password) ? "bg-stone-500/70 cursor-pointer shadow-md" : "bg-stone-300/70 cursor-default"}
//                     `}
//                     onClick={async () => {
//                         if (!name || !email || !password) return;
//                         setIsLoading(true);
//                         await signIn("credentials", { name, email, password });
//                         setIsLoading(false);
//                     }}
//                 >
//                     SUBMIT
//                 </button>

//                 <div className="flex items-center justify-center">
//                     <p className="text-center text-xs text-stone-500 px-2 py-1">HAVE ACCOUNT? <span>&#10513;</span></p>
//                     <button type="button" className="text-xs px-2 py-1 text-stone-500 bg-stone-200 rounded-full"
//                         onClick={() => {
//                             handleSetPage("login")
//                             window && window.history.pushState(null, 'login', '/login');
//                         }}
//                     >
//                         LOGIN
//                     </button>
//                 </div>
//             </div>
//         </main>
//     )
// }