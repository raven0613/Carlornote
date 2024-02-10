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
}

export default function ImageBox({ data, handleUpdateElement, isSelected, handleClick, isShadow, handleShadowDragEnd }: IImageBox) {
    // console.log(textData)
    // console.log("isSelected", isSelected)

    return (
        <Box
            isShadow={isShadow}
            handleUpdate={handleUpdateElement}
            data={data}
            isSelected={isSelected}
            handleClick={handleClick}
            handleShadowDragEnd={handleShadowDragEnd}
        >
            <Image id={data.id} className="imagebox" width={data.width} height={data.height} src={data.content} alt={data.name}
                style={{
                    objectFit: 'contain', // cover, contain, none
                }}
            />
        </Box>
    )
}