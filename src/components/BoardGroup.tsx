"use client"
import React, { useRef, useState } from 'react'
import ControlPanel from './ControlPanel';
import Board from './Board';
import { IBoardElement, ICard, boxType } from '@/type/card';

export default function BoardGroup() {
    const [card, setCard] = useState<ICard>({
        id: "",
        authorId: "",
        userList: [],
        boardElement: defaultElements,
        visibility: "private",
        editability: "close",
        createdAt: "",
        updatedAt: "",
        imageUrl: "",
        name: "",
        tags: []
    });
    const [draggingBox, setDraggingBox] = useState<boxType>("");
    const boardWrapperRef = useRef<HTMLDivElement>(null);
    return (
        <div ref={boardWrapperRef} className=" justify-center items-center w-[90%] h-[80%] rounded-lg overflow-hidden shadow-lg shadow-black/20 px-0 pt-0 relative bg-white"
        >
            <Board
                distenceToLeftTop={{ left: boardWrapperRef.current?.offsetLeft ?? 0, top: boardWrapperRef.current?.getBoundingClientRect().top ?? 0 }}
                handlePushStep={() => { }}
                elements={card.boardElement}
                handleUpdateElementList={(allElement: IBoardElement[]) => {
                    // console.log("update allElement list", allElement)
                    setCard(pre => {
                        return { ...pre, boardElement: allElement };
                    });
                }}
                draggingBox={draggingBox}
                handleMouseUp={() => {
                    setDraggingBox("");
                }}
                handleSetDirty={() => {
                }}
                permission={"editable"}
            />
            <ControlPanel
                isSelectingCard={true}
                handleDrag={(type) => {
                    setDraggingBox(type);
                }}
            />
        </div>
    )
}

const defaultElements: IBoardElement[] = [
    {
        id: "element_599a35ee-88f1-460f-b148-e6126547e000",
        type: "markdown",
        name: "",
        content: "## Markdown\n\n### Double click me",
        width: 550,
        height: 295,
        rotation: 0,
        left: 140,
        top: 270,
        radius: 0,
        opacity: 100,
        isLock: false,
    },
    {
        id: "element_599a35ee-88f1-460f-b148-e6126547e662",
        type: "code",
        name: "Double click me",
        content: "console.log(\"Hello Carlornote!\")",
        width: 480,
        height: 260,
        rotation: 0,
        left: 745,
        top: 65,
        radius: 0,
        opacity: 100,
        isLock: false,
        programmingLanguage: "typescript"
    },
    {
        id: "element_057f69d1-6d0b-463b-a6e9-5b323b77fecd",
        type: "text",
        name: "",
        content: "Drag me!",
        width: 200,
        height: 60,
        textColor: "#009688",
        fontSize: "2xl",
        fontWeight: "extraBold",
        rotation: -14.44,
        left: 89,
        top: 28,
        radius: 0,
        opacity: 100,
        isLock: false
    },
    {
        id: "element_83e86f64-3a51-47c9-bde8-4c1e6372e31c",
        type: "text",
        name: "",
        content: "Rotate me!",
        width: 200,
        height: 60,
        textColor: "#03a9f4",
        fontSize: "2xl",
        fontWeight: "extraBold",
        rotation: -6.39,
        left: 112,
        top: 85,
        radius: 0,
        opacity: 100,
        isLock: false
    },
    {
        id: "element_90f8a8db-ba09-4dc2-a365-70cc7c45a90f",
        type: "text",
        name: "",
        content: "Scale me!",
        width: 200,
        height: 60,
        textColor: "#ff5722",
        fontSize: "2xl",
        fontWeight: "extraBold",
        rotation: 8.3,
        left: 96,
        top: 158,
        radius: 0,
        opacity: 100,
        isLock: false
    },
    {
        id: "element_638476aa-6d9e-4649-b7f0-01442b120337",
        type: "image",
        name: "example image 01",
        content: "https://i.imgur.com/gAzhP1L.png",
        width: 370,
        height: 320,
        rotation: 0,
        left: 525,
        top: 350,
        radius: 0,
        opacity: 100,
        isLock: false
    },
    {
        id: "element_288b510f-c08a-4705-9fac-aecbacbe3a11",
        type: "image",
        name: "example image 02",
        content: "https://i.imgur.com/XOkGMfS.png",
        width: 277,
        height: 240,
        rotation: 0,
        left: 1070,
        top: 435,
        radius: 0,
        opacity: 100,
        isLock: false
    }
] 