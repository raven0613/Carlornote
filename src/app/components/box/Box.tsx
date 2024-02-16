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
    isShadowElement?: boolean;
    isLock: boolean;
    handleDelete: (id: string) => void;
    handleSetDirty: () => void;
}

export default function Box({ data, handleUpdate, isSelected, handleClick, children, isShadowElement, handleShadowDragEnd, isLock, handleDelete, handleSetDirty }: ITextBox) {
    // console.log(textData) 
    // console.log(data.name, isSelected)
    const { width, height, rotation, left, top } = data;
    const boxRef = useRef<HTMLDivElement>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deg, setDeg] = useState(rotation);
    const [size, setSize] = useState({ width, height });
    const [position, setPosition] = useState({ left, top });
    const [radius, setRadius] = useState(0);
    const leftTopRef = useRef({ toBoxLeft: 0, toBoxTop: 0 });
    // console.log("isEditMode", isEditMode)

    useEffect(() => {
        if (isSelected) setIsEditMode(true);
        else setIsEditMode(false);
    }, [isSelected])

    useEffect(() => {
        if (!data) return;
        setDeg(data.rotation);
        setRadius(data.radius);
        setSize({ width: data.width, height: data.height });
        if (isShadowElement) return;
        setPosition({ left: data.left, top: data.top });
    }, [data, isShadowElement])

    useEffect(() => {
        if (!isShadowElement) return;
        function handleMouse(e: MouseEvent) {
            setPosition({ left: e.clientX, top: e.clientY });
        }
        document.addEventListener("mousemove", handleMouse);
        return () => document.removeEventListener("mousemove", handleMouse);
    }, [isShadowElement]);

    return (
        <>
            <div ref={boxRef}
                className={`boardElement absolute min-h-5 min-w-12 border hover:border-slate-400 
            ${isEditMode ? "border-slate-400" : "border-transparent"} 
            ${isShadowElement ? "opacity-50" : "opacity-100"}
            ${isLock ? "pointer-events-none" : ""}
            `}
                style={{ left: `${position.left}px`, top: `${position.top}px`, rotate: `${deg}deg`, width: size.width, height: size.height, transition: "border-color 0.15s ease" }}
                onMouseDown={(e) => {
                    // 紀錄點擊的時候的位置
                    leftTopRef.current = {
                        toBoxLeft: e.clientX - e.currentTarget.offsetLeft,
                        toBoxTop: e.clientY - e.currentTarget.offsetTop
                    };
                }}
                onDragStart={(e) => {
                    e.dataTransfer.setDragImage(e.currentTarget, window.outerWidth, window.outerHeight);
                    e.dataTransfer.effectAllowed = "copyMove";
                    setIsEditMode(true);
                }}
                onDragEnd={(e: DragEvent) => {
                    // 這時候才存資料
                    console.log("box drag end")
                    if (isShadowElement && handleShadowDragEnd) {
                        handleShadowDragEnd(e);
                        return;
                    }
                    handleUpdate({ ...data, left: position.left, top: position.top, width: size.width, height: size.height, rotation: deg, radius });
                    setIsEditMode(false);
                    handleSetDirty();
                }}
                onDragOver={(e) => {
                    // console.log("ㄟㄟ")
                    e.preventDefault();
                    // setIsLock(true);
                }}
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
                    setIsEditMode(true);
                }}
                draggable={true}
            >
                <div className={`boardElement w-full h-full overflow-hidden`} style={{ borderRadius: `${radius}px` }}>
                    {children}
                </div>
                {/* size */}
                <div
                    draggable={true}
                    onDrag={(e) => {
                        e.stopPropagation();
                        // console.log("onDrag")
                        if (!boxRef.current) return;
                        setIsEditMode(true);
                        const startX = boxRef.current.offsetLeft + boxRef.current.offsetWidth;
                        const startY = boxRef.current.offsetTop + boxRef.current.offsetHeight;
                        const nowX = e.clientX;
                        const nowY = e.clientY;
                        if (!nowX && !nowY) return;
                        let width, height;
                        width = Number(boxRef.current.style.width.split("px")[0]) + nowX - startX;
                        height = Number(boxRef.current.style.height.split("px")[0]) + nowY - startY;
                        if (width <= 48) width = 48;
                        if (height <= 20) height = 20;
                        setSize({ width, height });
                    }}
                    className={`w-2.5 h-2.5 rounded-full bg-slate-500 absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 z-20 cursor-nwse-resize duration-100 ${isEditMode ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                ></div>
                {/* rotate */}
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
                        else if (degree > 40 && degree < 50) degree = 45;
                        else if (degree > 85 && degree < 95) degree = 90;
                        else if (degree > 130 && degree < 140) degree = 135;
                        else if (degree > 175 && degree < 185) degree = 180;
                        else if (degree > -50 && degree < -40) degree = -45;
                        else if (degree > -95 && degree < -85) degree = -90;
                        else if (degree > -140 && degree < -130) degree = -135;
                        setDeg(Number(degree.toFixed(2)));
                    }}
                    className={`w-2.5 h-2.5 bg-slate-500 absolute bottom-1/2 -right-5 translate-y-1/2 translate-x-1/2 z-20 cursor-grab active:cursor-grabbing duration-100 ${isEditMode ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                ></div>
                {/* radius */}
                <div
                    draggable={true}
                    onDrag={(e) => {
                        e.stopPropagation();
                        console.log("Radius")
                        if (!boxRef.current) return;
                        setIsEditMode(true);
                        const nowX = e.clientX;
                        if (!nowX) return;
                        if (nowX === leftTopRef.current.toBoxLeft) return;
                        if (nowX > leftTopRef.current.toBoxLeft) setRadius(radius - 1);
                        else setRadius(radius + 1);
                        leftTopRef.current = {
                            toBoxLeft: e.clientX,
                            toBoxTop: e.clientY
                        };
                        if (radius < 0) setRadius(0);
                        else if (radius > width / 2) setRadius(width / 2);
                        else if (radius > height / 2) setRadius(height / 2);
                        // console.log("now", leftTopRef.current.toBoxLeft)
                    }}
                    onDragEnd={() => {
                        setIsEditMode(false);
                    }}
                    className={`w-2.5 h-2.5 rounded-full border-2 border-slate-500 bg-slate-200 absolute top-2 right-2 z-20 cursor-cell duration-100 ${isEditMode ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                ></div>
                {/* delete */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log("Radius")
                        handleDelete(data.id);
                    }}
                    className={`w-3 h-3 rounded-full border border-slate-500 bg-slate-100 absolute cursor-pointer -top-3.5 -right-3.5 z-20 
                before:content-[""] before:h-[7px] before:w-[1px] before:bg-slate-500 before:absolute before:rotate-45 before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2
                after:content-[""] after:h-[7px] after:w-[1px] after:bg-slate-500 after:absolute after:-rotate-45 after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 hover:scale-125 duration-200
                ${isEditMode ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
                ></div>
            </div>
        </>
    )
}