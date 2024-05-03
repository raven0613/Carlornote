import { useState, useEffect } from "react";
interface widowSize {
    width: number;
    height: number;
}
const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<widowSize>({
        width: 0,
        height: 0,
    });
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
};
export default useWindowSize;