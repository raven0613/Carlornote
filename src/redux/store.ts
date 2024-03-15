"use client"
import { combineReducers, legacy_createStore as createStore } from 'redux';
import { initUserState, userReducer, userPermissionReducer, initUserPermissionState } from './reducers/user';
import { IBoardElement, ICard } from '@/type/card';
import { cardsReducer, dirtyCardsIdReducer, selectedCardReducer, dirtyStateType, dirtyReducer, cardTagsReducer, initCardState, initSelectedCardState, initDirtyCardsIdState, initDirtyState, initTags } from './reducers/card';
import { modalReducer, IModalPayload, IModalState, initModalState } from './reducers/modal';
import { initSelectedElementState, selectedElementIdReducer } from './reducers/boardElement';
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
    cardTags: string[],
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
    cardTags: cardTagsReducer,
    userPermission: userPermissionReducer
});
// const initialState = {
//     user: initUserState,
//     card: initCardState,
//     modal: initModalState,
//     selectedCard: initSelectedCardState,
//     selectedElementId: initSelectedElementState,
//     dirtyCardsId: initDirtyCardsIdState,
//     dirtyState: initDirtyState,
//     cardTags: initTags,
//     userPermission: initUserPermissionState
// }

export const store = createStore(rootReducer);