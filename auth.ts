import type { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

type SessionUser = DefaultSession["user"] & {
  id: string;
  role?: string | null;
};

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const member = await prisma.members.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!member || !member.password_hash || !member.is_active) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          member.password_hash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: String(member.id),
          name: member.display_name ?? member.first_name,
          email: member.email ?? undefined,
          role: member.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string | null }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as SessionUser;
        sessionUser.id = token.sub ?? "";
        sessionUser.role =
          typeof token.role === "string" ? token.role : undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
