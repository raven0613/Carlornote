"use client"
import { IBoardElement, ICard } from "@/type/card";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, openModal } from "@/redux/reducers/modal";
import { IState } from "@/redux/store";
import { selectElementId } from "@/redux/reducers/boardElement";
import { ImageCore } from "../box/ImageBox";
import { selectCard, setDirtyCardId, setDirtyState, updateCards } from "@/redux/reducers/card";
import { handleChangeZIndex } from "../Board";
import { ReactNode } from "react";
import StackArrowIcon from "../svg/StackArrow";
import DeleteIcon from "../svg/Delete";
import PositionIcon from "../svg/Position";
import UnlockIcon from "../svg/Unlock";
import LockIcon from "../svg/Lock";
import EyeIcon from "../svg/Eye";
import EyeCloseIcon from "../svg/EyeClose";

interface IButton {
    children: ReactNode;
    handleClick: () => void;
    classProps?: string;
}

function Button({ children, handleClick, classProps }: IButton) {
    return (
        <button type="button" className={`w-8 h-8 rounded-full p-1.5 ${classProps}`}
            onClick={() => {
                handleClick();
            }}
        >{children}</button>
    )
}

interface IElementModal {
}

export default function ElementModal({ }: IElementModal) {
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const { type: openModalType, data: modalProp } = useSelector((state: IState) => state.modal)
    const dispatch = useDispatch();
    const selectedElementId = useSelector((state: IState) => state.selectedElementId);
    // console.log("selectedCard", selectedCard)

    function save(updatedCard: ICard) {
        dispatch(updateCards([updatedCard]));
        dispatch(selectCard(updatedCard));
        dispatch(setDirtyCardId(selectedCard.id));
        dispatch(setDirtyState("dirty"));
    }
    return (
        <>
            {/* panel */}
            <div className="hidden sm:block w-80 h-[97vh] rounded-xl bg-white relative z-10 overflow-y-scroll py-2 pl-2 pr-2" onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}>
                {/* wrapper */}
                <div className="w-full h-fit flex flex-col-reverse">
                    {/* elements */}
                    {selectedCard && selectedCard.boardElement.map((item: IBoardElement) => {
                        return (
                            <div key={item.id} className={`w-full h-auto mb-2 rounded-md border-slate-300 border relative`}
                                onClick={() => {
                                    dispatch(selectElementId(item.id));
                                }}
                            >
                                {/* buttons */}
                                {<section className={`w-full  flex gap-2 items-center justify-center overflow-hidden duration-150 ${selectedElementId === item.id ? "h-10 opacity-100" : "h-0 opacity-0"}`}>
                                    <Button
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
                                        }} classProps="bg-slate-300" >
                                        <PositionIcon />
                                    </Button>
                                    <Button handleClick={() => {
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
                                    }} classProps="bg-slate-300" >
                                        {item.isLock ? <UnlockIcon /> : <LockIcon />}
                                    </Button>
                                    <Button
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
                                        }} classProps="bg-slate-300"
                                    >
                                        {item.opacity === 0 ? <EyeIcon /> : <EyeCloseIcon />}
                                    </Button>
                                    <Button
                                        handleClick={() => {
                                            const updatedElements = handleChangeZIndex(item.id, "bottom", selectedCard.boardElement);
                                            if (!updatedElements) return;
                                            const updatedCard: ICard = {
                                                ...selectedCard,
                                                boardElement: updatedElements
                                            }
                                            save(updatedCard);
                                        }} classProps="bg-slate-300"
                                    >
                                        <StackArrowIcon classProps="rotate-180" />
                                    </Button>
                                    <Button
                                        handleClick={() => {
                                            const updatedElements = handleChangeZIndex(item.id, "top", selectedCard.boardElement);
                                            if (!updatedElements) return;
                                            const updatedCard: ICard = {
                                                ...selectedCard,
                                                boardElement: updatedElements
                                            }
                                            save(updatedCard);
                                        }} classProps="bg-slate-300"
                                    >
                                        <StackArrowIcon />
                                    </Button>
                                    <Button
                                        handleClick={() => {
                                            const newElements = selectedCard.boardElement.filter(ele => ele.id !== item.id);
                                            const updatedCard: ICard = {
                                                ...selectedCard,
                                                boardElement: newElements
                                            }
                                            save(updatedCard);
                                            dispatch(selectElementId(""));
                                        }} classProps="bg-red-400" >
                                        <DeleteIcon classProps="stroke-2 stroke-slate-700" />
                                    </Button>
                                </section>}
                                {item.type === "text" && <>
                                    <div
                                        className="textbox_textarea w-full h-fit p-2 rounded-md overflow-hidden whitespace-pre-wrap outline-none resize-none bg-transparent text-neutral-700"
                                        onClick={() => {
                                            console.log(item.id)
                                            dispatch(selectElementId(item.id));
                                        }}
                                    >
                                        {item.content}
                                    </div>
                                </>}
                                {(item.type === "image") && <div
                                    onClick={() => {
                                        dispatch(selectElementId(item.id));
                                    }}
                                    className={`flex items-center justify-center relative overflow-hidden ${item.name ? "" : "h-7 pointer-events-none grayscale"}`}
                                >
                                    <ImageCore imageData={item} handleOnLoad={() => { }}
                                    />
                                </div>}
                            </div>
                        )
                    })}
                </div>
            </div>
            {/* 小耳朵 */}
            <div className={`hidden sm:block absolute top-0 bg-white w-10 h-24 rounded-lg cursor-pointer -z-10  shadow-black/30 duration-150
                ${openModalType === "boardElements" ? "left-0" : "-left-6 shadow-md"}
            `} onClick={() => {
                    if (openModalType === "boardElements") return dispatch(closeModal({ type: "" }));
                    dispatch(openModal({ type: "boardElements", data: selectedCard?.boardElement }));
                }}></div>
        </>
    )
}