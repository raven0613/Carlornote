import { handleAddCard, handleGetCards } from "@/api/card";
import Card, { CardWithHover } from "@/components/Card";
import useWindowSize from "@/hooks/useWindowSize";
import { addCard, setCards } from "@/redux/reducers/card";
import { closeAllModal, openModal } from "@/redux/reducers/modal";
import { IState } from "@/redux/store";
import { ICard } from "@/type/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TagIcon from "./svg/Tag";
import SortIcon from "./svg/Sort";
import { SortCore, SortPanel, TagCore, TagPanel, sortConditionType } from "./CardListPanel";
import SrollBar from "./ScrollBar";
import CloseIcon from "./svg/Close";
import useTouchmoveDirection from "@/hooks/useTouchmoveDirection";

function FakeCard({ cardLize }: { cardLize: "hidden" | "sm" | "lg" }) {
    return (
        <main className={`w-14 rounded-lg relative group hover:z-50 duration-200 ${cardLize === "lg" ? "h-32" : `${cardLize === "sm" ? "h-24" : "h-0 opacity-0"}`}
            `}
        >
            <div className={`w-28 h-36 bg-zinc-00 rounded-lg duration-200 shadow-lg  
        grid grid-rows-5 absolute top-0 left-1/2 -translate-x-1/2`}></div>
        </main>
    )
}

function CardLoading({ cardLize, length }: { cardLize: "hidden" | "sm" | "lg", length: number }) {
    const list = Array.from({ length });
    return (<div className="w-full h-full flex">
        {list.map((_item, index) => (
            <FakeCard cardLize={cardLize} key={index} />
        ))}
    </div>)
}

interface ICardList {
    selectedCardId: string;
    handleSetSelectedCard: (id: string) => void;
    handleDrag: (card: ICard) => void;
}

export default function CardList({ selectedCardId, handleSetSelectedCard, handleDrag }: ICardList) {
    const user = useSelector((state: IState) => state.user);
    const dispatch = useDispatch();
    const allCards = useSelector((state: IState) => state.card);
    const [wheelIdx, setWheelIdx] = useState(0);
    const [showCardAmounts, setSowCardAmounts] = useState(5);
    const [cardState, setCardState] = useState<"loading" | "ok" | "error">("loading");
    const [addCardState, setAddCardState] = useState<"loading" | "ok" | "error">("ok");
    const [cardSize, setCardSize] = useState<"hidden" | "sm" | "lg">("hidden");
    const { width: windowWidth } = useWindowSize();
    const pathname = usePathname();
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const allTags = useSelector((state: IState) => state.cardTags);
    const [openedPanel, setOpenedPanel] = useState<"tag" | "sort" | "mobileFilter" | "">("");
    const { type: openModalType, props: modalProp } = useSelector((state: IState) => state.modal)
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const isFiltered = Boolean(selectedTags.length > 0);
    const touchMoveResult = useTouchmoveDirection();

    // console.log("touchMoveResult", touchMoveResult)
    // console.log("allCards", allCards)
    // console.log("wheelIdx", wheelIdx)

    const tagSet = new Set(selectedTags);
    const filteredCards = (isFiltered && allCards) ? allCards.filter(card => card.tags?.some(t => tagSet.has(t))) : allCards;

    // console.log("createdAt", allCards[0].createdAt)
    // console.log("createdAt", new Date(allCards[0].createdAt).getTime())

    useEffect(() => {
        if (allCards.length > 0) return setCardState("ok");
        async function handleFetchCard() {
            const response = await handleGetCards(user?.id || "");
            if (response.status === "FAIL") return setCardState("error");
            setCardState("ok");
            dispatch(setCards(JSON.parse(response.data).sort((a: ICard, b: ICard) => {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            })));

            if (pathname === "/") {
                setCardSize("lg");
                return;
            }
            if (!selectedCard) return;
            if (user && (selectedCard.authorId === user.id || selectedCard.visibility === "public" || selectedCard.visibility === "limited" && selectedCard.userList.includes(user.id))) {
                setCardSize("lg");
            }
            // console.log("get data", JSON.parse(response.data))
        }
        setCardState("loading");
        handleFetchCard();
    }, [dispatch, user, allCards.length, selectedCard, pathname]);

    useEffect(() => {
        if (!windowWidth) return;
        if (windowWidth <= 700) setSowCardAmounts(5);
        else if (windowWidth <= 900) setSowCardAmounts(7);
        else setSowCardAmounts(10);
    }, [windowWidth]);

    function handleSort(condition: sortConditionType) {
        if (condition.key === "name") {
            dispatch(setCards([...allCards].sort((a, b) => {
                if (condition.sort === "asc") {
                    return a.name.localeCompare(b.name)
                }
                return -a.name.localeCompare(b.name)
            })))
            return;
        }
        dispatch(setCards([...allCards].sort((a, b) => {
            if (condition.sort === "asc") {
                return new Date(a[condition.key] as string).getTime() - new Date(b[condition.key] as string).getTime()
            }
            return new Date(b[condition.key] as string).getTime() - new Date(a[condition.key] as string).getTime()
        })))
    }

    // 手機版 list 佔整頁
    return (
        <>
            <section className={`w-full h-full sm:px-28 flex sm:items-center sm:justify-center relative border-t-slate-200/70
                ${cardSize === "lg" ? "sm:h-[10rem]" : `${cardSize === "sm" ? "sm:h-[7rem]" : "sm:h-[2rem]"}`}
                ${cardSize === "hidden" ? "bg-[#f8f8f8] border-t-[1px]" : "border-t-[3px]"}
                duration-150
            `}
                onClick={() => {
                    const cardId = pathname.split("/").at(-1);
                    if (cardId) return;
                    handleSetSelectedCard("");
                }}
            >
                {/* tag list */}
                {cardSize !== "hidden" && <button className={`absolute ${cardSize === "lg" ? "top-3" : "top-1"} left-3 w-6 h-6 p-0.5 rounded-full border border-seagull-500 hover:border-seagull-600 duration-150 ${isFiltered ? "bg-seagull-500 hover:bg-seagull-600" : ""}`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenedPanel(pre => pre === "tag" ? "" : "tag");
                    }}
                ><TagIcon classProps={`${isFiltered ? "text-white" : "text-seagull-400 hover:text-seagull-600"} duration-150`} /></button>}
                <TagPanel allTags={allTags} isOpen={openedPanel === "tag"}
                    selectedTagsProp={selectedTags}
                    handleSelectTag={(tags: string[]) => {
                        setSelectedTags(tags);
                        setWheelIdx(0);
                    }}
                    handleClose={() => { setOpenedPanel("") }}
                />

                {/* sort panel */}
                {cardSize !== "hidden" && <button className={`absolute ${cardSize === "lg" ? "top-3" : "top-1"} left-12 w-6 h-6 p-0.5 rounded-full border border-seagull-500 hover:border-seagull-600 duration-150`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenedPanel(pre => pre === "sort" ? "" : "sort");
                    }}
                ><SortIcon classProps={`text-seagull-400 hover:text-seagull-600 duration-150`} /></button>}
                <SortPanel isOpen={openedPanel === "sort"}
                    handleSort={handleSort}
                    handleClose={() => { setOpenedPanel("") }}
                />

                {/* bottom card info */}
                {cardSize === "hidden" && <div className={`h-full w-1/2 absolute left-0 truncate leading-[2rem] px-4 text-sm`} onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}>
                    {selectedCard?.name}
                </div>}

                {/* normal card info */}
                {selectedCard && <div className={`${cardSize === "hidden" ? "-right-[15rem]" : "right-0"} hidden sm:flex flex-col h-full w-[15rem] duration-150 absolute   leading-[2rem] pl-4 pr-7 pb-2 text-sm rounded-l-xl shadow-[40px_35px_60px_15px_rgba(0,0,0,0.3)] overflow-y-scroll`} onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                >
                    {selectedCard?.name}
                    <div className="flex gap-2 flex-wrap  w-full h-fit pt-2 text-sm">
                        {selectedCard.tags?.map(tag => (
                            <span key={tag} className="bg-seagull-200 px-2 py-1 rounded-md">{tag}</span>
                        ))}
                    </div>
                </div>}

                {/* add button */}
                <button disabled={addCardState === "loading" || !user?.id} type="button"
                    className={`w-14 h-14 bg-seagull-500 rounded-full absolute z-30 bottom-20 left-1/2 -translate-x-1/2 shadow-md shadow-black/30
                sm:left-12 sm:bottom-1/2 sm:translate-y-1/2 
                text-seagull-200 text-3xl font-light disabled:bg-seagull-100 hover:scale-110 hover:bg-seagull-600 duration-150 ${cardSize === "hidden" ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                    onClick={async () => {
                        // 之後再新增公開匿名卡片
                        if (!user?.id) return;
                        setAddCardState("loading");
                        const response = await handleAddCard({
                            id: "",
                            authorId: user.id,
                            name: "",
                            boardElement: [],
                            userList: [],
                            visibility: "private",
                            editability: "close",
                            imageUrl: "",
                            createdAt: new Date().toUTCString(),
                            updatedAt: new Date().toUTCString(),
                            tags: []
                        });
                        if (response.status === "FAIL") return setAddCardState("error");
                        const card = JSON.parse(response.data) as ICard;
                        dispatch(addCard(card));
                        setAddCardState("ok");
                        // TODO: 新增的卡片要馬上被 insertSort? 還是要保持在最後一張(目前)
                        // 新增的卡片要被選取並且卡片欄位要顯示(先不要)
                        // dispatch(selectCard(card));
                        // if (allCards.length - showCardAmounts + 1 >= 0) setWheelPx(allCards.length - showCardAmounts + 1);
                        // else setWheelPx(0);
                    }}
                >+</button>

                {/* mobile */}
                <div className="fixed inset-x-0 top-12 bottom-[3.7rem] pb-4 pt-4
                grid grid-cols-1 min-[320px]:grid-cols-2 min-[560px]:grid-cols-3 auto-rows-[16rem] min-[320px]:auto-rows-[12rem] min-[450px]:auto-rows-[14rem] min-[500px]:auto-rows-[16rem] min-[560px]:auto-rows-[12rem]
                px-8 min-[400px]:px-12 min-[560px]:px-14
                sm:hidden overflow-scroll gap-4 justify-items-center"
                >
                    {filteredCards.map(item => {
                        return (
                            <Link scroll={false} key={item.id} href={`/card/${item.id.split("card_")[1]}`} className="w-full h-full">
                                <Card
                                    id={item.id}
                                    url={item.imageUrl}
                                    name={item.name}
                                    classProps={""}
                                    cardLize={cardSize}
                                />
                            </Link>
                        )
                    })}
                </div>

                {/* mobile filter */}
                {(openModalType[0] === "mobileFilter" || openedPanel === "") && <div className={`sm:hidden flex flex-col gap-4 absolute inset-x-0 bottom-0 p-4 h-[40%] z-40 shadow-[0_1px_12px_-2px_rgba(0,0,0,0.3)] overflow-y-scroll bg-white rounded-t-lg duration-150 ease-in-out 
                ${openModalType[0] === "mobileFilter" ? "translate-y-0" : "translate-y-full"}`}
                    onTouchMove={() => {
                        if (touchMoveResult.y === "bottom") dispatch(closeAllModal());
                    }}
                >
                    <SortCore handleSort={handleSort} />
                    <TagCore allTags={allTags}
                        selectedTagsProp={selectedTags}
                        handleSelectTag={(tags: string[]) => {
                            setSelectedTags(tags);
                        }}
                    />
                    <span className="w-8 h-8 absolute top-[6px] right-0 duration-150 ease-in-out cursor-pointer"
                        onClick={() => {
                            console.log("ㄟ")
                            dispatch(closeAllModal());
                        }}><CloseIcon classProps="pointer-events-none" />
                    </span>
                </div>}

                {/* pc */}
                <div className={`hidden sm:flex w-auto h-full items-end ${cardSize === "lg" ? "pb-4" : "pb-2"}`}
                    onWheel={(e) => {
                        // console.log(e.deltaX)
                        // console.log(e.deltaY)
                        if (e.deltaY > 0) setWheelIdx(pre => {
                            if (pre + showCardAmounts >= filteredCards.length) return filteredCards.length - showCardAmounts;
                            return pre + 1
                        });
                        else setWheelIdx(pre => {
                            if (pre <= 0) return 0;
                            return pre - 1
                        });
                    }}
                >
                    {cardState === "loading" && <CardLoading cardLize={cardSize} length={showCardAmounts} />}
                    {cardState === "error" && "Error"}
                    {(cardState === "ok" && allCards) &&
                        filteredCards.slice(
                            filteredCards.length <= showCardAmounts ? 0 : wheelIdx,
                            filteredCards.length <= showCardAmounts ? filteredCards.length : wheelIdx + showCardAmounts
                        )
                            .map((item) =>
                                <CardWithHover key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    url={item.imageUrl}
                                    isSelected={selectedCardId === item.id}
                                    cardLize={cardSize}
                                    handleClick={() => {
                                        handleSetSelectedCard(item.id);
                                        // setDirtyState("none");
                                    }}
                                    handleClickEdit={() => {
                                        dispatch(openModal({ type: "card", props: { data: item } }));
                                    }}
                                    handleDrag={() => handleDrag(item)}
                                />
                            )}
                </div>

                {/* pc control button */}
                {user && <div className={`hidden sm:flex absolute right-3 text-xs gap-2 ${cardSize === "hidden" ? "" : "flex-col"}`}>
                    <button className={`w-5 h-5 bg-seagull-200 rounded-full hover:scale-125 duration-150 relative ${cardSize === "lg" ? "bg-seagull-600" : "bg-seagull-200"}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCardSize("lg");
                        }}
                    >
                        <span className={`absolute w-[0.5rem] h-[0.65rem] rounded-[0.1rem] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${cardSize === "lg" ? "bg-seagull-100" : "bg-seagull-700"}`} />
                    </button>

                    <button className={`w-5 h-5 rounded-full hover:scale-125 duration-150 hover:shadow-sm ${cardSize === "sm" ? "bg-seagull-600" : "bg-seagull-200"}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCardSize("sm");
                        }}
                    >
                        <span className={`absolute w-[0.5rem] h-[0.5rem] rounded-[0.1rem] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${cardSize === "sm" ? "bg-seagull-100" : "bg-seagull-700"}`} />
                    </button>

                    <button className={`w-5 h-5 bg-seagull-200 rounded-full hover:scale-125 duration-150 hover:shadow-sm  font-semibold ${cardSize === "hidden" ? "bg-seagull-600 text-seagull-200" : "bg-seagull-200 text-seagull-700"}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCardSize("hidden");
                        }}
                    >-</button>
                </div>}

                <SrollBar isFull={filteredCards.length <= showCardAmounts} startIndex={wheelIdx} barItemsLength={showCardAmounts} totalItemsLength={filteredCards.length} showingPos={cardBarMap[cardSize]} />
            </section>
        </>
    )
}

const cardBarMap: Record<"lg" | "sm" | "hidden", "base" | "bottom" | "none"> = {
    lg: "base",
    sm: "bottom",
    hidden: "none"
}