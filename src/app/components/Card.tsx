"use client"
import { useState } from "react"

export default function Card() {
    const [s, setS] = useState();
    return (
        <>
            <div className="w-20 h-52 rounded-lg relative hover:mx-24 group duration-200">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-52 bg-zinc-300 rounded-lg group-hover:bg-zinc-600 group-hover:-top-10 duration-200 shadow-lg cursor-pointer">

                </div>
            </div>
        </>
    )
}