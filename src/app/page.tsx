"use client"
import Board from "@/components/Board";
import { useCallback, useEffect, useRef, useState } from "react";
import { IBoardElement, ICard, boxType } from "@/type/card";
import ControlPanel from "@/components/ControlPanel";
import { handleUpdateCard } from "@/api/card";
import { signOut, useSession } from "next-auth/react";
import { IState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { clearDirtyCardId, selectCard, setDirtyCardId, setDirtyState, setTags, updateCards } from "@/redux/reducers/card";
import CardList from "@/components/CardList";
import Popup from "@/components/Popup";
import { addUser, setUserPermission } from "@/redux/reducers/user";
import ControlBar from "@/components/ControlBar";
import Link from "next/link";
import { changeIndex } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { handleAddUser, handleGetUserByEmail } from "@/api/user";
import useDebounce from "@/hooks/useDebounce";

export type StepType = { id: string, newIdx: number, oldIdx: number } | { newData: IBoardElement, oldData: IBoardElement } | { added: IBoardElement } | { deleted: IBoardElement, index: number };

let undoList: Array<StepType> = [];
let redoList: Array<StepType> = [];

export default function Home() {
    const [draggingBox, setDraggingBox] = useState<boxType>("");
    const [draggingCard, setDraggingCard] = useState<ICard>();
    const dispatch = useDispatch();
    const router = useRouter();
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const allCards = useSelector((state: IState) => state.card);
    const dirtyCards = useSelector((state: IState) => state.dirtyCardsId);
    const dirtyState = useSelector((state: IState) => state.dirtyState);
    const user = useSelector((state: IState) => state.user);

    // console.log("回復", undoList)
    // console.log("重來", redoList)
    // console.log("wheelPx", wheelPx)
    // console.log("user", user)
    // console.log("session", session)
    // console.log("draggingBox page", draggingBox)
    // console.log("allCards page", allCards)
    // console.log("dirtyState", dirtyState)
    // console.log("dirtyCards", dirtyCards)
    // console.log("selectedCard page", selectedCard)

    // useEffect(() => {
    //     if (user) return;
    //     console.log("轉址 login")
    //     router.push("/login");
    // }, [user, router])

    useEffect(() => {
        dispatch(setUserPermission("editable"));
    }, [dispatch])

    const handleSave = useCallback(async() => {
        if (dirtyState !== "dirty") return;

        console.log("dirtyCards in time", dirtyCards);
        const idSet = new Set([...dirtyCards]);
        // console.log("idSet", idSet);
        const data = allCards.filter(item => idSet.has(item.id));
        if (data.length === 0) return;
        // console.log("data", data);

        // 測試用
        // dispatch(setDirtyState("clear"))
        // dispatch(clearDirtyCardId());
        // console.log("先不存")
        // return;

        const response = await handleUpdateCard(data);
        // console.log("存檔", response);
        const resData = JSON.parse(response.data);
        const failedData = response.failedData && JSON.parse(response.failedData);
        if (failedData) console.log("failedData", failedData);
        // dispatch(updateCards(JSON.parse(response.data)));

        dispatch(setDirtyState("clear"));
        dispatch(clearDirtyCardId());
    }, [allCards, dirtyCards, dirtyState, dispatch])
    // 有修改的話 5 秒存檔一次
    const setIsDebounceActive = useDebounce({ callback: handleSave, time: 5000 });
    
    // 儲存 tags
    useEffect(() => {
        if (!allCards) return;
        const tags: string[] = allCards.reduce((pre: string[], curr: ICard) => [...pre, ...(curr.tags ?? [])], []);
        dispatch(setTags(tags));
    }, [allCards, dispatch])

    // 如果點選卡片要切換網址，以下為了按上一頁時也能抓到資料
    // useEffect(() => {
    //     const cardId = pathname.split("/").at(-1);
    //     dispatch(selectCard(allCards.find(item => item.id === `card_${cardId}`) || null));
    // }, [allCards, dispatch, pathname])

    return (
        <main className="mainpage flex h-svh w-full flex-col items-center justify-between overflow-hidden">
            <ControlBar
                canUserEdit={true}
                isCardLock={!selectedCard?.isLock}
                canUndo={undoList.length > 0}
                canRedo={redoList.length > 0}
                handleUndo={() => {
                    // console.log("現在回復 boardElement", selectedCard.boardElement)
                    const lastStep = undoList.pop();
                    // console.log("現在回復 lastStep", lastStep)
                    if (typeof lastStep === "undefined") return;

                    let newBoardElements: IBoardElement[] = [];
                    if ("added" in lastStep) {
                        // console.log("added")
                        redoList.push({ added: lastStep.added });
                        // 原本被增加的 undo 要刪除
                        newBoardElements = selectedCard.boardElement.filter(item => item.id !== lastStep.added.id);
                    }
                    else if ("deleted" in lastStep) {
                        // console.log("deleted")
                        redoList.push({ deleted: lastStep.deleted, index: lastStep.index });
                        // 原本被刪除的 undo 要加回原本的 index
                        newBoardElements = [...selectedCard.boardElement.slice(0, lastStep.index), lastStep.deleted, ...selectedCard.boardElement.slice(lastStep.index, -1)]
                    }
                    else if ("newData" in lastStep) {
                        redoList.push(lastStep);
                        // 被修改而已的話就用原資料覆蓋回去即可
                        newBoardElements = selectedCard.boardElement.map(item => {
                            if (item.id === lastStep.oldData.id) return lastStep.oldData;
                            return item;
                        })
                    }
                    else {
                        redoList.push(lastStep);
                        // 被改變 index 的話就放回原本 index
                        newBoardElements = changeIndex({ targetIdx: lastStep.oldIdx, originIdx: lastStep.newIdx, array: selectedCard.boardElement });
                    }
                    // console.log("newBoardElements", newBoardElements)

                    const updatedCard: ICard = {
                        ...selectedCard,
                        boardElement: newBoardElements
                    }
                    dispatch(updateCards([updatedCard]));
                    dispatch(selectCard(updatedCard));
                }}
                handleRedo={() => {
                    // console.log("現在重來", redoList)
                    const lastStep = redoList.pop();
                    // console.log("現在重來", lastStep)
                    if (!lastStep) return;
                    let newBoardElements: IBoardElement[] = [];
                    if ("added" in lastStep) {
                        undoList.push({ added: lastStep.added });
                        // 原本被增加的 redo 要加回最後一個
                        newBoardElements = [...selectedCard.boardElement, lastStep.added];
                    }
                    else if ("deleted" in lastStep) {
                        undoList.push({ deleted: lastStep.deleted, index: lastStep.index });
                        // 原本被刪除的 redo 要再刪除
                        newBoardElements = selectedCard.boardElement.filter(item => item.id !== lastStep.deleted.id);
                    }
                    else if ("newData" in lastStep) {
                        undoList.push(lastStep);
                        // 被修改而已的話就用新資料再覆蓋回去
                        newBoardElements = selectedCard.boardElement.map(item => {
                            if (item.id === lastStep.newData.id) return lastStep.newData;
                            return item;
                        })
                    }
                    else {
                        undoList.push(lastStep);
                        // 被改變 index 的話就再次放到新的 index
                        newBoardElements = changeIndex({ targetIdx: lastStep.newIdx, originIdx: lastStep.oldIdx, array: selectedCard.boardElement });
                    }

                    const updatedCard: ICard = {
                        ...selectedCard,
                        boardElement: newBoardElements
                    }
                    dispatch(updateCards([updatedCard]));
                    dispatch(selectCard(updatedCard));
                }}
                handleLockCard={() => {
                    const updatedCard: ICard = {
                        ...selectedCard,
                        isLock: !selectedCard.isLock
                    }
                    dispatch(updateCards([updatedCard]));
                    dispatch(selectCard(updatedCard));
                    dispatch(setDirtyState("dirty"));
                    dispatch(setDirtyCardId(selectedCard.id));
                    setIsDebounceActive(true);
                }}
            />

            <section className="hidden sm:flex flex-1 w-full h-full px-0 pt-0 relative items-center"
            >
                {!selectedCard && <p className="text-center w-full">{user ?
                    "請選擇一張卡片" :
                    <>
                        {"請先"}
                        <Link scroll={false} href={"./login"} className="border border-slate-400 px-1.5 py-1 rounded-md ml-1.5">登入</Link>
                    </>
                }</p>}
                {selectedCard && <>
                    <Board
                        handlePushStep={(step: StepType) => {
                            undoList.push(step);
                            redoList = [];
                        }}
                        elements={allCards.find(item => item.id === selectedCard.id)?.boardElement || []}
                        handleUpdateElementList={(allElement: IBoardElement[]) => {
                            // console.log("update allElement list", allElement)
                            const newCard: ICard = allCards.find(item => item.id === selectedCard.id) as ICard;
                            const updatedCard: ICard = {
                                ...newCard,
                                boardElement: allElement,
                                updatedAt: new Date().toISOString()
                            }
                            dispatch(updateCards([updatedCard]));
                            dispatch(selectCard(updatedCard));
                        }}
                        draggingBox={draggingBox}
                        handleMouseUp={() => {
                            setDraggingBox("");
                        }}
                        handleSetDirty={() => {
                            dispatch(setDirtyState("dirty"))
                            dispatch(setDirtyCardId(selectedCard.id));
                            setIsDebounceActive(true);
                        }}
                        permission={user?.id === selectedCard.authorId ? "editable" : "none"}
                        draggingCard={draggingCard}
                        isCardLock={selectedCard.isLock}
                    />
                </>}
                <ControlPanel
                    isSelectingCard={selectedCard != null}
                    handleDrag={(type) => {
                        if (!selectedCard) return;
                        setDraggingBox(type);
                    }}
                />
            </section>

            <div className="card w-full h-full sm:h-fit relative sm:flex-grow-0 sm:flex-shrink-0">
                <CardList selectedCardId={selectedCard?.id}
                    handleSetSelectedCard={(id: string) => {
                        // console.log("id", id)
                        dispatch(selectCard(allCards.find(item => item.id === id) || null));
                        // window && window.history.pushState(null, 'cardId', `/card/${id.split("_").at(-1)}`);
                        // router.push(`/card/${id.split("_").at(-1)}`);
                        undoList = [];
                        redoList = [];
                    }}
                    handleDrag={(card: ICard) => {
                        if (!selectedCard) return;
                        setDraggingBox("card");
                        setDraggingCard(card);
                    }}
                />
            </div>
        </main>
    );
}

