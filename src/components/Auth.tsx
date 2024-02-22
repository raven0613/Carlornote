"use client";
import { handleGetUserByEmail } from "@/api/user";
import { addUser } from "@/redux/reducers/user";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

interface IProps {
    children: ReactNode;
}

const Auth = (props: IProps) => {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const pathname = usePathname();
    console.log("Auth status", status)

    useEffect(() => {
        if (status !== "authenticated") return;
        async function handleCheckUser() {
            const getUserRes = await handleGetUserByEmail(session?.user?.email ?? "");
            if (getUserRes.status === "FAIL") return handleCheckUser();

            const registeredUser = JSON.parse(getUserRes.data);
            if (registeredUser.length > 0) {
                dispatch(addUser(registeredUser[0]));
            }
            // 有沒有有 session 卻沒找到 user 的狀況?
        }
        handleCheckUser();
    }, [dispatch, session?.user?.email, status])

    if (["login", "signup"].includes(pathname)) return <>{props.children}</>
    if (status === "loading") return <main className="w-full h-full">確認身分中</main>

    return (
        <>{props.children}</>
    )
}

export default Auth;