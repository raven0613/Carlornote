"use client"
import { IBoardElement, ICard, boxType } from "@/type/card";
import { useDispatch, useSelector } from "react-redux";
import { closeAllModal, closeModal, modalTypes, openModal } from "@/redux/reducers/modal";
import { IState } from "@/redux/store";
import { selectElementId } from "@/redux/reducers/boardElement";
import { ImageCore } from "../box/ImageBox";
import { selectCard, setDirtyCardId, setDirtyState, updateCards } from "@/redux/reducers/card";
import { draggingBoxHeight, draggingBoxWidth } from "../Board";
import { ReactNode, useEffect, useState } from "react";
import StackArrowIcon from "../svg/StackArrow";
import DeleteIcon from "../svg/Delete";
import PositionIcon from "../svg/Position";
import UnlockIcon from "../svg/Unlock";
import LockIcon from "../svg/Lock";
import EyeIcon from "../svg/Eye";
import EyeCloseIcon from "../svg/EyeClose";
import { CodeCore, EditButton } from "../box/CodeBox";
import { MarkdownCore } from "../box/MarkdownBox";
import useAutosizedTextarea from "@/hooks/useAutosizedTextarea";
import { Button as AddBoxButton } from "@/components/ControlPanel";
import TextIcon from "../svg/Text";
import CodeIcon from "../svg/Code";
import ImageIcon from "../svg/Image";
import NoteIcon from "../svg/Note";
import { v4 as uuidv4 } from 'uuid';
import { handlePostImgur } from "@/api/imgur";
import useClickOutside from "@/hooks/useClickOutside";
import Card from "@/components/Card";
import { getResizedSize, handleChangeZIndex } from "@/utils/utils";
import CloseIcon from "../svg/Close";
import useTouchmoveDirection from "@/hooks/useTouchmoveDirection";
import ShrinkIcon from "../svg/Shrink";
import ExpandIcon from "../svg/Expand";

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
    const { type: openModalType, props: modalProp } = useSelector((state: IState) => state.modal)
    const user = useSelector((state: IState) => state.user);
    const dispatch = useDispatch();
    const selectedElementId = useSelector((state: IState) => state.selectedElementId);
    // console.log("selectedCard", selectedCard)
    const [editingElementId, setEditingElementId] = useState("");
    const [expandElementId, setExpandElementId] = useState("");
    const textRef = useAutosizedTextarea<HTMLTextAreaElement>(selectedCard?.boardElement?.find(item => item.id === selectedElementId)?.content ?? "", true);
    const isLock = (permission && permission !== "editable") ? true : false;
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [filterType, setFilterType] = useState<boxType[]>([]);
    const filterTypeSet = new Set(filterType);
    const filteredElements = selectedCard?.boardElement?.filter(item => {
        if (filterTypeSet.size === 0) return true;
        return filterTypeSet.has(item.type);
    }) ?? [];
    const dirtyCards = useSelector((state: IState) => state.dirtyCardsId);
    const dirtyState = useSelector((state: IState) => state.dirtyState);
    const nodeRef = useClickOutside<HTMLButtonElement>({
        handleMouseDownOutside: () => {
            setIsAddPanelOpen(false);
        },
        handleMouseDownInside() {
            setIsAddPanelOpen(pre => !pre);
        },
    })
    // console.log("permission", permission)
    // console.log("filterType", filterType)
    // console.log("filteredElements", filteredElements)
    // console.log("isLock", isLock)
    const touchMoveResult = useTouchmoveDirection();

    function save(updatedCard: ICard) {
        // console.log("updatedCard", updatedCard)
        dispatch(updateCards([updatedCard]));
        dispatch(selectCard(updatedCard));
        dispatch(setDirtyCardId(selectedCard.id));
        dispatch(setDirtyState("dirty"));
    }

    useEffect(() => {
        return () => {
            setExpandElementId("");
        }
    }, [])

    return (
        <>
            {/* panel */}
            <main className="elementPanel fixed inset-x-0 bottom-16 top-12 sm:top-0 w-full sm:relative sm:w-96 sm:h-svh sm:rounded-xl bg-white overflow-y-scroll pt-4 sm:py-2 pl-2 pr-2 z-20 sm:z-50" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch(selectElementId(""));
            }}>
                {dirtyCards.length > 0 && <p className="block sm:hidden w-full h-8 leading-8  text-center cursor-default text-sm text-seagull-700/80 z-20 pr-2 backdrop-blur-xl fixed top-12">正在儲存...</p>}
                {dirtyState === "clear" && <p className={`block sm:hidden w-full h-8 leading-8  text-center cursor-default animate-hide opacity-0 text-sm text-seagull-700/80 z-20 pr-2 backdrop-blur-xl fixed top-12`}>已成功儲存</p>}

                {/* wrapper */}
                <div className="w-full h-fit flex flex-col-reverse">
                    {/* elements */}
                    {filteredElements.map((item: IBoardElement) => {
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
                                            dispatch(openModal({
                                                type: modalTypes.checkWindow,
                                                props: {
                                                    text: "刪除後將無法復原，確定要刪除嗎？",
                                                    handleConfirm: async () => {
                                                        const newElements = selectedCard.boardElement.filter(ele => ele.id !== item.id);
                                                        const updatedCard: ICard = {
                                                            ...selectedCard,
                                                            boardElement: newElements
                                                        }
                                                        save(updatedCard);
                                                        dispatch(selectElementId(""));
                                                        dispatch(closeModal({ type: "" }));
                                                    }
                                                }
                                            }));
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
                                        handleUpdateElement={(data: ((pre: IBoardElement) => IBoardElement) | IBoardElement) => {
                                            if (typeof data === "function") {
                                                const newElement = data(item);
                                                console.log(newElement)
                                    
                                                const updatedCard: ICard = {
                                                    ...selectedCard,
                                                    boardElement: selectedCard.boardElement.map(ele => {
                                                        if (ele.id === item.id) return newElement;
                                                        return ele;
                                                    })
                                                }
                                                save(updatedCard)
                                                return;
                                            }
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
                                    <button className="sm:hidden absolute top-4 right-4 z-20 w-8 h-8 hover:scale-110 duration-150"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setExpandElementId(item.id);
                                        }}
                                    >
                                        {expandElementId === item.id ? <ShrinkIcon classProps="stroke-slate-600" /> : <ExpandIcon classProps="stroke-slate-600" />}
                                    </button>
                                </div>}
                                {(item.type === "card") && <div
                                    onClick={() => {
                                        dispatch(selectElementId(item.id));
                                    }}
                                    className={`flex items-center justify-center relative h-fit`}
                                >
                                    <Card id={item.id} url={item.cardData?.imageUrl ?? ""} name={item.cardData?.name ?? ""} cardLize={"lg"}
                                        classProps={``}
                                    />
                                </div>}
                            </div>
                        )
                    })}
                </div>
            </main>

            {/* mobile add area */}
            {!isLock && <>
                {/* add panel */}
                <div className={`fixed duration-200 ease-in-out overflow-hidden origin-bottom bottom-0
                ${isAddPanelOpen ? "opacity-100 -translate-y-20" : "translate-y-0 opacity-0"}
                left-1/2 -translate-x-1/2 bg-slate-100 shadow-md shadow-black/30 flex gap-2 p-2 z-30 rounded-xl`}>
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
                    className={`w-14 h-14 bg-seagull-500 rounded-full absolute z-40 bottom-20 right-5 shadow-md shadow-black/30
                sm:hidden
                text-seagull-200 text-3xl font-light disabled:bg-seagull-100 hover:scale-110 duration-150 hover:bg-seagull-600`}
                    onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!user?.id) return;
                        dispatch(selectElementId(""));
                    }}
                >+</button>
            </>}
            {/* mobile filter */}
            <div className={`sm:hidden items-center flex gap-4 absolute inset-x-0 bottom-16 p-8 z-40 bg-white rounded-t-lg duration-150 ease-in-out 
            ${openModalType[0] === "mobileFilter" ? "h-[15%] translate-y-0 shadow-[0_1px_12px_-2px_rgba(0,0,0,0.3)] overflow-y-scroll" : "translate-y-full h-0"}`}
                onTouchMove={() => {
                    if (touchMoveResult.y === "bottom") dispatch(closeAllModal());
                }}
            >
                <AddBoxButton
                    handleClick={() => {
                        if (filterTypeSet.has("text")) {
                            setFilterType(pre => pre.filter(item => item !== "text"));
                            return;
                        }
                        setFilterType(pre => [...pre, "text"]);
                    }} type={"text"}
                    classProps={`${filterTypeSet.has("text") ? "bg-seagull-200 border-seagull-600" : ""}`}
                >
                    <TextIcon classProps="fill-slate-600" />
                </AddBoxButton>
                <AddBoxButton
                    handleClick={() => {
                        if (filterTypeSet.has("image")) {
                            setFilterType(pre => pre.filter(item => item !== "image"));
                            return;
                        }
                        setFilterType(pre => [...pre, "image"]);
                    }} type={"image"}
                    classProps={`${filterTypeSet.has("image") ? "bg-seagull-200 border-seagull-600" : ""}`}
                >
                    <ImageIcon classProps="stroke-slate-600" />
                </AddBoxButton>
                <AddBoxButton
                    handleClick={() => {
                        if (filterTypeSet.has("code")) {
                            setFilterType(pre => pre.filter(item => item !== "code"));
                            return;
                        }
                        setFilterType(pre => [...pre, "code"]);
                    }} type={"code"}
                    classProps={`${filterTypeSet.has("code") ? "bg-seagull-200 border-seagull-600" : ""}`}
                >
                    <CodeIcon classProps="text-slate-600" />
                </AddBoxButton>
                <AddBoxButton
                    handleClick={() => {
                        if (filterTypeSet.has("markdown")) {
                            setFilterType(pre => pre.filter(item => item !== "markdown"));
                            return;
                        }
                        setFilterType(pre => [...pre, "markdown"]);
                    }} type={"markdown"}
                    classProps={`${filterTypeSet.has("markdown") ? "bg-seagull-200 border-seagull-600" : ""}`}
                >
                    <NoteIcon classProps="text-slate-600" />
                </AddBoxButton>
                <span className="w-8 h-8 absolute top-[6px] right-0 duration-150 ease-in-out cursor-pointer"
                    onClick={() => {
                        dispatch(closeAllModal());
                    }}><CloseIcon classProps="pointer-events-none" />
                </span>
            </div>
            {/* mobile markdown fullscreen */}
            <div className={`${expandElementId ? "fixed inset-x-0 top-12 bottom-16 z-40 opacity-100" : "w-full h-full -z-10 opacity-0 pointer-events-none"} duration-300 sm:hidden`}>
                {expandElementId && <MarkdownCore
                    handleUpdateElement={(data: ((pre: IBoardElement) => IBoardElement) | IBoardElement) => {
                    }}
                    handleSetDirty={() => {
                    }}
                    textData={selectedCard.boardElement.find(item => item.id === expandElementId) as IBoardElement}
                    articleMode={"read"}
                />}
                <div className="w-8 h-8 fixed right-5 top-16 z-50" onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setExpandElementId("");
                }}>
                    <ShrinkIcon classProps="stroke-slate-600" />
                </div>

            </div>
        </>
    )
}

{/* {item.opacity === 0 && <div className={`absolute inset-0 z-10 bg-black/30 pointer-events-none`}></div>} */ }