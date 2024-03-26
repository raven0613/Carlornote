"use client";
import { handleGetUserByEmail } from "@/api/user";
import { addUser } from "@/redux/reducers/user";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageLoading } from "./ImageLoading";
import { IState } from "@/redux/store";

export const outerPage = ["/login", "/signup", "/logout", "/intro"];

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
    // console.log("Auth session", session)
    // console.log("Auth user", user)

    useEffect(() => {
        console.time("auth")
        if (status !== "loading") console.timeEnd("auth")

        if (status !== "authenticated") return router.push("/login");
        async function handleCheckUser(): Promise<void> {
            const getUserRes = await handleGetUserByEmail(session?.user?.email ?? "");
            // console.log("userRes", getUserRes)
            if (getUserRes.status === "FAIL") return handleCheckUser();

            const registeredUser = JSON.parse(getUserRes.data);
            if (registeredUser.length > 0) {
                dispatch(addUser(registeredUser[0]));
            }
            // 有沒有有 session 卻沒找到 user 的狀況?
        }
        handleCheckUser();
    }, [dispatch, session?.user?.email, status])

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