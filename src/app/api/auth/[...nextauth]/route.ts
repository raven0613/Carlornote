import { handleGetAuthOptions } from "@/api/auth/authOptions";
import NextAuth from "next-auth";

const options = await handleGetAuthOptions();
console.log("options", options)
const handler = NextAuth(options);
export { handler as GET, handler as POST };