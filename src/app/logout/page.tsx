"use client"
import { removeUser } from "@/store/user";
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react"
import { useDispatch } from "react-redux";

export default function Logout() {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        async function handleSignOut() {
            await signOut();
            dispatch(removeUser());
            router.push("/");
        }
        handleSignOut();
    }, [dispatch, router])
    return <></>
}