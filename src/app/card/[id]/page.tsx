"use client"
// import { handleGoogleLogin } from "@/api/firebase_admin";
import useAutosizedTextarea from "@/hooks/useAutosizedTextarea"
import { IBoardElement, ICard, boxType } from "@/type/card";
import React, { RefObject, useEffect, useRef, useState, DragEvent, use } from "react";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { firebaseConfig } from "@/api/firebase";
import * as firebase from "firebase/app";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { handleAddUser, handleGetUserByEmail } from "@/api/user";
import { handleGetCard, handleAddCard, handleUpdateCard, handleGetCards, handleDeleteCard } from "@/api/card";
import { IState, store } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { addUser, removeUser } from "@/redux/reducers/user";
import { setCards, updateCards } from "@/redux/reducers/card";
import Board from "@/app/components/Board";
import ControlPanel from "@/app/components/ControlPanel";
import Link from "next/link";
// import login from "@/api/user";

export default function CardPage() {
    // TODO: 要驗證有沒有閱覽/編輯權限
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const user = useSelector((state: IState) => state.user);
    const allCards = useSelector((state: IState) => state.card);
    const [draggingBox, setDraggingBox] = useState<boxType>("");
    const [dirtyState, setDirtyState] = useState<"dirty" | "clear" | "none">("none");
    // console.log("session", session)
    console.log("status", status)
    // console.log("user", user)
    console.log("pathname", pathname)
    console.log("allCards", allCards)

    useEffect(() => {
        const cardId = pathname.split("/").at(-1);
        async function handleCard(cardId: string) {
            const response = await handleGetCard(`card_${cardId}`);
            console.log("res", response)
            // if (response.status === "FAIL") return await handleCard(cardId);
            if (response.status === "FAIL") {
                router.push("/")
                return;
            }
            const data = JSON.parse(response.data) as ICard;
            console.log("data", data)
            // return;
            if (data.visibility === "private") {
                router.push("/")
                return;
            }
            dispatch(setCards([data]));
        }
        if (!cardId) return;
        handleCard(cardId);
    }, [dispatch, pathname, router])

    // 有修改的話 5 秒存檔一次
    useEffect(() => {
        let time: NodeJS.Timeout | null = null;
        if (dirtyState !== "dirty" || time) return;
        time = setInterval(async () => {
            console.log("修改")
            if (!allCards[0]) return;

            const response = await handleUpdateCard(allCards);
            console.log("存檔", response);
            const resData = JSON.parse(response.data);
            const failedData = response.failedData && JSON.parse(response.failedData);
            if (failedData) console.log("failedData", failedData);

            // dispatch(updateCards(JSON.parse(response.data)));
            setDirtyState("clear");
            if (time) clearInterval(time);
        }, 5000);
        return () => {
            if (time) clearInterval(time);
        }
    }, [allCards, dirtyState]);

    return (
        <main className="flex h-screen flex-col gap-2 items-center justify-between overflow-hidden">

            <header className="fixed inset-x-0 top-0 h-10 bg-zinc-500 grid grid-cols-6 z-50">
                <div className="w-60 h-full col-span-4">{user && `Hi! ${user.name}`}</div>
                <div className="w-full h-full bg-zinc-700 col-span-2">
                    {!user && <Link href={`/login`} scroll={false}>Login</Link>}
                    {user && <button onClick={async () => {
                        await signOut();
                        dispatch(removeUser());
                    }}>Logout</button>}
                </div>
            </header>

            <section className="w-full h-full px-16 py-16 relative flex items-center">
                {dirtyState === "dirty" && <p className="absolute top-10 left-16">改動尚未儲存，請勿離開本頁</p>}
                {dirtyState === "clear" && <p className={`absolute top-10 left-16 animate-hide opacity-0`}>已儲存全部改動</p>}

                {!allCards[0] && <p className="text-center w-full">{user ? "請選擇一張卡片" : "請先登入"}</p>}
                {allCards[0] && <>
                    <main className="w-full h-full border border-slate-500 overflow-hidden">
                        <Board elements={allCards[0].boardElement}
                            handleUpdateElementList={(allElement) => {
                                const selectedCard: ICard = allCards[0];
                                const updatedCard: ICard = {
                                    ...selectedCard,
                                    boardElement: allElement
                                }
                                dispatch(updateCards([updatedCard]));
                            }}
                            handleUpdateElement={(data) => {
                                const selectedCard: ICard = allCards[0];
                                const updatedCard: ICard = {
                                    ...selectedCard,
                                    boardElement: selectedCard.boardElement.map(ele => {
                                        if (ele.id === data.id) return data;
                                        return ele;
                                    })
                                }
                                dispatch(updateCards([updatedCard]));
                            }}
                            draggingBox={draggingBox}
                            handleMouseUp={() => {
                                setDraggingBox("");
                            }}
                            handleSetDirty={() => {
                                setDirtyState("dirty");
                            }}
                        />
                    </main>
                </>}
                <ControlPanel
                    handleDrag={(type) => {
                        if (!allCards[0]) return;
                        setDraggingBox(type);
                    }}
                />
            </section>
        </main>
    )
}