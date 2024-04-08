"use client"
import useScrollToView, { ScrollContextType, useScroll } from '@/hooks/useScrollToView';
import { IState } from '@/redux/store';
import React, { createContext, useContext } from 'react'
import { useSelector } from 'react-redux';

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

export function IntroHeaderButton() {
    const user = useSelector((state: IState) => state.user);
    return (
        <button className="bg-seagull-500 px-3 py-2 text-white rounded-sm hover:bg-seagull-600 duration-150">
            {user? "Go to your board" :"Sign up for free"}
        </button>
    )
}