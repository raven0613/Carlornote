export interface IUser {
    id: string,
    name: string,
    email: string,
    password: string,
    role: "admin" | "user",
    birthday: string,
    accessLevel: "initial" | "prodessional",
    avatorUrl: string,
    createdAt: string,
    updatedAt: string,
    lastLogin: string
}