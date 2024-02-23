"use client"
import { combineReducers, legacy_createStore as createStore } from 'redux';
import { initUserState, userReducer } from './reducers/user';
import { ICard } from '@/type/card';
import { cardsReducer, selectedCardReducer } from './reducers/card';
import { modalReducer, IModalPayload } from './reducers/modal';

export interface IAction<T> { type: string, payload?: T }
export interface IState { user: IUser | null, card: ICard[], modal: IModalPayload, selectedCard: ICard }

const rootReducer = combineReducers({ user: userReducer, card: cardsReducer, modal: modalReducer, selectedCard: selectedCardReducer });
const initialState = { user: initUserState }

export const store = createStore(rootReducer, initialState);