"use client"
import { IBoardElement, ICard, boxType } from "@/type/card";
import { useSession } from "next-auth/react";
import Image from "next/image";
import ControlPanel from "@/components/ControlPanel";
import Board from "@/components/Board";
import { Suspense, useRef, useState } from "react";
import 'dompurify';

// https://fonts.google.com/selection/embed

export default function Intro() {
    const { data: session, status } = useSession();
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
    const boardSectionRef = useRef<HTMLDivElement>(null);

    return (
        <main className="flex flex-col w-full">
            <header className={`fixed top-0 w-full left-0 h-16 bg-white/50 backdrop-blur z-20 flex justify-between px-5 items-center`}>
                <div className="w-28 madimi-one-regular text-2xl cursor-default">
                    <span className="text-seagull-900">Carlor</span>
                    <span className="madimi-one-regular text-2xl text-seagull-500">note</span>
                </div>
                <div className="flex items-center h-full">
                    <button className="bg-seagull-500 px-3 py-2 text-white rounded-sm hover:bg-seagull-600 duration-150">Sign up for free</button>
                </div>
            </header>

            <button className="w-20 h-20 rounded-full fixed right-5 bottom-5 bg-seagull-700 text-white/80 z-10" onClick={() => {
                scrollTo({
                    top: 0,
                    behavior: "smooth"
                })
            }}>TOP</button>

            <section className={`flex h-svh w-full items-center bg-gradient-to-tr from-orange-50 to-cyan-50 relative`}>
                <div className="absolute left-24 bottom-10 h-[40%] w-[30rem]  text-5xl font-signika flex flex-col items-center z-10">
                    <p className="text-seagull-950">Create your decks</p>
                    <p className="ml-16 pt-0.5 whitespace-nowrap text-seagull-950">Note your cards</p>
                    <span className="text-sm pt-5 pb-6 font-normal text-slate-500">隨時掌握手中知識，創建、紀錄並分享</span>
                    <button className="bg-transparent w-[14rem] h-[3rem]  rounded-sm overflow-hidden text-base font-semibold relative border-2 border-seagull-500
                    
                    before:content-[''] before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:z-0 before:rounded-full before:opacity-0 before:w-5 before:h-5 hover:before:w-[14rem] hover:before:h-[14rem] before:bg-seagull-500 hover:before:rounded-none hover:before:opacity-100 before:duration-150">
                        <span className="duration-150 text-seagull-500 hover:text-white absolute inset-0 z-10 leading-[3rem] backdrop-blur-lg">Start a free trial</span>
                    </button>
                </div>
                <div className="w-[50rem] h-[28rem] absolute right-16">
                    <div className="w-[34rem] h-[22rem] bg-seagull-400 absolute top-20 right-28 rounded-md shadow-md skew-y-6 " />

                    <div className="w-[20rem] h-[5rem] bg-seagull-600 absolute top-40 left-16 rounded-md shadow-md skew-y-6 hover:-rotate-1 hover:skew-y-3 hover:scale-105 origin-[90%_10%] duration-150 ease-out hover:shadow-seagull-950/40 z-0 hover:z-10" />
                    <div className="w-[10rem] h-[5rem] bg-seagull-500 absolute top-24 left-4 rounded-md shadow-md skew-y-6 hover:-rotate-1 hover:skew-y-3 hover:scale-105 origin-[90%_10%] duration-150 ease-out hover:shadow-seagull-950/40 z-0 hover:z-10" />
                    <div className="w-[5rem] h-[7rem] bg-seagull-800 absolute -bottom-10 right-48 rounded-md shadow-md skew-y-6 hover:-rotate-1 hover:skew-y-3 hover:scale-105 origin-[90%_10%] duration-150 ease-out hover:shadow-seagull-950/40 z-0 hover:z-10" />
                    <div className="w-[20rem] h-[12rem] bg-seagull-700 absolute -bottom-5 left-30 rounded-md shadow-md skew-y-6 hover:skew-y-3 hover:-rotate-1 hover:scale-105 origin-[90%_10%] duration-150 ease-out hover:shadow-lg hover:shadow-seagull-950/40 z-0 hover:z-10" />
                </div>
                <div className="absolute bottom-2 w-20 left-1/2 -translate-x-1/2 text-center font-signika h-6 border-b border-seagull-700 text-seagull-700 hover:w-28 duration-150 cursor-pointer hover:scale-105" onClick={() => {
                    boardSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
                }}>Try now</div>
            </section>

            {/* 三個特色 */}
            <section className={`flex h-80 w-full items-center bg-seagull-200 p-10`}>
                <div className="w-1/3 h-full ">
                    <p className="w-full text-center text-3xl font-signika">Creation</p>
                    <p className="w-full text-center text-sm font-normal text-slate-600">快速創建，隨時紀錄</p>
                </div>
                <div className="w-1/3 h-full ">
                    <p className="w-full text-center text-3xl font-signika">No limitation</p>
                    <p className="w-full text-center text-sm font-normal text-slate-600">小至瓢蟲、大至宇宙，都可以是一張卡片</p>
                </div>
                <div className="w-1/3 h-full ">
                    <p className="w-full text-center text-3xl font-signika">Connection</p>
                    <p className="w-full text-center text-sm font-normal text-slate-600">將碎片化的知識累積、歸納與連結</p>
                </div>
            </section>
            <section className={`flex flex-col h-svh w-full items-center bg-white pt-16`}>
                <div className="w-[80%] 2xl:w-[70%] lg:h-40 lg:mb-10 lg:pt-16 xl:h-32 xl:mb-8 xl:pt-12 2xl:h-20 2xl:pt-2 2xl:mb-2">
                    <p className="font-extrabold text-3xl text-seagull-800 pb-1">Keep your notes in any topic</p>
                    <span className="text-sm text-slate-600 mt">每一張卡片都是一個可大可小的主題，越小的主題越能夠詳盡記錄，較大的主題可以透過卡片連結來歸納知識。</span>
                </div>
                <div className="w-[80%] 2xl:w-[70%]">
                    <Image
                        className={`rounded-md`} width={1600} height={1600} src={"https://i.imgur.com/UCX6ZT5.png"}
                        priority={true}
                        alt={"react example"}
                        style={{
                            objectFit: 'cover', // cover, contain, none
                            width: '100%', height: '',
                            boxShadow: "2px 5px 20px rgba(0, 0, 0, 0.3)"
                        }}
                        onLoad={(e) => {
                            // console.log("onLoad")
                        }}
                        onError={() => {
                        }}
                    />
                </div>
            </section>

            {/* <section className={`flex h-svh w-full items-center bg-seagull-500`}>
                能做到的服務：
            </section>
            <section className={`flex h-80 w-full items-center bg-seagull-700`}>
                完成的卡片範例
            </section> */}
            <section ref={boardSectionRef} className={`hidden sm:flex flex-col gap-2 pt-5 h-svh w-full items-center justify-center bg-seagull-200 relative`}
                style={{
                    backgroundImage: "radial-gradient(rgb(100 100 120) 1px, transparent 0)",
                    backgroundSize: "15px 15px",
                    backgroundPosition: "-19px -19px"
                }}
            >
                <span className="w-[90%] text-5xl font-serif text-seagull-800">Try It
                    <span className="pl-5 text-xl font-sans text-seagull-800">Do Something on the Board</span>
                </span>

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
            </section>
            <footer className={`flex h-20 w-full items-center bg-seagull-900 justify-center gap-96`}>
                <div className="w-28 madimi-one-regular text-2xl cursor-default">
                    <span className="text-seagull-400">Carlor</span>
                    <span className="madimi-one-regular text-2xl text-seagull-600">note</span>
                </div>
                <span className="text-seagull-300 font-extralight">Copyright © 2024 Raven. All rights reserved.</span>
            </footer>
        </main>
    );
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