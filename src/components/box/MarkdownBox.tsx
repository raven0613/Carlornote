"use client"
import { IBoardElement, ICard } from "@/type/card";
import React, { RefObject, useEffect, useRef, useState, DragEvent, ReactNode } from "react";
import Box from "./Box";
import markdownit from 'markdown-it'
import EditIcon from '../svg/Edit';
import OKIcon from '../svg/OK';
import ExpandIcon from "../svg/Expand";
import ShrinkIcon from "../svg/Shrink";
import useClickOutside from "@/hooks/useClickOutside";
const md = markdownit();

// foundation 淺
// androidstudio 深

// This is a hack to suppress the warning about missing defaultProps in react-color library as of version ^2.19.3
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error;
console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
};

interface IMarkdownCore {
    textData: IBoardElement;
    handleUpdateElement: (data: IBoardElement) => void;
    handleSetDirty: () => void;
    articleMode: "read" | "edit";
    needFull?: boolean;
}

export function MarkdownCore({ textData, handleUpdateElement, handleSetDirty, articleMode, needFull }: IMarkdownCore) {
    const [value, setValue] = useState(textData.content);
    const [isFull, setIsFull] = useState(false);
    const scrollTopRef = useRef(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const articleRef = useRef<HTMLTitleElement>(null);

    useEffect(() => {
        if (textData.content === value) return;
        setValue(textData.content);
    }, [textData.content, value])

    return (
        <>
            {articleMode === "edit" && <div className="h-full w-full rounded-xl p-4 bg-[#282c2e] text-slate-400 relative">
                <textarea ref={textareaRef}
                    onWheel={(e) => {
                        // scrollTopRef.current = e.currentTarget.scrollTop;
                        articleRef.current?.scrollTo({
                            top: e.currentTarget.scrollTop,
                            behavior: "smooth"
                        });
                    }}
                    onChange={(e) => {
                        // console.log("e.target.value", e.target.value)
                        setValue(e.target.value);
                        handleUpdateElement({ ...textData, content: e.target.value });
                        handleSetDirty();
                    }}
                    className={`textbox_textarea textInput w-full p-2 rounded-md whitespace-pre-wrap outline-none resize-none bg-white/5
                    ${needFull ? (isFull ? "min-h-[30rem]" : "h-60") : "h-full"} 
                    `}
                    value={value}>
                </textarea>
                <article ref={articleRef} className="prose max-w-none marker:text-slate-500 w-full h-full bg-[#e9e6e2] outline-none p-4 ml-2 text-slate-700 absolute left-full top-0 rounded-md overflow-y-scroll z-30 shadow-md shadow-black/30"
                    onWheel={(e) => {
                        textareaRef.current?.scrollTo({
                            top: e.currentTarget.scrollTop,
                            behavior: "smooth"
                        });
                    }}
                    dangerouslySetInnerHTML={{ __html: md.render(value) }}
                />
            </div>}

            {articleMode === "read" && <div className={`w-full relative bg-[#e9e6e2] rounded-lg overflow-y-scroll pb-2
            ${needFull ? (isFull ? "h-full max-h-[80vh] min-h-48" : "h-48") : "h-full"}
            `}
            >
                <article className={`prose marker:text-slate-500 max-w-none w-full h-full
                text-slate-700  p-4`} dangerouslySetInnerHTML={{ __html: md.render(value) }} />
            </div>}

            {needFull && <button className="absolute top-4 right-4 z-20 w-8 h-8 hover:scale-110 duration-150"
                onClick={() => {
                    setIsFull(pre => !pre);
                }}
            >
                {isFull ? <ShrinkIcon classProps="stroke-slate-600" /> : <ExpandIcon classProps="stroke-slate-600" />}
            </button>}
        </>
    )
}

interface IMarkdownBox {
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

export default function MarkdownBox({ textData, handleUpdateElement, handleClick, isShadow, isBoardLocked, handleDelete, handleSetDirty, handleChangeZIndex, isSelected, isPointerNone, elementPositions, scrollPosition }: IMarkdownBox) {
    // console.log(textData)
    // console.log("CodeBox isSelected", isSelected)
    const [value, setValue] = useState(textData.content);
    const [mode, setMode] = useState<"read" | "edit">("read");
    const [position, setPosition] = useState({ left: textData.left, top: textData.top });

    const nodeRef = useClickOutside<HTMLDivElement>({ 
        handleMouseDownOutside: () => {
            setMode("read");
        } 
    });
    useEffect(() => {
        // 為了 undo/redo 的時候位置要跟著跑
        setPosition({ left: textData.left, top: textData.top })
    }, [textData.left, textData.top]);
    // console.log("supportedLanguages", SyntaxHighlighter.supportedLanguages)
    // console.log("mode", mode)

    useEffect(() => {
        if (!textData) return;
        setValue(textData.content);
    }, [textData])

    return (
        <div ref={nodeRef} onDoubleClick={() => {
            if (isPointerNone || isBoardLocked) return;
            setMode("edit");
        }}>
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
                <MarkdownCore
                    handleUpdateElement={handleUpdateElement}
                    handleSetDirty={handleSetDirty}
                    textData={textData} articleMode={mode}
                />
            </Box>

            {/* buttons */}
            {(isSelected && !isBoardLocked) && <div className="bg-white w-auto h-auto absolute border rounded-full flex gap-1 items-center p-[0.2rem] text-xs"
                style={{ top: position.top - 30, left: position.left }}
            >
                <button type="button" className={`bg-slate-200 w-5 h-5 rounded-full font-semibold relative p-1`}
                    onClick={() => {
                        if (mode === "edit") setMode("read");
                        else setMode("edit");
                    }}
                >
                    {mode === "read" ?
                        <EditIcon classProps='stroke-slate-700' /> :
                        <OKIcon classProps='stroke-slate-700' />}
                </button>
            </div>}
        </div>
    )
}