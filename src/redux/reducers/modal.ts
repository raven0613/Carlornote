"use client"
import { IAction } from "../store";

export interface IModalState {
    type: string[],
    props?: any
}

export interface IModalPayload {
    type: string,
    props?: any
}

export const initModalState = { type: [] };
const OPEN_MODAL = "OPEN_MODAL";
const OPEN_ONE_MODAL = "OPEN_ONE_MODAL";
const CLOSE_MODAL = "CLOSE_MODAL";
const CLOSE_ALL_MODAL = "CLOSE_ALL_MODAL";

export const openModal = (payload: IModalPayload) => ({ type: OPEN_MODAL, payload });
export const openOneModal = (payload: IModalPayload) => ({ type: OPEN_ONE_MODAL, payload });
export const closeModal = (payload?: IModalPayload) => ({ type: CLOSE_MODAL, payload });
export const closeAllModal = (payload?: IModalPayload) => ({ type: CLOSE_ALL_MODAL, payload });

export function modalReducer(state: IModalState = initModalState, action: IAction<IModalPayload>) {
    // console.log("payload", action.payload)
    switch (action.type) {
        case OPEN_MODAL: {
            return { type: [...state.type, action.payload?.type], props: action.payload?.props };
        }
        case OPEN_ONE_MODAL: {
            return { type: [action.payload?.type], props: action.payload?.props };
        }
        case CLOSE_MODAL: {
            return { ...state, type: state.type.filter((_item, i) => i !== state.type.length - 1) };
        }
        case CLOSE_ALL_MODAL: {
            return { type: [], props: null };
        }
        default: return state;
    }
}

export const modalTypes = {
    boardElements: "boardElements",
    card: "card",
    checkWindow: "checkWindow",
    confirmWindow: "confirmWindow",
    mobileSearch: "mobileSearch",
    mobileCardSetting: "mobileCardSetting",
    mobileFilter: "mobileFilter"
}