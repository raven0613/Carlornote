"use client"
import Card from "@/components/Card";
import Board from "@/components/Board";
import { Suspense, useEffect, useState } from "react";
import { IBoardElement, ICard, boxType } from "@/type/card";
import ControlPanel from "@/components/ControlPanel";
import { handleGetCard, handleAddCard, handleUpdateCard, handleGetCards, handleDeleteCard } from "@/api/card";
import Loading from "@/components/loading";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { IState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { handleGetUserByEmail } from "@/api/user";
import { removeUser } from "@/redux/reducers/user";
import { addCard, removeCard, setCards, updateCards } from "@/redux/reducers/card";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function Home() {
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [draggingBox, setDraggingBox] = useState<boxType>("");
  const [dirtyState, setDirtyState] = useState<"dirty" | "clear" | "none">("none");
  const [dirtyCards, setDirtyCards] = useState<string[]>([]);
  const dispatch = useDispatch();
  const user = useSelector((state: IState) => state.user);
  const allCards = useSelector((state: IState) => state.card);
  const router = useRouter();

  // console.log("user", user)
  // console.log("session", session)

  useEffect(() => {
    if (!user) return;
    async function handleFetchCard() {
      const response = await handleGetCards(user?.id || "");
      if (response.status === "FAIL") return;
      dispatch(setCards(JSON.parse(response.data)));
      // console.log("get data", JSON.parse(data.data))
    }
    handleFetchCard();
  }, [dispatch, user]);

  // console.log("allCard", allCard)
  // console.log("dirtyState", dirtyState)
  // console.log("dirtyCards", dirtyCards)
  // console.log("allCards", allCards)
  // console.log("selectedCardId", selectedCardId)

  // 有修改的話 5 秒存檔一次
  useEffect(() => {
    let time: NodeJS.Timeout | null = null;
    if (dirtyState !== "dirty" || time) return;
    time = setInterval(async () => {
      if (!selectedCardId) return;
      const idSet = new Set([...dirtyCards]);
      const data = allCards.filter(item => idSet.has(item.id));
      if (data.length === 0) return;

      const response = await handleUpdateCard(data);
      console.log("存檔", response);
      const resData = JSON.parse(response.data);
      const failedData = response.failedData && JSON.parse(response.failedData);
      if (failedData) console.log("failedData", failedData);

      // dispatch(updateCards(JSON.parse(response.data)));
      setDirtyState("clear");
      setDirtyCards([]);
      if (time) clearInterval(time);
    }, 5000);
    return () => {
      if (time) clearInterval(time);
    }
  }, [allCards, dirtyCards, dirtyState, selectedCardId]);

  return (
    <main className="flex h-screen flex-col gap-2 items-center justify-between overflow-hidden">
      <Header />
      <section className="w-full h-full px-16 pt-16 relative flex items-center">
        {dirtyCards.length > 0 && <p className="absolute top-10 left-16">改動尚未儲存，請勿離開本頁</p>}
        {dirtyState === "clear" && <p className={`absolute top-10 left-16 animate-hide opacity-0`}>已儲存全部改動</p>}

        {!selectedCardId && <p className="text-center w-full">{user ? "請選擇一張卡片" : "請先登入"}</p>}
        {selectedCardId && <>
          <main className="w-full h-full border border-slate-500 overflow-hidden">
            <Board elements={allCards.find(item => item.id === selectedCardId)?.boardElement || []}
              handleUpdateElementList={(allElement) => {
                const selectedCard: ICard = allCards.find(item => item.id === selectedCardId) as ICard;
                const updatedCard: ICard = {
                  ...selectedCard,
                  boardElement: allElement
                }
                dispatch(updateCards([updatedCard]));
              }}
              handleUpdateElement={(data) => {
                const selectedCard: ICard = allCards.find(item => item.id === selectedCardId) as ICard;
                const updatedCard: ICard = {
                  ...selectedCard,
                  boardElement: selectedCard.boardElement.map(ele => {
                    if (ele.id === data.id) return data;
                    return ele;
                  })
                }
                dispatch(updateCards([updatedCard]));
              }}
              draggingBox={draggingBox}
              handleMouseUp={() => {
                setDraggingBox("");
              }}
              handleSetDirty={() => {
                setDirtyState("dirty");
                setDirtyCards(pre => {
                  const set = new Set([...pre]);
                  set.add(selectedCardId);
                  return Array.from(set);
                });
              }}
            />
          </main>
        </>}
        <ControlPanel
          handleDrag={(type) => {
            if (!selectedCardId) return;
            setDraggingBox(type);
          }}
        />
      </section>
      <section className="w-full h-40 my-5 flex items-center justify-center relative"
        onClick={() => {
          setSelectedCardId("");
        }}
      >
        <button type="button" className="w-16 h-16 bg-slate-400 rounded-full absolute left-10 text-white font-semibold text-3xl"
          onClick={async () => {
            // 之後再新增公開匿名卡片
            if (!user) return;
            const response = await handleAddCard({
              id: "",
              authorId: user.id,
              boardElement: [],
              userId: [user.id],
              visibility: "private",
              createdAt: new Date().toUTCString(),
              updatedAt: new Date().toUTCString(),
            });
            if (response.status === "FAIL") return;
            const card = JSON.parse(response.data) as ICard;
            dispatch(addCard(card));
            setSelectedCardId(card.id);
          }}
        >+</button>
        <Suspense fallback={<>等等等</>}>
          {/* 試試看用 server component 裝 cards */}
          {allCards && allCards.map(item =>
            <Card key={item.id}
              isSelected={selectedCardId === item.id}
              handleClick={() => {
                setSelectedCardId(item.id);
                setDirtyState("none");
              }}
              handleDelete={async () => {
                const response = await handleDeleteCard(selectedCardId);
                if (response.status === "FAIL") return;
                dispatch(removeCard(selectedCardId));
              }}
              handleShare={async () => {
                const updatedData = [{ ...item, visibility: "public" }] as ICard[];
                const response = await handleUpdateCard(updatedData);
                // console.log("response", response)
                if (response.status === "FAIL") return false;
                // console.log("data", JSON.parse(response.data))

                dispatch(updateCards(updatedData));
                const url = process.env.NODE_ENV === "production" ? "https://deck-crafter.vercel.app/" : "http://localhost:3000/";
                navigator.clipboard.writeText(`${url}card/${item.id.split("_")[1]}`);
                return true;
              }}
            />
          )}
        </Suspense>
      </section>
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