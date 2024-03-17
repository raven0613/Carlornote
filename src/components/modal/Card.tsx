"use client"
import { useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import ShareIcon from "@/components/svg/Share";
import Image from "next/image";
import EmptyImageIcon from "@/components/svg/EmptyImage";
import { handlePostImgur } from "@/api/imgur";
import TextBox from "@/components/box/TextBox";
import { IBoardElement, ICard, boxType } from "@/type/card";
import { v4 as uuidv4 } from 'uuid';
import { handleDeleteCard, handleUpdateCard } from "@/api/card";
import { INewImageBoxProps } from "@/components/Board";
import { removeCard, selectCard, updateCards } from "@/redux/reducers/card";
import { useDispatch, useSelector } from "react-redux";
import { ImageLoading } from "../ImageLoading";
import DeleteIcon from "../svg/Delete";
import OKIcon from "../svg/OK";
import { checkEmail } from "../SignPanel";
import { closeAllModal, closeModal, openModal } from "@/redux/reducers/modal";
import ArrowIcon from "../svg/Arrow";
import EditIcon from "../svg/Edit";
import Modal from "./Modal";
import { IState } from "@/redux/store";

interface IRadioOptions {
    groupName: string,
    options: {
        value: string,
        text: string,
        des: string,
        disabled?: boolean
    }[],
    selectedValue: string,
    handleSelect: (value: string) => void,
    isDisabled?: boolean
}

function RadioOptions({ groupName, options, selectedValue, handleSelect, isDisabled }: IRadioOptions) {
    return (
        <>
            {options.map(item => {
                const disabled = isDisabled || item.disabled;
                let radioColor = () => {
                    if (disabled && selectedValue === item.value) return "bg-gray-600"; // disabled 已被選取
                    if (disabled) return "bg-white"; // disabled 未選取
                    if (selectedValue === item.value) return "bg-sky-600"; // 已選取
                    return "bg-white group-hover:bg-sky-300 group-hover:border-sky-100"; // 未選取
                }
                return (
                    <div key={`${groupName}_${item.value}`}
                        className={`flex items-center h-6 gap-2 mb-1 group text-sm 
                            ${(disabled) ? "text-slate-500" : "cursor-pointer"}
                        `}
                        onClick={() => {
                            if (disabled) return;
                            handleSelect(item.value);
                        }}
                    >
                        <span
                            className={`w-3 h-3 rounded-full border-2 border-white
                            ${radioColor()}
                            `}
                        />
                        {item.text}
                        <span className={`text-xs h-full leading-6 ${(disabled) ? "text-zinc-400" : "text-zinc-500"}`}>{item.des}</span>
                    </div>
                )
            })}
        </>
    )
}

interface ICardModal {
    isSelected: boolean;
    handleClose?: () => void;
}

export default function CardModal({ isSelected, handleClose }: ICardModal) {
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const [name, setName] = useState(selectedCard.name);
    const [inputUrl, setInputUrl] = useState("");
    const [url, setUrl] = useState(selectedCard.imageUrl);
    const [tag, setTag] = useState("");
    const [tagList, setTagList] = useState(selectedCard.tags ?? []);
    const [tagWrong, setTagWrong] = useState("");
    const [email, setEmail] = useState("");
    const [emailList, setEmailList] = useState(selectedCard.userList ?? []);
    const [emailErrorMsg, setEmailErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [visibility, setVisibility] = useState(selectedCard.visibility);
    const [editability, setEditability] = useState(selectedCard.editability ?? "close");
    const [settingArea, setSettingArea] = useState<"info" | "access" | "user">("info");
    const [isTagEditing, setIsTagEditing] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const dispatch = useDispatch();
    const { type: openModalType, props: modalProp } = useSelector((state: IState) => state.modal)
    console.log("modalProp", modalProp)
    return (
        <>
            <Modal
                position="center"
                isOpen={openModalType.includes("card")}
                handleClose={() => {
                    console.log("close")
                    if (isDirty) {
                        if (openModalType.at(-1) === "checkWindow") {
                            dispatch(closeModal({ type: "checkWindow", props: { data: selectedCard } }));
                            return;
                        }
                        dispatch(openModal({
                            type: "checkWindow",
                            props: {
                                text: "改動尚未儲存，確定要關閉視窗嗎？",
                                handleConfirm: async () => {
                                    dispatch(closeAllModal({ type: "" }));
                                },
                                data: selectedCard
                            }
                        }));
                        return;
                    }
                    if (openModalType.includes("card")) dispatch(closeModal({ type: "card", props: null }));
                }}
            >
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-fit h-96 bg-zinc-300 rounded-lg duration-200 shadow-lg  flex gap-6 
                        ${isSelected ? "bg-zinc-800" : "group-hover:bg-zinc-600 group-hover:-top-10"}`}
                >
                    {/* avator */}
                    <aside className="grid grid-rows-8 gap-2 h-full w-[15rem] bg-zinc-400/30 p-3">
                        {/* display image */}
                        {<div className={`row-span-6 flex items-center justify-center relative overflow-hidden rounded-md`}>

                            {isLoading && <div className="absolute inset-0 z-10">
                                <ImageLoading />
                            </div>}

                            {!url && <EmptyImageIcon classProps="absolute inset-0" />}
                            <input id="board_input" name="board_input" type="file" className="textInput w-full h-full opacity-0 absolute inset-0"
                                onChange={async (e) => {
                                    // console.log("image drop")
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!e.currentTarget.files || e.currentTarget.files?.length === 0) return;

                                    setIsDirty(true)
                                    setIsLoading(true);
                                    const file = e.currentTarget.files[0];
                                    // console.log("file", file)
                                    const formData = new FormData();
                                    formData.append("image", file);
                                    e.target.value = "";

                                    const res = await handlePostImgur(formData);
                                    // console.log("res", res)
                                    if (res.success === false) return;
                                    setUrl(res.data.link);
                                }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                }}
                            />
                            {(url) && <Image
                                className={`rounded-md`} width={200} height={220} src={url}
                                alt={`${selectedCard.name} image`}
                                style={{
                                    objectFit: 'cover', // cover, contain, none
                                    width: '100%', height: '100%',
                                    opacity: isLoading ? 0 : 200
                                }}
                                onLoad={(e) => {
                                    console.log("onLoad")
                                    setIsLoading(false);
                                }}
                                onError={() => {
                                }}
                            />}
                        </div>}

                        {/* url input */}
                        <div className="relative">
                            <input
                                className={`textInput row-span-1 outline-none border h-full m-auto text-sm pl-2 pr-8 rounded-md w-full
                    `} value={inputUrl || ""}
                                onChange={(e) => {
                                    setInputUrl(e.target.value.trim());
                                }}
                                placeholder="輸入圖片網址或拖曳圖片"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 hover:scale-125 duration-150 w-5 h-5"
                                onClick={(e) => {
                                    // console.log("image url ok")
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setUrl(inputUrl);
                                    setIsLoading(true);
                                }}
                            >
                                <OKIcon classProps="stroke-slate-600" />
                            </button>
                        </div>

                        {/* name input */}
                        <input className="textInput row-span-1 w-full h-full text-slate-700 m-auto text-sm outline-none px-2 rounded-md placeholder:text-sm" placeholder="輸入卡片名稱" value={name} onChange={(e) => {
                            setName(e.target.value);
                            setIsDirty(true)
                        }} />
                    </aside>

                    {/* all info */}
                    <main className="w-[22rem] h-full py-3 overflow-hidden relative flex flex-col">
                        <div className="text-xl pb-2 text-zinc-700 font-semibold flex items-center gap-2">
                            {settingArea !== "info" && <div onClick={() => {
                                setSettingArea("info")
                            }}>
                                <ArrowIcon classProps="w-7 h-7 cursor-pointer" />
                            </div>}

                            {/* title */}
                            {settingArea === "info" && "卡片詳細資訊"}
                            {settingArea === "access" && "卡片權限設定"}
                            {settingArea === "user" && "權限名單設定"}
                        </div>

                        <div
                            className={`w-[44rem] flex duration-150 h-full pb-8
                            ${settingArea === "info" ? "translate-x-0" : "-translate-x-1/2"}
                        `}
                        >
                            {/* info panel */}
                            <section className="w-[22rem] h-full flex flex-col gap-5">
                                <div className="">
                                    <span className="flex text-sm">
                                        create: {selectedCard.createdAt}
                                    </span>
                                    <span className="flex text-sm">
                                        update: {selectedCard.updatedAt}
                                    </span>
                                </div>
                                {/* tag panel */}
                                <div className="flex flex-col py-2 pr-6 gap-2 max-h-60">
                                    {/* title */}
                                    <div className="w-full flex items-center">
                                        <span className="text-md text-zinc-700">tag 設定</span>
                                        <button type="button" className="w-5 h-5 p-[4px] rounded-full bg-slate-100 cursor-pointer hover:scale-125 duration-200 ml-2"
                                            onClick={() => {
                                                setIsTagEditing(pre => !pre);
                                            }}
                                        >
                                            {isTagEditing === true && <OKIcon classProps="stroke-slate-500" />}
                                            {isTagEditing === false && <EditIcon classProps="stroke-slate-500" />}
                                        </button>
                                    </div>
                                    {/* tag input */}
                                    <div className={`w-full ${isTagEditing === true ? "h-8" : "h-0"} shrink-0 relative overflow-hidden duration-150`}>
                                        <input type="text" className="textInput w-full h-full outline-none text-sm pl-2 pr-8 rounded-md" placeholder="請輸入tag" value={tag} onChange={(e) => {
                                            setTag(e.target.value);
                                            setTagWrong("");
                                        }} />
                                        <button disabled={tag === ""} className={`absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-2xl  leading-5 align-middle duration-75
                                            ${tag === "" ? "text-slate-300" : "text-slate-600 hover:scale-125"}
                                            ${isTagEditing === true ? "opacity-100" : "opacity-0"}
                                        `}
                                            onClick={(e) => {
                                                // set tag
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (!tag) return;
                                                if (tagList.find(item => item === tag)) return setTagWrong(tag);
                                                setTagList(pre => [...pre, tag.trim().replace(/\s/g, "_")]);
                                                setTag("");
                                                setIsDirty(true);
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    {/* show tags */}
                                    <div className="flex gap-2 flex-wrap w-full max-h-48 text-sm bg-zinc-400/50 py-4 px-4 rounded-md overflow-y-scroll">
                                        {(!tagList || tagList.length === 0) && <p className="text-center w-full text-zinc-500">
                                            目前沒有 tag
                                        </p>}
                                        {tagList?.map(tag => (
                                            <span key={tag} className={`
                                            ${tagWrong === tag ? "bg-red-200" : "bg-seagull-50"}
                                            ${isTagEditing ? "pl-2 pr-7" : "px-2"}
                                            text-seagull-500 py-1 rounded-md relative`}>
                                                {tag}
                                                {isTagEditing && <button className="absolute right-0 inset-y-0 w-6 text-seagull-500 hover:text-seagull-600 hover:bg-seagull-100 duration-150 rounded-md"
                                                    onClick={() => {
                                                        setTagList(pre => pre.filter(item => item !== tag));
                                                        setIsDirty(true);
                                                    }}
                                                >x</button>}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* setting panel */}
                            <section className="w-[22rem] h-full">
                                {/* access setting panel */}
                                {settingArea === "access" && <div className="w-full h-full">

                                    {/* visibility setting panel */}
                                    <div className="flex flex-col py-2">
                                        <div className="w-full flex items-center">
                                            <span className="text-md text-zinc-700">閱覽權設定</span>
                                            {/* share */}
                                            {visibility !== "private" && <div
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const url = process.env.NODE_ENV === "production" ? "https://carlornote.vercel.app/" : "https://carlornote.vercel.app/";
                                                    navigator.clipboard.writeText(`${url}card/${selectedCard.id.split("_")[1]}`);
                                                    return true;
                                                }}
                                                className={`w-5 h-5 p-[4px] rounded-full bg-slate-100 cursor-pointer hover:scale-125 duration-200 ml-2
                                            `}
                                            ><ShareIcon classProps="fill-none stroke-slate-500" /></div>}
                                        </div>

                                        <p className="text-xs text-zinc-500 mb-2">誰可以觀看這張卡片？</p>
                                        <RadioOptions
                                            handleSelect={(value) => {
                                                setVisibility(value as "public" | "private" | "limited");
                                                if (value === "private") setEditability("close");
                                                else if (value === "limited" && editability === "open") setEditability("limited");
                                                setIsDirty(true);
                                            }}
                                            groupName={"card_read"}
                                            options={[{
                                                value: "public",
                                                text: "公開",
                                                des: "所有人都能夠觀看"
                                            }, {
                                                value: "private",
                                                text: "私密",
                                                des: "只有你可以觀看"
                                            }, {
                                                value: "limited",
                                                text: "限制",
                                                des: "只有你設定的使用者可以觀看"
                                            }]}
                                            selectedValue={visibility}
                                        />
                                    </div>
                                    {/* editibility setting panel */}
                                    <div className="flex flex-col py-2">
                                        <p className="text-md text-zinc-700">編輯權設定</p>
                                        <p className="text-xs text-zinc-500 mb-2">誰可以編輯這張卡片？</p>
                                        <RadioOptions
                                            handleSelect={(value) => {
                                                setEditability(value as "open" | "close" | "limited");
                                                setIsDirty(true);
                                            }}
                                            groupName={"card_edit"}
                                            options={[{
                                                value: "open",
                                                text: "開啟",
                                                des: "所有人都能夠編輯",
                                                disabled: visibility !== "public"
                                            }, {
                                                value: "close",
                                                text: "關閉",
                                                des: "只有你可以編輯"
                                            }, {
                                                value: "limited",
                                                text: "限制",
                                                des: "只有你設定的使用者可以編輯"
                                            }]}
                                            isDisabled={visibility === "private"}
                                            selectedValue={editability}
                                        />
                                    </div>
                                </div>}
                                {/* user setting panel */}
                                {settingArea === "user" && <div className="w-full h-full py-2 pr-6">
                                    <p className="text-md text-zinc-700">使用者設定</p>
                                    <p className="text-xs text-zinc-500">名單內的使用者可以觀看這張卡片</p>
                                    <div className="w-full h-8 mt-2 relative">
                                        <input type="text" className="textInput w-full h-full outline-none text-sm pl-2 pr-8 rounded-md" placeholder="請輸入e-mail" value={email} onChange={(e) => {
                                            setEmail(e.target.value);
                                        }} />
                                        <button className="absolute right-2 top-1/2 -translate-y-1/2 hover:scale-125 duration-150 w-5 h-5 text-2xl text-slate-600 leading-5 align-middle"
                                            onClick={(e) => {
                                                // set email
                                                e.preventDefault()
                                                e.stopPropagation()
                                                if (!checkEmail(email)) return setEmailErrorMsg("email 格式不正確");
                                                if (emailList.includes(email)) return setEmailErrorMsg("此 email 已在名單中");
                                                setEmailList(pre => [...pre, email]);
                                                setEmailErrorMsg("");
                                                setEmail("");
                                                setIsDirty(true);
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* accepted user area */}
                                    <div className="w-full h-[11.5rem] bg-zinc-400/50 overflow-scroll rounded-md mt-2 pl-[6px] py-[6px]">
                                        {emailList.map(item => {
                                            return (
                                                <div className="flex justify-between items-center gap-1" key={item}>
                                                    <span className="py-1 text-base even:bg-zinc-400/80 truncate relative px-0.5" >
                                                        {item}
                                                    </span>
                                                    <button type="button" className=" hover:bg-zinc-400/50 rounded-full duration-150 w-6 h-6 shrink-0 relative before:absolute before:content-[''] before:left-1/2 before:-translate-x-1/2 before:w-[1px] before:h-4 before:bg-zinc-600 before:rotate-45 before:top-1/2 before:-translate-y-1/2 
                                            after:absolute after:content-[''] after:left-1/2 after:-translate-x-1/2 after:w-[1px] after:h-4 after:bg-zinc-600 after:-rotate-45 after:top-1/2 after:-translate-y-1/2"
                                                        onClick={() => {
                                                            setEmailList(pre => pre.filter(email => email !== item));
                                                            setIsDirty(true);
                                                        }}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>}
                                <div className="flex justify-between items-center pr-6">
                                    <span className="text-red-700 text-sm">{emailErrorMsg}</span>
                                </div>
                            </section>

                        </div>
                    </main >

                    <span className="cursor-pointer px-2 rounded duration-150 text-sky-600 hover:bg-zinc-400/40 align-middle text-center absolute right-2 bottom-2" onClick={() => {
                        if (settingArea === "info") {
                            setSettingArea("access");
                            setIsTagEditing(false);
                            return;
                        }
                        setSettingArea(pre => pre === "access" ? "user" : "access");
                        setEmailErrorMsg("");
                    }}>
                        {settingArea === "access" ? "權限名單設定" : "卡片權限設定"}
                    </span>
                    <div className="absolute -bottom-8 right-0 flex gap-4">
                        {/* delete */}
                        <div
                            onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                dispatch(openModal({
                                    type: "checkWindow",
                                    props: {
                                        text: "卡片刪除後無法復原，確定要刪除卡片嗎？",
                                        data: selectedCard,
                                        handleConfirm: async () => {
                                            const response = await handleDeleteCard(selectedCard.id);
                                            if (response.status === "FAIL") return;
                                            dispatch(removeCard(selectedCard.id));
                                            dispatch(closeAllModal({ type: "" }));
                                        }
                                    }
                                }));
                            }}
                            className={`w-6 h-6 p-[3px] rounded-full  bg-red-500 cursor-pointer hover:scale-125 duration-200 
                                `}
                        >
                            <DeleteIcon classProps="stroke-slate-800 stroke-1" />
                        </div>


                        {/* OK button */}
                        <button className="bg-green-400 w-6 h-6 p-[4px] rounded-full text-slate-100 hover:scale-125 duration-200"
                            onClick={async () => {
                                const updatedCard = { ...selectedCard, imageUrl: url, name, visibility, editability, userList: emailList, tags: tagList };
                                const response = await handleUpdateCard([updatedCard]);
                                console.log("response", response)
                                if (response.status === "FAIL") return setEmailErrorMsg("儲存失敗，請再試一次");
                                const resData = JSON.parse(response.data);
                                console.log("resData", resData)
                                setIsDirty(false);
                                dispatch(updateCards(resData));
                                dispatch(selectCard(updatedCard));
                                dispatch(closeAllModal({ type: "", props: {} }));
                            }}
                        >
                            <OKIcon classProps="stroke-slate-700" />
                        </button>
                    </div>
                </div >
            </Modal>
        </>
    )
}