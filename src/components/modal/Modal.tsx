"use client"
import React, { useEffect, useRef, useState, DragEvent, ReactNode, useTransition } from "react";
import useClickOutside from "@/hooks/useClickOutside";


interface IModal {
    isOpen: boolean;
    handleClose: () => void;
    children: ReactNode;
    position: "center" | "aside"
    top?: string;
}

export default function Modal({ isOpen, handleClose, children, position, top }: IModal) {
    const nodeRef = useClickOutside<HTMLDivElement>({
        handleMouseDownOutside: () => {
            handleClose();
        },
        exceptions: ["checkWindow"]
    })
    // console.log("nodeRef", nodeRef)
    if (position === "center") return (
        <>
            {isOpen && <>
                <div className="fixed inset-0 bg-slate-800/70 z-50"></div>
                <div ref={nodeRef} className={`flex flex-col fixed w-fit min-w-10 min-h-10 h-fit  left-1/2 -translate-x-1/2 z-50 ${top ? top : "top-36"}`}>
                    {children}
                </div>
            </>}
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