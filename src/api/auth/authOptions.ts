"use server"
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Provider } from "next-auth/providers/index";
import { handleAddUser, handleGetUserByEmail, handleUpdateUser } from "../user";

const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
                name: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                // console.log("credentials", credentials)
                // console.log("req", req)
                const getUserRes = await handleGetUserByEmail(credentials?.email || "");
                console.log("getUserRes", getUserRes)
                if (getUserRes.status === "FAIL") return null;
                const userData = JSON.parse(getUserRes.data)[0];
                if (typeof userData !== "undefined") {
                    if (userData.password !== credentials?.password) return null;
                    const loginUser = {
                        ...userData,
                        lastLogin: new Date().toUTCString()
                    }
                    const updateUserRes = await handleUpdateUser([loginUser])
                    console.log(updateUserRes)
                    return loginUser;
                }
                const addUserRes = await handleAddUser({
                    id: "",
                    name: credentials?.name || "",
                    email: credentials?.email || "",
                    password: credentials?.password || "",
                    role: "user",
                    birthday: "",
                    accessLevel: "initial",
                    avatorUrl: "",
                    createdAt: new Date().toUTCString(),
                    updatedAt: new Date().toUTCString(),
                    lastLogin: new Date().toUTCString()
                })
                // console.log("addUserRes", addUserRes)
                if (addUserRes.status === "FAIL") return null;
                return JSON.parse(addUserRes.data);
            },
        })
    ] as Provider[],
    secret: process.env.SECRET
}

export const handleGetAuthOptions = async () => {
    return authOptions;
}