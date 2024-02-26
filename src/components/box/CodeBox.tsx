"use client"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord, vs2015, foundation, anOldHope, androidstudio, atelierDuneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { IBoardElement, ICard } from "@/type/card";
import React, { RefObject, useEffect, useRef, useState, DragEvent, ReactNode } from "react";
import Box from "./Box";
import Popup from "../Popup";
import { ColorResult, SwatchesPicker, SliderPicker } from 'react-color';
import useClickOutside from "@/hooks/useClickOutside";

// foundation 淺
// androidstudio 深

// This is a hack to suppress the warning about missing defaultProps in react-color library as of version ^2.19.3
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error;
console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
};

const supportedLanguage = ["css", "c", "csharp", "django", "dockerfile", "go", "http", "java", "javascript", "json", "kotlin", "markdown", "nginx", "objectivec", "php-template", "php", "powershell", "python", "r", "scss", "sql", "swift", "typescript", "xml"]

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
    const textRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState(textData.content);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
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
                {mode === "edit" && <textarea id={textData.id} ref={textRef}
                    onChange={(e) => {
                        setValue(e.target.value);
                        handleUpdateElement({ ...textData, content: e.target.value });
                        handleSetDirty();
                    }}
                    className={`boardElement textbox_textarea w-full h-full p-2 rounded-md whitespace-pre-wrap outline-none resize-none bg-transparent text-neutral-700
                    `}
                    style={{ color: textData.textColor ?? "#FFFFFF" }}
                    value={value}>
                </textarea>}
                {mode === "read" && <div id={textData.id} className="boardElement textInput absolute inset-0"
                >
                    <SyntaxHighlighter
                        customStyle={{
                            width: "100%", height: "100%", borderRadius: "1rem",
                            // pointerEvents: "none"
                        }} language="javascript" style={androidstudio} wrapLongLines>
                        {value}
                    </SyntaxHighlighter></div>}
            </Box>

            {/* buttons */}
            {isSelected && <div className="boardElement bg-white w-auto h-auto absolute border rounded-full flex gap-1 items-center p-[0.2rem] text-xs"
                style={{ top: position.top - 30, left: position.left }}
            >
                <button type="button" className={`bg-slate-200 w-5 h-5 rounded-full font-semibold relative`}
                    onClick={() => {
                        if (mode === "edit") setMode("read");
                        else setMode("edit");
                    }}
                >
                    M
                </button>
            </div>}
        </>
    )
}