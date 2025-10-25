// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// ✅ Force this route to use Node.js runtime
export const runtime = "nodejs";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
