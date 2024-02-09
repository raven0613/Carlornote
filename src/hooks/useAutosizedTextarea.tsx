import React, { useEffect, useState } from "react";

export default function useAutosizedTextarea(ref: React.RefObject<HTMLTextAreaElement>, value: string, idEditing: boolean) {
    useEffect(() => {
        if (!ref.current || !value || !idEditing) return;
        const scrollHeight = ref.current?.scrollHeight;
        ref.current.style.height = scrollHeight + "px";
    }, [ref, value, idEditing])
}