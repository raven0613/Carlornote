"use client"
import { useState } from "react"
import ShareIcon from "./svg/Share";
import Link from "next/link";

interface ICard {
    handleClick: () => void;
    isSelected: boolean;
    handleDelete: () => void;
    handleShare: () => Promise<boolean>;
}

export default function Card({ handleClick, isSelected, handleDelete, handleShare }: ICard) {
    return (
        <>
            <main className={`w-14 h-36 rounded-lg relative group hover:z-50 duration-200  ${isSelected ? "z-20 mx-16" : "hover:w-36"}`}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Select")
                    handleClick();
                }}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-28 h-36 bg-zinc-300 rounded-lg   duration-200 shadow-lg  ${isSelected ? "bg-zinc-800" : "group-hover:bg-zinc-600 group-hover:-top-10 cursor-pointer"}`}>
                </div>
                {/* delete */}
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Delete")
                        handleDelete();
                    }}
                    className={`w-5 h-5 rounded-full border border-slate-500 bg-slate-100 absolute top-2 -right-6 z-50 
                    ${isSelected ? "opacity-0 group-hover:opacity-100 group-hover:cursor-pointer" : "opacity-0"}
                before:content-[""] before:h-[7px] before:w-[1px] before:bg-slate-500 before:absolute before:rotate-45 before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2
                after:content-[""] after:h-[7px] after:w-[1px] after:bg-slate-500 after:absolute after:-rotate-45 after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 hover:scale-125 duration-200
                
                `}
                ></div>
                {/* share */}
                <div
                    onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("share");
                        const canOpen = await handleShare();
                        console.log("canOpen", canOpen)
                        if (!canOpen) return;
                    }}
                    className={`w-5 h-5 p-[3px] rounded-full border border-slate-500 bg-slate-100 absolute bottom-1 -right-6 z-50 
                    ${isSelected ? "opacity-0 group-hover:opacity-100 group-hover:cursor-pointer" : "opacity-0"} hover:scale-125 duration-200
                `}
                ><ShareIcon classProps="fill-none stroke-slate-500" /></div>
            </main>
        </>
    )
}