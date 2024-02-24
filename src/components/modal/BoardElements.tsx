"use client"
import { IBoardElement, ICard } from "@/type/card";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, openModal } from "@/redux/reducers/modal";
import { IState } from "@/redux/store";
import { selectElementId } from "@/redux/reducers/boardElement";
import { ImageCore } from "../box/ImageBox";
import { selectCard, setDirtyCardId, setDirtyState, updateCards } from "@/redux/reducers/card";
import { handleChangeZIndex } from "../Board";

interface IButton {
    text: string;
    handleClick: () => void;
    classProps?: string;
}

function Button({ text, handleClick, classProps }: IButton) {
    return (
        <button type="button" className={`boardElement w-8 h-8 rounded-full ${classProps}`}
            onClick={() => {
                handleClick();
            }}
        >{text}</button>
    )
}

interface IElementModal {
}

export default function ElementModal({ }: IElementModal) {
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const { type: openModalType, data: modalProp } = useSelector((state: IState) => state.modal)
    const dispatch = useDispatch();
    const selectedElementId = useSelector((state: IState) => state.selectedElementId);
    console.log("selectedCard", selectedCard)

    function save(updatedCard: ICard) {
        dispatch(updateCards([updatedCard]));
        dispatch(selectCard(updatedCard));
        dispatch(setDirtyCardId(selectedCard.id));
        dispatch(setDirtyState("dirty"));
    }
    return (
        <>
            {/* panel */}
            <div className="w-80 h-[72vh] rounded-xl bg-white relative z-10 overflow-y-scroll py-2 pl-2 pr-2" onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}>
                {/* wrapper */}
                <div className="w-full h-fit flex flex-col-reverse">
                    {/* elements */}
                    {selectedCard && selectedCard.boardElement.map((item: IBoardElement) => {
                        return (
                            <div key={item.id} className={`boardElement w-full h-auto mb-2 rounded-md border-slate-300 border relative`}
                                onClick={() => {
                                    dispatch(selectElementId(item.id));
                                }}
                            >
                                {/* buttons */}
                                {<section className={`boardElement w-full  flex gap-2 items-center justify-center overflow-hidden duration-150 ${selectedElementId === item.id ? "h-10 opacity-100" : "h-0 opacity-0"}`}>
                                    <Button text="刪"
                                        handleClick={() => {
                                            const newElements = selectedCard.boardElement.filter(ele => ele.id !== item.id);
                                            const updatedCard: ICard = {
                                                ...selectedCard,
                                                boardElement: newElements
                                            }
                                            save(updatedCard);
                                            dispatch(selectElementId(""));
                                        }} classProps="bg-red-500" />
                                    <Button text="重"
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
                                        }} classProps="bg-slate-300" />
                                    <Button text="鎖" handleClick={() => {

                                    }} classProps="bg-slate-300" />
                                    <Button text={`${item.opacity === 0 ? "開" : "隱"}`}
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
                                    />
                                    <Button text="下"
                                        handleClick={() => {
                                            const updatedElements = handleChangeZIndex(item.id, "bottom", selectedCard.boardElement);
                                            if (!updatedElements) return;
                                            const updatedCard: ICard = {
                                                ...selectedCard,
                                                boardElement: updatedElements
                                            }
                                            save(updatedCard);
                                        }} classProps="bg-slate-300"
                                    />
                                    <Button text="上"
                                        handleClick={() => {
                                            const updatedElements = handleChangeZIndex(item.id, "top", selectedCard.boardElement);
                                            if (!updatedElements) return;
                                            const updatedCard: ICard = {
                                                ...selectedCard,
                                                boardElement: updatedElements
                                            }
                                            save(updatedCard);
                                        }} classProps="bg-slate-300"
                                    />
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
                                    className={`imagebox flex items-center justify-center relative overflow-hidden ${item.name ? "" : "h-7 pointer-events-none grayscale"}`}
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
            <div className="absolute top-0 -left-6 bg-white w-10 h-24 rounded-lg cursor-pointer -z-10 shadow-md shadow-black/30" onClick={() => {
                if (openModalType === "boardElements") return dispatch(closeModal({ type: "" }));
                dispatch(openModal({ type: "boardElements", data: selectedCard?.boardElement }));
            }}></div>
        </>
    )
}