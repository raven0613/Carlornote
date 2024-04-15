import useClickOutside from "@/hooks/useClickOutside";
import { useState } from "react";
import SortIcon from "./svg/Sort";
import TagIcon from "./svg/Tag";
import { ICard } from "@/type/card";
import SortedIcon from "./svg/Sorted";
import ResetIcon from "./svg/Reset";

export type sortConditionType = { key: keyof ICard, sort: "asc" | "desc" };

interface ISortCore {
    sortConditionProp?: sortConditionType;
    handleSort?: (condition: sortConditionType) => void;
}

export function SortCore({ sortConditionProp, handleSort }: ISortCore) {
    const [sortCondition, setSortCondition] = useState<sortConditionType>(sortConditionProp ?? { key: "createdAt", sort: "asc" });

    return (
        <div className="flex flex-col gap-2">
            <SortIcon classProps={`text-seagull-400 w-6 h-6 mr-52`} />
            <div className="flex items-center gap-4">
                <select name="sort" id="sort"
                    className={`border-2 border-seagull-300 rounded-md w-52 h-8 text-sm outline-none px-1.5`}
                    onChange={(e) => {
                        const condition: sortConditionType = { ...sortCondition, key: e.target.value as keyof ICard }
                        setSortCondition(condition);
                        handleSort && handleSort(condition);
                    }}
                >
                    <option value="createdAt" className="">創建時間（預設）</option>
                    <option value="updatedAt" className="">更新時間</option>
                    <option value="name" className="">名稱</option>
                </select>
                <button className=""
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const condition: sortConditionType = sortCondition.sort === "asc" ?
                            { ...sortCondition, sort: "desc" } :
                            { ...sortCondition, sort: "asc" }
                        setSortCondition(condition);
                        handleSort && handleSort(condition);
                    }}
                >
                    <SortedIcon classProps={`text-seagull-400 hover:text-seagull-600 duration-150 w-6 h-6 ${sortCondition.sort === "desc" ? "-scale-y-100" : ""}`} />
                </button>
            </div>
        </div>
    )
}

interface ISortList {
    sortConditionProp?: sortConditionType;
    handleSort?: (condition: sortConditionType) => void;
    isOpen: boolean;
    handleClose?: () => void;
}

export function SortPanel({ sortConditionProp, handleSort, isOpen, handleClose }: ISortList) {
    const nodeRef = useClickOutside<HTMLDivElement>({
        handleMouseDownOutside: () => {
            if (!isOpen || !handleClose) return;
            handleClose();
        }
    })
    return (
        <>
            <div ref={nodeRef} className={`flex-wrap absolute left-4 bottom-full mb-4 border border-slate-200 gap-2 w-72 h-24 p-3 rounded-lg bg-white shadow-lg shadow-black/20 overflow-y-scroll duration-100 ease-in-out
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <SortCore sortConditionProp={sortConditionProp} handleSort={handleSort} />
            </div>
        </>
    )
}

interface ITagCore {
    allTags: string[];
    selectedTagsProp?: string[];
    handleSelectTag?: (tags: string[]) => void;
}

export function TagCore({ allTags, selectedTagsProp, handleSelectTag }: ITagCore) {
    const [selectedTags, setSelectedTags] = useState<string[]>(selectedTagsProp ?? []);
    const selectedTagSet = new Set<string>(selectedTags);
    return (
        <div className="flex flex-col gap-2 overflow-y-scroll">
            <div className="flex w-full justify-between items-center gap-2 pr-4">
                <TagIcon classProps={`text-seagull-400 w-6 h-6`} />
                <ResetIcon classProps={`text-seagull-400 w-5 h-5 cursor-pointer hover:text-seagull-600 duration-150`}
                    handleClick={() => {
                        handleSelectTag && handleSelectTag([]);
                        setSelectedTags([]);
                    }}
                />
            </div>
            <div className="flex flex-wrap gap-2 ">
                {allTags.map(tag => {
                    return (
                        <span key={tag} className={`py-0.5 px-2 h-fit rounded text-sm border border-seagull-400 cursor-pointer 
                        ${selectedTagSet.has(tag) ? "bg-seagull-400 text-white" : "text-seagull-700"}`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const tags = selectedTagSet.has(tag) ?
                                    selectedTags.filter(t => t !== tag)
                                    : [...selectedTags, tag];

                                setSelectedTags(tags);
                                handleSelectTag && handleSelectTag(tags);
                            }}
                        >
                            {tag}
                        </span>
                    )
                })}
            </div>
        </div>
    )
}

interface ITagList {
    allTags: string[];
    selectedTagsProp?: string[];
    handleSelectTag?: (tags: string[]) => void;
    isOpen: boolean;
    handleClose?: () => void;
}

export function TagPanel({ allTags, selectedTagsProp, handleSelectTag, isOpen, handleClose }: ITagList) {
    const nodeRef = useClickOutside<HTMLDivElement>({
        handleMouseDownOutside: () => {
            if (!isOpen || !handleClose) return;
            handleClose();
        }
    })
    return (
        <>
            <div ref={nodeRef} className={`flex flex-wrap absolute left-4 bottom-full mb-4 border border-slate-200 gap-2 w-72 max-h-48 p-3 rounded-lg bg-white shadow-lg shadow-black/20 overflow-y-scroll duration-100 ease-in-out
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <TagCore allTags={allTags} selectedTagsProp={selectedTagsProp} handleSelectTag={handleSelectTag} />
            </div>
        </>
    )
}