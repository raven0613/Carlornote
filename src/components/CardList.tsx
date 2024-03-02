import { handleAddCard, handleDeleteCard, handleUpdateCard, handleGetCards } from "@/api/card";
import Card, { CardWithHover } from "@/components/Card";
import useWindowSize from "@/hooks/useWindowSize";
import { addCard, removeCard, selectCard, setCards, updateCards } from "@/redux/reducers/card";
import { openModal } from "@/redux/reducers/modal";
import { IState } from "@/redux/store";
import { ICard } from "@/type/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    return (<div className="w-full h-full">
        {list.map((_item, index) => (
            <FakeCard key={index} />
        ))}
    </div>)
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
    const [showCardAmounts, setSowCardAmounts] = useState(5);
    const [cardState, setCardState] = useState<"loading" | "ok" | "error">("loading");
    const [addCardState, setAddCardState] = useState<"loading" | "ok" | "error">("ok");
    const [cardLize, setCardSize] = useState<"hidden" | "sm" | "lg">("lg");
    const { width: windowWidth } = useWindowSize();
    const pathname = usePathname();

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
        if (windowWidth <= 700) setSowCardAmounts(5);
        else if (windowWidth <= 900) setSowCardAmounts(7);
        else setSowCardAmounts(10);
    }, [windowWidth]);

    // 手機版 list 佔整頁
    return (
        <>
            <section className={`w-full h-full sm:px-28 flex sm:items-center sm:justify-center relative 
                
                border-t-slate-200/70
                ${cardLize === "lg" ? "sm:h-[10rem]" : `${cardLize === "sm" ? "sm:h-[7rem]" : "sm:h-[2rem]"}`}
                ${cardLize === "hidden" ? "bg-[#f8f8f8] border-t-[1px]" : "border-t-[3px]"}
                duration-150
            `}
                onClick={() => {
                    const cardId = pathname.split("/").at(-1);
                    if (cardId) return;
                    handleSetSelectedCard("");
                }}
            >
                {/* add button */}
                <button disabled={addCardState === "loading" || !user?.id} type="button"
                    className={`w-14 h-14 bg-slate-200 rounded-full absolute z-50 bottom-6 left-1/2 -translate-x-1/2 shadow-md shadow-black/30
                sm:left-10 sm:bottom-1/2 sm:translate-y-1/2 
                text-slate-400 text-3xl font-light disabled:bg-slate-100 hover:scale-110 duration-150 ${cardLize === "hidden" ? "opacity-0 pointer-events-none" : "opacity-100"}`}
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
                            editability: "close",
                            imageUrl: "",
                            createdAt: new Date().toUTCString(),
                            updatedAt: new Date().toUTCString(),
                        });
                        if (response.status === "FAIL") return setAddCardState("error");
                        const card = JSON.parse(response.data) as ICard;
                        dispatch(addCard(card));
                        setAddCardState("ok");
                        // 新增的卡片要被選取並且卡片欄位要顯示
                        dispatch(selectCard(card));
                        if (allCards.length - showCardAmounts + 1 >= 0) setWheelPx(allCards.length - showCardAmounts + 1);
                        else setWheelPx(0);
                    }}
                >+</button>

                {/* mobile */}
                <div className="fixed inset-x-0 top-16 bottom-0 pb-10
                grid grid-cols-1 min-[320px]:grid-cols-2 min-[560px]:grid-cols-3 auto-rows-[16rem] min-[320px]:auto-rows-[12rem] min-[450px]:auto-rows-[14rem] min-[500px]:auto-rows-[16rem] min-[560px]:auto-rows-[12rem]
                px-8 min-[400px]:px-12 min-[560px]:px-14
                sm:hidden overflow-scroll gap-4 justify-items-center"
                >
                    {allCards.map(item => {
                        return (
                            <Link scroll={false} key={item.id} href={`/card/${item.id.split("card_")[1]}`} className="w-full h-full">
                                <Card url={item.imageUrl} name={item.name} classProps={""} cardLize={cardLize}></Card>
                            </Link>
                        )
                    })}
                </div>

                {/* pc */}
                <div className={`hidden sm:flex w-auto h-full items-end ${cardLize === "lg" ? "pb-4" : "pb-2"}`}
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
                {/* pc control button */}
                <div className={`hidden sm:flex absolute right-2 text-xs gap-2 ${cardLize === "hidden" ? "" : "flex-col"}`}>
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
                    >-</button>
                </div>

            </section>
        </>
    )
}