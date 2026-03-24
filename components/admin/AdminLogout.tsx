"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AdminLogout({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className={`flex items-center gap-2 text-sm text-stone-500 hover:text-red-600 transition-colors ${className || ""}`}
    >
      <LogOut size={16} />
      Sign out
    </button>
  );
}
