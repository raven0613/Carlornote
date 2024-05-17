import { CanvasHTMLAttributes, useEffect, useRef } from "react"

interface ICanvasProp {

}

export default function Canvas ({}: ICanvasProp) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvasContext = canvasRef.current?.getContext("2d");
        if (!canvasContext) return;
        canvasContext.fillStyle = "#334155";
        canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    }, [])

    return (
        <>
            <canvas ref={canvasRef} className="h-20 w-20"></canvas>
        </>
    )
}