import { boxType } from "@/type/card";
import ImageIcon from "./svg/Image";
import TextIcon from "./svg/Text";
import CodeIcon from "./svg/Code";
import NoteIcon from "./svg/Note";
import { ReactNode } from "react";

interface IButton {
    handleDrag?: (type: boxType) => void;
    handleClick?: () => void;
    children: ReactNode;
    type: boxType;
    classProps?: string;
}

export function Button({ handleDrag, handleClick, children, type, classProps }: IButton) {
    return (
        <button className={`p-1 w-10 h-10 border  rounded-md hover:scale-105 duration-200 ${classProps? classProps : "bg-transparent border-slate-300"}`}
            onMouseDown={() => {
                handleDrag && handleDrag(type);
            }}
            onClick={() => {
                handleClick && handleClick();
            }}
        >
            {children}
        </button>
    )
}

interface IControlPanel {
    handleDrag: (type: boxType) => void;
    isSelectingCard: boolean;
}

export default function ControlPanel({ handleDrag, isSelectingCard }: IControlPanel) {
    // console.log("isSelectingCard", isSelectingCard)
    return (
        <>
            <main className={`absolute ${isSelectingCard ? "left-0" : "-left-16"} duration-150 top-8 grid grid-cols-1 grid-rows-4 gap-1.5 p-3 shadow-md shadow-black/40 rounded-r-lg bg-white`}>
                <Button handleDrag={handleDrag} type="text">
                    <TextIcon classProps="fill-slate-600" />
                </Button>
                <Button handleDrag={handleDrag} type="image">
                    <ImageIcon classProps="stroke-slate-600" />
                </Button>
                <Button handleDrag={handleDrag} type="code">
                    <CodeIcon classProps="text-slate-600" />
                </Button>
                <Button handleDrag={handleDrag} type="markdown">
                    <NoteIcon classProps="text-slate-600" />
                </Button>
            </main>
        </>
    )
}