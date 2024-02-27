import { handleAddCard, handleDeleteCard, handleUpdateCard, handleGetCards } from "@/api/card";
import Card, { CardWithHover } from "@/components/Card";
import useWindowSize from "@/hooks/useWindowSize";
import { addCard, removeCard, setCards, updateCards } from "@/redux/reducers/card";
import { openModal } from "@/redux/reducers/modal";
import { IState } from "@/redux/store";
import { ICard } from "@/type/card";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const showCardAmounts = 10;

function FakeCard() {
    return (
        <main className={`w-14 h-36 rounded-lg relative group hover:z-50 duration-200`}
        >
            <div className={`w-28 h-36 bg-zinc-00 rounded-lg duration-200 shadow-lg  
        grid grid-rows-5 absolute top-0 left-1/2 -translate-x-1/2`}></div>
        </main>
    )
}

function CardLoading() {
    const list = Array.from({ length: showCardAmounts });
    return list.map((_item, index) => (
        <FakeCard key={index} />
    ))
}

interface ICardList {
    selectedCardId: string;
    handleSetSelectedCard: (id: string) => void;

}

export default function CardList({ selectedCardId, handleSetSelectedCard }: ICardList) {
    const user = useSelector((state: IState) => state.user);
    const dispatch = useDispatch();
    const allCards = useSelector((state: IState) => state.card);
    const [wheelPx, setWheelPx] = useState(0);
    const [showCardAmounts, setSowCardAmounts] = useState(3);
    const [cardState, setCardState] = useState<"loading" | "ok" | "error">("loading");
    const [addCardState, setAddCardState] = useState<"loading" | "ok" | "error">("ok");
    const [cardLize, setCardSize] = useState<"hidden" | "sm" | "lg">("lg");
    const { width: windowWidth } = useWindowSize();

    useEffect(() => {
        if (!user) return;
        async function handleFetchCard() {
            const response = await handleGetCards(user?.id || "");
            if (response.status === "FAIL") return setCardState("error");
            setCardState("ok");
            dispatch(setCards(JSON.parse(response.data)));
            // console.log("get data", JSON.parse(data.data))
        }
        setCardState("loading");
        handleFetchCard();
    }, [dispatch, user]);

    useEffect(() => {
        if (!windowWidth) return;
        if (windowWidth <= 700) setSowCardAmounts(3);
        else if (windowWidth <= 900) setSowCardAmounts(5);
        else if (windowWidth <= 1000) setSowCardAmounts(7);
        else if (windowWidth <= 1100) setSowCardAmounts(10);
        else if (windowWidth <= 1200) setSowCardAmounts(12);
        else if (windowWidth <= 1400) setSowCardAmounts(15);
        else setSowCardAmounts(18);
    }, [windowWidth]);


    return (
        <>
            <section className={`w-full px-28 flex items-center justify-center relative
                border-t-slate-200/70
                ${cardLize === "lg"? "h-[10rem]" : `${ cardLize === "sm"? "h-[7rem]" : "h-[2rem]" }`}
                ${cardLize === "hidden"? "bg-[#f8f8f8] border-t-[1px]" : "border-t-[3px]"}
                duration-150
            `}
                onClick={() => {
                    handleSetSelectedCard("");
                }}
            >
                <button disabled={addCardState === "loading" || !user?.id} type="button" className={`w-16 h-16 bg-slate-200/80 rounded-full absolute left-10 text-slate-400 text-3xl font-light disabled:bg-slate-100 hover:scale-110 duration-150 ${cardLize === "hidden"? "opacity-0 pointer-events-none" : "opacity-100"}`}
                    onClick={async () => {
                        // 之後再新增公開匿名卡片
                        if (!user?.id) return;
                        setAddCardState("loading");
                        const response = await handleAddCard({
                            id: "",
                            authorId: user.id,
                            name: "",
                            boardElement: [],
                            userId: [user.id],
                            visibility: "private",
                            imageUrl: "",
                            createdAt: new Date().toUTCString(),
                            updatedAt: new Date().toUTCString(),
                        });
                        if (response.status === "FAIL") return setAddCardState("error");
                        const card = JSON.parse(response.data) as ICard;
                        dispatch(addCard(card));
                        setAddCardState("ok");
                        // 新增的卡片要被選取並且卡片欄位要顯示
                        handleSetSelectedCard(card.id);
                        if (allCards.length - showCardAmounts + 1 >= 0) setWheelPx(allCards.length - showCardAmounts + 1);
                        else setWheelPx(0);
                    }}
                >+</button>

                <div className={`w-auto h-full flex items-end ${cardLize === "lg"? "pb-4" : "pb-2"}`}
                    onWheel={(e) => {
                        // console.log(e.deltaX)
                        // console.log(e.deltaY)
                        if (e.deltaY > 0) setWheelPx(pre => {
                            if (pre + showCardAmounts >= allCards.length) return allCards.length - showCardAmounts;
                            return pre + 1
                        });
                        else setWheelPx(pre => {
                            if (pre <= 0) return 0;
                            return pre - 1
                        });
                    }}
                >
                    {cardState === "loading" && <CardLoading />}
                    {cardState === "error" && "Error"}
                    {(cardState === "ok" && allCards) &&
                        allCards.slice(
                            allCards.length <= showCardAmounts ? 0 : wheelPx,
                            allCards.length <= showCardAmounts ? allCards.length : wheelPx + showCardAmounts
                        )
                            .map((item) =>
                                <CardWithHover key={item.id}
                                    name={item.name}
                                    url={item.imageUrl}
                                    isSelected={selectedCardId === item.id}
                                    cardLize={cardLize}
                                    handleClick={() => {
                                        handleSetSelectedCard(item.id);
                                        // setDirtyState("none");
                                    }}
                                    handleClickEdit={() => {
                                        dispatch(openModal({ type: "card", data: item }));
                                    }}
                                />
                            )}
                </div>

                <div className={`absolute right-2 flex  text-xs gap-2 ${cardLize === "hidden"? "" : "flex-col"}`}>
                    <button className="w-5 h-5 bg-slate-200 rounded-full hover:scale-125 duration-150"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCardSize("lg");
                        }}
                    >L</button>
                    <button className="w-5 h-5 bg-slate-200 rounded-full hover:scale-125 duration-150 hover:shadow-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCardSize("sm");
                        }}
                    >S</button>
                    <button className="w-5 h-5 bg-slate-200 rounded-full hover:scale-125 duration-150 hover:shadow-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCardSize("hidden");
                        }}
                    ></button>
                </div>

            </section>
        </>
    )
}