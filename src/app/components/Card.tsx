"use client"
import { useState } from "react"

interface ICard {
    handleClick: () => void;
    isSelected: boolean;
    handleDelete: () => void;
}

export default function Card({ handleClick, isSelected, handleDelete }: ICard) {
    return (
        <>
            <main className={`w-16 h-40 rounded-lg relative group hover:z-50 duration-200  ${isSelected ? "z-20 mx-20" : "hover:w-40"}`}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Select")
                    handleClick();
                }}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-40 bg-zinc-300 rounded-lg   duration-200 shadow-lg  ${isSelected ? "bg-zinc-800" : "group-hover:bg-zinc-600 group-hover:-top-10 cursor-pointer"}`}>
                </div>

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
            </main>
        </>
    )
}