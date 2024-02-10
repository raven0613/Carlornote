"use client"
import useAutosizedTextarea from "@/hooks/useAutosizedTextarea"
import { IBoardElement } from "@/type/card";
import React, { ReactNode, RefObject, useEffect, useRef, useState, DragEvent } from "react";

interface ITextBox {
    data: IBoardElement;
    handleUpdate: (data: IBoardElement) => void;
    isSelected: boolean;
    handleClick: (id: string) => void;
    handleShadowDragEnd?: (e: DragEvent) => void;
    children: ReactNode;
    isShadow?: boolean;
}

export default function Box({ data, handleUpdate, isSelected, handleClick, children, isShadow, handleShadowDragEnd }: ITextBox) {
    // console.log(textData)
    console.log(data.name, isSelected)
    const { width, height, rotation, left, top } = data;
    const boxRef = useRef<HTMLDivElement>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deg, setDeg] = useState(rotation);
    const [size, setSize] = useState({ width, height });
    const [position, setPosition] = useState({ left, top });
    const leftTopRef = useRef({ toBoxLeft: 0, toBoxTop: 0 });

    useEffect(() => {
        if (isSelected) setIsEditMode(true);
        else setIsEditMode(false);
    }, [isSelected])

    useEffect(() => {
        if (!data) return;
        setDeg(data.rotation);
        setSize({ width: data.width, height: data.height });
        if (isShadow) return;
        setPosition({ left: data.left, top: data.top });
    }, [data, isShadow])

    useEffect(() => {
        if (!isShadow) return;
        function handleMouse(e: MouseEvent) {
            setPosition({ left: e.clientX, top: e.clientY });
        }
        document.addEventListener("mousemove", handleMouse);
        return () => document.removeEventListener("mousemove", handleMouse);
    }, [isShadow]);

    return (
        <div ref={boxRef} className={`absolute min-h-10 min-w-24 rounded-md border hover:border-slate-400 ${isEditMode ? "border-slate-400" : "border-transparent"} ${isShadow ? "opacity-50" : "opacity-100"}`}
            style={{ left: `${position.left}px`, top: `${position.top}px`, rotate: `${deg}deg`, width: size.width, height: size.height, transition: "border-color 0.15s ease" }}
            onMouseDown={(e) => {
                // 紀錄點擊的時候的位置
                leftTopRef.current = {
                    toBoxLeft: e.clientX - e.currentTarget.offsetLeft,
                    toBoxTop: e.clientY - e.currentTarget.offsetTop
                };
            }}
            // onDragStart={(e) => {
            //     e.dataTransfer.setDragImage(e.currentTarget, window.outerWidth, window.outerHeight);
            //     e.dataTransfer.effectAllowed = "copyMove";
            //     setIsEditMode(true);
            // }}
            onDragEnd={(e: DragEvent) => {
                // 這時候才存資料
                console.log("box drag end")
                if (isShadow && handleShadowDragEnd) {
                    handleShadowDragEnd(e);
                    return;
                }
                handleUpdate({ ...data, left: position.left, top: position.top, width: size.width, height: size.height, rotation: deg });
                setIsEditMode(false);
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
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClick(data.id);
                // setIsEditMode(true);
            }}
            draggable={true}
        >
            {children}
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
                }}
                className={`w-2.5 h-2.5 rounded-full bg-slate-500 absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 z-20 cursor-nwse-resize duration-100 ${isEditMode ? "opacity-100" : "opacity-0 pointer-events-none"}`}
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
                }}
                className={`w-2.5 h-2.5 bg-slate-500 absolute bottom-1/2 -right-5 translate-y-1/2 translate-x-1/2 z-20 cursor-grab active:cursor-grabbing duration-100 ${isEditMode ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            ></div>
        </div>
    )
}