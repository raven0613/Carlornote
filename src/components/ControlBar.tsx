import { IState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Popup from "./Popup";
import { signOut } from "next-auth/react";
import { removeUser } from "@/redux/reducers/user";
import UndoRedoIcon from "./svg/UndoRedo";

interface IControlBar {
    handleRedo: () => void;
    handleUndo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    canEdit: boolean;
}

export default function ControlBar({ handleRedo, handleUndo, canUndo, canRedo, canEdit }: IControlBar) {
    const [openPopup, setOpenPopup] = useState<"setting" | null>(null);
    const dispatch = useDispatch();
    const user = useSelector((state: IState) => state.user);
    return (
        <div className="hidden sm:flex fixed top-2 right-10 z-30 gap-2 items-center justify-center">
            {canEdit &&<>
                <button disabled={!canUndo} className={`w-6 h-6 ${canUndo? "text-seagull-500" : "text-seagull-200 cursor-default"}`}
                    onClick={() => {
                        if (!canUndo) return;
                        handleUndo();
                    }}
                >
                    <UndoRedoIcon />
                </button>
                <button disabled={!canRedo} className={`w-6 h-6 ${canRedo? "text-seagull-500" : "text-seagull-200 cursor-default"}`}
                    onClick={() => {
                        if (!canRedo) return;
                        handleRedo();
                    }}
                >
                    <UndoRedoIcon classProps="-scale-x-100" />
                </button>
            </>}
            <button type="button" className="w-6 h-6 bg-seagull-300 rounded-full relative ml-4"
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
                        await signOut();
                        dispatch(removeUser());
                    } : () => { }
                }]}
                    isOpen={openPopup === "setting"}
                    handleClose={() => setOpenPopup(null)}
                    classPorops="top-6 right-2/4"
                />
            </button>
        </div>
    )
}