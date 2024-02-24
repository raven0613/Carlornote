"use client"
import React, { useEffect, useRef, useState, DragEvent, ReactNode, useTransition } from "react";

import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';
import useClickOutside from "@/hooks/useClickOutside";
import Link from "next/link";


interface IModal {
    isOpen: boolean;
    handleClose: () => void;
    children: ReactNode;
    position: "center" | "aside"
}

export default function Modal({ isOpen, handleClose, children, position }: IModal) {
    const nodeRef = useClickOutside<HTMLDivElement>({
        handleMouseDown: () => {
            handleClose();
        }
    })
    // console.log("nodeRef", nodeRef)
    if (position === "center") return (
        <>
            {isOpen && <>
                <div ref={nodeRef} className="flex flex-col fixed top-36 w-fit h-fit border border-red-500 shadow-md rounded-sm right-2/4 z-50">
                    {children}
                </div>
                <div className="fixed inset-0 bg-slate-800/70 z-40"></div>
            </>}
        </>
    )
    if (position === "aside") return (
        <>
            <div ref={nodeRef} className={`flex-col fixed top-14 w-fit h-fit  duration-300 ease-in-out rounded-xl right-0 shadow-md shadow-black/30
            ${isOpen ? "-translate-x-[0.55rem]" : "translate-x-full"}
            `}
                style={{
                }}
            >
                {children}
            </div>
        </>
    )
}