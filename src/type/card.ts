export type boxType = "text" | "card" | "image" | "code" | "markdown" | "";

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
    isLock?: boolean,
    programmingLanguage?: string,
    cardData?: {
        id: string,
        name: string,
        imageUrl: string
    }
}

export interface ICard {
    id: string,
    authorId: string,
    userList: string[],
    boardElement: IBoardElement[],
    visibility: "public" | "private" | "limited",
    editability: "open" | "close" | "limited"
    createdAt: string,
    updatedAt: string,
    imageUrl: string,
    name: string,
    tags: string[]
}