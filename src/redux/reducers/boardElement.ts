import { IBoardElement } from "@/type/card";
import { IAction } from "../store";

export const initSelectedElementState = "";
const SELECT_ELEMENT = "SELECT_ELEMENT";
export const selectElementId = (payload: string) => ({ type: SELECT_ELEMENT, payload });

export function selectedElementIdReducer(state: string = initSelectedElementState, action: IAction<string>) {
    // console.log("payload", action.payload)
    switch (action.type) {
        case SELECT_ELEMENT: {
            return action.payload;
        }
        default: return state;
    }
}