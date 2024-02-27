import { handleAddCard, handleDeleteCard, handleUpdateCard, handleGetCards } from "@/api/card";
import Card, { CardWithHover } from "@/components/Card";
import useWindowSize from "@/hooks/useWindowSize";
import { addCard, removeCard, setCards, updateCards } from "@/redux/reducers/card";
import { openModal } from "@/redux/reducers/modal";
import { IState } from "@/redux/store";
import { ICard } from "@/type/card";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface IPointerFrame {
    selectedCardId: string;
    handleSetSelectedCard: (id: string) => void;

}

export default function PointerFrame({ selectedCardId, handleSetSelectedCard }: IPointerFrame) {
    const [clickedPoint, setClickedPoint] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 });
    
    return (
        <>
            <div className="bg-slate-400/30"></div>
        </>
    )
}