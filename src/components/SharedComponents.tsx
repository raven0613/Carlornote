"use client";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/components/modal/Card";
import Modal from "@/components/modal/Modal";
import { closeModal, openModal } from "@/redux/reducers/modal";
import { IState } from "@/redux/store";
import ElementModal from "./modal/BoardElements";
import CardList from "./CardList";
import { usePathname, useRouter } from "next/navigation";
import { outerPage } from "./Auth";

interface IProps {
    children: ReactNode;
}

const SharedComponents = (props: IProps) => {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const userPermission = useSelector((state: IState) => state.userPermission);
    const { type: openModalType, data: modalProp } = useSelector((state: IState) => state.modal)
    const dirtyCards = useSelector((state: IState) => state.dirtyCardsId);
    const dirtyState = useSelector((state: IState) => state.dirtyState);
    const user = useSelector((state: IState) => state.user);
    const pathname = usePathname();
    // console.log("modalProp", modalProp)
    // console.log("selectedCard", selectedCard)
    // console.log("status", status)
    // console.log("openModalType", openModalType)
    const router = useRouter();

    // dev: 顯示所點選的元素
    useEffect(() => {
        function handleMouse(e: MouseEvent) {
            // e.stopPropagation();
            // e.preventDefault();
            // console.log((e.target as HTMLElement))
        }
        document.addEventListener("click", handleMouse);
        return () => document.removeEventListener("click", handleMouse);
    }, []);

    if (status === "unauthenticated" || outerPage.includes(pathname)) return <>{props.children}</>;
    return (
        <>
            {props.children}

            {openModalType === "card" && <Modal
                position="center"
                isOpen={openModalType === "card"}
                handleClose={() => {
                    if (openModalType === "card") dispatch(closeModal({ type: "", data: null }));
                }}
            >
                {openModalType === "card" && <Card
                    isSelected={false}
                    cardData={modalProp}
                    handleClose={() => {
                        if (openModalType === "card") dispatch(closeModal({ type: "", data: null }));
                    }}
                />}
            </Modal>}

            {userPermission === "editable" && <Modal
                position="aside"
                isOpen={openModalType === "boardElements"}
                handleClose={() => {
                    if (openModalType === "boardElements") dispatch(closeModal({ type: "", data: modalProp }))
                }}
            >
                <div className="w-fit h-fit hidden sm:block">
                    <ElementModal />
                </div>
                {/* 小耳朵 */}
                <div className={`hidden sm:block absolute top-0 bg-white w-10 h-24 rounded-lg cursor-pointer -z-10  shadow-black/30 duration-150
                    ${openModalType === "boardElements" ? "left-0" : "-left-6 shadow-md"}
                    `}
                    onClick={() => {
                        if (openModalType === "boardElements") return dispatch(closeModal({ type: "" }));
                        dispatch(openModal({ type: "boardElements", data: selectedCard?.boardElement }));
                    }}>
                </div>
            </Modal>}

            {/* {user && <div className="w-full h-full sm:h-auto fixed bottom-0 inset-x-0">
                {dirtyCards.length > 0 && <p className="cursor-default absolute top-1.5 left-2 text-sm text-slate-500 z-20">正在儲存...</p>}
                {dirtyState === "clear" && <p className={`cursor-default absolute top-1.5 left-2 animate-hide opacity-0 text-sm text-slate-500 z-20`}>已成功儲存</p>}
                <CardList selectedCardId={selectedCard?.id}
                    handleSetSelectedCard={(id: string) => {
                        console.log("id", id)
                        // dispatch(selectCard(allCards.find(item => item.id === id) || null));
                        // window && window.history.pushState(null, 'cardId', `/card/${id.split("_").at(-1)}`);
                        router.push(`/card/${id.split("_").at(-1)}`);
                    }}
                />
            </div>} */}
        </>
    )
}

export default SharedComponents;