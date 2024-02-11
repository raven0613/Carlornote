import { boxType } from "@/type/card";
import ImageIcon from "./svg/Image";
import TextIcon from "./svg/Text";

interface IControlPanel {
    handleDrag: (type: boxType) => void;
}

export default function ControlPanel({ handleDrag }: IControlPanel) {
    return (
        <>
            <main className="absolute left-1 top-8 grid grid-cols-1 grid-rows-4 border gap-1.5 p-1.5">
                <button className="p-1 w-10 h-10 bg-transparent border border-slate-500 rounded-md"
                    onMouseDown={() => {
                        handleDrag("text");
                    }}
                ><TextIcon classProps="fill-slate-700" /></button>
                <button className="p-1 w-10 h-10 bg-transparent border border-slate-500 rounded-md"
                    onMouseDown={() => {
                        handleDrag("image");
                    }}
                ><ImageIcon classProps="stroke-slate-700" /></button>
            </main>
        </>
    )
}