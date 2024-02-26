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
}

export default function Card({ url, name, children, classProps }: ICard) {
    // console.log("name", name, url)
    return (
        <>
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-28 h-36 bg-zinc-300 rounded-lg   duration-200 shadow-lg  
                grid grid-rows-5
                    ${classProps}`}
            >
                <div className={`${name ? "row-span-4" : "row-span-5"} flex items-center justify-center overflow-hidden`}>
                    {!url && <EmptyImageIcon classProps="p-2 pointer-events-none" />}
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
                {name && <p className="row-span-1 text-white/90 w-full text-center text-sm">{name}</p>}

                {/* controllers */}
                {children}
            </div>
        </>
    )
}

interface ICardWithHover {
    handleClick: () => void;
    isSelected: boolean;
    handleDelete: () => void;
    handleShare: () => Promise<boolean>;
    handleClickEdit: () => void;
    url: string;
    name: string;
}

export function CardWithHover({ handleClick, isSelected, handleDelete, handleShare, url, name, handleClickEdit }: ICardWithHover) {
    // console.log("name", name, url)
    return (
        <>
            <main className={`w-14 h-36 rounded-lg relative group hover:z-50 duration-200  ${isSelected ? "z-20 mx-16" : "hover:w-36"}`}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Select")
                    handleClick();
                }}>
                <Card url={url} name={name} classProps={`${isSelected ? "bg-zinc-800" : "group-hover:bg-zinc-600 group-hover:-top-6 cursor-pointer"}`} >
                    {/* edit */}
                    <div
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClickEdit();
                        }}
                        className={`w-5 h-5 p-[3px] rounded-full border border-slate-500 bg-slate-100 absolute bottom-1 right-1 z-50 
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