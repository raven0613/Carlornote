"use client"
import { IBoardElement } from "@/type/card";
import React, { useEffect, useRef, useState, DragEvent } from "react";
import Box from "./Box";
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';

function getUrlIsValid(url: string) {
    if (url === "http://" || url === "https://") return false;
    if (!url.includes("http://") && !url.includes("https://")) return false;
    return true;
}

interface IImageBox {
    imageData: IBoardElement;
    handleUpdateElement: (data: IBoardElement) => void;
    isSelected: boolean;
    handleClick: (id: string) => void;
    isShadow?: boolean;
    isLocked: boolean;
    handleDelete: (id: string) => void;
    handleSetDirty: () => void;
    handleChangeZIndex: (id: string) => void;
}

export default function ImageBox({ imageData, handleUpdateElement, isSelected, handleClick, isShadow, isLocked, handleDelete, handleSetDirty, handleChangeZIndex }: IImageBox) {
    console.log("imageData", imageData)
    // console.log("isSelected", isSelected)
    const [url, setUrl] = useState(imageData.content);
    const [showingBlock, setShowingBlock] = useState<"image" | "input">("input");
    const [imageLoadState, setImageLoadState] = useState<"fail" | "success" | "loading" | "none">("none")
    const inputValueRef = useRef<string>("");

    console.log("imageSentState", imageLoadState)
    useEffect(() => {
        if (!imageData.name) return;
        setImageLoadState("success");
        setShowingBlock("image");
    }, [imageData])

    return (
        <Box
            isLocked={isLocked}
            isShadowElement={isShadow}
            handleUpdate={handleUpdateElement}
            data={imageData}
            isSelected={isSelected}
            handleClick={handleClick}
            handleDelete={handleDelete}
            handleSetDirty={handleSetDirty}
            handleChangeZIndex={handleChangeZIndex}
            isImage={true}
        >
            {(imageData.name && imageLoadState !== "success") && <div id={imageData.id} className="boardElement imagebox absolute inset-0 bg-slate-400 z-20"></div>}

            {showingBlock === "image" && <Image id={imageData.id}
                className={`boardElement imagebox ${imageLoadState === "success" ? "opacity-100" : "opacity-0"}`} width={imageData.width} height={imageData.height} src={url} alt={imageData.name}
                style={{
                    objectFit: 'fill', // cover, contain, none
                }}
                onLoad={(e) => {
                    console.log("onLoad")
                    setShowingBlock("image");
                    const name = uuidv4();
                    // console.log("imageData.name", imageData.name)
                    setImageLoadState("success");
                    handleUpdateElement({ ...imageData, content: url, width: imageData.width, height: imageData.height, name });
                    // console.log(e.currentTarget.naturalWidth)
                    // console.log(e.currentTarget.naturalHeight)
                }}
                onError={() => {
                    setShowingBlock("input");
                    setImageLoadState("fail");
                }}
            />}
            {imageLoadState !== "success" && <>
                <input id={imageData.id}
                    className={`boardElement imagebox outline-none border px-2 absolute inset-y-0 left-0 right-16 ${imageLoadState === "fail" ? "border border-red-500" : ""}
                    `}
                    onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        inputValueRef.current = e.currentTarget.value;
                    }}
                    placeholder="請輸入圖片網址"
                    onFocus={() => {
                        setImageLoadState("none");
                    }}
                />
                <button
                    className={`boardElement imagebox w-7 h-7 bg-green-500 absolute right-6 top-1/2 -translate-y-1/2 rounded-full leading-5 text-white
                    `}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!getUrlIsValid(inputValueRef.current)) {
                            setImageLoadState("fail")
                            return;
                        }
                        setImageLoadState("loading")
                        setShowingBlock("image");
                        setUrl(inputValueRef.current);
                    }}
                >
                    {imageLoadState === "loading" ? "o" : "v"}
                </button>
            </>}
        </Box>
    )
}