import useClickOutside from "@/hooks/useClickOutside"
import { IState } from "@/redux/store";
import { ICard } from "@/type/card";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";

function Card({ cardData }: { cardData: ICard }) {
    return (
        <>
            <div className={`w-full h-20 border-b border-slate-200 cursor-pointer flex items-center px-2`}>
                {/* 圖片 */}
                <div className={`w-16 h-16 rounded-sm bg-seagull-300 shrink-0`}></div>
                <div className="h-full p-2">
                    <p className={`text-sm pb-0.5 text-slate-800 text-start`}>{cardData.name}</p>
                    <span className={`block w-full text-slate-400 text-start`}>文字文字文字</span>
                </div>
            </div>
        </>
    )
}

export default function SearchPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [result, setResult] = useState<ICard[]>([]);
    const allCards = useSelector((state: IState) => state.card);
    const nodeRef = useClickOutside<HTMLDivElement>({
        handleMouseDownOutside: () => {
            setIsOpen(false);
        }
    })
    console.log("allCards", allCards)
    console.log("result", result)

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
            setResult(allCards.filter(card => {
                return card.boardElement.some(ele => ele.type !== "image" &&
                    (ele.content.toLowerCase().includes(inputValue.toLowerCase()) || ele.name.toLowerCase().includes(inputValue.toLowerCase())))
            }))

            console.log(inputValue)
            setIsLoading(false);
            if (time) clearInterval(time);
        }, 1000);

        return () => {
            if (time) clearInterval(time);
        }
    }, [allCards, inputValue]);

    return (
        <button className={`relative w-6 h-6 rounded-full bg-seagull-500`}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(true);
            }}
        >

            {isOpen && <div ref={nodeRef} className={`absolute top-10 right-0 cursor-default shadow-md shadow-slate-800/30 w-[25rem] h-fit bg-white rounded-lg `}>

                <input type="text" className="outline-none w-[17rem] h-8 rounded border border-seafull-400 px-2 text-sm mx-auto my-5" value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                    }}
                />

                <div className={`w-full min-h-12 border-t border-slate-200 text-slate-400 text-sm max-h-80 overflow-scroll`}>
                    {(result.length === 0 && !isLoading) ? "沒有結果" : ""}
                    {isLoading ? "loading" : ""}
                    {result.length > 0 && result.map(item => (
                        <Card key={item.id} cardData={item} />
                    ))}
                </div>
            </div>}
        </button>
    )
}