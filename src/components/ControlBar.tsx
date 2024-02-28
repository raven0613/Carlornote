import { IState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Popup from "./Popup";
import { signOut } from "next-auth/react";
import { removeUser } from "@/redux/reducers/user";

export default function ControlBar() {
    const [openPopup, setOpenPopup] = useState<"setting" | null>(null);
    const dispatch = useDispatch();
    const user = useSelector((state: IState) => state.user);
    return (
        <div className="hidden sm:flex fixed top-2 right-10 z-50">
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
                    classPorops="top-6 right-2/4"
                />
            </button>
        </div>
    )
}