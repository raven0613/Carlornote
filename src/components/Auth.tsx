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
    // const [isLoading, setIsLoading] = useState(true);


    const { storageData: authStorage, saveStorage, removeStorage } = useLocalStorage({ storageKey });
    const [isAuthValid, setIsAuthValid] = useState(false);
    // console.log("Auth isAuthValid", isAuthValid)
    // console.log("Auth status", status)
    // console.log("Auth session", session)
    // console.log("Auth user", user)

    useEffect(() => {
        if (status === "loading" || !session || isAuthValid) return;
        // 有 localStorage 但過期了
        if (authStorage && new Date(JSON.parse(authStorage).expires).getTime() < Date.now()) {
            console.log("有 localStorage 但過期")
            removeStorage();
            router.push("/login");
            return;
        }
        console.log("有 localStorage 要儲存")
        saveStorage(JSON.stringify({ expires: session?.expires }));
        setIsAuthValid(true);
    }, [status, session, router, authStorage, saveStorage, removeStorage, isAuthValid])

    useEffect(() => {
        // 在主頁沒有登入就導到登入頁
        // if (!authStorage && pathname === "/") return router.push("/login");
        if (!isAuthValid || user || !session) return;
        console.log("有 localStorage")
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
                setIsAuthValid(true);
            }
        }
        handleCheckUser();
    }, [authStorage, dispatch, isAuthValid, router, session, user])

    useEffect(() => {
        console.time("auth")
        if (authStorage) console.timeEnd("auth")
    }, [authStorage])

    if (outerPage.includes(pathname)) return <>{props.children}</>

    // 1. 如果還在 loading，auth 也還沒轉 true 就繼續跳 loading 畫面(代表可能只是 F5)
    // 2. 如果 localStorage 的 auth OK了，但還沒有 fetch 到 user 並儲存好，也繼續 loading 畫面
    if ((!isAuthValid && status === "loading") || (isAuthValid && !user)) return (
        <main className="w-full h-screen">
            <ImageLoading />
        </main>
    )

    return (
        <>{props.children}</>
    )
}

export default Auth;