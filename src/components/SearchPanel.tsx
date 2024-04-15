import useClickOutside from "@/hooks/useClickOutside"
import { selectCard } from "@/redux/reducers/card";
import { IState } from "@/redux/store";
import { ICard } from "@/type/card";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import EmptyImageIcon from "./svg/EmptyImage";
import SearchIcon from "./svg/Search";
import CloseIcon from "./svg/Close";
import { v4 as uuidv4 } from 'uuid';
import BarLoader from "react-spinners/BarLoader";
import { closeAllModal } from "@/redux/reducers/modal";
import Link from "next/link";

function Card({ cardData, summary, handleClick, isDisabled }: { cardData: ICard, summary: string[], handleClick: () => void, isDisabled: boolean }) {
    return (
        <>
            <div className={`w-full h-20 shrink-0 border-b border-slate-200  flex items-center px-2 hover:bg-slate-100 duration-150 ${isDisabled ? "pointer-events-none blur-[2px]" : "cursor-pointer"}`}
                onClick={() => {
                    handleClick();
                }}
            >
                {/* 圖片 */}
                <div className={`w-16 h-16 rounded-sm bg-seagull-300 shrink-0 mr-1`}>
                    {cardData.imageUrl && <Image
                        className={`rounded-md`} width={150} height={150} src={cardData.imageUrl}
                        priority={true}
                        alt={cardData.name}
                        style={{
                            objectFit: 'cover', // cover, contain, none
                            width: '100%', height: '100%',
                        }}
                        onLoad={(e) => {
                            // console.log("onLoad")
                        }}
                        onError={() => {
                        }}
                    />}
                </div>
                <div className="h-full p-2 w-[18.5rem]">
                    <p className={`text-sm pb-0.5 text-slate-900 text-start w-full truncate`}>{cardData.name ?? "無標題"}</p>
                    {summary.map((item, i) => {
                        const unique = uuidv4();
                        if (i > 1) return;
                        return (
                            <span key={`${item}_${unique}`} className={`block w-full text-slate-400 text-start truncate`}>{item.replaceAll("\n", " ")}</span>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export function SearchPanel() {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [result, setResult] = useState<{ cardData: ICard, summary: string[] }[]>([]);
    const allCards = useSelector((state: IState) => state.card);

    // console.log("allCards", allCards)
    // console.log("result", result)

    // 有修改的話 0.5 秒搜尋一次
    useEffect(() => {
        let time: NodeJS.Timeout | null = null;
        if (time) return;
        if (!inputValue) {
            setResult([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);

        time = setInterval(async () => {
            const input = inputValue.toLowerCase();
            const result = allCards.map(card => {
                const targetElement = card.boardElement.filter(item =>
                    item.content.toLowerCase().includes(input)
                    || ((item.type === "code" || item.type === "card") && item.name.toLowerCase().includes(input)));
                if (targetElement.length === 0) return { cardData: card, summary: [] };
                const summary = targetElement.map(ele => {
                    if ((ele.type === "code" || ele.type === "card") && ele.name.toLowerCase().includes(input)) return ele.name;
                    const splitContents = ele.content.toLowerCase().split(input);
                    return `${splitContents[0].length > 10 ? `...${splitContents[0].slice(-10)}` : splitContents[0]}${inputValue}${splitContents[1].length > 50 ? splitContents[1].slice(0, 50) : splitContents[1]}`;
                })
                const summarySet = new Set(summary);
                return { cardData: card, summary: [...summarySet] }
            })
            setResult(result.filter(card => card.summary.length > 0));

            // console.log(inputValue)
            setIsLoading(false);
            if (time) clearInterval(time);
        }, 1000);

        return () => {
            if (time) clearInterval(time);
        }
    }, [allCards, inputValue]);

    return (
        <>
            <div className="flex items-center justify-center px-5 bg-white sm:rounded-lg">
                <input type="text" autoFocus className="textInput outline-none flex-1 h-8 rounded border border-seafull-400 pl-2 pr-7 text-sm mx-auto my-5" value={inputValue} placeholder="請輸入搜尋關鍵字"
                    onChange={(e) => {
                        setInputValue(e.target.value);
                    }}
                />
                <div className="w-6 h-6 hover:bg-slate-200 duration-150 absolute top-[1.5rem] right-6 cursor-pointer rounded-sm"
                    onClick={() => {
                        setInputValue("");
                    }}
                >
                    <CloseIcon classProps="pointer-events-none" />
                </div>
            </div>


            {isLoading && <BarLoader
                color="#5bbbd5"
                cssOverride={{ width: "100%" }}
                loading={isLoading}
            />}

            <div className={`sm:rounded-lg bg-white w-full min-h-full sm:min-h-12 border-t border-slate-200 text-slate-400 text-sm max-h-full pb-16 sm:max-h-80 overflow-scroll flex flex-col justify-start`}>
                {(result.length === 0 && !isLoading) && <p className="mt-3.5 text-center">沒有結果</p>}
                {(result.length > 0 && !isLoading) && <p className="mt-3.5 text-center">共 {result.length} 筆結果</p>}
                {result.length > 0 && result.map(item => (
                    <>
                        <div className="sm:hidden" key={`${item.cardData.id}_mobile`}>
                            <Link href={`/card/${item.cardData?.id.split("_")[1]}`}
                                prefetch
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(closeAllModal());
                                }}
                            >
                                <Card cardData={item.cardData}
                                    isDisabled={isLoading}
                                    summary={item.summary} handleClick={() => {}} />
                            </Link>
                        </div>
                        <div className="hidden sm:block" key={`${item.cardData.id}_pc`}>  
                            <Card cardData={item.cardData}
                                isDisabled={isLoading}
                                summary={item.summary} handleClick={() => {
                                    if (pathname === "/") {
                                        dispatch(selectCard(item.cardData));
                                        return;
                                    }
                                    router.push(`/card/${item.cardData.id.split("_")[1]}`);
                                    dispatch(closeAllModal());
                                }}
                            />
                        </div>
                    </>
                ))}
            </div>
        </>
    )
}

export default function SearchGroup() {
    const [isOpen, setIsOpen] = useState(false);
    const nodeRef = useClickOutside<HTMLDivElement>({
        handleMouseDownOutside: () => {
            setIsOpen(false);
        }
    })
    return (
        <button className={`relative w-6 h-6 rounded-full bg-seagull-300 hover:bg-seagull-500 duration-150`}
            onMouseDown={(e) => {
                // e.preventDefault();
                // e.stopPropagation();
                setIsOpen(true);
            }}
        >
            <SearchIcon classProps="w-full h-full absolute top-1/2 -translate-y-1/2 p-1 text-white pointer-events-none" />

            <div ref={nodeRef} className={`absolute top-10 right-0 cursor-default shadow-md shadow-slate-800/30 w-[25rem] h-fit bg-white rounded-lg duration-150 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
                <SearchPanel />
            </div>
        </button>
    )
}