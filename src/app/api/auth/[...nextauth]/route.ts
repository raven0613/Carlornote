import { handleGetAuthOptions } from "@/api/auth/authOptions";
import NextAuth from "next-auth";

const options = await handleGetAuthOptions();

const handler = NextAuth(options);
export { handler as GET, handler as POST };