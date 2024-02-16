"use client"
import Card from "@/app/components/Card";
import Board from "@/app/components/Board";
import { useEffect, useState } from "react";
import { IBoardElement, ICard, boxType } from "@/type/card";
import ControlPanel from "@/app/components/ControlPanel";
import { handleGetCard, handleAddCard, handleUpdateCard, handleGetCards } from "@/api/card";

export default function Home() {
  const [allCard, setAllCard] = useState<ICard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [draggingBox, setDraggingBox] = useState<boxType>("");
  const [dirtyState, setDirtyState] = useState<"dirty" | "clear" | "none">("none");
  const [dirtyCards, setDirtyCards] = useState<string[]>([]);

  useEffect(() => {
    async function handleFetchCard() {
      const data = await handleGetCards()
      if (!data.data) return;
      setAllCard(JSON.parse(data.data));
      // console.log("get data", JSON.parse(data.data))
    }
    handleFetchCard();
  }, [])
  // console.log("allCard", allCard)
  console.log("dirtyState", dirtyState)
  console.log("dirtyCards", dirtyCards)

  useEffect(() => {
    let time: NodeJS.Timeout | null = null;
    if (dirtyState !== "dirty" || time) return;
    time = setInterval(async () => {
      if (!selectedCardId) return;
      // const data = allCard.find(item => item.id === selectedCardId);
      const idSet = new Set([...dirtyCards]);
      const data = allCard.filter(item => idSet.has(item.id));
      // if (!data) return;
      if (data.length === 0) return;

      const response = await handleUpdateCard(data);
      console.log("存檔", response);
      // if (response.status !== "SUCCESS" || !response.data) return;
      const resData = JSON.parse(response.data);
      const failedData = response.failedData && JSON.parse(response.failedData);
      if (failedData) console.log("failedData", failedData);

      setAllCard(pre => pre.map(item => {
        if (item.id === resData.id) return resData;
        return item;
      }));
      setDirtyState("clear");
      setDirtyCards([]);
      if (time) clearInterval(time);
    }, 5000);
    return () => {
      if (time) clearInterval(time);
    }
  }, [allCard, dirtyCards, dirtyState, selectedCardId])

  // useEffect(() => {
  //   async function handleFetchCard() {
  //     const data = await handleAddCard({
  //       id: "", userId: null, boardElement: [
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
  //       ]
  //     })
  //     console.log("post data", data)
  //   }
  //   handleFetchCard();
  // }, [])

  return (
    <main className="flex h-screen flex-col gap-2 items-center justify-between overflow-hidden">
      <section className="w-full h-full px-16 pt-8 relative flex items-center">
        {dirtyCards.length > 0 && <p className="absolute top-2 left-16">改動尚未儲存，請勿離開本頁</p>}
        <p className={`absolute top-2 left-16 ${dirtyState === "clear" ? "opacity-100" : "opacity-0"}`}>已儲存全部改動</p>

        {!selectedCardId && <p className="text-center w-full">請選擇一張卡片</p>}
        {selectedCardId && <Board elements={allCard.find(item => item.id === selectedCardId)?.boardElement || []}
          handleUpdateElementList={(allElement) => {
            setAllCard(pre => pre.map(item => {
              if (item.id === selectedCardId) return { ...item, boardElement: allElement };
              return item;
            }))
          }}
          handleUpdateElement={(data) => {
            setAllCard(pre => pre.map(item => {
              if (item.id === selectedCardId) return {
                ...item,
                boardElement: item.boardElement.map(ele => {
                  if (ele.id === data.id) return data;
                  return ele;
                })
              };
              return item;
            }))
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
        />}
        <ControlPanel
          handleDrag={(type) => {
            setDraggingBox(type);
          }}
        />
      </section>
      <section className="w-full h-auto my-5 flex items-center justify-center" 
        onClick={() => {
          setSelectedCardId("");
        }}
      >
        {allCard && allCard.map(item =>
          <Card key={item.id}
            isSelected={selectedCardId === item.id}
            handleClick={() => {
              setSelectedCardId(item.id);
              setDirtyState("none")
            }}
          />
        )}
      </section>
    </main>
  );
}

let cards: ICard[] = [
  {
    id: "card_001",
    userId: [],
    boardElement: [
      {
        id: "element_001",
        type: "text",
        name: "",
        content: "第一張卡第1個text",
        width: 250,
        height: 100,
        rotation: 40,
        left: 500,
        top: 300,
        radius: 0
      }, {
        id: "element_002",
        type: "text",
        name: "",
        content: "第一張卡第2個text",
        width: 250,
        height: 100,
        rotation: 20,
        left: 200,
        top: 100,
        radius: 0
      }
    ]
  }, {
    id: "card_002",
    userId: [],
    boardElement: [
      {
        id: "element_001",
        type: "text",
        name: "",
        content: "第二張卡第1個text",
        width: 250,
        height: 100,
        rotation: 20,
        left: 500,
        top: 300,
        radius: 0
      }
    ]
  }, {
    id: "card_003",
    userId: [],
    boardElement: [
      {
        id: "element_001",
        type: "image",
        name: "element_001",
        content: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
        width: 250,
        height: 100,
        rotation: 20,
        left: 500,
        top: 300,
        radius: 0
      }, {
        id: "element_002",
        type: "image",
        name: "element_002",
        content: "https://media.istockphoto.com/id/635905252/photo/milky-way-and-silhouette-of-a-standing-man-near-river.jpg?s=612x612&w=0&k=20&c=q9bB5WIsk1l5Xq7SNCu3VtqAbEqFDY_Y1T67qw_Qy80=",
        width: 300,
        height: 100,
        rotation: -20,
        left: 20,
        top: 250,
        radius: 0
      }, {
        id: "element_003",
        type: "image",
        name: "element_003",
        content: "https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bG9va2luZ3xlbnwwfHwwfHx8MA%3D%3D",
        width: 250,
        height: 500,
        rotation: 0,
        left: 700,
        top: 150,
        radius: 0
      },
      {
        id: "element_004",
        type: "image",
        name: "element_004",
        content: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-james-wheeler-414612.jpg&fm=jpg",
        width: 250,
        height: 100,
        rotation: 0,
        left: 600,
        top: 150,
        radius: 0
      },
      {
        id: "element_005",
        type: "image",
        name: "element_005",
        content: "https://statusneo.com/wp-content/uploads/2023/02/MicrosoftTeams-image551ad57e01403f080a9df51975ac40b6efba82553c323a742b42b1c71c1e45f1.jpg",
        width: 250,
        height: 100,
        rotation: 0,
        left: 300,
        top: 150,
        radius: 0
      },
      {
        id: "element_006",
        type: "image",
        name: "element_006",
        content: "https://www.searchenginejournal.com/wp-content/uploads/2022/06/image-search-1600-x-840-px-62c6dc4ff1eee-sej.png",
        width: 250,
        height: 100,
        rotation: 0,
        left: 100,
        top: 150,
        radius: 0
      }, {
        id: "element_007",
        type: "image",
        name: "element_007",
        content: "https://cc-prod.scene7.com/is/image/CCProdAuthor/adobe-firefly-marquee-text-to-image-0-desktop-1000x1000?$pjpeg$&jpegSize=300&wid=1000",
        width: 250,
        height: 100,
        rotation: 0,
        left: 100,
        top: 200,
        radius: 0
      }
    ]
  },
  {
    id: "card_004",
    userId: [],
    boardElement: [
      {
        id: "element_001",
        type: "text",
        name: "",
        content: "第一張卡第1個text",
        width: 250,
        height: 100,
        rotation: 40,
        left: 500,
        top: 300,
        radius: 0
      }, {
        id: "element_002",
        type: "text",
        name: "",
        content: "第一張卡第2個text",
        width: 250,
        height: 100,
        rotation: 20,
        left: 200,
        top: 100,
        radius: 0
      }
    ]
  },
  {
    id: "card_005",
    userId: [],
    boardElement: [
      {
        id: "element_001",
        type: "text",
        name: "",
        content: "第一張卡第1個text",
        width: 250,
        height: 100,
        rotation: 40,
        left: 500,
        top: 300,
        radius: 0
      }, {
        id: "element_002",
        type: "text",
        name: "",
        content: "第一張卡第2個text",
        width: 250,
        height: 100,
        rotation: 20,
        left: 200,
        top: 100,
        radius: 0
      }
    ]
  },
  {
    id: "card_006",
    userId: [],
    boardElement: [
      {
        id: "element_001",
        type: "text",
        name: "",
        content: "第一張卡第1個text",
        width: 250,
        height: 100,
        rotation: 40,
        left: 500,
        top: 300,
        radius: 0
      }, {
        id: "element_002",
        type: "text",
        name: "",
        content: "第一張卡第2個text",
        width: 250,
        height: 100,
        rotation: 20,
        left: 200,
        top: 100,
        radius: 0
      }
    ]
  },
  {
    id: "card_007",
    userId: [],
    boardElement: [
      {
        id: "element_001",
        type: "text",
        name: "",
        content: "第一張卡第1個text",
        width: 250,
        height: 100,
        rotation: 40,
        left: 500,
        top: 300,
        radius: 0
      }, {
        id: "element_002",
        type: "text",
        name: "",
        content: "第一張卡第2個text",
        width: 250,
        height: 100,
        rotation: 20,
        left: 200,
        top: 100,
        radius: 0
      }
    ]
  }
]
