import React, { useEffect, useRef, useState } from "react";
import useCheckTabVisibility from "./useCheckTabVisibility";
import { handleGetCards } from "@/api/card";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "@/redux/store";
import { closeModal, openModal } from "@/redux/reducers/modal";
import { setCards } from "@/redux/reducers/card";
import { ICard } from "@/type/card";

interface IUseCheckLastUpdate {
    handleLock: (isLock: boolean) => void;
}

const checkTime = 600000;

export default function useCheckLastUpdate({ handleLock }: IUseCheckLastUpdate) {
    const dispatch = useDispatch();
    const user = useSelector((state: IState) => state.user);
    const allCards = useSelector((state: IState) => state.card);
    const allCardsRef = useRef(allCards);
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const selectedCardRef = useRef(selectedCard);
    const shouldFetchRef = useRef(false);
    const isCurrentTab = useCheckTabVisibility();
    const [isMouseOut, setIsMouseOut] = useState(false);

    // 當在不同地方開著兩個視窗的時候，視窗A有更新，視窗B在閒置10分鐘後就要 fetch 資料檢查所有資料的 updatedAt 是否相同，否的話即更新所有 card 資料
    // 必須用 ref 來裝，因為如果用 allCards 在 dependency 裡面會造成最後 update allCards 的時候又啟動一次 effect function
    useEffect(() => {
        allCardsRef.current = allCards;
    }, [allCards])
    useEffect(() => {
        selectedCardRef.current = selectedCard;
    }, [selectedCard])
    useEffect(() => {
        // console.log("isCurrentTab", isCurrentTab)
        // console.log("shouldFetchRef", shouldFetchRef.current)
        if (isCurrentTab && !isMouseOut && shouldFetchRef.current) {
            handleLock(true);
            async function fetchCards() {
                const response = await handleGetCards(user?.id ?? "");
                if (response.status === "FAIL" || !response.data) return;
                const data = JSON.parse(response.data);
                // console.log(data)
                console.log("fetch card data")
                // 如果本卡片有更新就跳視窗說請更新卡片
                // 如果更新的是別的卡片就默默更新
                const incomingCardsMap = new Map();
                data.forEach((card: ICard) => {
                    incomingCardsMap.set(card.id, card);
                })
                const changedCardSet = new Set();
                allCardsRef.current.forEach((card: ICard) => {
                    const incomingCard = incomingCardsMap.get(card.id);
                    const incomingLastUpdate = new Date(incomingCard.updatedAt).getTime();
                    const originalLastUpdate = new Date(card.updatedAt).getTime();
                    if (incomingLastUpdate > originalLastUpdate) {
                        changedCardSet.add(card.id);
                    }
                });
                if (changedCardSet.has(selectedCardRef.current.id)) {
                    // 為了避免 updateCardWindow 疊加，必須先關掉原本的再開新的
                    dispatch(closeModal({ type: "updateCardWindow", props: {} }));
                    dispatch(openModal({
                        type: "updateCardWindow", props: {
                            handleConfirm: () => {
                                //更新所有卡片
                                dispatch(setCards(data));
                                dispatch(closeModal({ type: "updateCardWindow", props: {} }));
                                allCardsRef.current = data;
                            },
                            text: "卡片資料有更新，請點選確認以同步最新資料"
                        }
                    }));
                }
                else if (changedCardSet.size > 0) {
                    dispatch(setCards(data));
                    allCardsRef.current = data;
                }
                handleLock(false);
                shouldFetchRef.current = false
            }
            fetchCards();
        }

        let time: NodeJS.Timeout | null = null;
        if (!isCurrentTab) {
            time = setTimeout(() => {
                shouldFetchRef.current = true;
            }, checkTime)
        }

        function handleMouseEnter() {
            // console.log("mouse in")
            setIsMouseOut(false);
        }
        document.addEventListener("mouseenter", handleMouseEnter);
        function handleMouseLeave() {
            // console.log("mouse out")
            setIsMouseOut(true);
        }
        document.addEventListener("mouseleave", handleMouseLeave);
        if (isMouseOut) {
            // console.log('isMouseOut', isMouseOut)
            // 記住原本的滑鼠指標位置
            // 過10分鐘滑鼠指標都沒變的話就重新fetch
            time = setTimeout(() => {
                if (!isMouseOut) return;
                shouldFetchRef.current = true;
            }, checkTime)
        }

        return () => {
            if (time) clearTimeout(time);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        }
    }, [dispatch, isCurrentTab, user?.id, handleLock, isMouseOut])
}