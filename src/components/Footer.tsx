"use client"
import React, { useEffect, useRef, useState, DragEvent, ReactNode } from "react";
import { signOut } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "@/redux/store";
import { removeUser } from "@/redux/reducers/user";
import Popup from "./Popup";
import Search from "./svg/Search";
import FilterIcon from "./svg/Filter";
import Cards from "./svg/Cards";
import { closeAllModal, openModal, openOneModal } from "@/redux/reducers/modal";

interface IHeader {
}

export default function Footer({ }: IHeader) {
    const dispatch = useDispatch();
    const user = useSelector((state: IState) => state.user);
    const allCards = useSelector((state: IState) => state.card);
    const [openPopup, setOpenPopup] = useState<"setting" | null>(null);
    // 先 hidden 之後看怎麼改
    return (
        <footer className="grid sm:hidden fixed inset-x-0 bottom-0 h-16 bg-white grid-cols-3 z-50 shadow-[0_1px_12px_-2px_rgba(0,0,0,0.3)]">
            <div className="w-full h-full col-span-1 flex flex-col items-center justify-center" onClick={() => {
                dispatch(closeAllModal());
            }}>
                <Cards classProps="w-7 h-7" />
                <span className="text-xs font-light text-slate-600">卡冊</span>
            </div>
            <div className="w-full h-full col-span-1 flex flex-col items-center justify-center" onClick={() => {
                dispatch(openOneModal({ type: "mobileSearch" }));
            }}>
                <Search classProps="w-7 h-7" />
                <span className="text-xs font-light text-slate-600">搜尋</span>
            </div>
            <div className="w-full h-full col-span-1 flex flex-col items-center justify-center" onClick={() => {
                dispatch(openOneModal({ type: "mobileFilter" }));
            }}>
                <FilterIcon classProps="w-7 h-7" />
                <span className="text-xs font-light text-slate-600">篩選</span>
            </div>
        </footer>
    )
}