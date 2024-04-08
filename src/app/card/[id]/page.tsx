"use client"
// import { handleGoogleLogin } from "@/api/firebase_admin";
import { IBoardElement, ICard, boxType } from "@/type/card";
import React, { RefObject, useEffect, useRef, useState, DragEvent, use } from "react";
// import { firebaseConfig } from "@/api/firebase";
import * as firebase from "firebase/app";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { handleGetCard, handleAddCard, handleUpdateCard, handleGetCards, handleDeleteCard } from "@/api/card";
import { IState, store } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { addCard, clearDirtyCardId, selectCard, setCards, setDirtyCardId, setDirtyState, setTags, updateCards } from "@/redux/reducers/card";
import Board from "@/components/Board";
import ControlPanel from "@/components/ControlPanel";
import ElementModal from "@/components/modal/BoardElements";
import CardList from "@/components/CardList";
import ControlBar from "@/components/ControlBar";
import useWindowSize from "@/hooks/useWindowSize";
import { setUserPermission } from "@/redux/reducers/user";
import { StepType } from "@/app/page";
import { changeIndex } from "@/utils/utils";
// import login from "@/api/user";

let undoList: Array<StepType> = [];
let redoList: Array<StepType> = [];

export default function CardPage() {
    // TODO: 要驗證有沒有閱覽/編輯權限
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const user = useSelector((state: IState) => state.user);
    const allCards = useSelector((state: IState) => state.card);
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const [draggingBox, setDraggingBox] = useState<boxType>("");
    const dirtyCards = useSelector((state: IState) => state.dirtyCardsId);
    const dirtyState = useSelector((state: IState) => state.dirtyState);
    // const [userPermission, setUserPermission] = useState<"editable" | "readable" | "none">("readable");
    const userPermission = useSelector((state: IState) => state.userPermission);
    const { width: windowWidth } = useWindowSize();
    const boardRef = useRef<HTMLDivElement>(null);
    const [borderSize, setBorderSize] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    // console.log("session", session)
    // console.log("status", status)
    // console.log("user", user)
    // console.log("openModalType", openModalType)
    // console.log("allCards card page", allCards)
    // console.log("allCards card selectedCard", selectedCard)
    // console.log("card access: ", selectedCard.visibility)
    // console.log("userPermission", userPermission)

    useEffect(() => {
        const cardId = pathname.split("/").at(-1);
        async function handleCard(cardId: string) {
            const response = await handleGetCard(`card_${cardId}`);
            // console.log("res", response)
            // console.log("user", user)
            // if (response.status === "FAIL") return await handleCard(cardId);
            if (response.status === "FAIL") {
                router.push("/")
                return;
            }
            const data = JSON.parse(response.data) as ICard;
            // console.log("data", data)
            // return;

            // 閱讀權限閘門
            if (data.visibility === "private" && data.authorId !== user?.id) {
                router.push("/");
                return;
            }
            else if (data.visibility === "limited" && data.authorId !== user?.id && !data.userList.includes(user?.email ?? "")) {
                router.push("/");
                return;
            }
            // console.log("access")
            dispatch(selectCard(data));

            // 如果是登入的 user 就不要動原本的卡片資料，否則就帶入網址這筆
            if (!user) {
                dispatch(setCards([data]));
            }

            // 編輯權限閘門
            if (data.authorId === user?.id || data.editability === "open") dispatch(setUserPermission("editable"));
            else if (data.editability === "limited" && data.userList.includes(user?.email ?? "")) dispatch(setUserPermission("editable"));
        }
        if (!cardId) return;
        handleCard(cardId);
    }, [dispatch, pathname, router, user])

    // 有修改的話 5 秒存檔一次
    useEffect(() => {
        let time: NodeJS.Timeout | null = null;
        if (dirtyState !== "dirty" || time) return;
        time = setInterval(async () => {
            const idSet = new Set([...dirtyCards]);
            const data = allCards.filter(item => idSet.has(item.id));
            if (data.length === 0) return;

            const response = await handleUpdateCard(data);
            // console.log("存檔", response);
            const resData = JSON.parse(response.data);
            const failedData = response.failedData && JSON.parse(response.failedData);
            if (failedData) console.log("failedData", failedData);
            // dispatch(updateCards(JSON.parse(response.data)));

            dispatch(setDirtyState("clear"))
            dispatch(clearDirtyCardId());
            if (time) clearInterval(time);
        }, 5000);
        return () => {
            if (time) clearInterval(time);
        }
    }, [allCards, dirtyCards, dirtyState, dispatch]);

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
        <main className="flex h-svh flex-col items-center justify-between overflow-hidden">
            {(windowWidth && windowWidth < 640) && <ElementModal permission={userPermission} />}

            <ControlBar
                canEdit={userPermission === "editable"}
                canUndo={undoList.length > 0}
                canRedo={redoList.length > 0}
                handleUndo={() => {
                    // console.log("現在回復 boardElement", selectedCard.boardElement)
                    const lastStep = undoList.pop();
                    // console.log("現在回復 lastStep", lastStep)
                    if (typeof lastStep === "undefined") return;

                    let newBoardElements: IBoardElement[] = [];
                    if ("added" in lastStep) {
                        console.log("added")
                        redoList.push({ added: lastStep.added });
                        // 原本被增加的 undo 要刪除
                        newBoardElements = selectedCard.boardElement.filter(item => item.id !== lastStep.added.id);
                    }
                    else if ("deleted" in lastStep) {
                        console.log("deleted")
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
                }} />
            <section className="hidden sm:flex flex-1 w-full h-full px-0 pt-0 relative items-center"
            >
                {selectedCard && <>
                    <Board
                        handlePushStep={(step: StepType) => {
                            undoList.push(step);
                            redoList = [];
                        }}
                        elements={allCards.find(item => item.id === selectedCard.id)?.boardElement ?? selectedCard.boardElement}
                        handleUpdateElementList={(allElement: IBoardElement[]) => {
                            // console.log("update allElement list", allElement)
                            const newCard: ICard = allCards.find(item => item.id === selectedCard.id) as ICard;
                            const updatedCard: ICard = {
                                ...newCard,
                                boardElement: allElement
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
                        }}
                        permission={userPermission}
                    />
                </>}
                {userPermission === "editable" && <ControlPanel
                    isSelectingCard={selectedCard != null}
                    handleDrag={(type) => {
                        if (!selectedCard) return;
                        setDraggingBox(type);
                    }}
                />}
            </section>
            <div className="w-full h-full sm:h-auto relative">
                {(windowWidth && windowWidth >= 640) && <CardList selectedCardId={selectedCard?.id}
                    handleSetSelectedCard={(id: string) => {
                        // console.log("id", id)
                        dispatch(selectCard(allCards.find(item => item.id === id) || null));
                        window && window.history.pushState(null, 'cardId', `/card/${id.split("_").at(-1)}`);
                    }}
                    handleDrag={() => {
                        if (!selectedCard) return;
                        setDraggingBox("card");
                    }}
                />}
            </div>
        </main>
    )
}