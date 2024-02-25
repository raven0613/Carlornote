"use client"
import { IAction } from "../store";

export interface IModalPayload {
    type: string,
    data?: any
}

export const initModalState = { type: "" };
const OPEN_MODAL = "OPEN_MODAL";
const CLOSE_MODAL = "CLOSE_MODAL";

export const openModal = (payload: IModalPayload) => ({ type: OPEN_MODAL, payload });
export const closeModal = (payload?: IModalPayload) => ({ type: CLOSE_MODAL, payload });

export function modalReducer(state: IModalPayload = initModalState, action: IAction<IModalPayload>) {
    // console.log("payload", action.payload)
    switch (action.type) {
        case OPEN_MODAL: {
            return action.payload;
        }
        case CLOSE_MODAL: {
            return action.payload;
        }
        default: return state;
    }
}