"use client"
import { combineReducers, legacy_createStore as createStore } from 'redux';
import { initUserState, userReducer } from './reducers/user';
import { ICard } from '@/type/card';
import { cardsReducer } from './reducers/card';
import { modalReducer, IModalPayload } from './reducers/modal';

export interface IAction<T> { type: string, payload?: T }
export interface IState { user: IUser | null, card: ICard[], modal: IModalPayload }

const rootReducer = combineReducers({ user: userReducer, card: cardsReducer, modal: modalReducer });
const initialState = { user: initUserState }

export const store = createStore(rootReducer, initialState);