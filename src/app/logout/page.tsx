"use client"

import { removeUser } from "@/redux/reducers/user";
import { IState } from "@/redux/store";
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";

export default function Logout() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: IState) => state.user);

    useEffect(() => {
        if (!user) return router.push("/login");
        async function handleSignOut() {
            await signOut();
            dispatch(removeUser());
            router.push("/login");
        }
        handleSignOut();
    }, [dispatch, router, user])
    return <></>
}