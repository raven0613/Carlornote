"use client"
import useAutosizedTextarea from "@/hooks/useAutosizedTextarea"
import { IBoardElement } from "@/type/card";
import React, { RefObject, useEffect, useRef, useState } from "react";

interface ITextBox {
    textData: IBoardElement;
    handleUpdateElement: (data: IBoardElement) => void;
    isSelected: boolean;
    handleClick: (id: string) => void;
}

export default function TextBox({ textData, handleUpdateElement, isSelected, handleClick }: ITextBox) {
    // console.log(textData)
    // console.log("isSelected", isSelected)
    const { content, width, height, rotation, left, top } = textData;
    const boxRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState(content);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deg, setDeg] = useState(rotation);
    const [size, setSize] = useState({ width, height });
    const [position, setPosition] = useState({ left, top });
    const leftTopRef = useRef({ toBoxLeft: 0, toBoxTop: 0 });

    useEffect(() => {
        if (isSelected) return;
        setIsEditMode(false);
    }, [isSelected])

    useEffect(() => {
        if (!textData) return;
        setValue(textData.content);
        setDeg(textData.rotation);
        setSize({ width: textData.width, height: textData.height });
        setPosition({ left: textData.left, top: textData.top });
    }, [textData])

    return (
        <div ref={boxRef} className={`absolute min-h-10 min-w-24 rounded-md border hover:border-slate-400 ${isEditMode ? "border-slate-400" : "border-transparent"}`}
            style={{ left: `${position.left}px`, top: `${position.top}px`, rotate: `${deg}deg`, width: size.width, height: size.height, transition: "border-color 0.15s ease" }}
            onMouseDown={(e) => {
                leftTopRef.current = {
                    toBoxLeft: e.clientX - e.currentTarget.offsetLeft,
                    toBoxTop: e.clientY - e.currentTarget.offsetTop
                };
            }}
            onDragStart={(e) => {
                e.dataTransfer.setDragImage(e.currentTarget, window.outerWidth, window.outerHeight);
                e.dataTransfer.effectAllowed = "copyMove";
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrag={(e) => {
                if (!leftTopRef.current) return;
                if (!e.clientX && !e.clientY) return;
                setPosition({
                    left: e.clientX - leftTopRef.current.toBoxLeft,
                    top: e.clientY - leftTopRef.current.toBoxTop
                })
                handleUpdateElement({ ...textData, left: e.clientX - leftTopRef.current.toBoxLeft, top: e.clientY - leftTopRef.current.toBoxTop });
            }}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClick(textData.id);
                setIsEditMode(true);
            }}
            draggable={true}
        >
            <textarea id={textData.id} ref={textRef}
                onChange={(e) => {
                    setValue(e.target.value);
                    handleUpdateElement({ ...textData, content: e.target.value });
                }}
                className="textbox_textarea w-full h-full p-2 rounded-md overflow-hidden whitespace-pre-wrap outline-none resize-none bg-transparent text-neutral-700"
                value={value}
            >
            </textarea>
            <div
                draggable={true}
                onDrag={(e) => {
                    e.stopPropagation();
                    console.log("onDrag")
                    if (!boxRef.current) return;
                    setIsEditMode(true);
                    const startX = boxRef.current.offsetLeft + boxRef.current.offsetWidth;
                    const startY = boxRef.current.offsetTop + boxRef.current.offsetHeight;
                    const nowX = e.clientX;
                    const nowY = e.clientY;
                    if (!nowX && !nowY) return;
                    setSize({
                        width: Number(boxRef.current.style.width.split("px")[0]) + nowX - startX,
                        height: Number(boxRef.current.style.height.split("px")[0]) + nowY - startY
                    })
                    handleUpdateElement({
                        ...textData, width: Number(boxRef.current.style.width.split("px")[0]) + nowX - startX,
                        height: Number(boxRef.current.style.height.split("px")[0]) + nowY - startY
                    });
                }}
                className={`w-2.5 h-2.5 rounded-full bg-slate-500 absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 z-20 cursor-nwse-resize duration-100 ${isEditMode ? "opacity-100" : "opacity-0"}`}
            ></div>
            <div
                draggable={true}
                onDrag={(e) => {
                    e.stopPropagation();
                    console.log("Rotate")
                    if (!boxRef.current) return;
                    setIsEditMode(true);
                    const centerX = boxRef.current.offsetLeft + boxRef.current.offsetWidth / 2;
                    const centerY = boxRef.current.offsetTop + boxRef.current.offsetHeight / 2;
                    const nowX = e.clientX;
                    const nowY = e.clientY;
                    const theta = Math.atan2(nowY - centerY, nowX - centerX);
                    let degree = (theta * 180) / Math.PI;
                    if (!nowX && !nowY) return;

                    if (degree > -5 && degree < 5) degree = 0;
                    else if (degree > 85 && degree < 95) degree = 90;
                    else if (degree > 175 && degree < 185) degree = 180;
                    else if (degree > -95 && degree < -85) degree = -90;
                    setDeg(Number(degree.toFixed(2)));
                    handleUpdateElement({ ...textData, rotation: Number(degree.toFixed(2)) });
                }}
                className={`w-2.5 h-2.5 bg-slate-500 absolute bottom-1/2 -right-5 translate-y-1/2 translate-x-1/2 z-20 cursor-grab active:cursor-grabbing duration-100 ${isEditMode ? "opacity-100" : "opacity-0"}`}
            ></div>
        </div>
    )
}