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

interface IProps {
    children: ReactNode;
}

const SharedComponents = (props: IProps) => {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const { type: openModalType, data: modalProp } = useSelector((state: IState) => state.modal)
    console.log("modalProp", modalProp)
    // console.log("status", status)
    // console.log("openModalType", openModalType)

    return (
        <>
            {props.children}
            {openModalType && <Modal position="center" isOpen={openModalType === "card"} handleClose={() => {
                if (openModalType === "card") dispatch(closeModal({ type: "", data: modalProp }));
            }} >
                {openModalType === "card" && <Card isSelected={false} cardData={modalProp} handleDelete={() => {
                    if (openModalType === "card") dispatch(closeModal({ type: "", data: modalProp }));
                }}
                />}
            </Modal>}
            <Modal position="aside" isOpen={openModalType === "boardElements"} handleClose={() => {
                if (openModalType === "boardElements") dispatch(closeModal({ type: "", data: selectedCard?.boardElement }))
            }} >
                <>
                    <div className="w-80 h-[85vh] rounded-xl bg-white relative z-10 overflow-y-scroll py-2 pl-2 pr-2" onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}>
                        {modalProp && modalProp.map((item: IBoardElement) => {
                            return (
                                <div key={item.id} className="w-full h-fit mb-2  rounded-md border border-slate-300">
                                    {item.type === "text" && <>
                                        <div id={item.id}
                                            onChange={(e) => {
                                            }}
                                            className="w-full h-fit p-2 rounded-md overflow-hidden whitespace-pre-wrap outline-none resize-none bg-transparent text-neutral-700"
                                            >
                                                {item.content}
                                        </div>
                                    </>}
                                    {item.type === "image" && <>
                                        <Image id={item.id}
                                            className={``} width={item.width} height={item.height} src={item.content} alt={item.name}
                                            style={{
                                                width: '100%', height: 'auto'
                                            }}
                                            onLoad={(e) => {
                                                console.log("onLoad")

                                            }}
                                            onError={() => {
                                            }}
                                        />
                                    </>}
                                </div>
                            )
                        })}
                    </div>
                    {/* 小耳朵 */}
                    <div className="absolute top-0 -left-6 bg-white w-10 h-24 rounded-lg cursor-pointer -z-10 shadow-md shadow-black/30" onClick={() => {
                        if (openModalType === "boardElements") return dispatch(closeModal({ type: "", data: selectedCard?.boardElement }));
                        dispatch(openModal({ type: "boardElements", data: selectedCard?.boardElement }));
                    }}></div>
                </>
            </Modal>
        </>
    )
}

export default SharedComponents;