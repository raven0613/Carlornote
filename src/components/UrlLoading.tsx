import { useEffect, useState } from "react";

interface IUrlLoading {
    isCompleted: boolean;
}

export default function UrlLoading({ isCompleted }: IUrlLoading) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isCompleted) setProgress(100);
    }, [isCompleted])
    // console.log("progress", progress)

    useEffect(() => {
        if (isCompleted) return;
        let timer: NodeJS.Timeout | null = null;
        if (timer) clearTimeout(timer);
        function randomAdd(time: number) {
            timer = setTimeout(() => {
                setProgress(pre => (pre + Math.random() * 10 <= 90) ? (pre + Math.random() * 10) : pre);
                randomAdd(Math.random() * 100);
            }, time)
        }
        randomAdd(100);
        return () => { if (timer) clearTimeout(timer) }
    }, [isCompleted])

    return (
        <div className="w-full h-4 p-1 shadow-lg bg-white shadow-black/30 rounded-full">
            <div className="h-full bg-slate-400 rounded-full" style={{
                width: `${progress}%`
            }}>
            </div>
        </div>
    )
}