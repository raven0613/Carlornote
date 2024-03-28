"use client"
import React, { useEffect, useRef, useState, DragEvent, ReactNode, useTransition } from "react";
import useClickOutside from "@/hooks/useClickOutside";


interface IModal {
    isOpen: boolean;
    handleClose: () => void;
    children: ReactNode;
    position: "center" | "aside" | "full"
    top?: string;
}

export default function Modal({ isOpen, handleClose, children, position, top }: IModal) {
    const nodeRef = useClickOutside<HTMLDivElement>({
        handleMouseDownOutside: () => {
            // console.log("點外面")
            handleClose();
        },
        exceptions: ["checkWindow"]
    })
    // console.log("nodeRef", nodeRef)
    // console.log("position", position)

    if (position === "full") return (
        <>
            <div ref={nodeRef} className={`fullModal block sm:hidden fixed top-12 bottom-16 inset-x-0 cursor-default duration-200 ease-out z-40 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                {children}
            </div>
        </>
    )
    if (position === "center") return (
        <>
            <>
                <div className={`fixed inset-0 bg-slate-800/70 z-50 duration-150 ease-out ${isOpen? "opacity-100" : "opacity-0 pointer-events-none"}`}></div>
                <div ref={nodeRef} className={`flex flex-col fixed w-fit min-w-10 min-h-10 h-fit  left-1/2 -translate-x-1/2 z-50 duration-150 ease-out ${top ? top : "top-36"} ${isOpen? "opacity-100" : "opacity-0"}
                `}>
                    {children}
                </div>
            </>
        </>
    )
    if (position === "aside") return (
        <>
            <div ref={nodeRef} className={`flex-col fixed z-30 top-2 w-fit h-fit  duration-300 ease-in-out rounded-xl right-0 shadow-md shadow-black/30
            ${isOpen ? "-translate-x-[0.55rem]" : "translate-x-full"}
            `}
            >
                {children}
            </div>
        </>
    )
    return <></>
}