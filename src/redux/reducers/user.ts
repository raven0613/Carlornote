"use client"
import { IAction } from "../store";

export const initUserState = null;
const ADD_USER = "ADD_USER";
const REMOVE_USER = "REMOVE_USER";
const UPDATE_USER = "UPDATE_USER";

export const addUser = (payload: IUser) => ({ type: ADD_USER, payload });
export const updateUser = (payload: IUser) => ({ type: UPDATE_USER, payload });
export const removeUser = () => ({ type: REMOVE_USER });

export function userReducer(state: IUser | null = initUserState, action: IAction<IUser>) {
    switch (action.type) {
        case ADD_USER: {
            return action.payload as IUser;
        }
        case REMOVE_USER: {
            return null;
        }
        case UPDATE_USER: {
            return action.payload as IUser;
        }
        default: return state;
    }
}


// export function fetchUser(email: string) {
//     async function fetchUserThunk(dispatch: Dispatch<any>, getState: typeof store.getState) {
//         const getUserRes = await handleGetUserByEmail(email ?? "");
//         if (getUserRes.status === "FAIL") return fetchUserThunk(dispatch, getState);
//         const registeredUser = JSON.parse(getUserRes.data);
//         if (registeredUser.length > 0) {
//             dispatch(addUser(registeredUser[0]));
//         }
//         // 有沒有有 session 卻沒找到 user 的狀況?
//     }
//     return fetchUserThunk;
// }