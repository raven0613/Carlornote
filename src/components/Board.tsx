"use client"
import TextBox from "@/components/box/TextBox";
import { IBoardElement, boxType } from "@/type/card";
import { useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import ImageBox from "./box/ImageBox";
import { handlePostImgur } from "@/api/imgur";

export const distenceToLeftTop = { left: 64, top: 64 };

export interface INewImageBoxProps {
    name: string,
    content: string,
    position: { left: number, top: number },
    size: { width: number, height: number }
}

interface INewTextBoxProps {
    content: string,
    position: { left: number, top: number }
}

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
    handleSetDirty: () => void;
}

export default function Board({ elements, handleUpdateElement, handleUpdateElementList, draggingBox, handleMouseUp, handleSetDirty }: IBoard) {
    // console.log(elements)
    const [selectedId, setSelectedId] = useState("");
    const pointerRef = useRef({ x: 0, y: 0 });
    const dropPointerRef = useRef({ x: 0, y: 0 });
    const [isLock, setIsLock] = useState(false);

    // console.log("selectedId", selectedId)
    // console.log("draggingBox", draggingBox)
    // console.log("pointerRef", pointerRef.current)
    // console.log("isLock", isLock)

    // add text box or imgUrl box
    const handleAddTextBox = useCallback(({ content, position: { left, top } }: INewTextBoxProps) => {
        const id = `element_${uuidv4()}`;
        const newBoardElement = [...elements, {
            id: id,
            type: draggingBox === "image" ? "image" : "text" as boxType,
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
    }, [draggingBox, elements, handleUpdateElementList])

    const handleAddImageBox = useCallback(({ name, content, position: { left, top }, size: { width, height } }: INewImageBoxProps) => {
        const id = `element_${uuidv4()}`;
        if (!left || !top) return;
        const newBoardElement = [...elements, {
            id: id,
            type: "image" as boxType,
            name: name,
            content: content,
            width: width,
            height: height,
            rotation: 0,
            left,
            top,
            radius: 0
        }]
        handleUpdateElementList(newBoardElement);
        setIsLock(false);
        return newBoardElement.at(-1);
    }, [elements, handleUpdateElementList])

    // click
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

    // mouse up
    useEffect(() => {
        // if (!draggingBox) return;
        function handleMouse(e: MouseEvent) {
            console.log("mouseup")
            e.stopPropagation();
            e.preventDefault();
            console.log((e.target as HTMLElement))
            if (!(e.target instanceof HTMLElement)) return;
            // drop 時加入資料
            if (e.target.classList.contains("boardElement")) {
                console.log("draggingBox", draggingBox)
                if (!draggingBox) return;
                console.log("ㄟ")
                handleAddTextBox({
                    content: getContent(draggingBox),
                    position: { left: e.clientX - distenceToLeftTop.left, top: e.clientY - distenceToLeftTop.top }
                });
                handleSetDirty();
            }
            // console.log((e.target as HTMLElement))
            // 如果在 board 以外的地方放開，就停止 drop 流程
            handleMouseUp();
        }
        document.addEventListener("mouseup", handleMouse);
        return () => document.removeEventListener("mouseup", handleMouse);
    }, [draggingBox, handleAddImageBox, handleAddTextBox, handleMouseUp, handleSetDirty]);

    // paste
    useEffect(() => {
        async function handlePaste(e: ClipboardEvent) {
            console.log("e.target", e.target)
            if ((e.target as HTMLElement).classList.contains("imagebox")) return;

            const pastedFiles = e.clipboardData?.files[0];
            const pastedText = e.clipboardData?.getData("text/plain") || "";
            console.log("pastedFiles", pastedFiles)
            console.log("pastedText", pastedText)
            if (!pastedFiles && !pastedText) return;
            if (pastedFiles) {
                const file = pastedFiles;
                const formData = new FormData();
                formData.append("image", file);
                const res = await handlePostImgur(formData);
                console.log("res", res)

                if (res.success === false) return;
                handleAddImageBox({
                    name: pastedFiles.name,
                    content: res.data.link,
                    position: { left: pointerRef.current.x, top: pointerRef.current.y },
                    size: { width: res.data.width, height: res.data.height }
                });
            }
            else {
                handleAddTextBox({
                    content: pastedText,
                    position: { left: pointerRef.current.x, top: pointerRef.current.y }
                });
            }
            handleSetDirty();
        }
        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, [handleAddImageBox, handleAddTextBox, handleSetDirty])

    function handleChangeZIndex(id: string) {
        // 被點選到的 element 要拉到第一個
        console.log("id", id)
        const filteredElements = elements.filter(item => item.id !== id);
        const selectedElement = elements.find(item => item.id === id);
        // 被點選到的 element 本來就第一個的話就不用改動
        if (!selectedElement || selectedElement.id === elements.at(0)?.id) return;
        handleUpdateElementList([selectedElement, ...filteredElements]);
        handleSetDirty();
    }

    function handleClick(id: string) {
        // 被點選到的 element 要拉到最後一個
        console.log("id", id)
        const newElements = elements.filter(item => item.id !== id);
        const selectedElement = elements.find(item => item.id === id);
        // 被點選到的 element 本來就最後一個的話就不用改動
        if (!selectedElement || selectedElement.id === elements.at(-1)?.id) return;
        newElements.push(selectedElement);
        handleUpdateElementList(newElements);
        handleSetDirty();
    }

    function handleDelete(id: string) {
        if (!id) return;
        const newElements = elements.filter(item => item.id !== id)
        handleUpdateElementList(newElements);
        setSelectedId("");
        handleSetDirty();
    }

    return (
        <>
            <div className="boardElement relative w-full h-full"
                // style={{ scale: "70%" }}
                onDragOver={(e) => {
                    // console.log("ㄟㄟ")
                    e.preventDefault();
                    setIsLock(true);
                }}
                onDragEnd={(e) => {
                    console.log("end")
                    setIsLock(false);
                    // console.log("left", e.clientX)
                    // console.log("top", e.clientY)
                }}
                onWheel={() => {

                    console.log("weeeeee")
                }}
            >
                <input id="board_input" name="board_input" type="file" className="boardElement w-full h-full opacity-0"
                    onChange={async (e) => {
                        console.log("image drop")
                        e.preventDefault()
                        e.stopPropagation()
                        if (!e.currentTarget.files || e.currentTarget.files?.length === 0) return;

                        // 這邊有問題  沒有成功在 card 裡面加入 boardElement
                        // const newBoardElement = handleAddImageBox({
                        //     name: "",
                        //     content: "",
                        //     position: { left: dropPointerRef.current.x, top: dropPointerRef.current.y },
                        //     size: { width: 250, height: 250 }
                        // });
                        // console.log("newBoardElement", newBoardElement)

                        const file = e.currentTarget.files[0];
                        // console.log("file", file)
                        const formData = new FormData();
                        formData.append("image", file);
                        e.target.value = "";

                        const res = await handlePostImgur(formData);
                        console.log("imgur res", res)
                        if (res.success === false) return;
                        // if (!newBoardElement) return;

                        // handleUpdateElement({ 
                        //     ...newBoardElement, 
                        //     name: file.name, 
                        //     content: res.data.link,
                        //     width: res.data.width, 
                        //     height: res.data.height
                        // })
                        handleAddImageBox({
                            name: file.name,
                            content: res.data.link,
                            position: { left: dropPointerRef.current.x, top: dropPointerRef.current.y },
                            size: { width: res.data.width, height: res.data.height }
                        });
                        handleSetDirty();
                    }}
                    onMouseMove={(e) => {
                        pointerRef.current = { x: e.clientX - distenceToLeftTop.left, y: e.clientY - distenceToLeftTop.top };
                    }}
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    onDrop={(e) => {
                        dropPointerRef.current = { x: e.clientX - distenceToLeftTop.left, y: e.clientY - distenceToLeftTop.top };
                    }}
                />

                {elements && elements.map(item => {
                    if (item.type === "text") return (
                        <TextBox key={item.id}
                            isLocked={isLock}
                            handleUpdateElement={handleUpdateElement}
                            textData={item}
                            isSelected={selectedId === item.id}
                            handleClick={handleClick}
                            handleDelete={handleDelete}
                            handleSetDirty={handleSetDirty}
                            handleChangeZIndex={handleChangeZIndex}
                        />
                    )
                    if (item.type === "image") return (
                        <ImageBox key={item.id}
                            isLocked={isLock}
                            handleUpdateElement={handleUpdateElement}
                            imageData={item}
                            isSelected={selectedId === item.id}
                            handleClick={handleClick}
                            handleDelete={handleDelete}
                            handleSetDirty={handleSetDirty}
                            handleChangeZIndex={handleChangeZIndex}
                        />
                    )
                    return <></>
                })}
                {draggingBox === "text" && <TextBox
                    isLocked={false}
                    handleUpdateElement={() => { }}
                    textData={{
                        id: "dragging_text",
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
                    handleDelete={() => { }}
                    handleSetDirty={() => { }}
                    isShadow={true}
                    handleChangeZIndex={() => { }}
                />}
                {draggingBox === "image" && <ImageBox
                    isLocked={false}
                    handleUpdateElement={() => { }}
                    imageData={{
                        id: "dragging_image",
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
                    handleSetDirty={() => { }}
                    handleDelete={() => { }}
                    isShadow={true}
                    handleChangeZIndex={() => { }}
                />}
            </div>
        </>
    )
}