"use client"
import TextBox from "@/components/box/TextBox";
import { IBoardElement, ICard, boxType } from "@/type/card";
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
import CardBox from "./box/CardBox";
import { StepType } from "@/app/page";
import { getResizedSize, handleChangeZIndex } from "@/utils/utils";
import { xDirection, yDirection } from "./box/Box";

// 看 board 離螢幕左和上有多少 px
export const distenceToLeftTop = { left: 0, top: 0 };

export const draggingBoxWidth: Record<boxType, number> = {
    text: 200,
    image: 500,
    code: 500,
    markdown: 500,
    card: 96,
    "": 0
}

export const draggingBoxHeight: Record<boxType, number> = {
    text: 60,
    image: 30,
    code: 300,
    markdown: 300,
    card: 128,
    "": 0
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
    name?: string
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
    draggingCard?: ICard;
    handleMouseUp: () => void;
    handleSetDirty: () => void;
    permission: "editable" | "readable" | "none";
    handlePushStep: (step: StepType) => void;
}

export default function Board({ elements, handleUpdateElementList, draggingBox, handleMouseUp, handleSetDirty, permission, draggingCard, handlePushStep }: IBoard) {
    const boardRef = useRef<HTMLDivElement>(null)
    // console.log("Board elements", elements)
    const selectedElementId = useSelector((state: IState) => state.selectedElementId);
    // console.log("selectedElementId", selectedElementId)
    const pointerRef = useRef({ x: 0, y: 0 });
    const moveDirectionRef = useRef<{ x: xDirection, y: yDirection }>({ x: "left", y: "top" });
    const clickedPointRef = useRef({ startX: 0, startY: 0, endX: 0, endY: 0 });
    const [isLock, setIsLock] = useState(false);
    const [isPointerNone, setIsPointerNone] = useState(false);
    const dispatch = useDispatch();
    const existPositionsRef = useRef({
        x: elements.reduce((pre: number[], curr: IBoardElement) => {
            return [...pre, curr.left, curr.left + curr.width];
        }, []).sort((a, b) => a - b),
        y: elements.reduce((pre: number[], curr: IBoardElement) => {
            return [...pre, curr.top, curr.top + curr.height];
        }, []).sort((a, b) => a - b)
    });
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isMoving, setIsMoving] = useState(false);

    console.log("isMoving", isMoving)
    // console.log("draggingBox", draggingBox)
    // console.log("pointerRef", pointerRef.current)
    // console.log("Board isLock", isLock)
    // console.log("Board isPointerNone", isPointerNone)
    // console.log("permission", permission)
    // console.log("selectedElementId", selectedElementId)


    useEffect(() => {
        if (permission !== "editable") {
            setIsLock(true);
        }
    }, [permission])

    // 每次切換卡片的時候重新設定 existPositions
    useEffect(() => {
        if (elements.length === 0) {
            existPositionsRef.current = { x: [], y: [] };
            return;
        };
        existPositionsRef.current = {
            x: elements.reduce((pre: number[], curr: IBoardElement) => {
                return [...pre, curr.left, curr.left + curr.width];
            }, []).sort((a, b) => a - b),
            y: elements.reduce((pre: number[], curr: IBoardElement) => {
                return [...pre, curr.top, curr.top + curr.height];
            }, []).sort((a, b) => a - b)
        }
        // console.log("existPositionsRef", existPositionsRef.current)
    }, [elements])

    // add box
    const handleAddBox = useCallback(({ type, content, name, position: { left, top }, size: { width, height } }: INewBoxProps) => {
        console.log("add box")
        const id = `element_${uuidv4()}`;
        const newBoardElement: IBoardElement = {
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
        }
        const cardBox: IBoardElement = {
            ...newBoardElement, cardData: {
                id: draggingCard?.id ?? "", name: draggingCard?.name ?? "", imageUrl: draggingCard?.imageUrl ?? ""
            }
        }
        const newBoardElements: IBoardElement[] = [...elements, type === "card" ? cardBox : newBoardElement];

        handleUpdateElementList(newBoardElements);
        handlePushStep({ added: newBoardElement });
        setIsPointerNone(false);
        dispatch(selectElementId(newBoardElements.at(-1)?.id ?? ""));
        dispatch(closeModal({ type: "" }));
    }, [dispatch, elements, handleUpdateElementList, draggingCard, handlePushStep])

    const handleAddImageBox = useCallback(({ name, content, position: { left, top }, size: { width, height } }: INewImageBoxProps) => {
        console.log("add img box")
        const id = `element_${uuidv4()}`;
        if (!left || !top) return;
        console.log("AddImageBox")
        const newBoardElement = {
            id: id,
            type: "image" as boxType,
            name: name,
            content: content,
            width: width,
            height: height,
            rotation: 0,
            left,
            top,
            radius: 0,
            isLock: false
        }
        const newBoardElements = [...elements, newBoardElement]
        handleUpdateElementList(newBoardElements);
        setIsPointerNone(false);
        dispatch(closeModal({ type: "" }));
        return newBoardElements;
    }, [dispatch, elements, handleUpdateElementList])

    const imageUpload = useCallback(async (file: File) => {
        console.log("imageUpload")
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
                    position: { left: pointerRef.current.x + (wrapperRef.current?.scrollLeft ?? 0), top: pointerRef.current.y + (wrapperRef.current?.scrollTop ?? 0) },
                    size: { width, height }
                }) ?? [];
                // console.log("newBoardElement", newBoardElement)
            };
        };
        reader.readAsDataURL(file);
        // return;
        const res = await handlePostImgur(formData);
        // console.log("res", res)

        if (res.success === false) return;
        if (!newBoardElement) return;
        const { width, height } = getResizedSize(res.data.width, res.data.height);
        const updatedNewBoardElement: IBoardElement[] = newBoardElement.map((item, index) => {
            if (index === newBoardElement.length - 1) return {
                ...item,
                name: file.name,
                content: res.data.link,
                width,
                height
            };
            return item;
        })
        handleUpdateElementList(updatedNewBoardElement)
        handlePushStep({ added: updatedNewBoardElement.at(-1) as IBoardElement });
    }, [handleAddImageBox, handlePushStep, handleUpdateElementList])


    // mouse up 拖曳後放開：drop 時加入 dragging box 資料
    useEffect(() => {
        function handlePutBoxOnBoard(e: MouseEvent) {
            // console.log("put box")
            e.stopPropagation();
            e.preventDefault();
            // console.log((e.target as HTMLElement))
            if (!(e.target instanceof HTMLElement)) return;
            // drop 時加入資料
            // console.log("draggingBox", draggingBox)
            if (!draggingBox) return;
            // console.log("ㄟ")
            handleAddBox({
                type: draggingBox,
                content: getContent(draggingBox),
                position: {
                    left: e.clientX - distenceToLeftTop.left + (wrapperRef.current?.scrollLeft ?? 0),
                    top: e.clientY - distenceToLeftTop.top + (wrapperRef.current?.scrollTop ?? 0)
                },
                size: { width: draggingBoxWidth[draggingBox], height: draggingBoxHeight[draggingBox] },
                name: draggingCard?.name
            })
            handleSetDirty();
            // 先不限制放開位置
            // if (boardRef.current?.contains(e.target)) {
            // }
            // console.log((e.target as HTMLElement))
            // old(如果在 board 以外的地方放開) 停止 drop 流程
            handleMouseUp();
            setIsMoving(false);
        }
        // dragend for cardBox, mouseup for others
        document.addEventListener("dragend", handlePutBoxOnBoard);
        document.addEventListener("mouseup", handlePutBoxOnBoard);
        return () => {
            document.removeEventListener("dragend", handlePutBoxOnBoard);
            document.removeEventListener("mouseup", handlePutBoxOnBoard);
        }
    }, [draggingBox, handleAddBox, handleMouseUp, handleSetDirty, draggingCard]);

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
                    position: { left: pointerRef.current.x + (wrapperRef.current?.scrollLeft ?? 0), top: pointerRef.current.y + (wrapperRef.current?.scrollTop ?? 0) },
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
        const newElements = elements.filter(item => item.id !== id);
        const deletedIdx = elements.findIndex(item => item.id === id);
        handlePushStep({ deleted: elements[deletedIdx], index: deletedIdx });
        handleUpdateElementList(newElements);
        // setSelectedId("");
        dispatch(selectElementId(""))
        handleSetDirty();
    }

    function handleBoxUpdateElement(data: IBoardElement) {
        const selectedElement = elements.find(ele => ele.id === data.id);
        selectedElement && handlePushStep({ newData: data, oldData: selectedElement });

        handleUpdateElementList(elements.map((item) => {
            if (item.id === data.id) return data;
            return item;
        }))
    }

    function handleBoxClick(id: string) {
        dispatch(selectElementId(id));
        const oldIdx = elements.findIndex(item => item.id === id);
        if (elements.at(-1)?.id === id || oldIdx === -1) return;
        handlePushStep({ id, newIdx: elements.length - 1, oldIdx });

        // 拉到DOM最上方
        const updatedElements = handleChangeZIndex(id, "top", elements);
        if (!updatedElements) return;
        handleUpdateElementList(updatedElements);
        handleSetDirty();
    }

    function handleBoxChangeZIdx(id: string) {
        const oldIdx = elements.findIndex(item => item.id === id);
        if (elements.at(-1)?.id === id || oldIdx === -1) return;
        handlePushStep({ id, newIdx: 0, oldIdx });

        // 拉到DOM最下方
        const updatedElements = handleChangeZIndex(id, "bottom", elements);
        if (!updatedElements) return;
        handleUpdateElementList(updatedElements);
        handleSetDirty();
    }

    const [boardSize, setBoardSize] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    // 每次選擇卡片後，board 的尺寸要被撐到涵蓋內部 box
    useEffect(() => {
        if (!elements) return;
        setBoardSize({ x: wrapperRef.current?.scrollWidth ?? 0, y: wrapperRef.current?.scrollHeight ?? 0 });
    }, [elements])
    // console.log("x", boardSize.x)
    // console.log("y", boardSize.y)

    return (
        <>
            <main ref={wrapperRef} className="boardElement absolute inset-0 items-center overflow-scroll min-w-full min-h-full bg-white/80"
            >
                <div className="boardElement absolute top-0 flex" ref={boardRef}
                    style={{
                        width: boardSize.x || "100%", height: boardSize.y || "100%",
                        scale: "100%", transformOrigin: "top left"
                    }}
                    onDragOver={(e) => {
                        // 為了防止在圖片上方 drop 的時候變成在瀏覽器打開圖片的行為，需要將圖片設定成 pointer-events-none
                        e.preventDefault();
                        setIsPointerNone(true);
                    }}
                    onDragEnd={(e) => {
                        // console.log("drag end")
                        setIsPointerNone(false);
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
                        setIsMoving(true);
                    }}
                    onMouseMove={(e) => {
                        // TODO: drag move

                        // if (!wrapperRef.current || !isMoving) return;
                        // if (e.clientX < pointerRef.current.x) moveDirectionRef.current.x = "left";
                        // else if (e.clientX > pointerRef.current.x) moveDirectionRef.current.x = "right";
                        // if (e.clientY < pointerRef.current.y) moveDirectionRef.current.y = "top";
                        // else if (e.clientY > pointerRef.current.y) moveDirectionRef.current.y = "bottom";

                        // console.log("pointerRefY", pointerRef.current.y)
                        // console.log("clientY", e.clientY)
                        // console.log("moveDirectionRef", moveDirectionRef.current)

                        // pointerRef.current = {
                        //     x: e.clientX - distenceToLeftTop.left,
                        //     y: e.clientY - distenceToLeftTop.top
                        // };
                        // const scrollTop = wrapperRef.current.scrollTop;
                        // const scrollLeft = wrapperRef.current.scrollLeft;
                        // const top = moveDirectionRef.current.y === "top"? scrollTop + 5 : scrollTop - 5;
                        // const left = moveDirectionRef.current.x === "left"? scrollLeft + 5 : scrollLeft - 5;

                        // wrapperRef.current.scrollTo({
                        //     top, left, behavior: "auto"
                        // })
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
                    <input id="board_input" name="board_input" type="file" className="boardElement board_input opacity-0 w-full h-full bg-red-200 z-0"
                        onChange={async (e) => {
                            console.log("image drop")
                            e.preventDefault()
                            e.stopPropagation()
                            if (!e.currentTarget.files || e.currentTarget.files?.length === 0) return;
                            console.log("image drop2")
                            const file = e.currentTarget.files[0];
                            imageUpload(file);
                            handleSetDirty();
                            // 如果是上傳一樣的圖片會無法觸發 onChange，所以必須把值歸零
                            e.target.value = "";
                        }}
                        onMouseMove={(e) => {
                            pointerRef.current = {
                                x: e.clientX - distenceToLeftTop.left,
                                y: e.clientY - distenceToLeftTop.top
                            };
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            // e.stopPropagation();
                            dispatch(selectElementId(""));
                        }}
                        onDrop={(e) => {
                        }}
                    />

                    {elements && elements.map(item => {
                        if (item.type === "text") return (
                            <TextBox key={item.id}
                                isBoardLocked={isLock || item.isLock}
                                handleUpdateElement={handleBoxUpdateElement}
                                textData={item}
                                isSelected={selectedElementId === item.id}
                                handleClick={() => {
                                    handleBoxClick(item.id);
                                }}
                                handleDelete={handleDelete}
                                handleSetDirty={handleSetDirty}
                                handleChangeZIndex={() => {
                                    handleBoxChangeZIdx(item.id);
                                }}
                                elementPositions={{ x: existPositionsRef.current.x, y: existPositionsRef.current.y }}
                                scrollPosition={{ x: wrapperRef.current?.scrollLeft ?? 0, y: wrapperRef.current?.scrollTop ?? 0 }}
                            />
                        )
                        if (item.type === "image") return (
                            <ImageBox key={item.id}
                                isBoardLocked={isLock || item.isLock}
                                handleUpdateElement={handleBoxUpdateElement}
                                handleImgOnLoad={(data) => {
                                    handleUpdateElementList(elements.map((item) => {
                                        if (item.id === data.id) return data;
                                        return item;
                                    }))
                                    // console.log("item", item)
                                    // 第一次輸入到 url input 的時候，content 會設為 image，只有這一次需要推到 undoList，同一張圖之後每次的 image onLoad 都不需要推到 undoList
                                    if (item.content !== "image") return;
                                    handlePushStep({ added: data });
                                }}
                                imageData={item}
                                isSelected={selectedElementId === item.id}
                                handleClick={() => {
                                    handleBoxClick(item.id);
                                }}
                                handleDelete={handleDelete}
                                handleSetDirty={handleSetDirty}
                                handleChangeZIndex={() => {
                                    handleBoxChangeZIdx(item.id);
                                }}
                                isPointerNone={isPointerNone}
                                elementPositions={{ x: existPositionsRef.current.x, y: existPositionsRef.current.y }}
                                scrollPosition={{ x: wrapperRef.current?.scrollLeft ?? 0, y: wrapperRef.current?.scrollTop ?? 0 }}
                            />
                        )
                        if (item.type === "code") return (
                            <CodeBox key={item.id}
                                isBoardLocked={isLock || item.isLock}
                                handleUpdateElement={handleBoxUpdateElement}
                                textData={item}
                                isSelected={selectedElementId === item.id}
                                handleClick={() => {
                                    handleBoxClick(item.id);
                                }}
                                handleDelete={handleDelete}
                                handleSetDirty={handleSetDirty}
                                handleChangeZIndex={() => {
                                    handleBoxChangeZIdx(item.id);
                                }}
                                isPointerNone={isPointerNone}
                                elementPositions={{ x: existPositionsRef.current.x, y: existPositionsRef.current.y }}
                                scrollPosition={{ x: wrapperRef.current?.scrollLeft ?? 0, y: wrapperRef.current?.scrollTop ?? 0 }}
                            />
                        )
                        if (item.type === "markdown") return (
                            <MarkdownBox key={item.id}
                                isBoardLocked={isLock || item.isLock}
                                handleUpdateElement={handleBoxUpdateElement}
                                textData={item}
                                isSelected={selectedElementId === item.id}
                                handleClick={() => {
                                    handleBoxClick(item.id);
                                }}
                                handleDelete={handleDelete}
                                handleSetDirty={handleSetDirty}
                                handleChangeZIndex={() => {
                                    handleBoxChangeZIdx(item.id);
                                }}
                                isPointerNone={isPointerNone}
                                elementPositions={{ x: existPositionsRef.current.x, y: existPositionsRef.current.y }}
                                scrollPosition={{ x: wrapperRef.current?.scrollLeft ?? 0, y: wrapperRef.current?.scrollTop ?? 0 }}
                            />
                        )
                        if (item.type === "card") return (
                            <CardBox key={item.id}
                                isBoardLocked={isLock || item.isLock}
                                handleUpdateElement={handleBoxUpdateElement}
                                cardData={item}
                                isSelected={selectedElementId === item.id}
                                handleClick={() => {
                                    handleBoxClick(item.id);
                                }}
                                handleDelete={handleDelete}
                                handleSetDirty={handleSetDirty}
                                handleChangeZIndex={() => {
                                    handleBoxChangeZIdx(item.id);
                                }}
                                isPointerNone={isPointerNone}
                                elementPositions={{ x: existPositionsRef.current.x, y: existPositionsRef.current.y }}
                                scrollPosition={{ x: wrapperRef.current?.scrollLeft ?? 0, y: wrapperRef.current?.scrollTop ?? 0 }}
                            />
                        )
                        return <></>
                    })}

                    {draggingBox === "text" && <TextBox
                        isBoardLocked={isLock}
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
                        elementPositions={{ x: existPositionsRef.current.x, y: existPositionsRef.current.y }}
                        scrollPosition={{ x: wrapperRef.current?.scrollLeft ?? 0, y: wrapperRef.current?.scrollTop ?? 0 }}
                    />}
                    {draggingBox === "image" && <ImageBox
                        isBoardLocked={isLock}
                        handleUpdateElement={() => { }}
                        handleImgOnLoad={() => { }}
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
                        elementPositions={{ x: existPositionsRef.current.x, y: existPositionsRef.current.y }}
                        scrollPosition={{ x: wrapperRef.current?.scrollLeft ?? 0, y: wrapperRef.current?.scrollTop ?? 0 }}
                    />}
                    {draggingBox === "code" && <CodeBox
                        isBoardLocked={isLock}
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
                        elementPositions={{ x: existPositionsRef.current.x, y: existPositionsRef.current.y }}
                        scrollPosition={{ x: wrapperRef.current?.scrollLeft ?? 0, y: wrapperRef.current?.scrollTop ?? 0 }}
                    />}
                    {draggingBox === "markdown" && <MarkdownBox
                        isBoardLocked={isLock}
                        handleUpdateElement={() => { }}
                        textData={{
                            id: "dragging_markdown",
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
                        elementPositions={{ x: existPositionsRef.current.x, y: existPositionsRef.current.y }}
                        scrollPosition={{ x: wrapperRef.current?.scrollLeft ?? 0, y: wrapperRef.current?.scrollTop ?? 0 }}
                    />}
                    {draggingBox === "card" && <CardBox
                        isBoardLocked={isLock}
                        handleUpdateElement={() => { }}
                        cardData={{
                            id: "dragging_card",
                            type: "card",
                            name: draggingCard?.name ?? "",
                            content: draggingCard?.imageUrl ?? "",
                            width: 96,
                            height: 128,
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
                        elementPositions={{ x: existPositionsRef.current.x, y: existPositionsRef.current.y }}
                        scrollPosition={{ x: wrapperRef.current?.scrollLeft ?? 0, y: wrapperRef.current?.scrollTop ?? 0 }}
                    />}
                </div>
            </main>
        </>
    )
}

// 吸附線
// {existPositionsRef.current.x.map(item => {
//     return (
//         <div className="absolute w-[1px] h-full bg-red-500 top-0 z-10" style={{ left: item + "px" }}></div>
//     )
// })}
// {existPositionsRef.current.y.map(item => {
//     return (
//         <div className="absolute h-[1px] w-full  bg-blue-500 left-0 z-10" style={{ top: item + "px" }}></div>
//     )
// })}