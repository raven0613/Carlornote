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
import { removeCard, updateCards } from "@/redux/reducers/card";
import { useDispatch } from "react-redux";
import { closeModal } from "@/redux/reducers/modal";

interface ICardModal {
    isSelected: boolean;
    cardData: ICard;
    handleDelete: () => void;
}

export default function CardModal({ isSelected, cardData, handleDelete }: ICardModal) {
    const [name, setName] = useState(cardData.name);
    const [inputUrl, setInputUrl] = useState("");
    const [url, setUrl] = useState(cardData.imageUrl);
    const dispatch = useDispatch();
    return (
        <>
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-56 h-72 bg-zinc-300 rounded-lg duration-200 shadow-lg p-2
                grid grid-rows-8 gap-2
                    ${isSelected ? "bg-zinc-800" : "group-hover:bg-zinc-600 group-hover:-top-10"}`}
            >
                {/* display image */}
                <div className={`row-span-6 flex items-center justify-center relative overflow-hidden rounded-md`}>
                    {!url && <EmptyImageIcon classProps="absolute inset-0" />}
                    <input id="board_input" name="board_input" type="file" className="w-full h-full opacity-0 absolute inset-0"
                        onChange={async (e) => {
                            console.log("image drop")
                            e.preventDefault();
                            e.stopPropagation();
                            if (!e.currentTarget.files || e.currentTarget.files?.length === 0) return;

                            const file = e.currentTarget.files[0];
                            // console.log("file", file)
                            const formData = new FormData();
                            formData.append("image", file);
                            e.target.value = "";

                            const res = await handlePostImgur(formData);
                            console.log("res", res)
                            if (res.success === false) return;
                            setUrl(res.data.link);
                        }}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        onDrop={(e) => {
                        }}
                    />
                    {url && <Image
                        className={`rounded-md`} width={200} height={220} src={url}
                        alt={`${cardData.name} image`}
                        style={{
                            objectFit: 'cover', // cover, contain, none
                            width: '100%', height: '100%',
                        }}
                        onLoad={(e) => {
                            console.log("onLoad")
                        }}
                        onError={() => {
                        }}
                    />}
                </div>

                {/* url input */}
                <div className="relative">
                    <input
                        className={`row-span-1 outline-none border h-full m-auto text-sm pl-2 pr-8 rounded-md w-full
                    `} value={inputUrl || ""}
                        onChange={(e) => {
                            setInputUrl(e.target.value.trim());
                        }}
                        placeholder="輸入圖片網址或拖曳圖片"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 hover:scale-125 duration-150"
                        onClick={(e) => {
                            console.log("image url ok")
                            e.preventDefault()
                            e.stopPropagation()
                            setUrl(inputUrl);
                        }}
                    >v</button>
                </div>

                {/* name input */}
                <input className="row-span-1 h-full text-slate-700 m-auto text-sm outline-none px-2 rounded-md placeholder:text-sm" placeholder="輸入卡片名稱" value={name} onChange={(e) => {
                    setName(e.target.value.trim());
                }} />

                <div className="absolute -bottom-8 right-0 flex gap-4">


                    {/* delete */}
                    <div
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("Delete")
                            const response = await handleDeleteCard(cardData.id);
                            if (response.status === "FAIL") return;
                            dispatch(removeCard(cardData.id));
                            handleDelete();
                        }}
                        className={`w-5 h-5 rounded-full border border-slate-100 bg-red-500 cursor-pointer hover:scale-125 duration-200
                `}
                    ></div>
                    {/* share */}
                    <div
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const updatedData = [{ ...cardData, visibility: "public" }] as ICard[];
                            const response = await handleUpdateCard(updatedData);
                            // console.log("response", response)
                            if (response.status === "FAIL") return false;
                            // console.log("data", JSON.parse(response.data))

                            dispatch(updateCards(updatedData));
                            const url = process.env.NODE_ENV === "production" ? "https://deck-crafter.vercel.app/" : "http://localhost:3000/";
                            navigator.clipboard.writeText(`${url}card/${cardData.id.split("_")[1]}`);
                            return true;
                        }}
                        className={`w-5 h-5 p-[3px] rounded-full border border-slate-500 bg-slate-100 cursor-pointer hover:scale-125 duration-200
                `}
                    ><ShareIcon classProps="fill-none stroke-slate-500" /></div>

                    {/* OK button */}
                    <button className="bg-green-400 w-5 h-5 rounded-full text-slate-100" onClick={async () => {
                        const response = await handleUpdateCard([{ ...cardData, imageUrl: url, name }]);
                        if (response.status === "FAIL") return;
                        const resData = JSON.parse(response.data);
                        console.log("resData", resData)
                        dispatch(updateCards(resData));
                        dispatch(closeModal({ type: "", data: null }));
                    }} >v</button>
                </div>
            </div>
        </>
    )
}