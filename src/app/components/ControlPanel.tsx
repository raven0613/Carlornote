import { boxType } from "@/type/card";

interface IControlPanel {
    handleDrag: (type: boxType) => void;
}

export default function ControlPanel({ handleDrag }: IControlPanel) {
    return (
        <>
            <main className="absolute left-0 top-8 grid grid-cols-1 grid-rows-4 border gap-1.5 p-1.5">
                <button className="w-10 h-10 bg-transparent border border-slate-500 rounded-md"
                    onMouseDown={() => {
                        handleDrag("text");
                    }}
                >字</button>
                <button className="w-10 h-10 bg-transparent border border-slate-500 rounded-md"
                    onMouseDown={() => {
                        handleDrag("image");
                    }}
                >圖</button>
                <button className="w-10 h-10 bg-transparent border border-slate-500 rounded-md"
                    onMouseDown={() => {
                        handleDrag("card");
                    }}
                >卡</button>

            </main>
        </>
    )
}