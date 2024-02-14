export type boxType = "text" | "card" | "image" | "";

export interface IBoardElement {
    id: string,
    type: boxType,
    name: string,
    content: string,
    width: number,
    height: number,
    rotation: number,
    left: number,
    top: number,
    radius: number
}

export interface ICard {
    id: string,
    userId: string | null,
    boardElement: IBoardElement[]
}