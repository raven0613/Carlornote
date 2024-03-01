"use client"
import { IBoardElement, ICard } from "@/type/card";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, openModal } from "@/redux/reducers/modal";
import { IState } from "@/redux/store";
import { selectElementId } from "@/redux/reducers/boardElement";
import { ImageCore } from "../box/ImageBox";
import { addCard, selectCard, setDirtyCardId, setDirtyState, updateCards } from "@/redux/reducers/card";
import { draggingBoxHeight, draggingBoxWidth, getResizedSize, handleChangeZIndex } from "../Board";
import { ReactNode, useState } from "react";
import StackArrowIcon from "../svg/StackArrow";
import DeleteIcon from "../svg/Delete";
import PositionIcon from "../svg/Position";
import UnlockIcon from "../svg/Unlock";
import LockIcon from "../svg/Lock";
import EyeIcon from "../svg/Eye";
import EyeCloseIcon from "../svg/EyeClose";
import CodeBox, { CodeCore, EditButton } from "../box/CodeBox";
import { MarkdownCore } from "../box/MarkdownBox";
import useAutosizedTextarea from "@/hooks/useAutosizedTextarea";
import { handleAddCard } from "@/api/card";
import { Button as AddBoxButton } from "@/components/ControlPanel";
import TextIcon from "../svg/Text";
import CodeIcon from "../svg/Code";
import ImageIcon from "../svg/Image";
import NoteIcon from "../svg/Note";
import { v4 as uuidv4 } from 'uuid';
import { handlePostImgur } from "@/api/imgur";
import useClickOutside from "@/hooks/useClickOutside";

interface IButton {
    children: ReactNode;
    handleClick: () => void;
    classProps?: string;
}

function ElementControlButton({ children, handleClick, classProps }: IButton) {
    return (
        <button type="button" className={`w-8 h-8 rounded-full p-1.5 ${classProps}`}
            onClick={() => {
                handleClick();
            }}
        >{children}</button>
    )
}

interface IElementModal {
    permission?: "editable" | "readable" | "none";
}

export default function ElementModal({ permission }: IElementModal) {
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const { type: openModalType, data: modalProp } = useSelector((state: IState) => state.modal)
    const user = useSelector((state: IState) => state.user);
    const dispatch = useDispatch();
    const selectedElementId = useSelector((state: IState) => state.selectedElementId);
    // console.log("selectedCard", selectedCard)
    const [editingElementId, setEditingElementId] = useState("");
    const textRef = useAutosizedTextarea<HTMLTextAreaElement>(selectedCard?.boardElement.find(item => item.id === selectedElementId)?.content ?? "", true);
    const isLock = permission && permission !== "editable";
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const nodeRef = useClickOutside<HTMLButtonElement>({
        handleMouseDownOutside: () => {
            setIsAddPanelOpen(false);
        },
        handleMouseDownInside() {
            setIsAddPanelOpen(pre => !pre);
        },
    })
    // console.log("isLock", isLock)

    function save(updatedCard: ICard) {
        // console.log("updatedCard", updatedCard)
        dispatch(updateCards([updatedCard]));
        dispatch(selectCard(updatedCard));
        dispatch(setDirtyCardId(selectedCard.id));
        dispatch(setDirtyState("dirty"));
    }
    return (
        <>
            {/* panel */}
            <main className="fixed inset-x-0 bottom-0 top-12 sm:top-0 w-full sm:relative sm:w-80 sm:h-[97vh] sm:rounded-xl bg-white overflow-y-scroll pt-4 sm:py-2 pl-2 pr-2 z-20 sm:z-50" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch(selectElementId(""));
            }}>
                {/* wrapper */}
                <div className="w-full h-fit flex flex-col-reverse">
                    {/* elements */}
                    {selectedCard && selectedCard.boardElement.map((item: IBoardElement) => {
                        return (
                            <div key={item.id} className={`w-full h-auto mb-2 rounded-lg border-slate-300 border relative`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    dispatch(selectElementId(item.id));
                                    if (editingElementId !== item.id) setEditingElementId("");
                                }}
                            >
                                {/* element control buttons */}
                                {!isLock && <section className={`w-full flex gap-2 items-center justify-center overflow-hidden duration-150 
                                ${selectedElementId === item.id ? "h-10 opacity-100" : "h-0 opacity-0"}`}>

                                    <div className="w-8 h-8 rounded-full sm:hidden">
                                        <EditButton handleClick={(mode) => {
                                            setEditingElementId(mode === "edit" ? item.id : "");
                                        }} defaultMode={editingElementId === item.id ? "edit" : "read"} />
                                    </div>
                                    <ElementControlButton
                                        handleClick={() => {
                                            const updatedCard: ICard = {
                                                ...selectedCard,
                                                boardElement: selectedCard.boardElement.map(ele => {
                                                    if (ele.id === item.id) return {
                                                        ...ele,
                                                        left: 0,
                                                        top: 0
                                                    }
                                                    return ele;
                                                })
                                            }
                                            save(updatedCard);
                                        }} classProps="bg-slate-200" >
                                        <PositionIcon classProps="fill-slate-600 text-slate-600" />
                                    </ElementControlButton>
                                    <ElementControlButton handleClick={() => {
                                        const updatedCard: ICard = {
                                            ...selectedCard,
                                            boardElement: selectedCard.boardElement.map(ele => {
                                                if (ele.id === item.id) return {
                                                    ...ele,
                                                    isLock: item.isLock ? false : true
                                                }
                                                return ele;
                                            })
                                        }
                                        save(updatedCard);
                                    }} classProps="bg-slate-200" >
                                        {item.isLock ? <UnlockIcon classProps="stroke-slate-600" /> : <LockIcon classProps="stroke-slate-600" />}
                                    </ElementControlButton>
                                    <ElementControlButton
                                        handleClick={() => {
                                            const updatedCard: ICard = {
                                                ...selectedCard,
                                                boardElement: selectedCard.boardElement.map(ele => {
                                                    if (ele.id === item.id) return {
                                                        ...ele,
                                                        opacity: item.opacity === 0 ? 100 : 0
                                                    }
                                                    return ele;
                                                })
                                            }
                                            save(updatedCard);
                                        }} classProps="bg-slate-200"
                                    >
                                        {item.opacity === 0 ? <EyeIcon classProps="stroke-slate-600" /> : <EyeCloseIcon classProps="text-slate-600" />}
                                    </ElementControlButton>
                                    <ElementControlButton
                                        handleClick={() => {
                                            const updatedElements = handleChangeZIndex(item.id, "bottom", selectedCard.boardElement);
                                            if (!updatedElements) return;
                                            const updatedCard: ICard = {
                                                ...selectedCard,
                                                boardElement: updatedElements
                                            }
                                            save(updatedCard);
                                        }} classProps="bg-slate-200"
                                    >
                                        <StackArrowIcon classProps="rotate-180 text-slate-600" />
                                    </ElementControlButton>
                                    <ElementControlButton
                                        handleClick={() => {
                                            const updatedElements = handleChangeZIndex(item.id, "top", selectedCard.boardElement);
                                            if (!updatedElements) return;
                                            const updatedCard: ICard = {
                                                ...selectedCard,
                                                boardElement: updatedElements
                                            }
                                            save(updatedCard);
                                        }} classProps="bg-slate-200 text-slate-600"
                                    >
                                        <StackArrowIcon />
                                    </ElementControlButton>
                                    <ElementControlButton
                                        handleClick={() => {
                                            const newElements = selectedCard.boardElement.filter(ele => ele.id !== item.id);
                                            const updatedCard: ICard = {
                                                ...selectedCard,
                                                boardElement: newElements
                                            }
                                            save(updatedCard);
                                            dispatch(selectElementId(""));
                                        }} classProps="bg-red-400" >
                                        <DeleteIcon classProps="stroke-2 stroke-red-100" />
                                    </ElementControlButton>
                                </section>}

                                {item.type === "text" && <>
                                    <div
                                        className="textbox_textarea w-full h-fit p-2 rounded-md overflow-hidden whitespace-pre-wrap outline-none resize-none bg-transparent text-neutral-700"
                                        onClick={() => {
                                            // console.log(item.id)
                                            dispatch(selectElementId(item.id));
                                        }}
                                    >
                                        <div className="w-full h-fit hidden sm:block">{item.content}</div>
                                        <textarea id={item.id} ref={textRef}
                                            onChange={(e) => {
                                                if (isLock) return;
                                                const updatedCard: ICard = {
                                                    ...selectedCard,
                                                    boardElement: selectedCard.boardElement.map(ele => {
                                                        if (ele.id === item.id) return {
                                                            ...ele,
                                                            content: e.target.value
                                                        }
                                                        return ele;
                                                    })
                                                }
                                                save(updatedCard);
                                            }}
                                            className={`textInput textbox_textarea w-full p-2 rounded-md whitespace-pre-wrap outline-none resize-none bg-transparent text-neutral-700 sm:hidden
                                            `}
                                            value={item.content}>
                                        </textarea>
                                    </div>
                                </>}
                                {(item.type === "image") && <>
                                    {/* {item.opacity === 0 && <div className={`absolute inset-0 z-10 bg-black/30 pointer-events-none`}></div>} */}
                                    <div
                                        onClick={() => {
                                            dispatch(selectElementId(item.id));
                                        }}
                                        className={`flex items-center rounded-md justify-center relative overflow-hidden 
                                    ${item.opacity === 0 ? "brightness-50" : ""}
                                    ${item.name ? "" : "h-7 pointer-events-none grayscale"}`}
                                    >
                                        <ImageCore imageData={item} handleOnLoad={() => { }}
                                        />
                                    </div>
                                </>}
                                {(item.type === "code") && <div
                                    onClick={() => {
                                        dispatch(selectElementId(item.id));
                                    }}
                                    className={`flex items-center justify-center relative h-fit duration-150`}
                                >
                                    <CodeCore
                                        handleUpdateElement={(data: IBoardElement) => {
                                            const updatedCard: ICard = {
                                                ...selectedCard,
                                                boardElement: selectedCard.boardElement.map(ele => {
                                                    if (ele.id === item.id) return data;
                                                    return ele;
                                                })
                                            }
                                            save(updatedCard);
                                        }}
                                        handleSetDirty={() => {
                                        }}
                                        textData={item}
                                        codeMode={editingElementId === item.id ? "edit" : "read"}
                                        needFull={true}
                                    />
                                </div>}
                                {(item.type === "markdown") && <div
                                    onClick={() => {
                                        dispatch(selectElementId(item.id));
                                    }}
                                    className={`flex items-center justify-center relative h-fit`}
                                >
                                    <MarkdownCore
                                        handleUpdateElement={(data: IBoardElement) => {
                                            // console.log("data!!!", data)
                                            const updatedCard: ICard = {
                                                ...selectedCard,
                                                boardElement: selectedCard.boardElement.map(ele => {
                                                    if (ele.id === item.id) return data;
                                                    return ele;
                                                })
                                            }
                                            save(updatedCard);
                                        }}
                                        handleSetDirty={() => {
                                        }}
                                        textData={item}
                                        articleMode={editingElementId === item.id ? "edit" : "read"}
                                        needFull={true}
                                    />
                                </div>}
                            </div>
                        )
                    })}
                </div>
            </main>

            {/* mobile add button */}
            {!isLock && <>
                {/* add panel */}
                <div className={`fixed duration-150 overflow-hidden
                ${isAddPanelOpen ? "top-[80%] opacity-100" : "top-[100%] opacity-0"}
                left-1/2 -translate-x-1/2 bg-slate-100 shadow-md shadow-black/30 flex gap-2 p-2 z-40 rounded-xl`}>
                    <AddBoxButton
                        handleClick={() => {
                            if (!user?.id) return;
                            const id = `element_${uuidv4()}`;
                            const updatedCard: ICard = {
                                ...selectedCard,
                                boardElement: [...selectedCard.boardElement, {
                                    id,
                                    type: "text",
                                    name: "",
                                    content: "text",
                                    width: draggingBoxWidth["text"],
                                    height: draggingBoxHeight["text"],
                                    rotation: 0,
                                    left: 100,
                                    top: 100,
                                    radius: 0,
                                    textColor: "#525252",
                                    fontSize: "base",
                                    fontWeight: "normal",
                                    opacity: 100,
                                    isLock: false
                                }]
                            }
                            save(updatedCard)
                        }} type={"text"}
                    >
                        <TextIcon classProps="fill-slate-600" />
                    </AddBoxButton>
                    <label htmlFor="mobileUploadImage" className="p-1 w-10 h-10 bg-transparent border border-slate-400 rounded-md hover:scale-105 duration-200 cursor-pointer">
                        <input hidden id="mobileUploadImage" type="file"
                            onChange={async (e) => {
                                if (!user?.id) return;
                                e.preventDefault()
                                e.stopPropagation()

                                if (!e.currentTarget.files || e.currentTarget.files?.length === 0) return;
                                const file = e.currentTarget.files[0];
                                const formData = new FormData();
                                formData.append("image", file);
                                const res = await handlePostImgur(formData);
                                // console.log("res", res)

                                if (res.success === false) return;
                                const { width, height } = getResizedSize(res.data.width, res.data.height);

                                const id = `element_${uuidv4()}`;
                                const updatedCard: ICard = {
                                    ...selectedCard,
                                    boardElement: [...selectedCard.boardElement, {
                                        id,
                                        type: "image",
                                        name: file.name,
                                        content: res.data.link,
                                        width,
                                        height,
                                        rotation: 0,
                                        left: 100,
                                        top: 100,
                                        radius: 0,
                                        opacity: 100,
                                        isLock: false,
                                    }]
                                }
                                save(updatedCard)
                            }}
                        />
                        <ImageIcon classProps="stroke-slate-600" />
                    </label>
                    <AddBoxButton
                        handleClick={() => {
                            if (!user?.id) return;
                            const id = `element_${uuidv4()}`;
                            const updatedCard: ICard = {
                                ...selectedCard,
                                boardElement: [...selectedCard.boardElement, {
                                    id,
                                    type: "code",
                                    name: "",
                                    content: "",
                                    width: draggingBoxWidth["code"],
                                    height: draggingBoxHeight["code"],
                                    rotation: 0,
                                    left: 100,
                                    top: 100,
                                    radius: 0,
                                    opacity: 100,
                                    isLock: false,
                                    programmingLanguage: "javascript"
                                }]
                            }
                            save(updatedCard)
                        }} type={"code"}
                    >
                        <CodeIcon classProps="text-slate-600" />
                    </AddBoxButton>
                    <AddBoxButton
                        handleClick={() => {
                            if (!user?.id) return;
                            const id = `element_${uuidv4()}`;
                            const updatedCard: ICard = {
                                ...selectedCard,
                                boardElement: [...selectedCard.boardElement, {
                                    id,
                                    type: "markdown",
                                    name: "",
                                    content: "",
                                    width: draggingBoxWidth["markdown"],
                                    height: draggingBoxHeight["markdown"],
                                    rotation: 0,
                                    left: 100,
                                    top: 100,
                                    radius: 0,
                                    opacity: 100,
                                    isLock: false,
                                }]
                            }
                            save(updatedCard)
                        }} type={"markdown"}
                    >
                        <NoteIcon classProps="text-slate-600" />
                    </AddBoxButton>
                </div>
                {/* add button */}
                <button ref={nodeRef} type="button"
                    className={`w-14 h-14 bg-slate-100 rounded-full absolute z-50 top-[90%] left-1/2 -translate-x-1/2 shadow-md shadow-black/30
                sm:hidden
                text-slate-400 text-3xl font-light disabled:bg-slate-100 hover:scale-110 duration-150`}
                    onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!user?.id) return;
                        dispatch(selectElementId(""));
                    }}
                >+</button>
            </>}
        </>
    )
}

{/* {item.opacity === 0 && <div className={`absolute inset-0 z-10 bg-black/30 pointer-events-none`}></div>} */ }