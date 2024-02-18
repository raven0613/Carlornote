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
    radius: number,
    textColor?: string,
    fontSize?: number,
    fontWeight?: number
}

export interface ICard {
    id: string,
    authorId: string,
    userId: string[],
    boardElement: IBoardElement[],
    visibility: "public" | "private",
    createdAt: string,
    updatedAt: string,
}