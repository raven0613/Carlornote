import React, { useEffect, useRef, useState } from "react";

interface IPointerPosition {
    x: number
    y: number
}

export default function usePointerPosition(): IPointerPosition {
    const pointer = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    
    useEffect(() => {
        function handleMouse(e: MouseEvent) {
            // 紀錄現在新位置
            pointer.current = {
                x: e.clientX,
                y: e.clientY
            };
        }
        document.addEventListener("mousemove", handleMouse);
        return () => document.removeEventListener("mousemove", handleMouse);
    }, []);

    return pointer.current;
}