"use client";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/components/modal/Card";
import Modal from "@/components/modal/Modal";
import { closeModal } from "@/redux/reducers/modal";
import { IState } from "@/redux/store";
import ElementModal from "./modal/BoardElements";

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
    // console.log("openModalType", openModalType)

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
                    <ElementModal />
                </>
            </Modal>
        </>
    )
}

export default SharedComponents;