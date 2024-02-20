"use client";
import { handleGetUserByEmail } from "@/api/user";
import { addUser } from "@/redux/reducers/user";

import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/components/modal/Card";
import Modal from "@/components/modal/Modal";
import { closeModal } from "@/redux/reducers/modal";
import { IState } from "@/redux/store";
import { handleUpdateCard } from "@/api/card";
import { ICard } from "@/type/card";

interface IProps {
    children: ReactNode;
}

const SharedComponents = (props: IProps) => {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const { type: openModalType, data: modalProp } = useSelector((state: IState) => state.modal)
    console.log("status", status)

    return (
        <>
            {props.children}
            {openModalType && <Modal isOpen={typeof openModalType !== "undefined"} handleClose={() => {
                dispatch(closeModal());
            }} >
                {openModalType === "card" && <Card isSelected={false} cardData={modalProp} handleDelete={() => {
                    dispatch(closeModal());
                }}
                />}
            </Modal>}
        </>
    )
}

export default SharedComponents;