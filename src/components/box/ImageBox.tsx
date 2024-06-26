"use client"
import { IBoardElement } from "@/type/card";
import React, { useEffect, useRef, useState, DragEvent, ReactNode } from "react";
import Box from "./Box";
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';
import { ImageLoading } from "../ImageLoading";
import UrlLoading from "../UrlLoading";
import OKIcon from "../svg/OK";
import CopyIcon from "../svg/Copy";
import ImageIcon from "../svg/Image";
import ImageSmIcon from "../svg/ImageSm";
import { useDispatch, useSelector } from "react-redux";
import { closeAllModal, modalTypes, openModal } from "@/redux/reducers/modal";
import { IState } from "@/redux/store";
import { handleUpdateCard } from "@/api/card";
import { selectCard, updateCards } from "@/redux/reducers/card";

interface IImageCore {
    imageData: IBoardElement;
    handleOnLoad: (data: IBoardElement) => void;
}

export function ImageCore({ imageData, handleOnLoad }: IImageCore) {
    // console.log("imageData", imageData)
    // console.log("isSelected", isSelected)
    const [url, setUrl] = useState(imageData.content);
    const [showingBlock, setShowingBlock] = useState<"image" | "input" | "none">("none");
    const [imageLoadState, setImageLoadState] = useState<"fail" | "success" | "loading" | "url-loading" | "none">("loading")
    const inputValueRef = useRef<string>("");

    // console.log("url", url)
    // console.log("imageSentState", imageLoadState)
    // console.log("showingBlock", showingBlock)
    useEffect(() => {
        if (imageData.content === "dragging_image" || imageData.content === "image") {
            setShowingBlock("input");
            setImageLoadState("none")
        }
        if (!imageData.name || !imageData.content) return;
        // console.log("有內容了")
        setShowingBlock("image");
        setUrl(imageData.content);
    }, [imageData])

    return (
        <>
            {(imageLoadState === "loading") && <ImageLoading />}
            {(imageLoadState === "url-loading") && <div className="absolute -bottom-6 left-0 w-full border">
                <UrlLoading isCompleted={imageData.name !== ""} />
            </div>}


            {showingBlock === "image" && <Image id={imageData.id}
                className={`${(imageLoadState === "success") ? "opacity-100" : "opacity-0"}`}
                width={imageData.width}
                priority={true}
                height={imageData.height}
                src={url}
                alt={imageData.name}
                style={{
                    objectFit: 'cover', // cover, contain, none
                }}
                onLoad={(e) => {
                    // console.log("onLoad")
                    setShowingBlock("image");
                    setImageLoadState("success");
                    const name = uuidv4();
                    if (imageData.name) {
                        handleOnLoad({ ...imageData, content: url, width: imageData.width, height: imageData.height, name: imageData.name });
                    }
                    else {
                        // 沒有名字代表是直接貼上網址
                        handleOnLoad({ ...imageData, content: url, width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight, name });
                    }
                }}
                onError={() => {
                    setShowingBlock("input");
                    setImageLoadState("fail");
                }}
            />}
            {(imageLoadState !== "success" && showingBlock === "input") && <>
                <input id={imageData.id}
                    className={`textInput outline-none border px-2 absolute inset-y-0 left-0 right-16 ${imageLoadState === "fail" ? "border border-red-500" : ""}
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
                    className={`w-6 h-6 bg-green-500 absolute right-6 top-1/2 -translate-y-1/2 rounded-full leading-5 text-white p-1
        `}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // console.log("OKOK")
                        if (!getUrlIsValid(inputValueRef.current)) {
                            setImageLoadState("fail")
                            return;
                        }
                        setImageLoadState("url-loading");
                        setShowingBlock("image");
                        setUrl(inputValueRef.current);
                    }}
                >
                    {imageLoadState === "url-loading" ? "o" : <OKIcon classProps="stroke-slate-600 stroke-2" />}
                </button>
            </>}
        </>
    )
}

function getUrlIsValid(url: string) {
    if (url === "http://" || url === "https://") return false;
    if (!url.includes("http://") && !url.includes("https://")) return false;
    return true;
}

interface IImageBox {
    imageData: IBoardElement;
    handleUpdateElement: (data: ((pre: IBoardElement) => IBoardElement) | IBoardElement) => void;
    handleImgOnLoad: (data: IBoardElement) => void;
    isSelected: boolean;
    handleClick: () => void;
    isShadow?: boolean;
    isBoardLocked?: boolean;
    handleDelete: (id: string) => void;
    handleSetDirty: () => void;
    handleChangeZIndex: (id: string) => void;
    isPointerNone?: boolean;
    elementPositions: { x: number[], y: number[] };
    scrollPosition: { x: number, y: number };
    distenceToLeftTop?: { left: number, top: number }
}

export default function ImageBox({ imageData, handleUpdateElement, handleImgOnLoad, handleClick, isShadow, isBoardLocked, handleDelete, handleSetDirty, handleChangeZIndex, isSelected, isPointerNone, elementPositions, scrollPosition, distenceToLeftTop }: IImageBox) {
    const [position, setPosition] = useState({ left: imageData.left, top: imageData.top });
    const [isCopied, setIsCopied] = useState(false);
    const dispatch = useDispatch();
    const selectedCard = useSelector((state: IState) => state.selectedCard);

    useEffect(() => {
        // 為了 undo/redo 的時候位置要跟著跑
        setPosition({ left: imageData.left, top: imageData.top })
    }, [imageData.left, imageData.top]);
    // console.log("imageData", imageData)
    return (
        <>
            <Box
                handleMove={({ left, top }) => {
                    setPosition({ left, top });
                }}
                isLocked={isBoardLocked}
                isShadowElement={isShadow}
                handleUpdate={handleUpdateElement}
                data={imageData}
                isSelected={isSelected}
                handleClick={handleClick}
                handleDelete={handleDelete}
                handleSetDirty={handleSetDirty}
                handleChangeZIndex={handleChangeZIndex}
                isImage={true}
                isPointerNone={isPointerNone}
                elementPositions={elementPositions}
                scrollPosition={scrollPosition}
                distenceToLeftTop={distenceToLeftTop}
            >
                <ImageCore imageData={imageData} handleOnLoad={(card) => {
                    // console.log("handleOnLoad1")
                    if (isBoardLocked) return;
                    // console.log("handleOnLoad2")
                    handleImgOnLoad(card);
                }} />
            </Box>
            {/* buttons */}
            {isSelected && <div className="bg-white w-auto h-auto absolute border rounded-full flex gap-1 items-center p-[0.2rem] text-xs"
                style={{ top: position.top - 30, left: position.left }}
            >
                <button type="button" className={`bg-slate-200 w-5 h-5 rounded-full font-semibold relative p-1`}
                    onClick={() => {
                        if (imageData.content === selectedCard.imageUrl) {
                            dispatch(openModal({
                                type: modalTypes.confirmWindow,
                                props: {
                                    text: "這張圖已經是卡片圖了",
                                    handleConfirm: async () => {
                                        dispatch(closeAllModal({ type: "", props: {} }));
                                    },
                                    data: selectedCard
                                }
                            }));
                            return;
                        }
                        dispatch(openModal({
                            type: modalTypes.checkWindow,
                            props: {
                                text: "要將這張圖設為卡片圖嗎？",
                                handleConfirm: async () => {
                                    const updatedCard = { ...selectedCard, imageUrl: imageData.content };
                                    const response = await handleUpdateCard([updatedCard]);
                                    // console.log("response", response)
                                    if (response.status === "FAIL") return;
                                    const resData = JSON.parse(response.data);
                                    dispatch(updateCards(resData));
                                    dispatch(selectCard(updatedCard));
                                    dispatch(closeAllModal({ type: "", props: {} }));
                                },
                                data: selectedCard
                            }
                        }));
                    }}
                >
                    <ImageSmIcon classProps='stroke-slate-700' />
                </button>
                <button type="button" className={`bg-slate-200 w-5 h-5 rounded-full font-semibold relative p-1`}
                    onClick={() => {
                        navigator.clipboard.writeText(imageData.content);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 1500);
                    }}
                >
                    <CopyIcon classProps='stroke-slate-700' />
                    {isCopied && <span className="absolute left-[1.85rem] top-1/2 -translate-y-1/2 text-slate-400 font-light animate-hideFast opacity-0">copied</span>}
                </button>
            </div>}
        </>
    )
}
