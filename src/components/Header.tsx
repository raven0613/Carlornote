"use client"
import React, { useEffect, useRef, useState, DragEvent, ReactNode } from "react";

import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "@/redux/store";
import { removeUser } from "@/redux/reducers/user";
import Popup from "./Popup";


interface IHeader {
}

export default function Header({ }: IHeader) {
    const dispatch = useDispatch();
    const user = useSelector((state: IState) => state.user);
    const allCards = useSelector((state: IState) => state.card);
    const [openPopup, setOpenPopup] = useState<"setting" | null>(null);
    // 先 hidden 之後看怎麼改
    return (
        <header className="hidden fixed inset-x-0 top-0 h-10 bg-transparent grid-cols-6 z-40">
            <div className="w-60 h-full col-span-4 pl-3 leading-10">Deck Crafter</div>
            <div className="w-full h-full col-span-2 flex items-center justify-end px-2">
                <button type="button" className="w-6 h-6 bg-slate-100 rounded-full relative"
                    onClick={() => {
                        setOpenPopup("setting");
                    }}
                >
                    <Popup options={[{
                        icon: <div className="w-2 h-2 bg-slate-600 rounded-full"></div>,
                        isLink: true,
                        content: "setting",
                        handleClick: () => { }
                    }, {
                        icon: <div className="w-2 h-2 bg-slate-600 rounded-full"></div>,
                        content: user ? "Logout" : "Login",
                        isLink: true,
                        href: user ? "" : "/login",
                        // hrefAs: user ? "" : "/login",
                        handleClick: user ? async () => {
                            // logout
                            await signOut();
                            dispatch(removeUser());
                        } : () => { }
                    }]}
                        isOpen={openPopup === "setting"}
                        handleClose={() => setOpenPopup(null)}
                        classPorops="top-10 right-2/4"
                    />
                </button>

            </div>
        </header>
    )
}