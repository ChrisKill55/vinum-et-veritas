import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

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
  console.log("AUTH credentials:", credentials);

  if (!credentials?.email || !credentials?.password) {
    console.log("AUTH abort: missing credentials");
    return null;
  }

  const member = await prisma.members.findUnique({
    where: {
      email: credentials.email,
    },
  });

  console.log("AUTH member found:", member
    ? {
        id: member.id,
        email: member.email,
        is_active: member.is_active,
        hasPasswordHash: !!member.password_hash,
        role: member.role,
      }
    : null
  );

  if (!member || !member.password_hash || !member.is_active) {
    console.log("AUTH abort: member invalid");
    return null;
  }

  const isValid = await bcrypt.compare(
    credentials.password,
    member.password_hash
  );

  console.log("AUTH password valid:", isValid);

  if (!isValid) {
    console.log("AUTH abort: invalid password");
    return null;
  }

  return {
    id: String(member.id),
    name: member.display_name ?? member.first_name,
    email: member.email ?? undefined,
    role: member.role,
  } as any;
}
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
        (session.user as any).id = token.sub ?? "";
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};