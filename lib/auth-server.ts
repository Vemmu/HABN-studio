import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  return session;
}

export async function getOptionalSession() {
  return getServerSession(authOptions);
}
