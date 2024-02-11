"use client"
import TextBox from "@/app/components/box/TextBox";
import { IBoardElement, boxType } from "@/type/card";
import { useEffect, useId, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import ImageBox from "./box/ImageBox";

interface IBoard {
    elements: IBoardElement[];
    handleUpdateElement: (data: IBoardElement) => void;
    handleChangeIdx: (allElement: IBoardElement[]) => void;
    draggingBox: boxType;
    handleMouseUp: () => void;
}

export default function Board({ elements, handleUpdateElement, handleChangeIdx, draggingBox, handleMouseUp }: IBoard) {
    // console.log(elements)
    const [selectedId, setSelectedId] = useState("");
    // console.log("selectedId", selectedId)
    // console.log("draggingBox", draggingBox)
    const pointerRef = useRef({ x: 0, y: 0 });
    // console.log("pointerRef", pointerRef.current)
    const [isLock, setIsLock] = useState(false);
    console.log("isLock", isLock)

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            // console.log((e.target as HTMLElement))
            if (e.target instanceof HTMLElement) {
                if (e.target.classList.contains("textbox_textarea") || e.target.classList.contains("imagebox")) setSelectedId(e.target.id);
                else setSelectedId("");
            }
        }
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    useEffect(() => {
        // if (!draggingBox) return;
        function handleMouse(e: MouseEvent) {
            console.log("mouseup")
            e.stopPropagation();
            e.preventDefault();
            console.log((e.target as HTMLElement))
            if (!(e.target instanceof HTMLElement)) return;
            if (e.target.classList.contains("board") || e.target.classList.contains("board_input") || e.target.classList.contains("textbox_textarea") || e.target.classList.contains("imagebox")) {
                if (!draggingBox) return;
                const id = uuidv4();
                const newBoardElement = [...elements, {
                    id: id,
                    type: draggingBox,
                    name: "",
                    content: "text",
                    width: 200,
                    height: 60,
                    rotation: 0,
                    left: e.clientX,
                    top: e.clientY,
                    radius: 0
                }]
                handleChangeIdx(newBoardElement);
                setSelectedId(id);
                handleMouseUp();
                return;
            };
            // console.log((e.target as HTMLElement))
            // 如果在 board 以外的地方放開，就停止 drop 流程
            handleMouseUp();
        }
        document.addEventListener("mouseup", handleMouse);
        return () => document.removeEventListener("mouseup", handleMouse);
    }, [draggingBox, elements, handleChangeIdx, handleMouseUp]);

    return (
        <>
            <div className="board w-full h-full border border-slate-700 "
                onDragOver={(e) => {
                    console.log("ㄟㄟ")
                    e.preventDefault();
                    setIsLock(true);
                }}
                onDragEnd={() => {
                    console.log("end")
                    setIsLock(false);
                }}
            >
                <input id="board_input" name="board_input" type="file" className="board_input w-full h-full opacity-0"
                    onChange={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (!e.currentTarget.files || e.currentTarget.files?.length === 0) return;
                        const file = e.currentTarget.files[0];
                        const reader = new FileReader();
                        reader.onloadend = function () {
                            // console.log("onLoaded", reader.result)
                            const id = uuidv4();
                            if (!pointerRef.current.x || !pointerRef.current.y) return;
                            const newBoardElement = [...elements, {
                                id: id,
                                type: "image" as boxType,
                                name: file.name,
                                content: reader.result as string,
                                width: 200,
                                height: 200,
                                rotation: 0,
                                left: pointerRef.current.x,
                                top: pointerRef.current.y,
                                radius: 0
                            }]
                            handleChangeIdx(newBoardElement);
                            e.target.value = "";
                            setIsLock(false);
                        }
                        reader.readAsDataURL(file);
                    }}
                    onMouseMove={(e) => {
                        pointerRef.current = { x: e.clientX, y: e.clientY };
                    }}
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                />

                {elements && elements.map(item => {
                    if (item.type === "text") return (
                        <TextBox key={item.id}
                            isLock={isLock}
                            handleUpdateElement={handleUpdateElement}
                            textData={item}
                            isSelected={selectedId === item.id}
                            handleClick={(id) => {
                                const newElements = elements.filter(item => item.id !== id);
                                const selectedElement = elements.find(item => item.id === id)
                                if (!selectedElement) return;
                                newElements.push(selectedElement);
                                handleChangeIdx(newElements);
                            }}
                        />
                    )
                    if (item.type === "image") return (
                        <ImageBox key={item.id}
                            isLock={isLock}
                            handleUpdateElement={handleUpdateElement}
                            data={item}
                            isSelected={selectedId === item.id}
                            handleClick={(id) => {
                                const newElements = elements.filter(item => item.id !== id);
                                const selectedElement = elements.find(item => item.id === id);
                                if (!selectedElement) return;
                                newElements.push(selectedElement);
                                handleChangeIdx(newElements);
                            }}
                        />
                    )
                    return <></>
                })}
                {draggingBox === "text" && <TextBox
                    isLock={false}
                    handleUpdateElement={() => { }}
                    textData={{
                        id: "",
                        type: "text",
                        name: "",
                        content: "text",
                        width: 200,
                        height: 60,
                        rotation: 0,
                        left: window.outerWidth,
                        top: window.outerHeight,
                        radius: 0
                    }}
                    isSelected={true}
                    handleClick={() => { }}
                    handleShadowDragEnd={(e) => {
                        console.log("mouseup2", draggingBox)
                        // if (!draggingBox) return;
                        // const id = uuidv4();
                        // const newBoardElement = [...elements, {
                        //     id: id,
                        //     type: draggingBox,
                        //     content: "text",
                        //     width: 200,
                        //     height: 60,
                        //     rotation: 0,
                        //     left: e.clientX,
                        //     top: e.clientY
                        // }]
                        // handleChangeIdx(newBoardElement);
                        // setSelectedId(id);
                        // handleMouseUp();
                    }}
                    isShadow={true}
                />}
            </div>
        </>
    )
}