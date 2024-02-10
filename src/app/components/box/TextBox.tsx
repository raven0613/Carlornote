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
    handleShadowDragEnd?: (e: DragEvent) => void;
}

export default function TextBox({ textData, handleUpdateElement, isSelected, handleClick, isShadow, handleShadowDragEnd }: ITextBox) {
    // console.log(textData)
    // console.log("isSelected", isSelected)
    const textRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState(textData.content);

    useEffect(() => {
        if (!textData) return;
        setValue(textData.content);
    }, [textData])

    return (
        <Box
            isShadow={isShadow}
            handleUpdate={handleUpdateElement}
            data={textData}
            isSelected={isSelected}
            handleClick={handleClick}
            handleShadowDragEnd={handleShadowDragEnd}
        >
            <textarea id={textData.id} ref={textRef}
                onChange={(e) => {
                    setValue(e.target.value);
                    handleUpdateElement({ ...textData, content: e.target.value });
                }}
                className="textbox_textarea w-full h-full p-2 rounded-md overflow-hidden whitespace-pre-wrap outline-none resize-none bg-transparent text-neutral-700"
                value={value}>
            </textarea>
        </Box>
    )
}