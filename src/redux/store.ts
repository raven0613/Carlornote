"use client"
import { combineReducers, legacy_createStore as createStore } from 'redux';
import { initUserState, userReducer, userPermissionReducer } from './reducers/user';
import { IBoardElement, ICard } from '@/type/card';
import { cardsReducer, dirtyCardsIdReducer, selectedCardReducer, dirtyStateType, dirtyReducer } from './reducers/card';
import { modalReducer, IModalPayload, IModalState } from './reducers/modal';
import { selectedElementIdReducer } from './reducers/boardElement';
import { IUser } from '@/type/user';

export interface IAction<T> { type: string, payload?: T }
export interface IState { 
    user: IUser | null, 
    card: ICard[], 
    modal: IModalState, 
    selectedCard: ICard, 
    selectedElementId: string, 
    dirtyCardsId: string[], 
    dirtyState: dirtyStateType, 
    userPermission: "editable" | "readable" 
}

const rootReducer = combineReducers({
    user: userReducer,
    card: cardsReducer,
    modal: modalReducer,
    selectedCard: selectedCardReducer,
    selectedElementId: selectedElementIdReducer,
    dirtyCardsId: dirtyCardsIdReducer,
    dirtyState: dirtyReducer,
    userPermission: userPermissionReducer
});
const initialState = { user: initUserState }

export const store = createStore(rootReducer, initialState);