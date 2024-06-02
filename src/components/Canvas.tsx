import useWindowSize from "@/hooks/useWindowSize";
import { CanvasHTMLAttributes, useEffect, useRef } from "react"

interface IPoint {
    x: number, y: number
}

function draw(ctx: CanvasRenderingContext2D, p1: IPoint, p2: IPoint, cp1: IPoint, cp2: IPoint) {
    if (!ctx) return;
    ctx.strokeStyle = "#334155";
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);
    ctx.stroke();
}

interface ICanvasProp {

}

export default function Canvas({ }: ICanvasProp) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { width: windowWidth, height: windowHeight } = useWindowSize();

    useEffect(() => {
        const canvasContext = canvasRef.current?.getContext("2d");
        if (!canvasContext || !window) return;

        // ref: https://stackoverflow.com/questions/37402616/pass-click-event-to-an-element-underneath
        document.addEventListener('click', (e) => {
            if (canvasContext.canvas.onclick) canvasContext.canvas.onclick(e);;
        });
        window.onmousemove = (e) => {
            if (canvasContext.canvas.onmousemove) canvasContext.canvas.onmousemove(e);

            if (e.clientY >= 100) {
                canvasContext.canvas.style.pointerEvents = "auto";
                return;
            }
            canvasContext.canvas.style.pointerEvents = "none";
        };

        // canvas 適應螢幕大小和倍率
        const dpr = window.devicePixelRatio || 1;
        canvasContext.canvas.width = windowWidth * dpr;
        canvasContext.canvas.height = windowHeight * dpr;
        canvasContext.scale(dpr, dpr);
        canvasContext.lineWidth = 2;
        canvasContext.lineJoin = "round";
        canvasContext.lineCap = "round";

        canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);

        const curve1 = {
            start: { x: 200, y: 200 },
            end: { x: 100, y: 500 }
        }
        const curve2 = {
            start: { x: 400, y: 600 },
            end: { x: 500, y: 300 }
        }
        const curves = [curve1, curve2];

        for (let curve of curves) {
            const cp1 = { x: (curve.start.x > curve.end.x ? curve.end.x : curve.start.x) + Math.abs(curve.end.x - curve.start.x) / 2, y: curve.start.y };
            const cp2 = { x: (curve.start.x > curve.end.x ? curve.end.x : curve.start.x) + Math.abs(curve.end.x - curve.start.x) / 2, y: curve.end.y };
            draw(canvasContext, curve.start, curve.end, cp1, cp2);
        }

        function checkHover(e: MouseEvent) {
            if (!canvasContext) return;

            for (let curve of curves) {
                const startX = curve.start.x > curve.end.x ? curve.end.x : curve.start.x;
                const startY = curve.start.y > curve.end.y ? curve.end.y : curve.start.y;
                const endX = curve.start.x > curve.end.x ? curve.start.x : curve.end.x;
                const endY = curve.start.y > curve.end.y ? curve.start.y : curve.end.y;
                if (e.pageX < startX || e.pageX > endX || e.pageY < startY || e.pageY > endY) continue;
                const width = endX - startX;
                const height = endY - startY;
                const curveData = canvasContext.getImageData(
                    startX, startY, width, height);
                let int32Array = new Int32Array(curveData.data.buffer);
                const x = e.pageX - startX;
                const y = e.pageY - startY;
                const mousePosOnRect = width * (y - 1) + x;

                const cp1 = { x: (curve.start.x > curve.end.x ? curve.end.x : curve.start.x) + Math.abs(curve.end.x - curve.start.x) / 2, y: curve.start.y };
                const cp2 = { x: (curve.start.x > curve.end.x ? curve.end.x : curve.start.x) + Math.abs(curve.end.x - curve.start.x) / 2, y: curve.end.y };
                canvasContext.clearRect(startX, startY, width, height);
                if (int32Array[mousePosOnRect] !== 0) canvasContext.lineWidth = 4;
                else canvasContext.lineWidth = 2;
                draw(canvasContext, curve.start, curve.end, cp1, cp2);
            }
        }
        document.addEventListener('mousemove', checkHover);

        // 遮罩：只有 rect 畫出來的範圍內可以有圖樣
        // canvasContext.save();
        // canvasContext.beginPath();
        // canvasContext.rect(50, 50, 100, 100);
        // canvasContext.clip("evenodd");

        // canvasContext.fillStyle = "green";
        // canvasContext.fillRect(50, 50, 2000, 550);
        // canvasContext.fillStyle = 'purple';
        // canvasContext.fillRect(100, 50, 2000, 500);

        // canvasContext.clearRect(100, 100, 400, 400);

        // canvasContext.restore();

        return () => {
            document.removeEventListener('click', (e) => {
                if (canvasContext.canvas.onclick) canvasContext.canvas.onclick(e);;
            });
            document.removeEventListener('mousemove', checkHover);
        }
    }, [windowHeight, windowWidth])

    return (
        <>
            <canvas ref={canvasRef} className="absolute inset-0 z-10 bg-transparent pointer-events-none" />
            {/* <div className="absolute top-[100px] left-[100px] w-[400px] h-[400px] bg-amber-700 z-0 hover:bg-lime-600"></div> */}
        </>
    )
}