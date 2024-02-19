"use client";
import { handleGetUserByEmail } from "@/api/user";
import { addUser } from "@/redux/reducers/user";

import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

interface IProps {
    children: ReactNode;
}

const Auth = (props: IProps) => {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    console.log("status", status)

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

    return (
        <>{status === "loading" ? <>確認身分中</> : props.children }</>
    )
}

export default Auth;