import { IState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Popup from "./Popup";
import { signOut } from "next-auth/react";
import { removeUser } from "@/redux/reducers/user";
import UndoRedoIcon from "./svg/UndoRedo";
import SearchGroup from "./SearchPanel";
import Link from "next/link";
import useLocalStorage from "@/hooks/useLocalStorage";
import { storageKey } from "./Auth";
import { useRouter } from "next/navigation";
import LockIcon from "./svg/Lock";
import { selectCard, updateCards } from "@/redux/reducers/card";
import UnlockIcon from "./svg/Unlock";

interface IControlBar {
    handleRedo: () => void;
    handleUndo: () => void;
    handleLockCard: () => void;
    canUndo: boolean;
    canRedo: boolean;
    canUserEdit: boolean;
    isCardLock: boolean;
}

export default function ControlBar({ handleRedo, handleUndo, canUndo, canRedo, canUserEdit, handleLockCard, isCardLock }: IControlBar) {
    const [openPopup, setOpenPopup] = useState<"setting" | null>(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state: IState) => state.user);
    const dirtyCards = useSelector((state: IState) => state.dirtyCardsId);
    const dirtyState = useSelector((state: IState) => state.dirtyState);

    const { removeStorage } = useLocalStorage({ storageKey });

    return (
        <div className="hidden sm:flex fixed top-2 right-10 z-30 gap-2 items-center justify-center">
            {dirtyCards.length > 0 && <p className="cursor-default text-sm text-seagull-700/80 z-20 pr-2">正在儲存...</p>}
            {dirtyState === "clear" && <p className={`cursor-default animate-hide opacity-0 text-sm text-seagull-700/80 z-20 pr-2`}>已成功儲存</p>}

            {canUserEdit && <>
                <button disabled={!canUndo} className={`w-7 h-7 pt-0.5 ${canUndo ? "text-seagull-500" : "text-seagull-200 cursor-default"}`}
                    onClick={() => {
                        if (!canUndo) return;
                        handleUndo();
                    }}
                >
                    <UndoRedoIcon />
                </button>
                <button disabled={!canRedo} className={`w-7 h-7 pt-0.5 ${canRedo ? "text-seagull-500" : "text-seagull-200 cursor-default mr-2"}`}
                    onClick={() => {
                        if (!canRedo) return;
                        handleRedo();
                    }}
                >
                    <UndoRedoIcon classProps="-scale-x-100" />
                </button>
            </>}

            {canUserEdit && <button className={`w-6 h-6 mr-2`}
                onClick={() => {
                    handleLockCard();
                }}
            >
                {isCardLock ? <UnlockIcon classProps="stroke-seagull-300" /> : <LockIcon classProps="stroke-seagull-300" />}
            </button>}

            {user && <SearchGroup />}
            {user && <button type="button" className="w-6 h-6 bg-seagull-300 rounded-full relative ml-2 duration-150"
                onClick={() => {
                    setOpenPopup("setting");
                }}
            >
                <Popup options={[{
                    icon: <div className="w-2 h-2 bg-slate-600 rounded-full"></div>,
                    content: user ? "Logout" : "Login",
                    isLink: true,
                    href: user ? "" : "/login",
                    // hrefAs: user ? "" : "/login",
                    handleClick: user ? async () => {
                        // logout
                        // console.log("按登出")
                        removeStorage();
                        await signOut();
                        dispatch(removeUser());
                        router.push("/login");
                    } : () => { }
                }]}
                    isOpen={openPopup === "setting"}
                    handleClose={() => setOpenPopup(null)}
                    classPorops="top-6 right-2/4"
                />
            </button>}
            {!user && <Link prefetch scroll={false} href={"/login"} className={`border bg-transparent border-seagull-400 text-seagull-600 px-2 py-1 rounded relative overflow-hidden z-10 duration-150
            before:content-[''] before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:-z-10 before:rounded-full before:opacity-0 before:w-5 before:h-5 hover:before:scale-[700%] hover:border-seagull-500 before:bg-seagull-500  hover:before:opacity-100 before:duration-150 hover:text-white/80
            backdrop-blur-lg
            `}
            >
                登入或創建帳號
            </Link>}
        </div>
    )
}