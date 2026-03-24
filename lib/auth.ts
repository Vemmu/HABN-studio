import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "SUPER_ADMIN" | "BRANCH_ADMIN";
      branchId: string | null;
      branchName?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
          include: { branch: true },
        });

        if (!admin) return null;
        const valid = await bcrypt.compare(credentials.password, admin.password);
        if (!valid) return null;

        return {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          branchId: admin.branchId,
          branchName: admin.branch?.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id: string; role?: string; branchId?: string | null; branchName?: string };
        token.id = u.id;
        token.role = u.role;
        token.branchId = u.branchId;
        token.branchName = u.branchName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).branchId = token.branchId;
        (session.user as any).branchName = token.branchName;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};
