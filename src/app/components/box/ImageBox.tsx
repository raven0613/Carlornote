"use client"
import useAutosizedTextarea from "@/hooks/useAutosizedTextarea"
import { IBoardElement } from "@/type/card";
import React, { RefObject, useEffect, useRef, useState, DragEvent } from "react";
import Box from "./Box";
import Image from "next/image";

interface IImageBox {
    data: IBoardElement;
    handleUpdateElement: (data: IBoardElement) => void;
    isSelected: boolean;
    handleClick: (id: string) => void;
    isShadow?: boolean;
    handleShadowDragEnd?: (e: DragEvent) => void;
    isLock: boolean;
    handleDelete: (id: string) => void;
}

export default function ImageBox({ data, handleUpdateElement, isSelected, handleClick, isShadow, handleShadowDragEnd, isLock, handleDelete }: IImageBox) {
    // console.log(textData)
    // console.log("isSelected", isSelected)

    return (
        <Box
            isLock={isLock}
            isShadowElement={isShadow}
            handleUpdate={handleUpdateElement}
            data={data}
            isSelected={isSelected}
            handleClick={handleClick}
            handleShadowDragEnd={handleShadowDragEnd}
            handleDelete={handleDelete}
        >
            {data.content !== "image" && <Image id={data.id} className="imagebox" width={data.width} height={data.height} src={data.content} alt={data.name}
                style={{
                    objectFit: 'fill', // cover, contain, none
                }}
            />}
            {data.content === "image" && <input id={data.id} className="outline-none border w-full h-full px-2 py-"
                onChange={(e) => {
                    handleUpdateElement({ ...data, content: e.target.value, width: 300, height: 300 });
                }}
            />}
        </Box>
    )
}