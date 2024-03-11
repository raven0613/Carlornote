"use client"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord, vs2015, foundation, anOldHope, androidstudio, atelierDuneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { IBoardElement, ICard } from "@/type/card";
import React, { RefObject, useEffect, useRef, useState, DragEvent, ReactNode } from "react";
import Box from "./Box";
import Popup from "../Popup";
import { ColorResult, SwatchesPicker, SliderPicker } from 'react-color';
import useClickOutside from "@/hooks/useClickOutside";
import CopyIcon from '../svg/Copy';
import EditIcon from '../svg/Edit';
import OKIcon from '../svg/OK';
import ShrinkIcon from '../svg/Shrink';
import ExpandIcon from '../svg/Expand';
import Card from '../Card';
import ShareIcon from '../svg/Share';

interface ICardBox {
    cardData: IBoardElement;
    handleUpdateElement: (data: IBoardElement) => void;
    isSelected: boolean;
    handleClick: () => void;
    isShadow?: boolean;
    isBoardLocked?: boolean;
    handleDelete: (id: string) => void;
    handleSetDirty: () => void;
    handleChangeZIndex: (id: string) => void;
    isPointerNone?: boolean;
    elementPositions: { x: number[], y: number[] };
    scrollPosition: { x: number, y: number };
}

export default function CardBox({ cardData, handleUpdateElement, handleClick, isShadow, isBoardLocked, handleDelete, handleSetDirty, handleChangeZIndex, isSelected, isPointerNone, elementPositions, scrollPosition }: ICardBox) {
    // console.log(textData)
    // console.log("CodeBox isSelected", isSelected)
    const [mode, setMode] = useState<"read" | "edit">("read");
    const [position, setPosition] = useState({ left: cardData.left, top: cardData.top });

    // console.log("supportedLanguages", SyntaxHighlighter.supportedLanguages)
    // console.log("mode", mode)
    return (
        <>
            <Box
                handleMove={({ left, top }) => {
                    setPosition({ left, top });
                }}
                isLocked={isBoardLocked}
                isShadowElement={isShadow}
                handleUpdate={handleUpdateElement}
                data={cardData}
                isSelected={isSelected}
                handleClick={handleClick}
                handleDelete={handleDelete}
                handleSetDirty={handleSetDirty}
                handleChangeZIndex={handleChangeZIndex}
                isPointerNone={isPointerNone}
                elementPositions={elementPositions}
                scrollPosition={scrollPosition}
            >
                <button type="button" className="absolute top-2 left-2 z-10 w-6 h-6 p-1" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("導頁")
                }}>
                    <ShareIcon classProps="fill-none stroke-slate-200 -scale-x-100" />
                </button>

                <Card url={cardData.content} name={cardData.name} cardLize={"lg"}
                    classProps={`${isSelected ? "bg-zinc-800" : "group-hover:bg-zinc-600 group-hover:-top-6 cursor-pointer"}
                    absolute top-0 left-1/2 -translate-x-1/2
                    `} >
                </Card>
            </Box>
        </>
    )
}