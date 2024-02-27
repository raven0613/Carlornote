"use client"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord, vs2015, foundation, anOldHope, androidstudio, atelierDuneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { IBoardElement, ICard } from "@/type/card";
import React, { RefObject, useEffect, useRef, useState, DragEvent, ReactNode } from "react";
import Box from "./Box";
import markdownit from 'markdown-it'
import Popup from "../Popup";
import { ColorResult, SwatchesPicker, SliderPicker } from 'react-color';
import useClickOutside from "@/hooks/useClickOutside";
import CopyIcon from '../svg/Copy';
import EditIcon from '../svg/Edit';
import OKIcon from '../svg/OK';
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

const supportedLanguage = ["css", "c", "csharp", "django", "dockerfile", "go", "http", "java", "javascript", "json", "jsx", "kotlin", "markdown", "nginx", "objectivec", "php-template", "php", "powershell", "python", "r", "scss", "sql", "swift", "typescript", "tsx", "xml"]

interface ICodeBox {
    textData: IBoardElement;
    handleUpdateElement: (data: IBoardElement) => void;
    isSelected: boolean;
    handleClick: () => void;
    isShadow?: boolean;
    isLocked: boolean;
    handleDelete: (id: string) => void;
    handleSetDirty: () => void;
    handleChangeZIndex: (id: string) => void;
}

export default function MarkdownBox({ textData, handleUpdateElement, handleClick, isShadow, isLocked, handleDelete, handleSetDirty, handleChangeZIndex, isSelected }: ICodeBox) {
    // console.log(textData)
    // console.log("CodeBox isSelected", isSelected)
    const [title, setTitle] = useState(textData.name);
    const [value, setValue] = useState(textData.content);
    const [mode, setMode] = useState<"read" | "edit">("read");
    const [position, setPosition] = useState({ left: textData.left, top: textData.top });

    const result = md.render(
        `
        #  ㄟㄟ
        ## 你好嗎
        ### 上班好玩嗎
        `);

    // console.log("supportedLanguages", SyntaxHighlighter.supportedLanguages)
    console.log("mode", mode)
    function save(updatedData: IBoardElement) {
        handleUpdateElement(updatedData);
        handleSetDirty();
    }

    useEffect(() => {
        if (!textData) return;
        setValue(textData.content);
    }, [textData])

    return (
        <>
            <Box
                handleMove={({ left, top }) => {
                    setPosition({ left, top });
                }}
                isLocked={isLocked}
                isShadowElement={isShadow}
                handleUpdate={handleUpdateElement}
                data={textData}
                isSelected={isSelected}
                handleClick={handleClick}
                handleDelete={handleDelete}
                handleSetDirty={handleSetDirty}
                handleChangeZIndex={handleChangeZIndex}
            >
                {mode === "edit" && <div className="h-full w-full rounded-xl p-4 bg-[#2c2e28] text-slate-400">
                    <textarea
                        onChange={(e) => {
                            setValue(e.target.value);
                            handleUpdateElement({ ...textData, content: e.target.value });
                            handleSetDirty();
                        }}
                        className={`textbox_textarea textInput w-full h-full p-2 rounded-md whitespace-pre-wrap outline-none resize-none bg-white/5
                    `}
                        value={value}>
                    </textarea>
                    <article className="prose max-w-none w-full h-full bg-[#a59e87] outline-none p-4 ml-2 text-slate-700 absolute left-full top-0 rounded-md overflow-y-scroll z-30 shadow-md shadow-black/30" dangerouslySetInnerHTML={{ __html: md.render(value) }} />
                </div>}

                {mode === "read" && <div className="w-full h-full relative bg-[#d3d0c5] rounded-lg"
                >
                    <article className="prose max-w-none w-full h-full text-slate-700 overflow-y-scroll p-4" dangerouslySetInnerHTML={{ __html: md.render(value) }} />                    
                </div>}
            </Box>

            {/* buttons */}
            {isSelected && <div className="bg-white w-auto h-auto absolute border rounded-full flex gap-1 items-center p-[0.2rem] text-xs"
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
        </>
    )
}