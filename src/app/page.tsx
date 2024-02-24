"use client"
import Board from "@/components/Board";
import { useEffect, useState } from "react";
import { IBoardElement, ICard, boxType } from "@/type/card";
import ControlPanel from "@/components/ControlPanel";
import { handleUpdateCard } from "@/api/card";
import { useSession } from "next-auth/react";
import { IState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { clearDirtyCardId, selectCard, setDirtyCardId, setDirtyState, updateCards } from "@/redux/reducers/card";
import CardList from "@/components/CardList";

export default function Home() {
    const { data: session, status } = useSession();
    const [draggingBox, setDraggingBox] = useState<boxType>("");
    const dispatch = useDispatch();
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const allCards = useSelector((state: IState) => state.card);
    const dirtyCards = useSelector((state: IState) => state.dirtyCardsId);
    const dirtyState = useSelector((state: IState) => state.dirtyState);

    console.log("selectedCard", selectedCard)
    // console.log("wheelPx", wheelPx)
    // console.log("user", user)
    // console.log("session", session)

    // console.log("allCards page", allCards)
    console.log("dirtyState", dirtyState)
    console.log("dirtyCards", dirtyCards)
    // console.log("selectedCardId", selectedCardId)
    // console.log("selectedCard page", allCards.find(item => item.id === selectedCardId))

    // 有修改的話 5 秒存檔一次
    useEffect(() => {
        let time: NodeJS.Timeout | null = null;
        if (dirtyState !== "dirty" || time) return;
        time = setInterval(async () => {
            // console.log("dirtyCards in time", dirtyCards);
            const idSet = new Set([...dirtyCards]);
            // console.log("idSet", idSet);
            const data = allCards.filter(item => idSet.has(item.id));
            if (data.length === 0) return;

            const response = await handleUpdateCard(data);
            console.log("存檔", response);
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

    return (
        <main className="flex h-screen flex-col gap-2 items-center justify-between overflow-hidden">

            <section className="w-full h-full px-16 pt-16 relative flex items-center">
                {dirtyCards.length > 0 && <p className=" cursor-default absolute top-10 left-16">改動尚未儲存，請勿離開本頁</p>}
                {dirtyState === "clear" && <p className={`cursor-default absolute top-10 left-16 animate-hide opacity-0`}>已儲存全部改動</p>}

                {!selectedCard && <p className="text-center w-full">{status !== "authenticated" ? "請先登入" : "請選擇一張卡片"}</p>}
                {selectedCard && <>

                    <main className="w-full h-full border border-slate-500 overflow-hidden">
                        <Board elements={allCards.find(item => item.id === selectedCard.id)?.boardElement || []}
                            handleUpdateElementList={(allElement: IBoardElement[]) => {
                                console.log("update allElement list", allElement)
                                const newCard: ICard = allCards.find(item => item.id === selectedCard.id) as ICard;
                                const updatedCard: ICard = {
                                    ...newCard,
                                    boardElement: allElement
                                }
                                dispatch(updateCards([updatedCard]));
                                dispatch(selectCard(updatedCard));
                            }}
                            handleUpdateElement={(data: IBoardElement) => {
                                console.log("updatee element data", data)
                                const newCard: ICard = allCards.find(item => item.id === selectedCard.id) as ICard;
                                const updatedCard: ICard = {
                                    ...newCard,
                                    boardElement: newCard.boardElement.map(ele => {
                                        if (ele.id === data.id) return data;
                                        return ele;
                                    })
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
                        />
                    </main>
                </>}
                <ControlPanel
                    handleDrag={(type) => {
                        if (!selectedCard) return;
                        setDraggingBox(type);
                    }}
                />
            </section>
            <CardList selectedCardId={selectedCard?.id}
                handleSetSelectedCard={(id: string) => {
                    console.log("id", id)
                    dispatch(selectCard(allCards.find(item => item.id === id) || null));
                }}
            />
        </main>
    );
}

// useEffect(() => {
//   async function handleFetchCard() {
//     const data = await handleAddCard({
//       id: "",
//       authorId: user?.id ?? "",
//       boardElement: [
//         {
//           id: "element_50b366cd-81b5-4fd8-a034-c97fbcfbce0b",
//           type: "text",
//           name: "",
//           content: "初始text",
//           width: 250,
//           height: 100,
//           rotation: 40,
//           left: 500,
//           top: 300,
//           radius: 0
//         }
//       ],
//       userId: user ? [user.id] : [],
//       visibility: "private",
//       createdAt: new Date().toUTCString(),
//       updatedAt: new Date().toUTCString(),
//     })
//     console.log("post data", data)
//   }
//   handleFetchCard();
// }, [user])


