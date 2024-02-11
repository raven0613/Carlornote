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
        top: 300,
        radius: 0
      }
    ]
  }, {
    id: "card_003",
    children: [],
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
        height: 100,
        rotation: 0,
        left: 700,
        top: 150,
        radius: 0
      },
      {
        id: "element_004",
        type: "image",
        name: "element_004",
        content: "https://lh3.googleusercontent.com/proxy/UKRatN0jfOtCo-zEeHdRyOKXbjwF6-I5ZtRGtbGeFKXT4oJt9YrbTlXI3qG1g9paXj1qaAOsuqH-Tcwu0cMR5NPiChCX43-C5p612kj-wS5S8UYIOl9H84oJBuyQVvl4y5W8yh7Zsm7YuolrDIo",
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
  }
]