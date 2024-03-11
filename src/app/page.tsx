"use client"
import Board from "@/components/Board";
import { useEffect, useRef, useState } from "react";
import { IBoardElement, ICard, boxType } from "@/type/card";
import ControlPanel from "@/components/ControlPanel";
import { handleUpdateCard } from "@/api/card";
import { signOut, useSession } from "next-auth/react";
import { IState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { clearDirtyCardId, selectCard, setDirtyCardId, setDirtyState, updateCards } from "@/redux/reducers/card";
import CardList from "@/components/CardList";
import Popup from "@/components/Popup";
import { setUserPermission } from "@/redux/reducers/user";
import ControlBar from "@/components/ControlBar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


export default function Home() {
    const { data: session, status } = useSession();
    const [draggingBox, setDraggingBox] = useState<boxType>("");
    const dispatch = useDispatch();
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const allCards = useSelector((state: IState) => state.card);
    const dirtyCards = useSelector((state: IState) => state.dirtyCardsId);
    const dirtyState = useSelector((state: IState) => state.dirtyState);

    useEffect(() => {
        dispatch(setUserPermission("editable"));
    }, [dispatch])
    // console.log("wheelPx", wheelPx)
    // console.log("user", user)
    // console.log("session", session)

    // console.log("allCards page", allCards)
    // console.log("dirtyState", dirtyState)
    // console.log("dirtyCards", dirtyCards)
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

    // 如果點選卡片要切換網址，以下為了按上一頁時也能抓到資料
    // useEffect(() => {
    //     const cardId = pathname.split("/").at(-1);
    //     dispatch(selectCard(allCards.find(item => item.id === `card_${cardId}`) || null));
    // }, [allCards, dispatch, pathname])

    return (
        <main className="flex h-svh w-full flex-col items-center justify-between overflow-hidden">
            <ControlBar />

            <section className="hidden sm:flex flex-1 w-full h-full px-0 pt-0 relative items-center"
            >
                {!selectedCard && <p className="text-center w-full">{status !== "authenticated" ?
                    <>
                        {"請先"}
                        <Link scroll={false} href={"./login"} className="border border-slate-400 px-1.5 py-1 rounded-md ml-1.5">登入</Link>
                    </>
                    : "請選擇一張卡片"}</p>}
                {selectedCard && <>
                    <Board elements={allCards.find(item => item.id === selectedCard.id)?.boardElement || []}
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
                        permission={status === "authenticated" ? "editable" : "none"}
                    />
                </>}
                <ControlPanel
                    handleDrag={(type) => {
                        if (!selectedCard) return;
                        setDraggingBox(type);
                    }}
                />
            </section>

            <div className="w-full h-full sm:h-fit relative sm:flex-grow-0 sm:flex-shrink-0">
                {dirtyCards.length > 0 && <p className="cursor-default absolute top-1.5 left-2 text-sm text-slate-500 z-20">正在儲存...</p>}
                {dirtyState === "clear" && <p className={`cursor-default absolute top-1.5 left-2 animate-hide opacity-0 text-sm text-slate-500 z-20`}>已成功儲存</p>}
                <CardList selectedCardId={selectedCard?.id}
                    handleSetSelectedCard={(id: string) => {
                        // console.log("id", id)
                        dispatch(selectCard(allCards.find(item => item.id === id) || null));
                        // window && window.history.pushState(null, 'cardId', `/card/${id.split("_").at(-1)}`);
                        // router.push(`/card/${id.split("_").at(-1)}`);
                    }}
                />
            </div>
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


