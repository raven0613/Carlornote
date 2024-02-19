"use client"
import useAutosizedTextarea from "@/hooks/useAutosizedTextarea"
import { IBoardElement } from "@/type/card";
import React, { RefObject, useEffect, useRef, useState, DragEvent } from "react";
import Box from "./Box";

interface ITextBox {
    textData: IBoardElement;
    handleUpdateElement: (data: IBoardElement) => void;
    isSelected: boolean;
    handleClick: (id: string) => void;
    isShadow?: boolean;
    isLocked: boolean;
    handleDelete: (id: string) => void;
    handleSetDirty: () => void;
    handleChangeZIndex: (id: string) => void;
}

export default function TextBox({ textData, handleUpdateElement, isSelected, handleClick, isShadow, isLocked, handleDelete, handleSetDirty, handleChangeZIndex }: ITextBox) {
    // console.log(textData)
    // console.log("isSelected", isSelected)
    const textRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState(textData.content);

    useEffect(() => {
        if (!textData) return;
        setValue(textData.content);
    }, [textData])

    // useEffect(() => {
    //     let timer: NodeJS.Timeout | null = null;
    //     function debounce (fn: (args: any) => void, delay: number) {
    //         // let timer: NodeJS.Timeout | null = null;
    //         function callback () {
    //             let args = arguments;
    //             if (timer) clearTimeout(timer);
    //             timer = setTimeout(() => {
    //                 fn(args);
    //             }, delay);
    //         }
    //         return callback;
    //     }
    //     const updateDebounce = debounce(() => {
    //         console.log("存")
    //         handleUpdateElement({ ...textData, content: value });
    //     }, 1000);
    //     updateDebounce();
    //     return () => {
    //         if (timer) clearTimeout(timer);
    //     }
    // }, [handleUpdateElement, textData, value])

    return (
        <Box
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
            <textarea id={textData.id} ref={textRef}
                onChange={(e) => {
                    setValue(e.target.value);
                    handleUpdateElement({ ...textData, content: e.target.value });
                    handleSetDirty();
                }}
                className="boardElement textbox_textarea w-full h-full p-2 rounded-md overflow-hidden whitespace-pre-wrap outline-none resize-none bg-transparent text-neutral-700"
                value={value}>
            </textarea>
        </Box>
    )
}