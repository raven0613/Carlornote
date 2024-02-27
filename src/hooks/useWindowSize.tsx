import { useState, useEffect } from "react";
interface widowSize {
    width: number | undefined;
    height: number | undefined;
}
const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<widowSize>({
        width: undefined,
        height: undefined,
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