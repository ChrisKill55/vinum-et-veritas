import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyEmailTwoFactorLogin } from "@/lib/auth-security";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
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
        challengeToken: { label: "Challenge", type: "text" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.challengeToken || !credentials?.code) {
          return null;
        }

        const member = await verifyEmailTwoFactorLogin(
          credentials.challengeToken,
          credentials.code
        );

        if (!member) {
          return null;
        }

        const authUser: AuthUser = {
          id: String(member.id),
          name: member.displayName ?? member.firstName,
          email: member.email,
          role: member.role,
        };

        return authUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & {
          id: string;
          role?: string;
        };
        sessionUser.id = token.sub ?? "";
        sessionUser.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
