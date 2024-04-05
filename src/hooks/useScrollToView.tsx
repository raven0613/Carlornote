import React, { ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export function useScroll() {
    return useContext(ScrollContext);
}

export interface ScrollContextType {
    nodeRef: React.RefObject<HTMLDivElement>; // 假設你的 ref 是針對普通的 HTML 元素
    scrollToNode: () => void;
}

export const ScrollContext = createContext<ScrollContextType | null>(null);

interface IScrollProvider {
    children: ReactNode;
}
export default function ScrollProvider({ children }: IScrollProvider) {
    const nodeRef = useRef<HTMLDivElement>(null);

    const scrollToNode = useCallback(() => {
        nodeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    return (
        <ScrollContext.Provider value={{ nodeRef, scrollToNode }}>
            {children}
        </ScrollContext.Provider>
    )
}


// export default function useScrollToView<T extends HTMLElement>() {
//     const nodeRef = useRef<T>(null);

//     const scrollToNode = useCallback(() => {
//         nodeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, []);

//     return { nodeRef, scrollToNode };
// }