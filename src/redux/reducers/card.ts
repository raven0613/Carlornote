"use client"
import { ICard } from "@/type/card";
import { IAction } from "../store";

export const initCardState = [];
const SET_CARDS = "ADD_CARDS";
const ADD_CARDS = "ADD_CARDS";
const ADD_CARD = "ADD_CARD";
const REMOVE_CARD = "REMOVE_CARD";
const UPDATE_CARDS = "UPDATE_CARD";

export const addCard = (payload: ICard) => ({ type: ADD_CARD, payload });
export const addCards = (payload: ICard[]) => ({ type: ADD_CARDS, payload });
export const setCards = (payload: ICard[]) => ({ type: SET_CARDS, payload });
export const updateCards = (payload: ICard[]) => ({ type: UPDATE_CARDS, payload });
export const removeCard = () => ({ type: REMOVE_CARD });

export function cardsReducer(state: ICard[] = initCardState, action: IAction<ICard[]>) {
    switch (action.type) {
        case ADD_CARD: {
            return [...state, action.payload];
        }
        case ADD_CARDS: {
            return [...state, ...(action.payload ?? [])];
        }
        case SET_CARDS: {
            return [...(action.payload ?? [])];
        }
        case REMOVE_CARD: {
            return state.filter(item => item.id !== (action.payload ?? [])[0].id);
        }
        case UPDATE_CARDS: {
            const newCardMap = new Map();
            for (let item of (action.payload ?? [])) {
                if (newCardMap.get(item.id)) continue;
                newCardMap.set(item.id, item);
            }
            return state.map(item => {
                if (newCardMap.get(item.id)) return newCardMap.get(item.id);
                return item;
            });
        }
        default: return state;
    }
}