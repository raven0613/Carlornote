import React, { useEffect, useRef, useState } from "react";

interface IUseClickOutside {
    handleMouseDownOutside: () => void,
    handleMouseDownInside?: () => void,
    exceptions?: string[]
}

export default function useClickOutside<T extends HTMLElement>({ handleMouseDownOutside, handleMouseDownInside, exceptions }: IUseClickOutside) {
    const nodeRef = useRef<T>(null);
    useEffect(() => {
        function handleMouse(e: MouseEvent) {
            // console.log("nodeRef", nodeRef.current)
            // console.log("e.target", e.target)
            if (!e.target) return;
            if (e.target instanceof HTMLElement) {
                // 點到例外的 element
                if (exceptions?.some(item => (e.target as HTMLElement)?.classList.contains(item))) return;

                if (!nodeRef.current?.contains(e.target)) {
                    // console.log("handleMouseDown")
                    handleMouseDownOutside();
                }
                else {
                    // console.log("handleMouseDownInside")
                    handleMouseDownInside && handleMouseDownInside();
                }
            }
        }
        document.addEventListener("mousedown", handleMouse);
        return () => document.removeEventListener("mousedown", handleMouse);
    }, [handleMouseDownOutside, handleMouseDownInside, exceptions]);
    return nodeRef;
}