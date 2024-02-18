"use server"
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Provider } from "next-auth/providers/index";

const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        })
    ] as Provider[],
    secret: process.env.SECRET
}

export const handleGetAuthOptions = async () => {
    return authOptions;
}