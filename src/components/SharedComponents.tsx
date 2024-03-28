"use client";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardInfo from "@/components/modal/CardInfo";
import Modal from "@/components/modal/Modal";
import { closeAllModal, closeModal, openModal } from "@/redux/reducers/modal";
import { IState } from "@/redux/store";
import ElementModal from "./modal/BoardElements";
import CardList from "./CardList";
import { usePathname, useRouter } from "next/navigation";
import { outerPage } from "./Auth";
import CheckWindow from "./modal/CheckWindow";
import { SearchPanel } from "./SearchPanel";
import { setCardSettingIsDirty } from "@/redux/reducers/card";

interface IProps {
    children: ReactNode;
}

const SharedComponents = (props: IProps) => {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const selectedCard = useSelector((state: IState) => state.selectedCard);
    const userPermission = useSelector((state: IState) => state.userPermission);
    const { type: openModalType, props: modalProp } = useSelector((state: IState) => state.modal)
    const dirtyCards = useSelector((state: IState) => state.dirtyCardsId);
    const dirtyState = useSelector((state: IState) => state.dirtyState);
    const user = useSelector((state: IState) => state.user);
    const pathname = usePathname();
    const isCardSettingDirty = useSelector((state: IState) => state.isCardSettingDirty)

    // console.log("SharedComponents modalProp", modalProp)
    // console.log("SharedComponents openModalType", openModalType)
    // console.log("selectedCard", selectedCard)
    // console.log("status", status)

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
    // dev: 顯示所點選的元素
    useEffect(() => {
        function handleMouse(e: MouseEvent) {
            // e.stopPropagation();
            // e.preventDefault();
            // console.log((e.target as HTMLElement))
        }
        document.addEventListener("mouseup", handleMouse);
        return () => document.removeEventListener("mouseup", handleMouse);
    }, []);

    useEffect(() => {
        function handleMouse(e: MouseEvent) {
            if (window.getSelection) window.getSelection()?.removeAllRanges();
        }
        document.addEventListener("mousedown", handleMouse);
        return () => document.removeEventListener("mousedown", handleMouse);
    }, []);

    if (status === "unauthenticated" || outerPage.includes(pathname)) return <>{props.children}</>;
    return (
        <>
            {props.children}

            {selectedCard && <Modal
                position={openModalType.includes("card") ? "center" : "full"}
                isOpen={openModalType.includes("card") || openModalType[0] === "mobileCardSetting"}
                handleClose={() => {
                    // 電腦版會讀這邊
                    // console.log("close")
                    if (isCardSettingDirty) {
                        if (openModalType.at(-1) === "checkWindow") {
                            dispatch(closeModal({ type: "checkWindow", props: { data: selectedCard } }));
                            return;
                        }
                        dispatch(openModal({
                            type: "checkWindow",
                            props: {
                                text: "改動尚未儲存，確定要關閉視窗嗎？",
                                handleConfirm: () => {
                                    console.log("confirm")
                                    dispatch(setCardSettingIsDirty(false));
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
                {/* card setting */}
                <CardInfo isSelected={false} />
            </Modal>}

            {/* side boardElements */}
            {userPermission === "editable" && <Modal
                position="aside"
                isOpen={openModalType.includes("boardElements")}
                handleClose={() => {
                    if (openModalType.includes("boardElements")) dispatch(closeModal({ type: "", props: modalProp }))
                }}
            >
                <div className="w-fit h-fit hidden sm:block">
                    <ElementModal />
                </div>
                {/* 小耳朵 */}
                <div className={`hidden sm:block absolute top-0 bg-white w-10 h-24 rounded-lg cursor-pointer -z-10  shadow-black/30 duration-150
                    ${openModalType.includes("boardElements") ? "left-0" : "-left-6 shadow-md"}
                    `}
                    onClick={() => {
                        if (openModalType.includes("boardElements")) return dispatch(closeModal({ type: "" }));
                        dispatch(openModal({ type: "boardElements", props: selectedCard?.boardElement }));
                    }}>
                </div>
            </Modal>}

            {/* checkWindow */}
            {userPermission === "editable" && <Modal
                position="center"
                isOpen={openModalType.includes("checkWindow")}
                handleClose={() => {
                    if (openModalType.includes("checkWindow")) {
                        dispatch(closeModal({ type: "checkWindow", props: modalProp }));
                        dispatch(setCardSettingIsDirty(false));
                    }
                }}
                top="top-1/2 -translate-y-1/2 sm:top-48 sm:translate-y-0"
            >
                {openModalType.includes("checkWindow") && <div className="w-fit h-fit z-50">
                    <CheckWindow data={modalProp?.data} text={modalProp?.text}
                        handleClose={() => {
                            dispatch(closeModal({ type: "checkWindow", props: modalProp }));
                        }}
                        handleConfirm={modalProp.handleConfirm}
                    />
                </div>}
            </Modal>}

            {/* mobile search */}
            <Modal
                isOpen={openModalType[0] === "mobileSearch"}
                handleClose={() => { }} position={"full"}
            >
                <SearchPanel />
            </Modal>

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