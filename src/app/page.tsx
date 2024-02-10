"use client"
import Image from "next/image";
import Card from "@/app/components/Card";
import Board from "@/app/components/Board";
import { useState } from "react";
import { IBoardElement, ICard, boxType } from "@/type/card";
import ControlPanel from "@/app/components/ControlPanel";

export default function Home() {
  const [allCard, setAllCard] = useState<ICard[]>(cards);
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [draggingBox, setDraggingBox] = useState<boxType>("");

  return (
    <main className="flex h-screen flex-col items-center justify-between overflow-hidden">
      <section className="w-full h-full border border-slate-700 px-16 py-8 relative">

        <Board elements={allCard.find(item => item.id === selectedCardId)?.boardElement || []}
          handleChangeIdx={(allElement) => {
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
        />
        <ControlPanel
          handleDrag={(type) => {
            setDraggingBox(type);
          }}
        />
      </section>
      <section className="w-full h-auto my-5 flex items-center justify-center">
        {cards && cards.map(item =>
          <Card key={item.id}

            isSelected={selectedCardId === item.id}
            handleClick={() => {
              setSelectedCardId(item.id);
            }}
          />
        )}
      </section>
    </main>
  );
}

// Authorization: Client-ID YOUR_CLIENT_ID
// id: 3bca2e4cdbf1b9d
// secret: bdc692ea7f980f990e4b1bbdaaceefe3cdc3ec379

let cards: ICard[] = [
  {
    id: "card_001",
    children: [],
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
        top: 300
      }, {
        id: "element_002",
        type: "text",
        name: "",
        content: "第一張卡第2個text",
        width: 250,
        height: 100,
        rotation: 20,
        left: 200,
        top: 100
      }
    ]
  }, {
    id: "card_002",
    children: [],
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
        top: 300
      }
    ]
  }, {
    id: "card_003",
    children: [],
    boardElement: [
      {
        id: "element_001",
        type: "text",
        name: "",
        content: "第三張卡第1個text",
        width: 250,
        height: 100,
        rotation: 20,
        left: 500,
        top: 300
      }, {
        id: "element_002",
        type: "text",
        name: "",
        content: "第三張卡第2個text",
        width: 300,
        height: 100,
        rotation: -20,
        left: 20,
        top: 250
      }, {
        id: "element_003",
        type: "text",
        name: "",
        content: "第三張卡第3個text",
        width: 250,
        height: 100,
        rotation: 0,
        left: 700,
        top: 150
      }
    ]
  }
]