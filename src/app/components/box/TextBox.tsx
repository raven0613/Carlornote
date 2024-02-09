"use client"
import useAutosizedTextarea from "@/hooks/useAutosizedTextarea"
import React, { useEffect, useRef, useState } from "react";

export default function TextBox() {
    const boxRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState("");
    const [isTextable, setIsTextable] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [rotation, setRotation] = useState(0);
    const [size, setSize] = useState({ width: 150, height: 66 });
    const [position, setPosition] = useState({ left: 200, top: 100 });
    const leftTopRef = useRef({ toBoxLeft: 0, toBoxTop: 0 });

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (!boxRef.current?.contains(e.target as Node)) {
                setIsTextable(false);
                setIsEditMode(false)
            }
            else setIsEditMode(true);
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [])

    return (
        <div ref={boxRef} className={`absolute p-2 min-h-10 min-w-24 rounded-md border hover:border-slate-400 ${isEditMode ? "border-slate-400" : "border-transparent"}`}
            style={{ left: `${position.left}px`, top: `${position.top}px`, rotate: `${rotation}deg`, width: size.width, height: size.height, transition: "border-color 0.15s ease" }}
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
            }}
            draggable={true}
        >
            <div
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onDoubleClick={() => setIsTextable(true)} className={`rounded-md absolute top-0 right-0 w-full h-full ${isTextable ? "hidden" : "block"}`}
            ></div>
            <textarea ref={textRef}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
                className="w-full h-full rounded-md overflow-hidden whitespace-pre-wrap outline-none resize-none bg-transparent text-neutral-700"
                value={value}
            >
            </textarea>
            <div
                draggable={true}
                onDrag={(e) => {
                    e.stopPropagation();
                    console.log("onDrag")
                    if (!boxRef.current) return;
                    const startX = boxRef.current.offsetLeft + boxRef.current.offsetWidth;
                    const startY = boxRef.current.offsetTop + boxRef.current.offsetHeight;
                    const nowX = e.clientX;
                    const nowY = e.clientY;
                    if (!nowX && !nowY) return;
                    setSize({
                        width: Number(boxRef.current.style.width.split("px")[0]) + nowX - startX,
                        height: Number(boxRef.current.style.height.split("px")[0]) + nowY - startY
                    })
                }}
                className={`w-2.5 h-2.5 rounded-full bg-slate-500 absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 z-20 cursor-nwse-resize duration-100 ${isEditMode ? "opacity-100" : "opacity-0"}`}
            ></div>
            <div
                draggable={true}
                onDrag={(e) => {
                    e.stopPropagation();
                    console.log("Rotate")
                    if (!boxRef.current) return;
                    const centerX = boxRef.current.offsetLeft + boxRef.current.offsetWidth / 2;
                    const centerY = boxRef.current.offsetTop + boxRef.current.offsetHeight / 2;
                    const nowX = e.clientX;
                    const nowY = e.clientY;
                    const theta = Math.atan2(nowY - centerY, nowX - centerX);
                    const degree = (theta * 180) / Math.PI;
                    if (!nowX && !nowY) return;
                    setRotation(degree);
                    if (degree > -5 && degree < 5) setRotation(0);
                    else if (degree > 85 && degree < 95) setRotation(90);
                    else if (degree > 175 && degree < 185) setRotation(180);
                    else if (degree > -95 && degree < -85) setRotation(-90);
                }}
                className={`w-2.5 h-2.5 bg-slate-500 absolute bottom-1/2 -right-5 translate-y-1/2 translate-x-1/2 z-20 cursor-grab active:cursor-grabbing duration-100 ${isEditMode ? "opacity-100" : "opacity-0"}`}
            ></div>
        </div>
    )
}