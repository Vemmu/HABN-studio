import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ServicesManager from "@/components/admin/ServicesManager";
import { redirect } from "next/navigation";

export default async function AdminServicesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const isSuperAdmin = (session.user as any).role === "SUPER_ADMIN";
  const branchId = (session.user as any).branchId as string | null;

  const [services, branches] = await Promise.all([
    prisma.service.findMany({
      where: branchId ? { branchId } : {},
      include: isSuperAdmin ? { branch: true } : undefined,
      orderBy: { name: "asc" },
    }),
    isSuperAdmin ? prisma.branch.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }) : [],
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">
          Services Management
        </h1>
      </div>

      <ServicesManager
        initialServices={services}
        branches={branches}
        currentBranchId={branchId}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
}
