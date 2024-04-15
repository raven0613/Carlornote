import React, { useEffect, useRef, useState } from "react";

interface IUseCheckTabVisibility {
}

export default function useCheckTabVisibility() {
    const [visibility, setVisibility] = useState(true)

    useEffect(() => {
        function handleVisibilityChange() {
            if (document.visibilityState === 'visible') {
                // console.log("用戶回到了網頁");
                setVisibility(true)
                // 用戶回到網頁時執行的動作
            } else {
                // console.log("用戶離開了網頁");
                setVisibility(false)
                // 用戶離開網頁時執行的動作
            }
        }
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    return visibility;
}