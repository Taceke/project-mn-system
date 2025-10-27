// lib/auth.js
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

export const runtime = "nodejs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day default
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("No user found");
        if (!user.password) throw new Error("Login with provider");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Incorrect password");

        return user;
      },
    }),
  ],

  callbacks: {
    // ✅ Merge your existing session logic + rememberMe support
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        if (token.rememberMe) session.rememberMe = true;
      }
      return session;
    },

    // ✅ Merge your existing jwt + rememberMe extension
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // Extend expiry if "Remember Me" is used
      if (trigger === "update" && session?.rememberMe) {
        token.rememberMe = true;
        token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
      }

      return token;
    },

    // ✅ Preserve your existing redirect logic
    async redirect({ url, baseUrl, token }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url === baseUrl) {
        if (token?.role === "ADMIN") return `${baseUrl}/admin/dashboard`;
        if (token?.role === "PROJECT_MANAGER")
          return `${baseUrl}/manager/dashboard`;
        if (token?.role === "TEAM_MEMBER") return `${baseUrl}/team/dashboard`;
        if (token?.role === "CLIENT") return `${baseUrl}/client-portal`;
      }
      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
