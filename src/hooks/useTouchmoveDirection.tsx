import React, { useEffect, useRef, useState } from "react";

export type xDirection = "" | "left" | "right";
export type yDirection = "" | "top" | "bottom";

interface IMoveResult {
    x: xDirection
    y: yDirection,
    xDistence: number,
    yDistence: number
}

export default function useTouchmoveDirection(): IMoveResult {
    const pointer = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const [direction, setDirection] = useState<IMoveResult>({
        x: "", y: "", xDistence: 0, yDistence: 0
    })

    useEffect(() => {
        function handleStart(e: TouchEvent) {
            // 紀錄現在新位置
            pointer.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
        document.addEventListener("touchstart", handleStart);
        return () => document.removeEventListener("touchstart", handleStart);
    }, []);

    useEffect(() => {
        function handleMove(e: TouchEvent) {
            // console.log("e.touches[0].clientX", e.touches[0].clientX)
            // console.log("pointer.current.x", pointer.current.x)
            // 與舊的位置比對計算，移動方向變了才存入
            if (e.touches[0].clientX < pointer.current.x) setDirection(pre => ({ ...pre, x: "left" }));
            else if (e.touches[0].clientX > pointer.current.x) setDirection(pre => ({ ...pre, x: "right" }));
            if (e.touches[0].clientY < pointer.current.y) setDirection(pre => ({ ...pre, y: "top" }));
            else if (e.touches[0].clientY > pointer.current.y) setDirection(pre => ({ ...pre, y: "bottom" }));

            setDirection(pre => ({ ...pre, xDistence: Math.abs(e.touches[0].clientX - pointer.current.x) }));
            setDirection(pre => ({ ...pre, yDistence: Math.abs(e.touches[0].clientY - pointer.current.y) }));

            // 紀錄現在新位置
            pointer.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
        document.addEventListener("touchmove", handleMove);
        return () => document.removeEventListener("touchmove", handleMove);
    }, []);

    useEffect(() => {
        function handleEnd(e: TouchEvent) {
            // 紀錄現在新位置
            pointer.current = {
                x: 0,
                y: 0
            };
            setDirection({ x: "", y: "", xDistence: 0, yDistence: 0 })
        }
        document.addEventListener("touchend", handleEnd);
        return () => document.removeEventListener("touchend", handleEnd);
    }, []);

    return direction;
}