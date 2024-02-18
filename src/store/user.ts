"use client"
import { Reducer } from 'react';
import { legacy_createStore as createStore } from 'redux'

interface IAction<T> { type: string, payload?: T }
export interface IState { user: IUser | null }

const initUserState = null;
const ADD_USER = "ADD_USER";
const REMOVE_USER = "REMOVE_USER";
const UPDATE_USER = "UPDATE_USER";

export const addUser = (payload: IUser) => ({ type: ADD_USER, payload });
export const updateUser = (payload: IUser) => ({ type: UPDATE_USER, payload });
export const removeUser = () => ({ type: REMOVE_USER });

function userReducer(state: IState | null = initUserState, action: IAction<IUser>) {
    switch (action.type) {
        case ADD_USER: {
            return { ...state, user: action.payload as IUser };
        }
        case REMOVE_USER: {
            return { ...state, user: null };
        }
        case UPDATE_USER: {
            return { ...state, user: action.payload as IUser };
        }
        default: return state;
    }
}
export const store = createStore(userReducer, { user: initUserState });