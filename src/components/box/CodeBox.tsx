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

// foundation 淺
// androidstudio 深

// This is a hack to suppress the warning about missing defaultProps in react-color library as of version ^2.19.3
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error;
console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
};

const supportedLanguage = ["css", "c", "csharp", "django", "dockerfile", "go", "http", "java", "javascript", "json", "jsx", "kotlin", "markdown", "nginx", "objectivec", "php-template", "php", "powershell", "python", "r", "scss", "sql", "swift", "typescript", "tsx", "xml"]

interface ICodeCore {
    textData: IBoardElement;
    handleUpdateElement: (data: IBoardElement) => void;
    handleSetDirty: () => void;
    codeMode: "read" | "edit";
    needFull?: boolean;
}

export function CodeCore({ textData, handleUpdateElement, handleSetDirty, codeMode, needFull }: ICodeCore) {
    const [title, setTitle] = useState(textData.name);
    const [value, setValue] = useState(textData.content);
    const [isFull, setIsFull] = useState(false);

    useEffect(() => {
        if (textData.content === value) return;
        setValue(textData.content);
    }, [textData.content, value])

    return (
        <>
            {codeMode === "edit" && <div className={`flex flex-col h-full w-full rounded-lg p-4 bg-[#282b2e] gap-2 text-slate-400 
            ${needFull ? (isFull ? "min-h-[30rem]" : "h-60") : "h-full"} 
            `}>
                <input className="textInput h-8 w-full bg-white/5 rounded-md outline-none pl-2 pr-9 sm:pr-2" value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        handleUpdateElement({ ...textData, name: e.target.value });
                        handleSetDirty();
                    }} />
                <textarea
                    onChange={(e) => {
                        setValue(e.target.value);
                        handleUpdateElement({ ...textData, content: e.target.value });
                        handleSetDirty();
                    }}
                    className={`textbox_textarea textInput w-full flex-1 p-2 rounded-md whitespace-pre-wrap outline-none resize-none bg-white/5
                    `}
                    value={value}>
                </textarea>
                {/* full icon */}
                {needFull && <button className="absolute top-4 right-6 z-20 w-8 h-8 hover:scale-110 duration-150"
                    onClick={() => {
                        setIsFull(pre => !pre);
                    }}
                >
                    {isFull ? <ShrinkIcon classProps="stroke-slate-500" /> : <ExpandIcon classProps="stroke-slate-500" />}
                </button>}
            </div>}
            {codeMode === "read" && <div className={`w-full relative pt-11 bg-[#1C1D21] rounded-lg h-full
            `}
            >
                {/* title */}
                <div className="w-full h-8 absolute top-0 inset-x-0 bg-slate-700 rounded-t-xl z-10 leading-8 pl-4 pr-8 text-slate-400 flex items-center justify-between overflow-hidden" >
                    <span className='truncate pr-2 text-sm'>{title}</span>
                    <div className='flex items-center gap-2'>
                        <select name="programmingLanguage" id="programmingLanguage" className="outline-none bg-slate-700 border-b px-1 border-slate-400 text-sm" value={textData.programmingLanguage}
                            onChange={(e) => {
                                if (e.target.value === textData.programmingLanguage) return;
                                handleUpdateElement({ ...textData, programmingLanguage: e.target.value });
                                handleSetDirty();
                            }}>
                            {supportedLanguage.map(item => {
                                return (
                                    <option className='px-1' value={item} key={item}>{item}</option>
                                )
                            })}
                        </select>
                        <button className='w-5 h-5 leading-5 rounded-[3px] border border-white/30 shrink-0 p-1 group hover:border-white/50 duration-150 hover:bg-white/10'
                            onClick={() => {
                                navigator.clipboard.writeText(value);
                            }}
                        >
                            <CopyIcon classProps="stroke-white/50 group-hover:stroke-white/80  duration-150" />
                        </button>
                    </div>
                </div>
                {/* code */}
                <div className={`w-full rounded-lg
                ${needFull ? (isFull ? "h-full max-h-[80vh] min-h-48 overflow-y-scroll" : "h-48") : "h-full"} 
                `}>
                    <SyntaxHighlighter
                        customStyle={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "1rem",
                            fontSize: "0.9rem",
                        }} language={textData.programmingLanguage ?? supportedLanguage[0]} style={anOldHope} wrapLongLines>
                        {value}
                    </SyntaxHighlighter>
                </div>

                {needFull && <button className="absolute top-10 right-4 z-20 w-8 h-8 hover:scale-110 duration-150"
                    onClick={() => {
                        setIsFull(pre => !pre);
                    }}
                >
                    {isFull ? <ShrinkIcon classProps="stroke-slate-500" /> : <ExpandIcon classProps="stroke-slate-500" />}
                </button>}
            </div>}
        </>
    )
}


interface IEditButton {
    handleClick: (mode: "read" | "edit") => void;
    defaultMode: "read" | "edit";
}

export function EditButton({ handleClick, defaultMode }: IEditButton) {
    const [mode, setMode] = useState<"read" | "edit">(defaultMode);
    useEffect(() => {
        setMode(defaultMode);
    }, [defaultMode])
    return (
        <>
            <button type="button" className={`bg-slate-200 w-full h-full rounded-full font-semibold relative p-2 sm:p-[0.2rem]`}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (mode === "edit") {
                        handleClick("read");
                        setMode("read");
                    }
                    else {
                        handleClick("edit");
                        setMode("edit");
                    }
                }}
            >
                {/* 電腦版 icon 在 box 外尺寸較小，手機板 icon 尺寸較大 */}
                {mode === "read" ?
                    <EditIcon classProps='stroke-slate-700 stroke-[2.5] sm:stroke-[2]' /> :
                    <OKIcon classProps='stroke-slate-700' />}
            </button>
        </>
    )
}

interface ICodeBox {
    textData: IBoardElement;
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
    scrollPosition:  { x: number, y: number };
}

export default function CodeBox({ textData, handleUpdateElement, handleClick, isShadow, isBoardLocked, handleDelete, handleSetDirty, handleChangeZIndex, isSelected, isPointerNone, elementPositions, scrollPosition }: ICodeBox) {
    // console.log(textData)
    // console.log("CodeBox isSelected", isSelected)
    const [mode, setMode] = useState<"read" | "edit">("read");
    const [position, setPosition] = useState({ left: textData.left, top: textData.top });

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
                data={textData}
                isSelected={isSelected}
                handleClick={handleClick}
                handleDelete={handleDelete}
                handleSetDirty={handleSetDirty}
                handleChangeZIndex={handleChangeZIndex}
                isPointerNone={isPointerNone}
                elementPositions={elementPositions}
                scrollPosition={scrollPosition}
            >
                <CodeCore
                    handleUpdateElement={handleUpdateElement}
                    handleSetDirty={handleSetDirty}
                    textData={textData} codeMode={mode}
                />
            </Box>

            {/* buttons */}
            {isSelected && <div className="bg-white w-7 h-7 absolute border rounded-full flex gap-1 items-center p-[0.2rem] text-xs"
                style={{ top: position.top - 30, left: position.left }}
            >
                <EditButton handleClick={(mode) => {
                    setMode(mode);
                }} defaultMode={mode} />
            </div>}
        </>
    )
}