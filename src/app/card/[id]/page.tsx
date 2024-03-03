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
import { addCard, clearDirtyCardId, selectCard, setCards, setDirtyCardId, setDirtyState, updateCards } from "@/redux/reducers/card";
import Board from "@/components/Board";
import ControlPanel from "@/components/ControlPanel";
import ElementModal from "@/components/modal/BoardElements";
import CardList from "@/components/CardList";
import ControlBar from "@/components/ControlBar";
import useWindowSize from "@/hooks/useWindowSize";
// import login from "@/api/user";

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
    const { type: openModalType, data: modalProp } = useSelector((state: IState) => state.modal)
    const [userPermission, setUserPermission] = useState<"editable" | "readable" | "none">("readable");
    const { width: windowWidth } = useWindowSize();
    // console.log("session", session)
    // console.log("status", status)
    // console.log("user", user)
    // console.log("openModalType", openModalType)
    // console.log("allCards card page", allCards)
    // console.log("allCards card selectedCard", selectedCard)
    // console.log("card access: ", selectedCard.visibility)

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
            else if (data.visibility === "limited" && data.authorId !== user?.id && !data.userId.includes(user?.email ?? "")) {
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
            if (data.authorId === user?.id || data.editability === "open") setUserPermission("editable");
            else if (data.editability === "limited" && data.userId.includes(user?.email ?? "")) setUserPermission("editable");
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

    // 如果點選卡片要切換網址，以下為了按上一頁時也能抓到資料
    // useEffect(() => {
    //     const cardId = pathname.split("/").at(-1);
    //     dispatch(selectCard(allCards.find(item => item.id === `card_${cardId}`) || null));
    // }, [allCards, dispatch, pathname])

    return (
        <main className="flex h-screen flex-col items-center justify-between overflow-hidden">
            {(windowWidth && windowWidth < 640) && <ElementModal permission={userPermission} />}

            <ControlBar />
            <section className="hidden sm:flex w-full flex-1 px-0 pt-0 relative items-center">
                {!selectedCard && <p className="text-center w-full">{status !== "authenticated" ? "請先登入" : "請選擇一張卡片"}</p>}
                {selectedCard && <>

                    <main className="w-full h-full overflow-scroll bg-white/85 ">
                        <Board elements={allCards.find(item => item.id === selectedCard.id)?.boardElement ?? selectedCard.boardElement}
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
                    </main>
                </>}
                {userPermission === "editable" && <ControlPanel
                    handleDrag={(type) => {
                        if (!selectedCard) return;
                        setDraggingBox(type);
                    }}
                />}
            </section>
            <div className="w-full h-full sm:h-auto relative">
                {dirtyCards.length > 0 && <p className="cursor-default absolute top-1.5 left-2 text-sm text-slate-500 z-20">正在儲存...</p>}
                {dirtyState === "clear" && <p className={`cursor-default absolute top-1.5 left-2 animate-hide opacity-0 text-sm text-slate-500 z-20`}>已成功儲存</p>}

                {(windowWidth && windowWidth >= 640) && <CardList selectedCardId={selectedCard?.id}
                    handleSetSelectedCard={(id: string) => {
                        // console.log("id", id)
                        // dispatch(selectCard(allCards.find(item => item.id === id) || null));
                        window && window.history.pushState(null, 'cardId', `/card/${id.split("_").at(-1)}`);
                    }}
                />}
            </div>
        </main>
    )
}