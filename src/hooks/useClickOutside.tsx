import React, { useEffect, useRef, useState } from "react";


export default function useClickOutside<T extends HTMLElement>({ handleMouseDown }: { handleMouseDown: () => void }) {
    const nodeRef = useRef<T>(null);
    useEffect(() => {
        function handleMouse(e: MouseEvent) {
            // console.log("e.target", e.target)
            if (!e.target) return;
            if (e.target instanceof HTMLElement) {
                if (!nodeRef.current?.contains(e.target)) {
                    handleMouseDown();
                }
            }
        }
        document.addEventListener("mousedown", handleMouse);
        return () => document.removeEventListener("mousedown", handleMouse);
    }, [handleMouseDown]);
    return nodeRef;
}