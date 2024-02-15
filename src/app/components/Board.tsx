"use client"
import TextBox from "@/app/components/box/TextBox";
import { IBoardElement, boxType } from "@/type/card";
import { useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import ImageBox from "./box/ImageBox";
import { handlePostImgur } from "@/api/imgur";
import { handleUpdateCard } from "@/api/card";

function getContent(type: boxType) {
    switch (type) {
        case "text": return "text";
        case "image": return "image";
        default: return "text";
    }
}

interface IBoard {
    elements: IBoardElement[];
    handleUpdateElement: (data: IBoardElement) => void;
    handleUpdateElementList: (allElement: IBoardElement[]) => void;
    draggingBox: boxType;
    handleMouseUp: () => void;
}

export default function Board({ elements, handleUpdateElement, handleUpdateElementList, draggingBox, handleMouseUp }: IBoard) {
    // console.log(elements)
    const [selectedId, setSelectedId] = useState("");
    // console.log("selectedId", selectedId)
    // console.log("draggingBox", draggingBox)
    const pointerRef = useRef({ x: 0, y: 0 });
    // console.log("pointerRef", pointerRef.current)
    const [isLock, setIsLock] = useState(false);
    // console.log("isLock", isLock)

    const handleAddTextBox = useCallback((
        { content, position: { left, top } }:
            { content: string, position: { left: number, top: number } }
    ) => {
        const id = `element_${uuidv4()}`;
        const newBoardElement = [...elements, {
            id: id,
            type: "text" as boxType,
            name: "",
            content: content,
            width: draggingBox === "image" ? 500 : 200,
            height: draggingBox === "image" ? 30 : 60,
            rotation: 0,
            left,
            top,
            radius: 0
        }]
        handleUpdateElementList(newBoardElement);
        setSelectedId(id);
        handleMouseUp();
    }, [draggingBox, elements, handleMouseUp, handleUpdateElementList])

    const handleAddImageBox = useCallback((
        { name, content, position: { left, top } }:
            { name: string, content: string, position: { left: number, top: number } }
    ) => {
        const id = `element_${uuidv4()}`;
        if (!left || !top) return;
        const newBoardElement = [...elements, {
            id: id,
            type: "image" as boxType,
            name: name,
            content: content,
            width: 200,
            height: 200,
            rotation: 0,
            left,
            top,
            radius: 0
        }]
        handleUpdateElementList(newBoardElement);
        setIsLock(false);
        handleMouseUp();
    }, [elements, handleMouseUp, handleUpdateElementList])

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            console.log("click", (e.target as HTMLElement))
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
            // drop 時加入資料
            if (e.target.classList.contains("board") || e.target.classList.contains("board_input") || e.target.classList.contains("textbox_textarea") || e.target.classList.contains("imagebox") || e.target.classList.contains("box")) {
                console.log("draggingBox", draggingBox)
                if (!draggingBox) return;
                console.log("ㄟ")
                handleAddTextBox({
                    content: getContent(draggingBox),
                    position: { left: e.clientX, top: e.clientY }
                });
            };
            // console.log((e.target as HTMLElement))
            // 如果在 board 以外的地方放開，就停止 drop 流程
            handleMouseUp();
        }
        document.addEventListener("mouseup", handleMouse);
        return () => document.removeEventListener("mouseup", handleMouse);
    }, [draggingBox, elements, handleUpdateElementList, handleMouseUp, handleAddTextBox]);

    useEffect(() => {
        async function handlePaste(e: ClipboardEvent) {
            const pastedFiles = e.clipboardData?.files[0];
            const pastedText = e.clipboardData?.getData("text/plain") || "";
            console.log(pastedFiles)
            if (!pastedFiles && !pastedText) return;
            if (pastedFiles) {
                const file = pastedFiles;
                const formData = new FormData();
                formData.append("image", file);
                const res = await handlePostImgur(formData);

                if (res.success === false) return;
                handleAddImageBox({
                    name: file.name,
                    content: res.data.link,
                    position: { left: pointerRef.current.x, top: pointerRef.current.y }
                });
            }
            else {
                handleAddTextBox({
                    content: pastedText,
                    position: { left: pointerRef.current.x, top: pointerRef.current.y }
                });
            }
        }
        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, [handleAddImageBox, handleAddTextBox])

    function handleClick(id: string) {
        console.log("id", id)
        const newElements = elements.filter(item => item.id !== id);
        const selectedElement = elements.find(item => item.id === id);
        if (!selectedElement) return;
        newElements.push(selectedElement);
        handleUpdateElementList(newElements);
    }

    function handleDelete(id: string) {
        const newElements = elements.filter(item => item.id !== id)
        handleUpdateElementList(newElements);
        setSelectedId("");
    }

    return (
        <>
            <div className="board w-full h-full border border-slate-700 "
                onDragOver={(e) => {
                    // console.log("ㄟㄟ")
                    e.preventDefault();
                    setIsLock(true);
                }}
                onDragEnd={() => {
                    console.log("end")
                    setIsLock(false);
                }}
            >
                <input id="board_input" name="board_input" type="file" className="board_input w-full h-full opacity-0"
                    onChange={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (!e.currentTarget.files || e.currentTarget.files?.length === 0) return;
                        const file = e.currentTarget.files[0];
                        e.target.value = "";
                        const formData = new FormData();
                        formData.append("image", file);

                        const res = await handlePostImgur(formData);

                        if (res.success === false) return;
                        handleAddImageBox({
                            name: file.name,
                            content: res.data.link,
                            position: { left: pointerRef.current.x, top: pointerRef.current.y }
                        });
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
                            handleClick={handleClick}
                            handleDelete={handleDelete}
                        />
                    )
                    if (item.type === "image") return (
                        <ImageBox key={item.id}
                            isLock={isLock}
                            handleUpdateElement={handleUpdateElement}
                            imageData={item}
                            isSelected={selectedId === item.id}
                            handleClick={handleClick}
                            handleDelete={handleDelete}
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
                    }}
                    handleDelete={() => { }}
                    isShadow={true}
                />}
                {draggingBox === "image" && <ImageBox
                    isLock={false}
                    handleUpdateElement={() => { }}
                    imageData={{
                        id: "",
                        type: "image",
                        name: "",
                        content: "text",
                        width: 500,
                        height: 30,
                        rotation: 0,
                        left: window.outerWidth,
                        top: window.outerHeight,
                        radius: 0
                    }}
                    isSelected={true}
                    handleClick={() => { }}
                    handleShadowDragEnd={(e) => {
                        console.log("mouseup2", draggingBox)
                    }}
                    handleDelete={() => { }}
                    isShadow={true}
                />}
            </div>
        </>
    )
}