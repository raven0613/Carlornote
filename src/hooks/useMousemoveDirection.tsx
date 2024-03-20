import React, { useEffect, useRef, useState } from "react";

export type xDirection = "left" | "right";
export type yDirection = "top" | "bottom";

interface IMousemoveResult {
    x: xDirection
    y: yDirection,
    xDistence: number,
    yDistence: number
}

export default function useMousemoveDirection(): IMousemoveResult {
    const pointer = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const moveRef = useRef<IMousemoveResult>({ x: "left", y: "top", xDistence: 0, yDistence: 0 });
    
    useEffect(() => {
        function handleMouse(e: MouseEvent) {
            // 與舊的位置比對計算，移動方向變了才存入
            if (e.clientX < pointer.current.x) moveRef.current.x = "left";
            else if (e.clientX > pointer.current.x) moveRef.current.x = "right";
            if (e.clientY < pointer.current.y) moveRef.current.y = "top";
            else if (e.clientY > pointer.current.y) moveRef.current.y = "bottom";

            moveRef.current.xDistence = Math.abs(e.clientX - pointer.current.x);
            moveRef.current.yDistence = Math.abs(e.clientY - pointer.current.y);

            // 紀錄現在新位置
            pointer.current = {
                x: e.clientX,
                y: e.clientY
            };
        }
        document.addEventListener("mousemove", handleMouse);
        return () => document.removeEventListener("mousemove", handleMouse);
    }, []);

    return moveRef.current;
}