"use client"
import { ICard } from "@/type/card";
import { IAction } from "../store";

export const initCardState = [];
const SET_CARDS = "SET_CARDS";
const ADD_CARDS = "ADD_CARDS";
const ADD_CARD = "ADD_CARD";
const REMOVE_CARD = "REMOVE_CARD";
const UPDATE_CARDS = "UPDATE_CARD";

export const addCard = (payload: ICard) => ({ type: ADD_CARD, payload });
export const addCards = (payload: ICard[]) => ({ type: ADD_CARDS, payload });
export const setCards = (payload: ICard[]) => ({ type: SET_CARDS, payload });
export const updateCards = (payload: ICard[]) => ({ type: UPDATE_CARDS, payload });
export const removeCard = (payload: string) => ({ type: REMOVE_CARD, payload });

export function cardsReducer(state: ICard[] = initCardState, action: IAction<ICard[] | string>) {
    // console.log("payload", action.payload)
    switch (action.type) {
        case ADD_CARD: {
            return [...state, action.payload];
        }
        case ADD_CARDS: {
            // console.log("ADD_CARDS")
            return [...state, ...(action.payload ?? [])];
        }
        case SET_CARDS: {
            // console.log("SET_CARDS")
            return action.payload;
        }
        case REMOVE_CARD: {
            return state.filter(item => item.id !== action.payload);
        }
        case UPDATE_CARDS: {
            const newCardMap = new Map();
            for (let item of (action.payload ?? [])) {
                const card = item as ICard;
                // console.log("card", card)
                if (newCardMap.get(card.id)) continue;
                newCardMap.set(card.id, card);
            }
            // console.log("newCardMap", newCardMap)
            return state.map(item => {
                if (newCardMap.get(item.id)) return newCardMap.get(item.id);
                return item;
            });
        }
        default: return state;
    }
}

export const initSelectedCardState = null;
const SELECT_CARD = "SELECT_CARD";
export const selectCard = (payload: ICard | null) => ({ type: SELECT_CARD, payload });

export function selectedCardReducer(state: ICard | null = initSelectedCardState, action: IAction<ICard | string>) {
    // console.log("payload", action.payload)
    switch (action.type) {
        case SELECT_CARD: {
            return action.payload;
        }
        default: return state;
    }
}

export const initDirtyCardsIdState = [];
const SET_DIRTY_CARD = "SET_DIRTY_CARD";
const CLEAR_DIRTY_CARD = "CLEAR_DIRTY_CARD";
export const setDirtyCardId = (payload: string) => ({ type: SET_DIRTY_CARD, payload });
export const clearDirtyCardId = () => ({ type: CLEAR_DIRTY_CARD });

export function dirtyCardsIdReducer(state: string[] = initDirtyCardsIdState, action: IAction<string>) {
    console.log("dirtyCards payload", action.payload)
    switch (action.type) {
        case SET_DIRTY_CARD: {
            const set = new Set([...state]);
            if (!action.payload) return [];
            set.add(action.payload);
            return Array.from(set);
        }
        case CLEAR_DIRTY_CARD: {
            return [];
        }
        default: return state;
    }
}

export type dirtyStateType = "dirty" | "clear" | "none";
export const initDirtyState = "none";
const SET_DIRTY_STATE = "SET_DIRTY_STATE";
export const setDirtyState = (payload: dirtyStateType) => ({ type: SET_DIRTY_STATE, payload });

export function dirtyReducer(state: dirtyStateType = initDirtyState, action: IAction<dirtyStateType>) {
    console.log("dirtyState payload", action.payload)
    switch (action.type) {
        case SET_DIRTY_STATE: {
            return action.payload;
        }
        default: return state;
    }
}