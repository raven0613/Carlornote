"use client";
import { handleGetUserByEmail } from "@/api/user";
import { addUser } from "@/redux/reducers/user";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageLoading } from "./ImageLoading";
import { IState } from "@/redux/store";
import useLocalStorage from "@/hooks/useLocalStorage";

export const outerPage = ["/login", "/signup", "/logout", "/intro"];
export const storageKey = "carlornote-info";

interface IProps {
    children: ReactNode;
}

const Auth = (props: IProps) => {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const pathname = usePathname();
    const user = useSelector((state: IState) => state.user);
    const router = useRouter();
    // console.log("Auth status", status)
    // const [isLoading, setIsLoading] = useState(false);
    // console.log("Auth session", session)
    // console.log("Auth user", user)
    const { storageData: authStorage, saveStorage, removeStorage } = useLocalStorage({ storageKey });
    
    useEffect(() => {
        if (status === "loading" || !session) return;
        if (authStorage && new Date(JSON.parse(authStorage).expires).getTime() < Date.now()) {
            removeStorage();
            router.push("/login");
            return;
        }
        saveStorage(JSON.stringify({ expires: session?.expires }));
    }, [status, session, router, authStorage, saveStorage, removeStorage])

    useEffect(() => {
        // 在主頁沒有登入就導到登入頁
        // if (!authStorage && pathname === "/") return router.push("/login");
        if (!authStorage) return;
        // 在主頁以外的頁面，例如卡片頁可能沒登入也可以看，但沒登入就不要去 fetch user
        async function handleCheckUser(): Promise<void> {
            const getUserRes = await handleGetUserByEmail(session?.user?.email ?? "");
            // console.log("userRes", getUserRes)
            if (getUserRes.status === "FAIL") {
                handleCheckUser();
                return;
            }

            const registeredUser = JSON.parse(getUserRes.data);
            if (registeredUser.length > 0) {
                dispatch(addUser(registeredUser[0]));
            }
            // 有沒有有 session 卻沒找到 user 的狀況?
        }
        handleCheckUser();
    }, [session, dispatch, pathname, router, authStorage])

    useEffect(() => {
        console.time("auth")
        if (authStorage) console.timeEnd("auth")
        // if (status !== "loading") console.timeEnd("auth")
        
        // if (status === "loading") return;
        // // 在主頁沒有登入就導到登入頁
        // if (pathname === "/" && status === "unauthenticated") return router.push("/login");
        // // 在主頁以外的頁面，例如卡片頁可能沒登入也可以看，但沒登入就不要去 fetch user
        // if (status === "unauthenticated") return;
        // async function handleCheckUser(): Promise<void> {
        //     const getUserRes = await handleGetUserByEmail(session?.user?.email ?? "");
        //     // console.log("userRes", getUserRes)
        //     if (getUserRes.status === "FAIL") return handleCheckUser();

        //     const registeredUser = JSON.parse(getUserRes.data);
        //     if (registeredUser.length > 0) {
        //         dispatch(addUser(registeredUser[0]));
        //     }
        //     // 有沒有有 session 卻沒找到 user 的狀況?
        // }
        // handleCheckUser();
    }, [dispatch, session?.user?.email, status, pathname, router, authStorage])

    if (outerPage.includes(pathname)) return <>{props.children}</>
    if (status === "loading" || (status === "authenticated" && !user)) return (
        <main className="w-full h-screen">
            <ImageLoading />
        </main>
    )

    return (
        <>{props.children}</>
    )
}

export default Auth;