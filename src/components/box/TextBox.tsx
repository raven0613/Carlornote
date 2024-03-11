"use client"
import useAutosizedTextarea from "@/hooks/useAutosizedTextarea"
import { IBoardElement, ICard } from "@/type/card";
import React, { RefObject, useEffect, useRef, useState, DragEvent } from "react";
import Box from "./Box";
import Popup from "../Popup";
import { ColorResult, SwatchesPicker, SliderPicker } from 'react-color';
import useClickOutside from "@/hooks/useClickOutside";

// This is a hack to suppress the warning about missing defaultProps in react-color library as of version ^2.19.3
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error;
console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
};

const fontSizeMap = {
    xs: "text-xs",
    base: "text-base",
    xl: "text-xl",
    "2xl": "text-2xl"
}
const fontWeightMap = {
    extraLight: "font-extralight",
    normal: "font-normal",
    semiBold: "font-semibold",
    extraBold: "font-extrabold"
}

interface ITextBox {
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

export default function TextBox({ textData, handleUpdateElement, handleClick, isShadow, isBoardLocked, handleDelete, handleSetDirty, handleChangeZIndex, isSelected, isPointerNone, elementPositions, scrollPosition }: ITextBox) {
    // console.log(textData)
    // console.log("isSelected", isSelected)
    const [value, setValue] = useState(textData.content);
    const [isFontWeightOpen, setIsFontWeightOpen] = useState(false);
    const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const nodeRef = useClickOutside<HTMLDivElement>({
        handleMouseDownOutside: () => {
            setIsColorOpen(false);
        }
    })
    const [position, setPosition] = useState({ left: textData.left, top: textData.top });

    // console.log("isFontWeightOpen", isFontWeightOpen)
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
            {isColorOpen && <div className="absolute z-10" ref={nodeRef}
                style={{ top: position.top - 275 <= 0 ? position.top + 10 : position.top - 275, left: position.left }}
            >
                <SwatchesPicker
                    className={` w-full h-full`}
                    color={`${textData.textColor ?? "#555555"}`}
                    onChangeComplete={(result: ColorResult) => {
                        // console.log("onChangeComplete", result)
                        setIsColorOpen(false);
                        if (textData.textColor === result.hex) return;
                        save({ ...textData, textColor: result.hex });
                    }}
                    onChange={(e) => {
                        // console.log("onChange", e)
                    }}
                />
            </div>}
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
                <textarea id={textData.id} disabled={isBoardLocked}
                    onChange={(e) => {
                        if (isBoardLocked) return;
                        setValue(e.target.value);
                        handleUpdateElement({ ...textData, content: e.target.value });
                        handleSetDirty();
                    }}
                    className={`textInput textbox_textarea w-full h-full p-2 rounded-md whitespace-pre-wrap outline-none resize-none bg-transparent text-neutral-700 overflow-hidden cursor-text
                    ${fontWeightMap[textData.fontWeight ?? "normal"]}
                    ${fontSizeMap[textData.fontSize ?? "base"]}
                    `}
                    style={{ color: textData.textColor ?? "#525252" }}
                    value={value}>
                </textarea>

            </Box>
            {/* buttons */}
            {(isSelected && !isBoardLocked) && <div className="bg-white w-auto h-auto absolute border rounded-full flex gap-1 items-center p-[0.2rem] text-xs"
                style={{ top: position.top - 30, left: position.left }}
            >
                <button type="button" className={`bg-slate-200 w-5 h-5 rounded-full font-semibold relative`}
                    onClick={() => {
                        setIsFontWeightOpen(true);
                    }}
                >
                    B
                    <Popup isOpen={isFontWeightOpen}
                        options={[{
                            content: "text",
                            handleClick: (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsFontWeightOpen(false);
                                if (textData.fontWeight === "extraLight") return;
                                save({ ...textData, fontWeight: "extraLight" });
                            },
                            classProps: `font-extralight ${fontSizeMap[textData.fontSize ?? "base"]}`
                        }, {
                            content: "text",
                            handleClick: (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsFontWeightOpen(false);
                                if (textData.fontWeight === "normal") return;
                                save({ ...textData, fontWeight: "normal" });
                            },
                            classProps: `font-normal ${fontSizeMap[textData.fontSize ?? "base"]}`
                        }, {
                            content: "text",
                            handleClick: (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsFontWeightOpen(false);
                                if (textData.fontWeight === "semiBold") return;
                                save({ ...textData, fontWeight: "semiBold" });
                            },
                            classProps: `font-semibold ${fontSizeMap[textData.fontSize ?? "base"]}`
                        }, {
                            content: "text",
                            handleClick: (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsFontWeightOpen(false);
                                if (textData.fontWeight === "extraBold") return;
                                save({ ...textData, fontWeight: "extraBold" });
                            },
                            classProps: `font-extrabold ${fontSizeMap[textData.fontSize ?? "base"]}`
                        }]}
                        handleClose={() => {
                            setIsFontWeightOpen(false);
                        }}
                        classPorops={`bottom-full left-1/2 -translate-x-1/2`}
                    />
                </button>
                <button type="button" className={`bg-slate-200 w-5 h-5 rounded-full font-semibold relative`}
                    onClick={() => {
                        setIsFontSizeOpen(true);
                    }}
                >
                    T
                    <Popup isOpen={isFontSizeOpen}
                        options={[{
                            content: "text",
                            handleClick: (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsFontSizeOpen(false);
                                if (textData.fontSize === "xs") return;
                                save({ ...textData, fontSize: "xs" });
                            },
                            classProps: `text-xs ${fontWeightMap[textData.fontWeight ?? "normal"]}`
                        }, {
                            content: "text",
                            handleClick: (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsFontSizeOpen(false);
                                if (textData.fontSize === "base") return;
                                save({ ...textData, fontSize: "base" });
                            },
                            classProps: `text-base ${fontWeightMap[textData.fontWeight ?? "normal"]}`
                        }, {
                            content: "text",
                            handleClick: (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsFontSizeOpen(false);
                                if (textData.fontSize === "xl") return;
                                save({ ...textData, fontSize: "xl" });
                            },
                            classProps: `text-xl ${fontWeightMap[textData.fontWeight ?? "normal"]}`
                        }, {
                            content: "text",
                            handleClick: (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsFontSizeOpen(false);
                                if (textData.fontSize === "2xl") return;
                                save({ ...textData, fontSize: "2xl" });
                            },
                            classProps: `text-2xl ${fontWeightMap[textData.fontWeight ?? "normal"]}`
                        }]}
                        handleClose={() => {
                            setIsFontSizeOpen(false);
                        }}
                        classPorops={`bottom-full left-1/2 -translate-x-1/2`}
                    />
                </button>

                <button type="button" className={`w-5 h-5 rounded-full border-4 border-slate-200`} style={{ backgroundColor: textData.textColor ?? "#FFFFFF" }}
                    onClick={() => {
                        setIsColorOpen(true);
                    }}
                >
                </button>
            </div>}
        </>
    )
}