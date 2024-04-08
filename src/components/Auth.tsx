"use client";
import { handleAddUser, handleGetUserByEmail } from "@/api/user";
import { addUser } from "@/redux/reducers/user";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageLoading } from "./ImageLoading";
import { IState } from "@/redux/store";
import useLocalStorage from "@/hooks/useLocalStorage";
import { handleAddCard } from "@/api/card";
import { CardEditabilityType, CardVisibilityType } from "@/type/card";
import { addCards, setCards } from "@/redux/reducers/card";

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

    const { storageData, saveStorage, removeStorage } = useLocalStorage({ storageKey });
    const [isAuthValid, setIsAuthValid] = useState(false);
    // console.log("Auth isAuthValid", isAuthValid)
    // console.log("Auth status", status)
    // console.log("Auth session", session)
    // console.log("Auth user", user)
    // console.log("Auth storageData", storageData)

    // save session expired time in localStorage
    useEffect(() => {
        if (status === "loading" || !session || isAuthValid) return;
        // 有 localStorage 但過期了
        if (storageData && new Date(JSON.parse(storageData).expires).getTime() < Date.now()) {
            // console.log("有 localStorage 但過期")
            removeStorage();
            router.push("/login");
            return;
        }
        // console.log("有 localStorage 要儲存")
        saveStorage(JSON.stringify({ ...JSON.parse(storageData || "{}"), expires: session?.expires }));
        // saveStorage(JSON.stringify({ expires: session?.expires }));
        setIsAuthValid(true);
    }, [isAuthValid, removeStorage, router, saveStorage, session, status, storageData])

    // check user when session OK
    useEffect(() => {
        let ignore = false;
        // 在主頁沒有登入就導到登入頁
        // if (!authStorage && pathname === "/") return router.push("/login");
        if (!isAuthValid || !session) return;
        // console.log("有 localStorage")
        // 在主頁以外的頁面，例如卡片頁可能沒登入也可以看，但沒登入就不要去 fetch user
        async function handleCheckUser(): Promise<void> {
            if (ignore) return;
            try {
                // user 存在: 把 localStorage 的卡片加給 user
                if (user) {
                    if (!storageData.includes("introCard")) return;
                    // console.log("Auth user2", user)
                    // console.log("Auth storageData2", storageData)
                    const newCard = {
                        ...(JSON.parse(storageData).introCard || "{}"),
                        authorId: user.id,
                        createdAt: new Date().toUTCString(),
                        updatedAt: new Date().toUTCString(),
                        imageUrl: "https://i.imgur.com/gAzhP1L.png"
                    }
                    const response = await handleAddCard(newCard);
                    // console.log("response", response)
                    if (response.status === "FAIL") return;
                    dispatch(addCards([newCard]));
                    saveStorage(JSON.stringify({ expires: session?.expires }));
                    return;
                }

                // user 不存在: 創建 user 並把 localStorage 的卡片加給 user
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
                    return;
                }
                
                const addUserRes = await handleAddUser({
                    id: "",
                    name: session?.user?.name || "",
                    email: session?.user?.email || "",
                    password: "",
                    role: "user",
                    birthday: "",
                    accessLevel: "initial",
                    avatorUrl: session?.user?.image || "",
                    createdAt: new Date().toUTCString(),
                    updatedAt: new Date().toUTCString(),
                    lastLogin: new Date().toUTCString()
                })
                // console.log("addUserRes", addUserRes)
                dispatch(addUser(JSON.parse(addUserRes.data)));
                // add a new card
                if (addUserRes.status === "FAIL") return;
                const newCard = storageData ? {
                    ...(JSON.parse(storageData).introCard || "{}"),
                    authorId: JSON.parse(addUserRes.data).id,
                    createdAt: new Date().toUTCString(),
                    updatedAt: new Date().toUTCString(),
                    imageUrl: "https://i.imgur.com/gAzhP1L.png"
                }
                    : {
                        id: "",
                        authorId: JSON.parse(addUserRes.data).id,
                        name: "",
                        boardElement: [],
                        userList: [],
                        visibility: "private" as CardVisibilityType,
                        editability: "close" as CardEditabilityType,
                        imageUrl: "",
                        createdAt: new Date().toUTCString(),
                        updatedAt: new Date().toUTCString(),
                        tags: []
                    }
                // console.log("newCard", newCard)
                const response = await handleAddCard(newCard);
                if (response.status === "FAIL") return;
                dispatch(setCards([newCard]));
                saveStorage(JSON.stringify({ expires: session?.expires }));
            }
            catch (error) {
                console.log("Auth user error", error)
            }
        }
        handleCheckUser();
        return () => {
            ignore = true;
        }
    }, [dispatch, isAuthValid, saveStorage, session, storageData, user])

    if (outerPage.includes(pathname)) return props.children;

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