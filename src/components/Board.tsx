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

export const distenceToLeftTop = { left: 64, top: 64 };

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
    console.log("id", id)
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
    handleUpdateElementList: (allElement: IBoardElement[]) => void;
    draggingBox: boxType;
    handleMouseUp: () => void;
    handleSetDirty: () => void;
}

export default function Board({ elements, handleUpdateElementList, draggingBox, handleMouseUp, handleSetDirty }: IBoard) {
    // console.log("Board elements", elements)
    const selectedElementId = useSelector((state: IState) => state.selectedElementId);
    console.log("selectedElementId", selectedElementId)
    const pointerRef = useRef({ x: 0, y: 0 });
    const dropPointerRef = useRef({ x: 0, y: 0 });
    const [isLock, setIsLock] = useState(false);
    const dispatch = useDispatch();

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
        dispatch(selectElementId(newBoardElement.at(-1)?.id ?? ""));
        dispatch(closeModal({ type: "" }));
    }, [dispatch, draggingBox, elements, handleUpdateElementList])

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
                console.log("newBoardElement", newBoardElement)
            };
        };
        reader.readAsDataURL(file);


        const res = await handlePostImgur(formData);
        console.log("res", res)

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

    // click：檢查點擊的元素是否是 board 上面的，是的話紀錄 id，否的話移除 id
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            console.log("click", (e.target as HTMLElement))
            if (e.target instanceof HTMLElement) {
                console.log("click", e.target.id)
                const boardElements = document.querySelectorAll(".boardElement");
                console.log(boardElements.length)
                if (e.target.classList.contains("boardElement") || e.target.classList.contains("textbox_textarea") || e.target.classList.contains("imagebox")) {
                    if (e.target.id) dispatch(selectElementId(e.target.id));
                    return;
                }
                console.time("檢查")
                for (let item of boardElements) {
                    if (item.contains(e.target as HTMLElement)) {
                        console.log("在 board 裡面")
                        return;
                    };
                }
                console.timeEnd("檢查")
                dispatch(selectElementId(""))
            }
        }
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [dispatch]);

    // mouse up 拖曳後放開：drop 時加入資料
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
                // console.log("draggingBox", draggingBox)
                if (!draggingBox) return;
                // console.log("ㄟ")
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
                imageUpload(file);
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
    }, [handleAddTextBox, handleSetDirty, imageUpload])

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
            <div className="boardElement relative w-full h-full"
                // style={{ scale: "70%" }}
                onDragOver={(e) => {
                    // 為了防止在圖片上方 drop 的時候變成在瀏覽器打開圖片的行為，需要將圖片設定成 pointer-events-none
                    e.preventDefault();
                    setIsLock(true);
                }}
                onDragEnd={(e) => {
                    console.log("end")
                    setIsLock(false);
                    // console.log("left", e.clientX)
                    // console.log("top", e.clientY)
                }}
            >
                <input id="board_input" name="board_input" type="file" className="boardElement w-full h-full opacity-0"
                    onChange={async (e) => {
                        console.log("image drop")
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
                            handleUpdateElement={(data: IBoardElement) => {
                                handleUpdateElementList(elements.map((item) => {
                                    if (item.id === data.id) return data;
                                    return item;
                                }))
                            }}
                            textData={item}
                            isSelected={selectedElementId === item.id}
                            handleClick={() => {
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
            </div>
        </>
    )
}