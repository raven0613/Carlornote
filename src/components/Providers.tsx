"use client";
import { store } from "@/redux/store";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Provider } from "react-redux";

interface IProps {
    children: ReactNode;
}

const Providers = (props: IProps) => {
    return (
        <Provider store={store}>
            <SessionProvider>
                {props.children}
            </SessionProvider>
        </Provider>
    )
}

export default Providers;