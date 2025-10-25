import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Just import authOptions and initialize NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
