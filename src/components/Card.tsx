"use client"
import { ReactNode, useState } from "react"
import ShareIcon from "@/components/svg/Share";
import Image from "next/image";
import EmptyImageIcon from "@/components/svg/EmptyImage";
import EditIcon from "./svg/Edit";

interface ICard {
    url: string;
    name: string;
    children: ReactNode;
    classProps: string;
    cardLize: "hidden" | "sm" | "lg";
}

export default function Card({ url, name, children, classProps, cardLize }: ICard) {
    // console.log("name", name, url)
    return (
        <>
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 bg-zinc-300 rounded-lg duration-200 shadow-md grid grid-rows-5
                    ${classProps} ${cardLize === "lg"? "h-32" : "h-24"}
                `}
            >
                <div className={`${(name && cardLize === "lg") ? "row-span-4" : "row-span-5"} flex items-center justify-center overflow-hidden`}>
                    {!url && <EmptyImageIcon classProps="p-1 pointer-events-none" />}
                    {url && <Image
                        className={`rounded-md`} width={150} height={150} src={url}
                        priority={true}
                        alt={name}
                        style={{
                            objectFit: 'cover', // cover, contain, none
                            width: '80%', height: '80%',
                        }}
                        onLoad={(e) => {
                            console.log("onLoad")
                        }}
                        onError={() => {
                        }}
                    />}
                </div>
                {(name && cardLize === "lg") && <p className="row-span-1 text-white/90 w-full text-center text-sm">{name}</p>}

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
}

export function CardWithHover({ handleClick, isSelected, url, name, handleClickEdit, cardLize }: ICardWithHover) {
    // console.log("name", name, url)
    return (
        <>
            <main className={`w-12 rounded-lg relative group hover:z-20 duration-200  
            ${isSelected ? "z-10 mx-14" : "hover:w-[7rem]"}
            ${cardLize === "lg"? "h-32" : `${ cardLize === "sm"? "h-24" : "h-0 opacity-0" }`}
            `}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Select")
                    handleClick();
                }}>
                <Card url={url} name={name} cardLize={cardLize}
                classProps={`${isSelected ? "bg-zinc-800" : "group-hover:bg-zinc-600 group-hover:-top-6 cursor-pointer"}`} >
                    {/* edit */}
                    <div
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClickEdit();
                        }}
                        className={`w-5 h-5 p-[3px] rounded-full border border-slate-500 bg-slate-100 absolute bottom-1 right-1 z-20 
                        ${isSelected ?
                                "opacity-0 group-hover:opacity-100 group-hover:cursor-pointer" :
                                "opacity-0 pointer-events-none"} hover:scale-125 duration-200
                `}
                    ><EditIcon classProps="fill-none stroke-slate-500" /></div>
                </Card>
            </main>
        </>
    )
}