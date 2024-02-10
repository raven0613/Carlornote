"use client"
import { useState } from "react"

interface ICard {
    handleClick: () => void;
    isSelected: boolean
}

export default function Card({ handleClick, isSelected }: ICard) {
    return (
        <>
            <div className={`w-20 h-52 rounded-lg relative hover:mr-24 group duration-200 ${isSelected ? "z-20 mr-24" : ""}`}
                onClick={() => handleClick()}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-52 bg-zinc-300 rounded-lg group-hover:bg-zinc-600 group-hover:-top-10 duration-200 shadow-lg cursor-pointer ${isSelected ? "bg-zinc-800" : ""}`}>
                </div>
            </div>
        </>
    )
}