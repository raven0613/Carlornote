"use client"
import { combineReducers, legacy_createStore as createStore } from 'redux';
import { initUserState, userReducer } from './reducers/user';
import { ICard } from '@/type/card';
import { cardsReducer } from './reducers/card';

export interface IAction<T> { type: string, payload?: T }
export interface IState { user: IUser | null, card: ICard[] }

const rootReducer = combineReducers({ user: userReducer, card: cardsReducer });
const initialState = { user: initUserState }

export const store = createStore(rootReducer, initialState);