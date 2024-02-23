"use client";
import { handleGetUserByEmail } from "@/api/user";
import { addUser } from "@/redux/reducers/user";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ReactNode, useDeferredValue, useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/components/modal/Card";
import Modal from "@/components/modal/Modal";
import { closeModal, openModal } from "@/redux/reducers/modal";
import { IState } from "@/redux/store";
import { handleUpdateCard } from "@/api/card";
import { IBoardElement, ICard } from "@/type/card";
import { ImageCore } from "./box/ImageBox";

interface IProps {
    children: ReactNode;
}

const SharedComponents = (props: IProps) => {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const { type: openModalType, data: modalProp } = useSelector((state: IState) => state.modal)
    // console.log("modalProp", modalProp)
    // console.log("selectedCard", selectedCard)
    // console.log("status", status)
    console.log("openModalType", openModalType)

    return (
        <>
            {props.children}
            {openModalType === "card" && <Modal position="center" isOpen={openModalType === "card"} handleClose={() => {
                if (openModalType === "card") dispatch(closeModal({ type: "", data: null }));
            }} >
                {openModalType === "card" && <Card isSelected={false} cardData={modalProp} handleDelete={() => {
                    if (openModalType === "card") dispatch(closeModal({ type: "", data: null }));
                }}
                />}
            </Modal>}

            <Modal position="aside" isOpen={openModalType === "boardElements"} handleClose={() => {
                if (openModalType === "boardElements") dispatch(closeModal({ type: "", data: modalProp }))
            }} >
                <>
                    <div className="w-80 h-[85vh] rounded-xl bg-white relative z-10 overflow-y-scroll py-2 pl-2 pr-2 flex flex-col-reverse" onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}>
                        {selectedCard && selectedCard.boardElement.map((item: IBoardElement) => {
                            return (
                                <div key={item.id} className="w-full h-fit mb-2  rounded-md border border-slate-300">
                                    <section className="w-full h-10 border">
                                        刪除 重置位置 選擇 鎖 拉到最下方 拉到最上方
                                    </section>
                                    {item.type === "text" && <>
                                        <div id={item.id}
                                            onChange={(e) => {
                                            }}
                                            className="w-full h-fit p-2 rounded-md overflow-hidden whitespace-pre-wrap outline-none resize-none bg-transparent text-neutral-700"
                                            >
                                                {item.content}
                                        </div>
                                    </>}
                                    {item.type === "image" && <div className="flex items-center justify-center">
                                        <ImageCore imageData={item} handleOnLoad={(data) => {}}
                                        />
                                    </div>}
                                    
                                </div>
                            )
                        })}
                    </div>
                    {/* 小耳朵 */}
                    <div className="absolute top-0 -left-6 bg-white w-10 h-24 rounded-lg cursor-pointer -z-10 shadow-md shadow-black/30" onClick={() => {
                        if (openModalType === "boardElements") return dispatch(closeModal({ type: "" }));
                        dispatch(openModal({ type: "boardElements", data: selectedCard?.boardElement }));
                    }}></div>
                </>
            </Modal>
        </>
    )
}

export default SharedComponents;