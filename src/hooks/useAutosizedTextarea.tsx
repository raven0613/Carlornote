import React, { useEffect, useRef, useState } from "react";

export default function useAutosizedTextarea<T extends HTMLElement>(value: string, idEditing: boolean) {
    const textRef = useRef<T>(null)
    useEffect(() => {
        if (!textRef.current || !value || !idEditing) return;
        const scrollHeight = textRef.current?.scrollHeight;
        textRef.current.style.height = scrollHeight + "px";
    }, [value, idEditing])
    return textRef;
}