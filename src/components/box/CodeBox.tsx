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

export default function CodeBox({ textData, handleUpdateElement, handleClick, isShadow, isLocked, handleDelete, handleSetDirty, handleChangeZIndex, isSelected }: ICodeBox) {
    // console.log(textData)
    // console.log("CodeBox isSelected", isSelected)
    const [title, setTitle] = useState(textData.name);
    const [value, setValue] = useState(textData.content);
    const [mode, setMode] = useState<"read" | "edit">("read");
    const [position, setPosition] = useState({ left: textData.left, top: textData.top });

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
                {mode === "edit" && <div className="flex flex-col h-full w-full rounded-xl p-4 bg-[#282b2e] gap-2 text-slate-400">
                    <input className="textInput h-8 w-full bg-white/5 rounded-md outline-none px-2" value={title}
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
                </div>}
                {mode === "read" && <div className="w-full h-full relative pl-2 pt-11 bg-[#1C1D21] rounded-lg"
                >
                    <div className="w-full h-8 absolute top-0 inset-x-0 bg-slate-700 rounded-t-xl z-10 leading-8 pl-4 pr-8 text-slate-400 flex items-center justify-between " >
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
                    <SyntaxHighlighter
                        customStyle={{
                            width: "100%", height: "100%", borderRadius: "1rem",
                            fontSize: "0.9rem"
                        }} language={textData.programmingLanguage} style={anOldHope} wrapLongLines>
                        {value}
                    </SyntaxHighlighter></div>}
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