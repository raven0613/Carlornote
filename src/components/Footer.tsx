"use client"
import React, { useEffect, useRef, useState, DragEvent, ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "@/redux/store";
import { removeUser } from "@/redux/reducers/user";
import Popup from "./Popup";
import Search from "./svg/Search";
import FilterIcon from "./svg/Filter";
import Cards from "./svg/Cards";
import { closeAllModal, closeModal, openModal, openOneModal } from "@/redux/reducers/modal";
import { usePathname, useRouter } from "next/navigation";
import SettingIcon from "./svg/Setting";
import { setCardSettingIsDirty } from "@/redux/reducers/card";

interface IFooter {
}

export default function Footer({ }: IFooter) {
    const { status } = useSession();
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state: IState) => state.user);
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const pathname = usePathname();
    const isCardSettingDirty = useSelector((state: IState) => state.isCardSettingDirty);
    const [openPopup, setOpenPopup] = useState<"setting" | null>(null);
    const { type: openModalType, props: modalProp } = useSelector((state: IState) => state.modal)

    // console.log("isCardSettingDirty", isCardSettingDirty)
    function dirtyCheck () {
        // 手機版讀這邊
        if (isCardSettingDirty) {
            if (openModalType.at(-1) === "checkWindow") {
                dispatch(closeModal({ type: "checkWindow", props: { data: selectedCard } }));
                return true;
            }
            dispatch(openModal({
                type: "checkWindow",
                props: {
                    text: "改動尚未儲存，確定要關閉視窗嗎？",
                    handleConfirm: async () => {
                        dispatch(setCardSettingIsDirty(false));
                        dispatch(closeAllModal({ type: "" }));
                    },
                    data: selectedCard
                }
            }));
            return true;
        }
        return false
    }

    if (status !== "authenticated") return <></>
    return (
        <footer className={`grid sm:hidden fixed inset-x-0 bottom-0 h-16 bg-white  z-50 shadow-[0_1px_12px_-2px_rgba(0,0,0,0.3)] ${pathname === "/" ? "grid-cols-3" : "grid-cols-4"}`}>

            {/* cards */}
            <div className="w-full h-full col-span-1 flex flex-col items-center justify-center" onClick={() => {
                const isDirty = dirtyCheck();
                if (isDirty) return;
                dispatch(closeAllModal());
                router.push("/");
            }}>
                <Cards classProps="w-7 h-7" />
                <span className="text-xs font-light text-slate-600">卡冊</span>
            </div>

            {/* search */}
            <div className="w-full h-full col-span-1 flex flex-col items-center justify-center" onClick={() => {
                const isDirty = dirtyCheck();
                if (isDirty) return;

                if (openModalType.includes("mobileSearch")) {
                    dispatch(closeAllModal());
                    return;
                }
                dispatch(openOneModal({ type: "mobileSearch" }));
            }}>
                <Search classProps="w-7 h-7" />
                <span className="text-xs font-light text-slate-600">搜尋</span>
            </div>

            {/* filter */}
            <div className="w-full h-full col-span-1 flex flex-col items-center justify-center" onClick={() => {
                const isDirty = dirtyCheck();
                if (isDirty) return;

                if (openModalType.includes("mobileFilter")) {
                    dispatch(closeAllModal());
                    return;
                }
                dispatch(openOneModal({ type: "mobileFilter" }));
            }}>
                <FilterIcon classProps="w-7 h-7" />
                <span className="text-xs font-light text-slate-600">篩選</span>
            </div>

            {/* card setting */}
            {pathname !== "/" && <div className="w-full h-full col-span-1 flex flex-col items-center justify-center" onClick={() => {
                const isDirty = dirtyCheck();
                if (isDirty) return;

                if (openModalType.includes("mobileCardSetting")) {
                    dispatch(closeAllModal());
                    return;
                }
                dispatch(openOneModal({ type: "mobileCardSetting" }));
            }}>
                <SettingIcon classProps="w-7 h-7" />
                <span className="text-xs font-light text-slate-600">設定</span>
            </div>}
        </footer>
    )
}