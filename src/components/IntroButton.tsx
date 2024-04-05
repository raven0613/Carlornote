"use client"
import useScrollToView, { ScrollContextType, useScroll } from '@/hooks/useScrollToView';
import React, { createContext, useContext } from 'react'

export function IntroTopButton() {
    return (
        <button className="w-20 h-20 rounded-full fixed right-5 bottom-5 bg-seagull-700 text-white/80 z-10"
            onClick={() => {
                scrollTo({
                    top: 0,
                    behavior: "smooth"
                })
            }}
        >Top</button>
    )
}

export function IntroTryButton() {
    const { scrollToNode } = useScroll() as ScrollContextType;
    return (
        <div className="absolute bottom-2 w-20 left-1/2 -translate-x-1/2 text-center font-signika h-6 border-b border-seagull-700 text-seagull-700 hover:w-28 duration-150 cursor-pointer hover:scale-105"
            onClick={() => {
                scrollToNode();
            }}
        >Try now</div>
    )
}