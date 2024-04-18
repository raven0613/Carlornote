"use client"
import { ReactNode, useState } from "react"
import ShareIcon from "@/components/svg/Share";
import Image from "next/image";
import EmptyImageIcon from "@/components/svg/EmptyImage";
import EditIcon from "./svg/Edit";
import Link from "next/link";

interface ICard {
    url: string;
    name: string;
    children?: ReactNode;
    classProps: string;
    cardLize: "hidden" | "sm" | "lg";
    isSelected?: boolean
    id: string;
}

export default function Card({ id, url, name, children, classProps, cardLize, isSelected }: ICard) {
    console.log("name", name, url, cardLize)
    return (
        <>
            <div className={`card w-full h-full sm:w-24 rounded-lg duration-200 shadow-md grid grid-rows-5
                    ${isSelected ? "bg-gray-700 text-white/90" : "bg-gray-300 group-hover:bg-gray-600 group-hover:-top-6 group-hover:text-white/90 cursor-pointer text-seagull-950/90"}
                    ${classProps} ${cardLize === "lg" ? "sm:h-32" : "sm:h-24"}
                `}
                onMouseDown={(e) => {
                    if (e.button !== 1 || !window || !id) return;
                    window.open(`/card/${id.split("_")[1]}`, "_blank")
                }}
            >
                <div className={`${(name && cardLize === "lg") ? "row-span-4" : "row-span-5"} flex items-center justify-center overflow-hidden`}>
                    {!url && <EmptyImageIcon classProps="p-1 pointer-events-none text-gray-400" />}
                    {url && <Image
                        className={`rounded-md`} width={150} height={150} src={url}
                        priority={true}
                        alt={name}
                        style={{
                            objectFit: 'cover', // cover, contain, none
                            width: '80%', height: '80%',
                        }}
                        onLoad={(e) => {
                            // console.log("onLoad")
                        }}
                        onError={() => {
                        }}
                    />}
                </div>
                {(name && cardLize === "lg") && <p className={`row-span-1  w-full text-center text-sm truncate px-2`}>{name}</p>}

                {/* controllers */}
                {children}
            </div>
        </>
    )
}

interface ICardWithHover {
    handleClick: () => void;
    isSelected: boolean;
    handleClickEdit: () => void;
    url: string;
    name: string;
    cardLize: "hidden" | "sm" | "lg";
    handleDrag: () => void;
    id: string
}

export function CardWithHover({ handleClick, isSelected, url, name, handleClickEdit, cardLize, handleDrag, id }: ICardWithHover) {
    // console.log("name", name, url)
    return (
        <>
            <main className={`w-12 rounded-lg relative group hover:z-20 duration-200  
            ${isSelected ? "z-10 mx-14" : "hover:w-[7rem]"}
            ${cardLize === "lg" ? "h-32" : `${cardLize === "sm" ? "h-24" : "h-0 opacity-0 pointer-events-none"}`}
            `}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // console.log("Select")
                    handleClick();
                }}
                onDragStart={() => {
                    if (isSelected) return;
                    handleDrag();
                }}
                draggable={!isSelected}
            >
                <Card id={id} url={url} name={name} cardLize={cardLize} isSelected={isSelected}
                    classProps={`
                    absolute top-0 left-1/2 -translate-x-1/2
                    `} >
                    {/* edit */}
                    <div
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClickEdit();
                        }}
                        className={`w-5 h-5 p-[3px] rounded-full border border-slate-500 bg-slate-100 absolute bottom-1 right-1 z-20 
                        ${isSelected ?
                                "opacity-0 group-hover:opacity-100 group-hover:cursor-pointer " 
                                :
                                "opacity-0 pointer-events-none"
                        } 
                        hover:scale-125 duration-200
                `}
                    ><EditIcon classProps="fill-none stroke-slate-500" /></div>
                </Card>
            </main>
        </>
    )
}