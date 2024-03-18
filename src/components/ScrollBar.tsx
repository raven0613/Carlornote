const yPositionMap: Record<"base" | "bottom" | "none", string> = {
    base: "bottom-1",
    bottom: "bottom-0",
    none: ""
}

const heightMap: Record<"base" | "bottom" | "none", string> = {
    base: "h-1.5",
    bottom: "h-1",
    none: ""
}

interface IScrollBar {
    startIndex: number;
    totalItemsLength: number;
    barItemsLength: number;
    showingPos: "base" | "bottom" | "none";
    isFull: boolean;
}

export default function SrollBar ({ startIndex, totalItemsLength, barItemsLength, showingPos, isFull }: IScrollBar) {
    // console.log("totalItemsLength", totalItemsLength)
    // console.log("barItemsLength", barItemsLength)
    return (
        <>
            <div className={`hidden sm:block absolute ${yPositionMap[showingPos]} left-1/2 -translate-x-1/2 w-1/3 ${heightMap[showingPos]} bg-white rounded-full shadow-seagull-600/20 shadow-[inset_0_5px_4px_0px]`}>
                <span className={`absolute ${isFull? "bg-seagull-100" : "bg-seagull-300"} h-full rounded-full duration-150`}
                    style={{ 
                        left: `${isFull? 0 : (1 / totalItemsLength) * 100 * startIndex}%`, 
                        width: `${isFull? 100 : barItemsLength / totalItemsLength * 100}%`
                    }}
                />
            </div>
        </>
    )
}