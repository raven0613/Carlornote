"use client"
import React, { useEffect, useRef, useState, DragEvent, ReactNode, useTransition } from "react";

import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';
import useClickOutside from "@/hooks/useClickOutside";
import Link from "next/link";


interface IPopup {
    options: {
        icon?: ReactNode,
        content?: string | ReactNode,
        handleClick: (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>) => void,
        classProps?: string,
        isLink?: boolean,
        href?: string,
        hrefAs?: string
    }[];
    isOpen: boolean;
    handleClose: () => void;
    classPorops: string;
}

export default function Popup({ options = [], isOpen, handleClose, classPorops }: IPopup) {
    const nodeRef = useClickOutside<HTMLDivElement>({
        handleMouseDown: () => {
            handleClose();
        }
    })

    return (
        <div ref={nodeRef} className={`flex flex-col absolute bg-slate-100 shadow-md rounded-sm  text-slate-700 ${classPorops} my-2`}>
            {isOpen && options.map(item => {
                return (
                    item.isLink ?
                        <Link key={uuidv4()} href={item.href ?? ""} as={item.hrefAs} className={`px-5 py-1.5 flex items-center gap-4 hover:bg-slate-200 text-sm ${item.classProps}`}
                            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                item.handleClick(e);
                            }}
                        >
                            {item.icon && <div className="">{item.icon}</div>}
                            {item.content}
                        </Link>
                        :
                        <div key={uuidv4()}
                            onClick={(e) => {
                                item.handleClick(e);
                            }}
                            className={`px-4 py-1.5 flex items-center gap-4 hover:bg-slate-200 text-sm ${item.classProps}`}
                        >
                            {item.icon && <div className="">{item.icon}</div>}
                            {item.content}
                        </div>
                )
            })}
        </div>
    )
}