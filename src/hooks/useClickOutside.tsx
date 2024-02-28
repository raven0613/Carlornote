import React, { useEffect, useRef, useState } from "react";


export default function useClickOutside<T extends HTMLElement>({ handleMouseDownOutside, handleMouseDownInside }: { handleMouseDownOutside: () => void, handleMouseDownInside?: () => void }) {
    const nodeRef = useRef<T>(null);
    useEffect(() => {
        function handleMouse(e: MouseEvent) {
            // console.log("nodeRef", nodeRef.current)
            // console.log("e.target", e.target)
            if (!e.target) return;
            if (e.target instanceof HTMLElement) {
                if (!nodeRef.current?.contains(e.target)) {
                    console.log("handleMouseDown")
                    handleMouseDownOutside();
                }
                else {
                    handleMouseDownInside && handleMouseDownInside();
                }
            }
        }
        document.addEventListener("mousedown", handleMouse);
        return () => document.removeEventListener("mousedown", handleMouse);
    }, [handleMouseDownOutside, handleMouseDownInside]);
    return nodeRef;
}