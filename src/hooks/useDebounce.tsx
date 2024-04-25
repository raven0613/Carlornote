import React, { useEffect, useRef, useState } from "react";

function debounce (callback: (...args: any[]) => void, time: number) {
    let timer: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args)
        }, time);
    }
}

interface IUseDebounce {
    callback: (arg?: any) => void,
    time: number
}

export default function useDebounce({ callback, time }: IUseDebounce) {
    const timeRef = useRef<NodeJS.Timeout | null>(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!isActive) return;
        if (timeRef.current) {
            clearTimeout(timeRef.current);
            timeRef.current = null;
        }

        timeRef.current = setTimeout(() => {
            callback()
            setIsActive(false);
        }, time);

        return () => {
            clearTimeout(timeRef.current ?? 0);
            timeRef.current = null;
        }
    }, [callback, isActive, time]);
    return setIsActive;
}