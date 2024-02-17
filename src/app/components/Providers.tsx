"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface IProps {
    children: ReactNode;
}

const Providers = (props: IProps) => {
    return <SessionProvider>{props.children}</SessionProvider>
}

export default Providers;