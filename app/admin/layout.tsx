import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LayoutDashboard, Scissors, Calendar, Image, Star, Package } from "lucide-react";
import AdminLogout from "@/components/admin/AdminLogout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page has no sidebar
  if (typeof window !== "undefined") {
    // This is a workaround - we'll use a client check in a child. For server, we don't have pathname.
    // Use a different approach: create (dashboard) and (auth) route groups.
  }

  const session = await getServerSession(authOptions);
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/services", label: "Services", icon: Scissors },
    { href: "/admin/appointments", label: "Appointments", icon: Calendar },
    ...(isSuperAdmin
      ? [
          { href: "/admin/products", label: "Products", icon: Package },
          { href: "/admin/gallery", label: "Gallery", icon: Image },
          { href: "/admin/reviews", label: "Reviews", icon: Star },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {session ? (
        <>
          <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-stone-200 p-6">
            <Link href="/admin" className="font-display text-xl font-semibold text-stone-800 block mb-8">
              HABN Admin
            </Link>
            {!isSuperAdmin && (
              <p className="text-xs text-stone-500 mb-4 px-2">{(session.user as any).branchName}</p>
            )}
            <nav className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-800 transition-colors"
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link href="/" className="mt-8 block text-sm text-stone-500 hover:text-stone-700">
              ← Back to site
            </Link>
            <AdminLogout className="mt-4" />
          </aside>
          <main className="ml-64 p-8">{children}</main>
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
