export type boxType = "text" | "card" | "image" | "code" | "";

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
    fontSize?: "base" | "xs" | "xl" | "2xl",
    fontWeight?: "normal" | "extraLight" | "semiBold" | "extraBold",
    opacity?: number,
    isLock?: boolean
}

export interface ICard {
    id: string,
    authorId: string,
    userId: string[],
    boardElement: IBoardElement[],
    visibility: "public" | "private" | "free",
    createdAt: string,
    updatedAt: string,
    imageUrl: string,
    name: string
}