import { boxType } from "@/type/card";
import ImageIcon from "./svg/Image";
import TextIcon from "./svg/Text";
import CodeIcon from "./svg/Code";

interface IControlPanel {
    handleDrag: (type: boxType) => void;
}

export default function ControlPanel({ handleDrag }: IControlPanel) {
    return (
        <>
            <main className="absolute left-1 top-14 grid grid-cols-1 grid-rows-4 gap-1.5 p-1.5">
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
                <button className="p-1  pl-1.5 pt-1.5 w-10 h-10 bg-transparent border border-slate-500 rounded-md"
                    onMouseDown={() => {
                        handleDrag("code");
                    }}
                ><CodeIcon classProps="stroke-slate-700" /></button>
                <button className="p-1  pl-1.5 pt-1.5 w-10 h-10 bg-transparent border border-slate-500 rounded-md"
                    onMouseDown={() => {
                        handleDrag("markdown");
                    }}
                ><CodeIcon classProps="stroke-slate-700" /></button>
            </main>
        </>
    )
}