"use client"
import TextBox from "@/components/box/TextBox";
import { IBoardElement, boxType } from "@/type/card";
import { useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import ImageBox from "./box/ImageBox";
import { handlePostImgur } from "@/api/imgur";
import { useDispatch, useSelector } from "react-redux";
import { selectElementId } from "@/redux/reducers/boardElement";
import { IState } from "@/redux/store";
import { closeModal } from "@/redux/reducers/modal";
import CodeBox from "./box/CodeBox";
import MarkdownBox from "./box/MarkdownBox";

// 看 board 離螢幕左和上有多少 px
export const distenceToLeftTop = { left: 0, top: 0 };

export const draggingBoxWidth: Record<boxType, number> = {
    text: 200,
    image: 500,
    code: 500,
    markdown: 500,
    card: 0,
    "": 0
}

export const draggingBoxHeight: Record<boxType, number> = {
    text: 60,
    image: 30,
    code: 300,
    markdown: 300,
    card: 0,
    "": 0
}

export function getResizedSize(originWidth: number, originHeight: number) {
    const imageAspectRatio = originWidth / originHeight;
    let width = originWidth;
    let height = originHeight;
    if (originWidth > originHeight && originWidth >= 800) {
        width = 800;
        height = width / imageAspectRatio;
    }
    else if (originHeight > originWidth && originHeight >= 400) {
        height = 400;
        width = height * imageAspectRatio;
    }
    return { width, height }
}

export function handleChangeZIndex(id: string, to: "top" | "bottom", elements: IBoardElement[]) {
    // 被點選到的 element 要拉到第一個
    // console.log("id", id)
    const filteredElements = elements.filter(item => item.id !== id);
    const selectedElement = elements.find(item => item.id === id);
    if (!selectedElement) return;
    if (to === "bottom") {
        if (selectedElement.id === elements.at(0)?.id) return;
        return [selectedElement, ...filteredElements];
    }
    else if (to === "top") {
        if (selectedElement.id === elements.at(-1)?.id) return;
        return [...filteredElements, selectedElement];
    }
}

export interface INewImageBoxProps {
    name: string,
    content: string,
    position: { left: number, top: number },
    size: { width: number, height: number }
}

interface INewBoxProps {
    type: boxType,
    content: string,
    position: { left: number, top: number }
    size: { width: number, height: number }
}


function getContent(type: boxType) {
    switch (type) {
        case "text": return "text";
        case "image": return "image";
        case "markdown": return "";
        default: return "text";
    }
}

interface IBoard {
    elements: IBoardElement[];
    handleUpdateElementList: (allElement: IBoardElement[]) => void;
    draggingBox: boxType;
    handleMouseUp: () => void;
    handleSetDirty: () => void;
    permission: "editable" | "readable" | "none";
}

export default function Board({ elements, handleUpdateElementList, draggingBox, handleMouseUp, handleSetDirty, permission }: IBoard) {
    const boardRef = useRef<HTMLDivElement>(null)
    // console.log("Board elements", elements)
    const selectedElementId = useSelector((state: IState) => state.selectedElementId);
    // console.log("selectedElementId", selectedElementId)
    const pointerRef = useRef({ x: 0, y: 0 });
    const clickedPointRef = useRef({ startX: 0, startY: 0, endX: 0, endY: 0 });
    const dropPointerRef = useRef({ x: 0, y: 0 });
    const [isLock, setIsLock] = useState(false);
    const dispatch = useDispatch();
    // console.log("draggingBox", draggingBox)
    // console.log("pointerRef", pointerRef.current)
    // console.log("isLock", isLock)
    // console.log("permission", permission)

    useEffect(() => {
        if (permission !== "editable") {
            setIsLock(true);
        }
    }, [permission])

    // add box
    const handleAddBox = useCallback(({ type, content, position: { left, top }, size: { width, height } }: INewBoxProps) => {
        const id = `element_${uuidv4()}`;
        const newBoardElement: IBoardElement[] = [...elements, {
            id: id,
            type,
            name: "",
            content: content,
            width,
            height,
            rotation: 0,
            left,
            top,
            radius: 0,
            textColor: "#525252",
            fontSize: "base",
            fontWeight: "normal",
            opacity: 100,
            isLock: false
        }]
        handleUpdateElementList(newBoardElement);
        dispatch(selectElementId(newBoardElement.at(-1)?.id ?? ""));
        dispatch(closeModal({ type: "" }));
    }, [dispatch, elements, handleUpdateElementList])

    const handleAddImageBox = useCallback(({ name, content, position: { left, top }, size: { width, height } }: INewImageBoxProps) => {
        const id = `element_${uuidv4()}`;
        if (!left || !top) return;
        // console.log("ㄟㄟ")
        const newBoardElements = [...elements, {
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
        handleUpdateElementList(newBoardElements);
        setIsLock(false);
        dispatch(closeModal({ type: "" }));
        return newBoardElements;
    }, [dispatch, elements, handleUpdateElementList])

    const imageUpload = useCallback(async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        let newBoardElement: IBoardElement[] = [];

        // 使用 FileReader 預覽圖片
        const reader = new FileReader();
        reader.onload = function () {
            const base64 = reader.result as string;
            const img = new Image();
            img.src = base64;
            img.onload = function () {
                const { width, height } = getResizedSize(img.width, img.height);
                // 取得圖片的寬和高
                newBoardElement = handleAddImageBox({
                    name: "",
                    content: "",
                    position: { left: pointerRef.current.x, top: pointerRef.current.y },
                    size: { width, height }
                }) ?? [];
                // console.log("newBoardElement", newBoardElement)
            };
        };
        reader.readAsDataURL(file);
        const res = await handlePostImgur(formData);
        // console.log("res", res)

        if (res.success === false) return;
        if (!newBoardElement) return;
        const { width, height } = getResizedSize(res.data.width, res.data.height);
        handleUpdateElementList(newBoardElement.map((item, index) => {
            if (index === newBoardElement.length - 1) return {
                ...item,
                name: file.name,
                content: res.data.link,
                width,
                height
            };
            return item;
        }))
    }, [handleAddImageBox, handleUpdateElementList])

    // mouse up 拖曳後放開：drop 時加入資料
    useEffect(() => {
        // if (!draggingBox) return;
        function handleMouse(e: MouseEvent) {
            // console.log("mouseup")
            e.stopPropagation();
            e.preventDefault();
            // console.log((e.target as HTMLElement))
            if (!(e.target instanceof HTMLElement)) return;
            // drop 時加入資料
            // console.log("draggingBox", draggingBox)
            if (!draggingBox) return;
            // console.log("ㄟ")
            if (boardRef.current?.contains(e.target)) {
                handleAddBox({
                    type: draggingBox,
                    content: getContent(draggingBox),
                    position: { left: e.clientX - distenceToLeftTop.left, top: e.clientY - distenceToLeftTop.top },
                    size: { width: draggingBoxWidth[draggingBox], height: draggingBoxHeight[draggingBox] }
                })
                handleSetDirty();
            }
            // console.log((e.target as HTMLElement))
            // 如果在 board 以外的地方放開，就停止 drop 流程
            handleMouseUp();
        }
        document.addEventListener("mouseup", handleMouse);
        return () => document.removeEventListener("mouseup", handleMouse);
    }, [draggingBox, handleAddBox, handleMouseUp, handleSetDirty]);

    // paste
    useEffect(() => {
        async function handlePaste(e: ClipboardEvent) {
            // console.log("e.target", e.target)
            // 是一般的 input 的話不要新增 box
            if ((e.target as HTMLElement).classList.contains("textInput")) return;

            const pastedFiles = e.clipboardData?.files[0];
            const pastedText = e.clipboardData?.getData("text/plain") || "";
            // console.log("pastedFiles", pastedFiles)
            // console.log("pastedText", pastedText)

            if (!pastedFiles && !pastedText) return;
            if (pastedFiles) {
                const file = pastedFiles;
                imageUpload(file);
            }
            else {
                handleAddBox({
                    type: "text",
                    content: pastedText,
                    position: { left: pointerRef.current.x, top: pointerRef.current.y },
                    size: { width: draggingBoxWidth["text"], height: draggingBoxHeight["text"] }
                })
            }
            handleSetDirty();
        }
        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, [draggingBox, handleAddBox, handleSetDirty, imageUpload])

    function handleDelete(id: string) {
        if (!id) return;
        const newElements = elements.filter(item => item.id !== id)
        handleUpdateElementList(newElements);
        // setSelectedId("");
        dispatch(selectElementId(""))
        handleSetDirty();
    }

    return (
        <>
            <div className="boardElement relative w-full h-full " ref={boardRef}
                // style={{ scale: "70%" }}
                onDragOver={(e) => {
                    // 為了防止在圖片上方 drop 的時候變成在瀏覽器打開圖片的行為，需要將圖片設定成 pointer-events-none
                    e.preventDefault();
                    setIsLock(true);
                }}
                onDragEnd={(e) => {
                    // console.log("end")
                    setIsLock(false);
                    // console.log("left", e.clientX)
                    // console.log("top", e.clientY)
                }}
                onMouseDown={(e) => {
                    clickedPointRef.current = {
                        startX: e.clientX - distenceToLeftTop.left,
                        startY: e.clientY - distenceToLeftTop.top,
                        endX: 0,
                        endY: 0
                    }
                }}
                onMouseUp={(e) => {
                    clickedPointRef.current = {
                        startX: e.clientX - distenceToLeftTop.left,
                        startY: e.clientY - distenceToLeftTop.top,
                        endX: e.clientX - distenceToLeftTop.left,
                        endY: e.clientY - distenceToLeftTop.top
                    }

                }}
            >
                <input id="board_input" name="board_input" type="file" className="boardElement board_input w-full h-full opacity-0"
                    onChange={async (e) => {
                        // console.log("image drop")
                        e.preventDefault()
                        e.stopPropagation()

                        if (!e.currentTarget.files || e.currentTarget.files?.length === 0) return;
                        const file = e.currentTarget.files[0];
                        imageUpload(file);
                        handleSetDirty();
                    }}
                    onMouseMove={(e) => {
                        pointerRef.current = { x: e.clientX - distenceToLeftTop.left, y: e.clientY - distenceToLeftTop.top };
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        // e.stopPropagation();
                        dispatch(selectElementId(""));
                    }}
                    onDrop={(e) => {
                        dropPointerRef.current = { x: e.clientX - distenceToLeftTop.left, y: e.clientY - distenceToLeftTop.top };
                    }}
                />

                {elements && elements.map(item => {
                    if (item.type === "text") return (
                        <TextBox key={item.id}
                            isLocked={isLock}
                            handleUpdateElement={(data: IBoardElement) => {
                                handleUpdateElementList(elements.map((item) => {
                                    if (item.id === data.id) return data;
                                    return item;
                                }))
                            }}
                            textData={item}
                            isSelected={selectedElementId === item.id}
                            handleClick={() => {
                                dispatch(selectElementId(item.id));
                                // 拉到DOM最上方
                                const updatedElements = handleChangeZIndex(item.id, "top", elements);
                                if (!updatedElements) return;
                                handleUpdateElementList(updatedElements);
                                handleSetDirty();
                            }}
                            handleDelete={handleDelete}
                            handleSetDirty={handleSetDirty}
                            handleChangeZIndex={() => {
                                // 拉到DOM最下方
                                const updatedElements = handleChangeZIndex(item.id, "bottom", elements);
                                if (!updatedElements) return;
                                handleUpdateElementList(updatedElements);
                                handleSetDirty();
                            }}
                        />
                    )
                    if (item.type === "image") return (
                        <ImageBox key={item.id}
                            isLocked={isLock}
                            handleUpdateElement={(data: IBoardElement) => {
                                handleUpdateElementList(elements.map((item) => {
                                    if (item.id === data.id) return data;
                                    return item;
                                }))
                            }}
                            imageData={item}
                            isSelected={selectedElementId === item.id}
                            handleClick={() => {
                                dispatch(selectElementId(item.id));
                                // 拉到DOM最上方
                                const updatedElements = handleChangeZIndex(item.id, "top", elements);
                                if (!updatedElements) return;
                                handleUpdateElementList(updatedElements);
                                handleSetDirty();
                            }}
                            handleDelete={handleDelete}
                            handleSetDirty={handleSetDirty}
                            handleChangeZIndex={() => {
                                // 拉到DOM最下方
                                const updatedElements = handleChangeZIndex(item.id, "bottom", elements);
                                if (!updatedElements) return;
                                handleUpdateElementList(updatedElements);
                                handleSetDirty();
                            }}
                        />
                    )
                    if (item.type === "code") return (
                        <CodeBox key={item.id}
                            isLocked={isLock}
                            handleUpdateElement={(data: IBoardElement) => {
                                handleUpdateElementList(elements.map((item) => {
                                    if (item.id === data.id) return data;
                                    return item;
                                }))
                            }}
                            textData={item}
                            isSelected={selectedElementId === item.id}
                            handleClick={() => {
                                dispatch(selectElementId(item.id));
                                // 拉到DOM最上方
                                const updatedElements = handleChangeZIndex(item.id, "top", elements);
                                if (!updatedElements) return;
                                handleUpdateElementList(updatedElements);
                                handleSetDirty();
                            }}
                            handleDelete={handleDelete}
                            handleSetDirty={handleSetDirty}
                            handleChangeZIndex={() => {
                                // 拉到DOM最下方
                                const updatedElements = handleChangeZIndex(item.id, "bottom", elements);
                                if (!updatedElements) return;
                                handleUpdateElementList(updatedElements);
                                handleSetDirty();
                            }}
                        />
                    )
                    if (item.type === "markdown") return (
                        <MarkdownBox key={item.id}
                            isLocked={isLock}
                            handleUpdateElement={(data: IBoardElement) => {
                                handleUpdateElementList(elements.map((item) => {
                                    if (item.id === data.id) return data;
                                    return item;
                                }))
                            }}
                            textData={item}
                            isSelected={selectedElementId === item.id}
                            handleClick={() => {
                                dispatch(selectElementId(item.id));
                                // 拉到DOM最上方
                                const updatedElements = handleChangeZIndex(item.id, "top", elements);
                                if (!updatedElements) return;
                                handleUpdateElementList(updatedElements);
                                handleSetDirty();
                            }}
                            handleDelete={handleDelete}
                            handleSetDirty={handleSetDirty}
                            handleChangeZIndex={() => {
                                // 拉到DOM最下方
                                const updatedElements = handleChangeZIndex(item.id, "bottom", elements);
                                if (!updatedElements) return;
                                handleUpdateElementList(updatedElements);
                                handleSetDirty();
                            }}
                        />
                    )
                    return <></>
                })}

                {draggingBox === "text" && <TextBox
                    isLocked={isLock}
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
                    isLocked={isLock}
                    handleUpdateElement={() => { }}
                    imageData={{
                        id: "dragging_image",
                        type: "image",
                        name: "",
                        content: "dragging_image",
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
                {draggingBox === "code" && <CodeBox
                    isLocked={isLock}
                    handleUpdateElement={() => { }}
                    textData={{
                        id: "dragging_code",
                        type: "code",
                        name: "",
                        content: "code",
                        width: 500,
                        height: 300,
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
                {draggingBox === "markdown" && <MarkdownBox
                    isLocked={isLock}
                    handleUpdateElement={() => { }}
                    textData={{
                        id: "dragging_code",
                        type: "markdown",
                        name: "",
                        content: "",
                        width: 500,
                        height: 300,
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