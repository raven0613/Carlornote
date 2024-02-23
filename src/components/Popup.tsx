"use client"
import React, { useEffect, useRef, useState, DragEvent, ReactNode, useTransition } from "react";

import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';
import useClickOutside from "@/hooks/useClickOutside";
import Link from "next/link";


interface IPopup {
    options: {
        icon: ReactNode,
        content: string,
        handleClick: () => void,
        isLink?: boolean,
        href?: string,
        hrefAs?: string
    }[];
    isOpen: boolean;
    handleClose: () => void;
}

export default function Popup({ options = [], isOpen, handleClose }: IPopup) {
    const nodeRef = useClickOutside<HTMLDivElement>({
        handleMouseDown: () => {
            handleClose();
        }
    })

    return (
        <div ref={nodeRef} className="flex flex-col absolute bg-slate-100 shadow-md rounded-sm top-10 right-2/4 text-slate-700">
            {isOpen && options.map(item => {
                return (
                    item.isLink ?
                        <Link key={item.content} href={item.href ?? ""} as={item.hrefAs} className="px-5 py-1.5 flex items-center gap-4 hover:bg-slate-200 text-sm"
                            onClick={() => {
                                item.handleClick();
                            }}
                        >
                            <div className="">{item.icon}</div>
                            {item.content}
                        </Link>
                        :
                        <div key={item.content}
                            onClick={() => {
                                item.handleClick();
                            }}
                            className="px-5 py-1.5 flex items-center gap-4 hover:bg-slate-200 text-sm"
                        >
                            <div className="">{item.icon}</div>
                            {item.content}
                        </div>
                )
            })}
        </div>
    )
}