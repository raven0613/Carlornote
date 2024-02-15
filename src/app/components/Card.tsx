"use client"
import { useState } from "react"

interface ICard {
    handleClick: () => void;
    isSelected: boolean
}

export default function Card({ handleClick, isSelected }: ICard) {
    return (
        <>
            <div className={`w-16 h-40 rounded-lg relative group hover:z-50 duration-200  ${isSelected ? "z-20 mx-20" : "hover:w-40"}`}
                onClick={() => handleClick()}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-40 bg-zinc-300 rounded-lg   duration-200 shadow-lg  ${isSelected ? "bg-zinc-800" : "group-hover:bg-zinc-600 group-hover:-top-10 cursor-pointer"}`}>
                </div>
            </div>
        </>
    )
}